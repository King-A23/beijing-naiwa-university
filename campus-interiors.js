// Authored room geometry is downloaded only at the door and released on exit.
const contains=(r,x,z,pad=0)=>x>=r.minX-pad&&x<=r.maxX+pad&&z>=r.minZ-pad&&z<=r.maxZ+pad;
export function interiorFloorHeight(building,x,z,currentY=0){
 if(!Number.isFinite(x+z+currentY))return null;
 const ramp=(building.ramps||[]).find(r=>contains(r,x,z)&&Math.abs((r.from+(r.to-r.from)*Math.max(0,Math.min(1,((r.axis==='x'?x:z)-r['min'+r.axis.toUpperCase()])/(r['max'+r.axis.toUpperCase()]-r['min'+r.axis.toUpperCase()]))))-currentY)<.6);
 if(ramp){const axis=ramp.axis.toUpperCase(),t=Math.max(0,Math.min(1,((ramp.axis==='x'?x:z)-ramp['min'+axis])/(ramp['max'+axis]-ramp['min'+axis])));return ramp.from+(ramp.to-ramp.from)*t;}
 const floors=(building.floors||[]).filter(f=>contains(f,x,z)&&f.y<=currentY+.48&&f.y>=currentY-.6);
 if(!floors.length)return null;
 return floors.sort((a,b)=>Math.abs(a.y-currentY)-Math.abs(b.y-currentY))[0].y;
}
export function interiorColliders(building,y){return building.colliders.filter(c=>(c.minY??0)<y+1.32&&c.height>y+.15);}
export function interiorBlocked(building,x,z,y,radius=.48){return interiorColliders(building,y).some(c=>x>c.minX-radius&&x<c.maxX+radius&&z>c.minZ-radius&&z<c.maxZ+radius);}
export function moveInInterior(building,position,dx,dz){
 const next={...position},steps=Math.max(1,Math.ceil(Math.hypot(dx,dz)/.12));
 for(let i=0;i<steps;i++)for(const [axis,delta] of [['x',dx/steps],['z',dz/steps]]){
  const x=next.x+(axis==='x'?delta:0),z=next.z+(axis==='z'?delta:0),y=interiorFloorHeight(building,x,z,next.y);
  if(y!==null&&!interiorBlocked(building,x,z,y)){next.x=x;next.z=z;next.y=y;}
 }
 return next;
}

