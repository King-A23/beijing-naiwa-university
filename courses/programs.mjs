// Stable, additive plan versions. Published versions are never edited retroactively.
export const planVersion='2026-foundation-v1';
const common1=['academic-writing','college-english-1','modern-chinese-history','ethics-law','current-affairs','physical-health-1','mental-health','labor-practice','art-appreciation'];
const common2=['college-english-2','marxism-foundations','mao-theory','xi-thought','physical-health-2','innovation-entrepreneurship'];
const feature=['signal','web','morning','queue','sow-care','temptation'];
const make=(id,title,college,focus,first,second,extension)=>({id,title,college,version:planVersion,scope:'first-year',language:'中文',focus,description:'首年基础培养方案。后续学年仅列出已具备完整讲义的衔接课程；本版不提供四年毕业资格审核。',buckets:[{id:'general',title:'公共通识',type:'required',courseIds:[...common1,...common2]},{id:'foundation',title:'方向基础',type:'required',courseIds:[...first,...second]},{id:'feature',title:'特色选修',type:'elective',courseIds:feature,targetCredits:2}],semesters:[{number:1,title:'第一学期',courseIds:[...common1,...first]},{number:2,title:'第二学期',courseIds:[...common2,...second]}],extensions:extension});
export const programs=[
 make('computer-science','计算机科学与技术方向','奶蛙计算机学院','编程、算法、系统与数据管理',['python-foundations','calculus-1','linear-algebra','discrete-mathematics'],['calculus-2','physics-1','data-structures','database-systems','computer-networks'],['digital-logic','computer-organization','algorithm-analysis','operating-systems','programming-project','web-application-project','database-project']),
 make('communication-engineering','通信工程方向','呱声通信学院','信号、电路与可靠通信',['calculus-1','linear-algebra','discrete-mathematics','python-foundations'],['calculus-2','physics-1','circuit-foundations','digital-logic'],['probability-statistics','physics-2','physics-lab','analog-electronics','signals-systems','communication-networks','information-theory','circuits-communication-project']),
 make('digital-media','数字媒体技术方向','蛙鸣数字媒体学院','视觉表达、交互与数字作品',['design-foundations','python-foundations','linear-algebra'],['visual-language','interaction-design','digital-image-processing','three-dimensional-modeling'],['digital-storytelling','digital-media-project','web-application-project']),
 make('life-and-society','生命科学与社会生活方向','荷塘生活学院','生命、环境、组织与证据调查',['life-science','organization-communication','calculus-1'],['calculus-2','ecology-foundations','food-nutrition','social-research','animal-science'],['probability-statistics','social-data-project'])
];
export const findProgram=(id,version=planVersion)=>programs.find(p=>p.id===id&&p.version===version);
