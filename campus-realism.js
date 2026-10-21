// Local, physical material and light rig. No network/CDN and no account data.
const ROOT='assets/campus/realism/';
const VERTEX=`precision highp float;
attribute vec3 position; attribute vec3 normal;
uniform mat4 world,worldViewProjection;uniform float time;
varying vec3 vPositionW;
void main(){vec3 p=position;float wave=sin(p.x*.54+time*.6)*cos(p.z*.47-time*.32)*.012+sin(p.x*1.7+p.z*.9-time*.4)*.004;p.y+=wave;vPositionW=(world*vec4(p,1.)).xyz;gl_Position=worldViewProjection*vec4(p,1.);}`;
const FRAGMENT=`precision highp float;
varying vec3 vPositionW;uniform vec3 cameraPosition,sunDirection,sunColor;uniform float time,exposure;uniform mat4 reflectionViewProjection;uniform sampler2D reflectionSampler;uniform samplerCube environmentSampler;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
void main(){vec2 p=vPositionW.xz;float tx=time*.22;vec3 n=normalize(vec3(.04*cos(p.x*.54+tx)*cos(p.y*.47-tx*.5)+.014*cos(p.x*1.7+p.y*.9-tx),1.,-.035*sin(p.x*.54+tx)*sin(p.y*.47-tx*.5)+.012*cos(p.x*1.7+p.y*.9-tx)));
vec3 V=normalize(cameraPosition-vPositionW);float ndv=max(dot(n,V),0.);float fresnel=.025+.975*pow(1.-ndv,5.);vec3 reflected=textureCube(environmentSampler,reflect(-V,n)).rgb;
vec4 q=reflectionViewProjection*vec4(vPositionW,1.);vec2 uv=q.xy/q.w*.5+.5;uv+=n.xz*.013;vec3 geometryReflection=texture2D(reflectionSampler,clamp(uv,.002,.998)).rgb;reflected=mix(reflected,geometryReflection,.82);
float bed=noise(p*.32)*.6+noise(p*1.8)*.25;vec3 shallow=mix(vec3(.12,.155,.064),vec3(.22,.24,.105),bed);vec3 deep=vec3(.035,.082,.052);float depth=mix(.45,.9,noise(p*.025));vec3 transmitted=mix(shallow,deep,depth);
vec3 H=normalize(V+sunDirection);float sparkle=pow(max(dot(n,H),0.),800.)*2.4;vec3 color=mix(transmitted,reflected,clamp(fresnel*.88+.12,.12,.94))+sunColor*sparkle;
gl_FragColor=vec4(max(color,vec3(0.)),1.);}`;
function projectUV(B,mesh,metres){if(mesh.isAnInstance||!mesh.getVerticesData)return;const p=mesh.getVerticesData(B.VertexBuffer.PositionKind),n=mesh.getVerticesData(B.VertexBuffer.NormalKind);if(!p||!n)return;const uv=new Float32Array(p.length/3*2);for(let i=0,j=0;i<p.length;i+=3,j+=2){const ax=Math.abs(n[i]),ay=Math.abs(n[i+1]),az=Math.abs(n[i+2]);if(ay>=ax&&ay>=az){uv[j]=p[i]/metres;uv[j+1]=p[i+2]/metres;}else if(ax>=az){uv[j]=p[i+2]/metres;uv[j+1]=p[i+1]/metres;}else{uv[j]=p[i]/metres;uv[j+1]=p[i+1]/metres;}}mesh.setVerticesData(B.VertexBuffer.UVKind,uv);}
export async function setupRealism(B,scene,engine,camera,{metadata=null,quality='medium',isCurrent=()=>true,reportPhase=()=>{},waitForAsset=promise=>promise}={}){
 const owned=[],textures=[],water=[];let disposed=false,ssao=null,shadow=null,probe=null,probeCenter=null,lastProbe=0,frame=0,elapsed=0,ssaoAttached=true,lastMirrorAt=0,mirrorCamera=null;const renderMeshes=scene.meshes.filter(m=>m.getTotalVertices()>0);const originalMaterials=new Map();
 const releaseResources=()=>{shadow?.dispose();probe?.dispose();for(const item of [...owned].reverse())item.dispose?.();for(const t of textures)t.dispose?.();};
 try{
 for(const light of [...scene.lights])light.dispose();
 scene.ambientColor=new B.Color3(0,0,0);scene.clearColor=new B.Color4(.55,.68,.83,1);scene.fogDensity=.00065;scene.fogColor=new B.Color3(.68,.75,.78);scene.environmentIntensity=.9;
 const image=scene.imageProcessingConfiguration;image.toneMappingEnabled=true;image.toneMappingType=B.ImageProcessingConfiguration.TONEMAPPING_ACES;image.exposure=1.12;image.contrast=1.05;
 const ambient=new B.HemisphericLight('diffuse-skylight',new B.Vector3(0,1,0),scene);ambient.intensity=.16;ambient.diffuse=new B.Color3(.72,.82,1);ambient.groundColor=new B.Color3(.20,.23,.16);owned.push(ambient);
 const sunDirection=new B.Vector3(.5530423,.743008,.3769395).normalize();const sun=new B.DirectionalLight('physical-daylight',sunDirection.scale(-1),scene);sun.position=sunDirection.scale(230);sun.diffuse=new B.Color3(1,.96,.86);sun.intensity=3;sun.autoCalcShadowZBounds=true;owned.push(sun);
 reportPhase('正在准备天空与阳光');let hdr;await waitForAsset(new Promise((ok,no)=>{hdr=new B.HDRCubeTexture(ROOT+'daylight.hdr',scene,512,false,true,false,true,ok,(_,e)=>no(e||new Error('HDR environment failed')));textures.push(hdr);}), '天空光照');if(!isCurrent()){hdr.dispose();return {dispose(){}};}
 hdr.rotationY=0;scene.environmentTexture=hdr;
 const sky=B.MeshBuilder.CreateBox('photographic-sky',{size:3000},scene);const skyMat=new B.BackgroundMaterial('photographic-daylight-sky',scene);skyMat.backFaceCulling=false;skyMat.reflectionTexture=hdr.clone();skyMat.reflectionTexture.coordinatesMode=B.Texture.SKYBOX_MODE;skyMat.reflectionTexture.level=1;skyMat.disableLighting=true;skyMat.useRGBColor=false;skyMat.primaryColor=new B.Color3(1,1,1);sky.material=skyMat;sky.infiniteDistance=true;sky.isPickable=false;sky.applyFog=false;sky.renderingGroupId=0;owned.push(sky,skyMat);textures.push(skyMat.reflectionTexture);
 const cache=new Map(),mapped=new Map();
 function texture(file,linear=false){const key=file+linear;if(cache.has(key))return cache.get(key);const t=new B.Texture(ROOT+file,scene,false,false,B.Texture.TRILINEAR_SAMPLINGMODE);t.gammaSpace=!linear;t.anisotropicFilteringLevel=8;textures.push(t);cache.set(key,t);return t;}
 function textured(name,id,roughness=1,tint=null){if(mapped.has(name))return mapped.get(name);const m=new B.PBRMaterial('physical-'+name,scene);m.albedoTexture=texture(id+'_diff.jpg');m.bumpTexture=texture(id+'_nor_gl.jpg',true);m.bumpTexture.level=name==='grass'?.35:.55;m.metallicTexture=texture(id+'_arm.jpg',true);m.useAmbientOcclusionFromMetallicTextureRed=true;m.useRoughnessFromMetallicTextureGreen=true;m.useRoughnessFromMetallicTextureAlpha=false;m.useMetallnessFromMetallicTextureBlue=true;m.metallic=0;m.roughness=roughness;m.environmentIntensity=.8;if(tint)m.albedoColor=tint;m.maxSimultaneousLights=3;m.forceIrradianceInFragment=true;owned.push(m);mapped.set(name,m);return m;}
 const brick=textured('brick','factory_brick',.94,new B.Color3(1,.88,.79)),asphalt=textured('asphalt','clean_asphalt',.93),paving=textured('paving','concrete_pavement',.9,new B.Color3(.88,.88,.84)),grass=textured('grass','leafy_grass',1,new B.Color3(.68,1.08,.60)),bark=textured('bark','bark_brown_02',1),bank=textured('pond-bank','rock_boulder_dry',.94,new B.Color3(.92,.9,.82));
 // Blend four offset samples in a smooth stochastic grid, avoiding a tiled lawn carpet.
 class LawnVariation extends B.MaterialPluginBase{
  constructor(material){super(material,'lawn-variation',200,{},true,true);}
  getCustomCode(type){return type==='fragment'?{
   CUSTOM_FRAGMENT_DEFINITIONS:`vec2 lawnHash(vec2 p){return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);}`,
   CUSTOM_FRAGMENT_UPDATE_ALBEDO:`
#ifdef ALBEDO
vec2 lp=vAlbedoUV,li=floor(lp*.25),lf=fract(lp*.25);vec2 lu=lf*lf*(3.-2.*lf);
vec3 la=texture2D(albedoSampler,lp+lawnHash(li)*31.7).rgb,lb=texture2D(albedoSampler,lp+lawnHash(li+vec2(1.,0.))*31.7).rgb,lc=texture2D(albedoSampler,lp+lawnHash(li+vec2(0.,1.))*31.7).rgb,ld=texture2D(albedoSampler,lp+lawnHash(li+vec2(1.))*31.7).rgb;
vec3 lawnColor=mix(mix(la,lb,lu.x),mix(lc,ld,lu.x),lu.y);
#ifdef GAMMAALBEDO
lawnColor=toLinearSpace(lawnColor);
#endif
vec2 macro=vPositionW.xz*.035,mi=floor(macro),mf=fract(macro);mf=mf*mf*(3.-2.*mf);
float variation=mix(mix(lawnHash(mi).x,lawnHash(mi+vec2(1.,0.)).x,mf.x),mix(lawnHash(mi+vec2(0.,1.)).x,lawnHash(mi+vec2(1.)).x,mf.x),mf.y);
surfaceAlbedo=vAlbedoColor.rgb*lawnColor*(.83+variation*.28);
#endif`
  }:null;}
 }
 new LawnVariation(grass);
 const glassMaterials=[],waterMeshes=[],casters=[];
 const materialMeshes=[...new Set(renderMeshes.map(m=>m.isAnInstance?m.sourceMesh:m))];
 for(const mesh of materialMeshes){const material=mesh.material;if(!material)continue;material.unfreeze?.();const name=material.name.toLowerCase(),meshName=mesh.name.toLowerCase();originalMaterials.set(mesh,material);let target=null,tile=2;
  if(/brick|terracotta/.test(name)){target=brick;tile=2.5;}else if(/asphalt/.test(name)){target=asphalt;tile=2;}else if(/revetment|lakebed|bank/.test(name)){target=bank;tile=1.2;}else if(/pav(ed|ing|ement)|limestone|stone/.test(name)){target=paving;tile=2.4;}else if(/lawn|field stripe|grass/.test(name)){target=grass;tile=.85;}else if(/bark/.test(name)&&!/timber|furniture/.test(name)){target=bark;tile=1.8;}
  if(target){projectUV(B,mesh,tile);mesh.material=target;}
  const mat=mesh.material;
  if(/glass|glaz/.test(name)&&!mesh.skeleton){const key='glass-'+material.uniqueId;let glass=mapped.get(key);if(!glass){glass=new B.PBRMaterial('reflective-'+material.name,scene);glass.albedoColor=new B.Color3(.022,.044,.052);glass.metallic=0;glass.roughness=.07;glass.indexOfRefraction=1.52;glass.environmentIntensity=1.15;glass.metallicF0Factor=3.2;glass.reflectivityColor=new B.Color3(.62,.68,.72);glass.alpha=1;glass.directIntensity=1;glass.clearCoat.isEnabled=true;glass.clearCoat.intensity=.6;glass.clearCoat.roughness=.06;glassMaterials.push(glass);mapped.set(key,glass);owned.push(glass);}mesh.material=glass;}
  if(/water/.test(name)||/water-pond|lake__water/.test(meshName)){waterMeshes.push(mesh);continue;}
  mesh.receiveShadows=true;
  
 }
 for(const mesh of renderMeshes)if(!/grass|road|paving|paved|marking|lake|water|stripe|zebra|site__/.test(mesh.name.toLowerCase())&&mesh.isVisible)casters.push(mesh);
 const base=scene.getMeshByName('campus-ground');if(base){projectUV(B,base,.85);base.material=grass;base.receiveShadows=true;}
 try{shadow=new B.CascadedShadowGenerator(2048,sun);shadow.numCascades=3;shadow.lambda=.8;shadow.shadowMaxZ=180;shadow.stabilizeCascades=true;shadow.usePercentageCloserFiltering=true;shadow.filteringQuality=B.ShadowGenerator.QUALITY_MEDIUM;shadow.bias=.00065;shadow.normalBias=.035;shadow.cascadeBlendPercentage=.15;shadow.freezeShadowCastersBoundingInfo=true;for(const m of casters)shadow.addShadowCaster(m,false);}catch(e){console.warn('CSM:',e.message);}
 // Geometry reflections complement the photographic sky, with local parallax at glass facades.
 probe=new B.ReflectionProbe('campus-geometry-reflection',256,scene,true,true,true);probe.position.set(16,7,-110);probe.renderList=renderMeshes.filter(m=>!glassMaterials.includes(m.material)&&!waterMeshes.includes(m));probe.renderList.push(sky);probe.refreshRate=0;
 for(const glass of glassMaterials){glass.reflectionTexture=probe.cubeTexture;glass.reflectionTexture.level=1;}
 const reflections=[];
 if(waterMeshes.length){
  const mirror=new B.MirrorTexture('pond-planar-reflection',512,scene,true,engine.getCaps().textureHalfFloatRender?B.Constants.TEXTURETYPE_HALF_FLOAT:B.Constants.TEXTURETYPE_UNSIGNED_BYTE);mirror.mirrorPlane=new B.Plane(0,-1,0,metadata?.pond?.waterY??.06);mirror.renderList=renderMeshes.filter(m=>!waterMeshes.includes(m));mirror.renderList.push(sky);mirror.refreshRate=0;mirror.level=.8;reflections.push(mirror);textures.push(mirror);scene.customRenderTargets.push(mirror);owned.push({dispose(){const i=scene.customRenderTargets.indexOf(mirror);if(i>=0)scene.customRenderTargets.splice(i,1);}});
  const waterMat=new B.ShaderMaterial('pond-physical-water',scene,{vertexSource:VERTEX,fragmentSource:FRAGMENT},{attributes:['position','normal'],uniforms:['world','worldViewProjection','time','cameraPosition','sunDirection','sunColor','exposure','reflectionViewProjection'],samplers:['reflectionSampler','environmentSampler'],needAlphaBlending:false});waterMat.backFaceCulling=false;waterMat.setTexture('reflectionSampler',mirror);waterMat.setTexture('environmentSampler',hdr);waterMat.setVector3('sunDirection',sunDirection);waterMat.setColor3('sunColor',new B.Color3(1,.94,.8));waterMat.setFloat('exposure',.85);owned.push(waterMat);
  for(const mesh of waterMeshes){mesh.material=waterMat;mesh.receiveShadows=false;mesh.isPickable=false;water.push(mesh);}
  const observer=mirror.onBeforeRenderObservable.add(()=>waterMat.setMatrix('reflectionViewProjection',scene.getTransformMatrix()));owned.push({dispose(){mirror.onBeforeRenderObservable.remove(observer);}});
 }
 const pipeline=new B.DefaultRenderingPipeline('photographic-camera',true,scene,[camera]);pipeline.samples=1;pipeline.fxaaEnabled=true;pipeline.bloomEnabled=true;pipeline.bloomThreshold=1.5;pipeline.bloomWeight=.08;pipeline.bloomKernel=48;pipeline.sharpenEnabled=true;pipeline.sharpen.edgeAmount=.15;pipeline.sharpen.colorAmount=1;pipeline.grainEnabled=false;owned.push(pipeline);
 if(engine.webGLVersion>1){try{ssao=new B.SSAO2RenderingPipeline('contact-occlusion',scene,{ssaoRatio:.5,blurRatio:1},[camera]);ssao.radius=1.1;ssao.totalStrength=.65;ssao.base=.22;ssao.samples=8;ssao.expensiveBlur=false;ssao.bilateralSamples=8;owned.push(ssao);}catch(e){console.warn('SSAO:',e.message);}}
 function setQuality(value){quality=value;const low=value==='low';if(shadow){shadow.shadowMaxZ=low?300:value==='high'?600:420;shadow.numCascades=low?2:value==='high'?4:3;const size=low?1024:value==='high'?4096:2048;if(shadow.mapSize!==size)shadow.mapSize=size;shadow.filteringQuality=value==='high'?B.ShadowGenerator.QUALITY_HIGH:B.ShadowGenerator.QUALITY_MEDIUM;}for(const mirror of reflections){mirror.refreshRate=0;const size=low?256:value==='high'?1024:512;if(mirror.getRenderWidth()!==size)mirror.resize(size);}const wantAO=value==='high';if(ssao&&ssaoAttached!==wantAO){scene.postProcessRenderPipelineManager[wantAO?'attachCamerasToRenderPipeline':'detachCamerasFromRenderPipeline']('contact-occlusion',camera);ssaoAttached=wantAO;}}
 reportPhase('正在准备建筑、道路与树木材质');await waitForAsset(new Promise(ok=>B.Texture.WhenAllReady([...cache.values()],ok)), '建筑材质');
 setQuality(quality);
 const update=(dt,position,reduced)=>{if(disposed)return;scene.fogDensity=.00065*Math.max(.24,1-camera.position.y/600);if(shadow&&frame%30===0){const far=Math.max(quality==='low'?300:quality==='high'?600:420,camera.position.y*1.8);if(Math.abs(shadow.shadowMaxZ-far)>25)shadow.shadowMaxZ=far;}elapsed+=reduced?0:dt;frame++;const now=performance.now(),view=[camera.position.x,camera.position.y,camera.position.z,camera.rotation.x,camera.rotation.y,camera.rotation.z];const changed=!mirrorCamera||view.some((v,i)=>Math.abs(v-mirrorCamera[i])>(i<3?.02:.001));if(changed||now-lastMirrorAt>500){for(const mirror of reflections)mirror.resetRefreshCounter();mirrorCamera=view;lastMirrorAt=now;}for(const mesh of water)mesh.material.setFloat('time',elapsed).setVector3('cameraPosition',camera.position);if(probe&&frame>4&&performance.now()-lastProbe>3500){const p=new B.Vector3(position.x,5,position.z);if(!probeCenter||B.Vector3.DistanceSquared(p,probeCenter)>1600){probeCenter=p;probe.position.copyFrom(p);probe.renderList=renderMeshes.filter(m=>m.isEnabled()&&!glassMaterials.includes(m.material)&&!waterMeshes.includes(m)&&B.Vector3.DistanceSquared(m.getBoundingInfo().boundingBox.centerWorld,p)<40000);probe.renderList.push(sky);probe.cubeTexture.resetRefreshCounter();lastProbe=performance.now();}}};
 return {update,setQuality,stats:()=>({photographicSky:true,physicalMaterials:mapped.size,shadowCascades:shadow?.numCascades||0,shadowCasters:casters.length,glassReflections:glassMaterials.length,pondReflection:water.length>0,ambientOcclusion:!!ssao&&ssaoAttached,quality}),dispose(){if(disposed)return;disposed=true;releaseResources();}};
 }catch(error){
  // Optional visual downloads must not destroy the loaded campus or leave partial effects behind.
  for(const [mesh,material] of originalMaterials)if(!mesh.isDisposed())mesh.material=material;
  scene.environmentTexture=null;releaseResources();
  if(!scene.isDisposed&&isCurrent()){
   const ambient=new B.HemisphericLight('fallback-skylight',new B.Vector3(0,1,0),scene);ambient.intensity=.85;
   const sun=new B.DirectionalLight('fallback-sun',new B.Vector3(-.5,-1,.35),scene);sun.intensity=1.05;sun.diffuse=new B.Color3(1,.94,.84);
  }
  throw error;
 }
}