export async function createCampusInteriors(B,{scene,player,host,state,profile,manifest,loadContainer,waitForAsset,isCurrent,signal,notify,wake,onMode}){
 let disposed=false,inside=null,busy=false,container=null,pending=null,epoch=0,cooldown=0,saved=null,outdoor=[],outdoorLights=[],interiorLights=[],shadow=null;
 const markers=[],owned=[],controller=new AbortController(),abort=()=>controller.abort();signal?.addEventListener('abort',abort,{once:true});
 const timer=setTimeout(abort,10000);let catalog;
 try{const response=await fetch('assets/campus/interiors/manifest.json',{signal:controller.signal});if(!response.ok)throw new Error('室内目录暂不可用');catalog=await response.json();}
 finally{clearTimeout(timer);signal?.removeEventListener('abort',abort);}
 if(!isCurrent()||signal?.aborted)return {dispose(){}};
 const buildings=catalog.buildings,doorButton=host.querySelector('#buildingDoor'),leaveButton=host.querySelector('#leaveBuilding'),roomLabel=host.querySelector('#interiorRoom');
 // Small entry markers remain outdoors; detailed room meshes are absent until entry.
 const blue=new B.StandardMaterial('interior-entrance-blue',scene);blue.diffuseColor=new B.Color3(.025,.16,.30);blue.emissiveColor=new B.Color3(.008,.025,.055);owned.push(blue);
 const gold=new B.StandardMaterial('interior-entrance-gold',scene);gold.diffuseColor=new B.Color3(.69,.43,.12);gold.specularColor=new B.Color3(.5,.4,.2);gold.specularPower=64;owned.push(gold);
 for(const building of buildings){
  const p=building.exterior,root=new B.TransformNode('door-'+building.id,scene);root.position.set(p.x,p.y||0,p.z);root.rotation.y=p.yaw??Math.PI;owned.push(root);
  for(const x of [-1.8,1.8]){const post=B.MeshBuilder.CreateBox('entrance-post-'+building.id,{width:.14,height:2.85,depth:.16},scene);post.position.set(x,1.425,0);post.parent=root;post.material=blue;markers.push(post);owned.push(post);}
  const lintel=B.MeshBuilder.CreateBox('entrance-lintel-'+building.id,{width:3.74,height:.2,depth:.18},scene);lintel.position.set(0,2.86,0);lintel.parent=root;lintel.material=gold;markers.push(lintel);owned.push(lintel);
  const texture=new B.DynamicTexture('entrance-label-'+building.id,{width:1024,height:192},scene,false);texture.drawText(building.name+' · 可进入',null,125,'bold 66px sans-serif','#fff5d5','#063d7c',true);owned.push(texture);
  const material=new B.StandardMaterial('entrance-label-material-'+building.id,scene);material.diffuseTexture=texture;material.emissiveColor=new B.Color3(.3,.3,.3);material.backFaceCulling=false;owned.push(material);
  const label=B.MeshBuilder.CreatePlane('entrance-sign-'+building.id,{width:3.5,height:.65,sideOrientation:B.Mesh.DOUBLESIDE},scene);label.parent=root;label.position.set(0,3.42,0);label.material=material;markers.push(label);owned.push(label);
 }
 if(catalog.portals?.url){try{const portals=await loadContainer(catalog.portals.url,'建筑门廊',signal);if(!isCurrent()||signal?.aborted){portals.dispose();return {dispose(){}};}portals.addAllToScene();owned.push(portals);}catch(error){console.warn('Campus entrance detail:',error.message);}}
 const clearMovement=()=>{state.keys.clear();state.joyX=state.joyY=0;state.run=false;state.animation='';};
 const setPosition=p=>{state.x=p.x;state.y=p.y||0;state.z=p.z;state.yaw=p.yaw??Math.PI;player.position.set(state.x,state.y+.012,state.z);player.rotation.y=state.yaw;clearMovement();};
 const playerMesh=mesh=>mesh===player||mesh.isDescendantOf(player);
 function restoreOutside(){
  for(const light of interiorLights)light.dispose();interiorLights=[];shadow?.dispose();shadow=null;
  container?.dispose();container=null;
  for(const [mesh,enabled] of outdoor)if(!mesh.isDisposed())mesh.setEnabled(enabled);outdoor=[];
  for(const [light,enabled] of outdoorLights)if(!light.isDisposed())light.setEnabled(enabled);outdoorLights=[];
  if(saved){scene.fogDensity=saved.fog;scene.clearColor=saved.clear;scene.ambientColor=saved.ambient;scene.environmentIntensity=saved.environment;scene.imageProcessingConfiguration.exposure=saved.exposure;for(const target of saved.targets)if(!scene.customRenderTargets.includes(target))scene.customRenderTargets.push(target);}
 }
 async function enter(building){
  if(disposed||busy||inside||!isCurrent())return;busy=true;const ticket=++epoch;pending=new AbortController();const cancel=()=>pending?.abort();signal?.addEventListener('abort',cancel,{once:true});
  clearMovement();host.querySelector('#campusLoad').hidden=false;host.querySelector('#loadDetail').textContent='正在打开'+building.name;host.querySelector('#loadElapsed').textContent='只加载当前建筑，其他室内不会下载。';host.dataset.interiorLoading=building.id;leaveButton.hidden=false;leaveButton.textContent='取消进门';doorButton.hidden=false;doorButton.disabled=true;doorButton.textContent='正在打开'+building.name+'…';notify('正在准备'+building.name+'室内，首次进入按需下载。');wake();let loaded;
  try{
   loaded=await loadContainer(building.url,building.name+'室内',pending.signal);
   if(disposed||ticket!==epoch||!isCurrent()){loaded.dispose();return;}
   saved={position:{x:state.x,y:state.y,z:state.z,yaw:state.yaw},camera:host.querySelector('#worldCamera').value,distance:state.distance,pitch:state.pitch,fog:scene.fogDensity,clear:scene.clearColor,ambient:scene.ambientColor,environment:scene.environmentIntensity,exposure:scene.imageProcessingConfiguration.exposure,targets:[...scene.customRenderTargets]};
   outdoor=scene.meshes.filter(mesh=>!playerMesh(mesh)).map(mesh=>[mesh,mesh.isEnabled(false)]);outdoorLights=scene.lights.map(light=>[light,light.isEnabled()]);
   for(const mesh of scene.meshes.filter(playerMesh))mesh.material?.unfreeze?.();
   for(const [mesh] of outdoor)mesh.setEnabled(false);for(const [light] of outdoorLights)light.setEnabled(false);scene.customRenderTargets.length=0;
   container=loaded;container.addAllToScene();container.animationGroups.forEach(group=>group.stop());for(const mesh of container.meshes){mesh.isPickable=false;if(mesh.getTotalVertices())mesh.freezeWorldMatrix();}
   const ambient=new B.HemisphericLight('interior-bounced-daylight',new B.Vector3(0,1,0),scene);ambient.intensity=.8;ambient.diffuse=new B.Color3(.9,.94,1);ambient.groundColor=new B.Color3(.42,.38,.31);interiorLights.push(ambient);
   const windowLight=new B.DirectionalLight('interior-window-daylight',new B.Vector3(-.6,-1,-.35),scene);windowLight.position.set(9,13,5);windowLight.intensity=1.45;windowLight.diffuse=new B.Color3(1,.94,.83);interiorLights.push(windowLight);
   if(!profile.mobile&&!profile.limited){shadow=new B.ShadowGenerator(1024,windowLight);shadow.usePercentageCloserFiltering=true;shadow.bias=.001;shadow.normalBias=.025;for(const mesh of [...container.meshes,...scene.meshes.filter(playerMesh)])if(mesh.getTotalVertices()){mesh.receiveShadows=true;if(!/glass|light/.test(mesh.material?.name||''))shadow.addShadowCaster(mesh,false);}}
   for(const point of (building.lights||[]).slice(0,profile.mobile?2:3)){const light=new B.PointLight('interior-reading-light',new B.Vector3(point.x,point.y,point.z),scene);light.diffuse=new B.Color3(1,.85,.63);light.intensity=point.intensity??.35;light.range=12;interiorLights.push(light);}
   scene.fogDensity=0;scene.clearColor=new B.Color4(.72,.79,.84,1);scene.ambientColor=new B.Color3(.12,.12,.12);scene.environmentIntensity=.38;scene.imageProcessingConfiguration.exposure=1.05;
   for(const material of container.materials){material.maxSimultaneousLights=profile.mobile?4:5;if(material.environmentIntensity!==undefined)material.environmentIntensity=.45;if(/interior-glass/.test(material.name)){material.alpha=.3;material.transparencyMode=B.PBRMaterial.PBRMATERIAL_ALPHABLEND;material.backFaceCulling=false;material.roughness=.12;material.environmentIntensity=.8;}}
   await waitForAsset(scene.whenReadyAsync(),building.name+'室内首帧',pending.signal);
   if(disposed||ticket!==epoch||!isCurrent()){restoreOutside();return;}
   inside=building;setPosition(building.spawn);state.distance=3.2;state.pitch=.14;host.querySelector('#worldCamera').value=saved.camera==='first'?'first':'follow';cooldown=performance.now()+1800;host.dataset.interior=building.id;delete host.dataset.interiorError;host.dataset.interiorReady='false';leaveButton.hidden=false;leaveButton.textContent='返回校园 · 离开建筑';onMode(building);notify('已进入'+building.name+'，从门口可返回校园。');
  }catch(error){
   if(!disposed&&ticket===epoch){if(container)restoreOutside();else loaded?.dispose();host.dataset.interiorError=error.message;if(error.message!=='VIEW_DISPOSED'&&error.name!=='AbortError')notify('室内暂未加载成功，仍停留在门外；可再次进入重试。');}
  }finally{signal?.removeEventListener('abort',cancel);if(ticket===epoch){busy=false;pending=null;delete host.dataset.interiorLoading;doorButton.disabled=false;if(!inside){leaveButton.hidden=true;if(host.dataset.contextLost!=='true')host.querySelector('#campusLoad').hidden=true;}wake();}}
 }
 function leave({returnToEntrance=true}={}){
  epoch++;pending?.abort();pending=null;busy=false;delete host.dataset.interiorLoading;doorButton.disabled=false;if(host.dataset.contextLost!=='true')host.querySelector('#campusLoad').hidden=true;delete host.dataset.interiorReady;
  if(!inside){if(container){restoreOutside();saved=null;}leaveButton.hidden=true;wake();return;}
  const building=inside;inside=null;restoreOutside();
  if(returnToEntrance){const p=building.exterior;setPosition({x:p.x-Math.sin(p.yaw??Math.PI)*3,y:p.y||0,z:p.z-Math.cos(p.yaw??Math.PI)*3,yaw:(p.yaw??Math.PI)+Math.PI});}
  state.distance=saved.distance;state.pitch=saved.pitch;host.querySelector('#worldCamera').value=saved.camera;saved=null;cooldown=performance.now()+2200;delete host.dataset.interior;leaveButton.hidden=true;roomLabel.hidden=true;onMode(null);wake();
 }
 function nearest(){if(inside||busy)return null;return buildings.map(building=>({building,distance:Math.hypot(state.x-building.exterior.x,state.z-building.exterior.z)})).filter(p=>p.distance<6).sort((a,b)=>a.distance-b.distance)[0]?.building||null;}
 function update(moving){
  if(disposed)return;
  if(inside){
   const room=inside.rooms.filter(room=>Math.abs(room.y-state.y)<1).sort((a,b)=>Math.hypot(a.x-state.x,a.z-state.z)-Math.hypot(b.x-state.x,b.z-state.z))[0];roomLabel.hidden=false;roomLabel.textContent=inside.name+' · '+(room?.name||'门厅')+' · '+(state.y>2?'二层':'一层');
   const atExit=state.y<.5&&contains(inside.exit,state.x,state.z);doorButton.hidden=!atExit;doorButton.textContent='E · 返回校园';
   if(moving&&atExit&&performance.now()>cooldown)leave();
  }else{
   const building=nearest();if(!busy){doorButton.hidden=!building;doorButton.textContent=building?'E · 进入'+building.name:'';}
   if(building&&moving&&performance.now()>cooldown&&Math.hypot(state.x-building.exterior.x,state.z-building.exterior.z)<1.35&&Math.cos(state.yaw-building.exterior.yaw)>.2)void enter(building);
  }
 }
 const interact=()=>{if(busy)return true;if(inside&&state.y<.5&&contains(inside.exit,state.x,state.z,.25)){leave();return true;}const building=nearest();if(building){void enter(building);return true;}return false;};
 const click=()=>interact(),exitClick=()=>leave();doorButton.addEventListener('click',click);leaveButton.addEventListener('click',exitClick);
 return {get building(){return inside;},get busy(){return busy;},buildings,nearest,interact,update,leave,
  diagnostics:()=>({building:inside?.id||null,loading:busy,loadedBuildings:container?1:0,roomMeshes:container?.meshes.length||0}),
  dispose(){if(disposed)return;disposed=true;epoch++;pending?.abort();if(inside||container)restoreOutside();inside=null;doorButton.removeEventListener('click',click);leaveButton.removeEventListener('click',exitClick);for(const item of owned.reverse())item.dispose?.();}
 };
}
