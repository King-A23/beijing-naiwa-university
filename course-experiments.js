// Original classroom cases: observations support a handover, not an online diagnosis.
export const sowCases=[
 {id:'routine',title:'日常巡查',observations:'母猪能自行饮水并进食，休息时能起身；仔猪哺乳后多安静休息，未见新出现的明显异常。',action:'record',why:'按猪场既定流程继续记录饮水、采食、精神、乳房和仔猪表现，交班时比较趋势；一次看起来正常不等于以后无需巡查。'},
 {id:'trend',title:'采食趋势发生变化',observations:'本次采食明显少于此前记录；饮水器出水不畅。母猪仍能站立，尚未完成其他项目观察。',action:'check',why:'先在安全条件下检查并报告供水问题，补充精神、泌乳及仔猪观察，按猪场流程及时汇报；不要只凭一项变化判断病因，也不要等到下一天才记录。'},
 {id:'milk',title:'母仔联合观察',observations:'仔猪持续争抢乳头、频繁叫唤；母猪采食减少、乳房红肿且触碰时表现疼痛。',action:'vet',why:'这些联合变化需要及时联系兽医评估并报告母仔情况。不能只给仔猪增加保温就忽略母猪，也不能在线断言具体疾病或自行开药。'},
 {id:'urgent',title:'明显危急表现',observations:'母猪突然无法站立，呼吸明显困难，并有大量持续出血。',action:'vet',why:'立即联系兽医或猪场紧急负责人，按既定应急流程保护人员与动物安全并报告准确观察。不要等待常规交班，不要尝试本课未教授的侵入性操作。'}
];
export function reviewSowCase(caseId,action){
 const item=sowCases.find(x=>x.id===caseId);
 if(!item||!['record','check','vet','medicate'].includes(action))throw Error('请先选择案例和下一步安排。');
 return {correct:action===item.action,explanation:item.why};
}

const triggers={notification:'学习时出现非紧急消息提醒',discount:'看见限时优惠，想购买计划外的东西',video:'休息结束后又想继续刷视频'};
const barriers={quiet:'关闭非必要提醒，保留事先约定的紧急联系渠道',list:'先对照原有清单，把计划外商品移出结算页',away:'把设备放到不顺手的位置，关掉自动连播',none:'保持原有页面和提醒，完全依靠临场克制'};
const responses={task:'先做一个可以完成的小任务，再到约定时间查看',wait:'离开结算页面，等到预定复核时间再决定',restart:'暂停播放并起身，回到已准备好的下一项任务',vague:'提醒自己以后一定不能再分心'};
export function buildTemptationPlan({goal,trigger,barrier,response,minutes}){
 goal=String(goal||'').trim();minutes=Number(minutes);
 if(!goal||goal.length>80||!triggers[trigger]||!barriers[barrier]||!responses[response]||!Number.isInteger(minutes)||minutes<5||minutes>120)throw Error('请填写80字以内的具体目标，并选择5–120分钟的复核间隔。');
 const concrete=barrier!=='none'&&response!=='vague';
 return {
  concrete,
  text:`我的目标：${goal}\n如果${triggers[trigger]}，那么我会${responses[response]}。\n环境安排：${barriers[barrier]}。\n${minutes}分钟后检查：是否完成下一步、哪里受阻、是否需要调整。`,
  feedback:!concrete?'计划还需要具体行动。把“只靠克制”换成一种环境安排，把“以后一定”换成当下能做的一步；这不代表个人品质评分。':trigger==='discount'&&response!=='wait'?'行动已具体，但购买情景还应明确何时重新核对需求和预算，间隔结束也不代表必须购买。':trigger==='notification'&&barrier!=='quiet'?'行动已具体；再确认提醒是否仍会打断任务，并为真正紧急的联系保留例外。':'计划已写清触发线索、下一步行动和复核时间。先试一次，再根据实际记录修改；这份练习不预测现实成功率。'
 };
}

const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const options=items=>Object.entries(items).map(([key,value])=>`<option value="${key}">${esc(value)}</option>`).join('');
export function mountCourseExperiment(host,type){
 if(type==='sow-care'){
  host.innerHTML=`<h3>护理交班情景训练</h3><p class="muted">虚构案例，仅练习观察、记录与升级报告；不作线上诊断，不自动获得学分。</p><label for="sowCase">选择巡查案例</label><select id="sowCase">${sowCases.map(c=>`<option value="${c.id}">${c.title}</option>`).join('')}</select><p id="sowObservations" class="prose"></p><form id="sowAction"><fieldset><legend>你会如何安排下一步？</legend>${[['record','按既定流程继续观察、记录和交班'],['check','检查供水等基本条件，补充观察并及时汇报'],['vet','及时联系兽医；危急时启动猪场应急流程'],['medicate','仅凭这段描述判断病因并自行用药']].map(([value,label])=>`<label class="choice"><input type="radio" name="action" value="${value}" required><span>${label}</span></label>`).join('')}</fieldset><button type="submit">核对护理安排</button></form><p id="sowFeedback" role="status" class="prose" hidden></p>`;
  const select=host.querySelector('#sowCase'),feedback=host.querySelector('#sowFeedback'),form=host.querySelector('form');
  const show=()=>{host.querySelector('#sowObservations').textContent=sowCases.find(x=>x.id===select.value).observations;form.reset();feedback.hidden=true;feedback.textContent='';};
  select.onchange=show;form.onsubmit=event=>{event.preventDefault();const result=reviewSowCase(select.value,new FormData(form).get('action'));feedback.hidden=false;feedback.textContent=(result.correct?'安排合适。':'请调整安排。')+result.explanation;};show();
 }else if(type==='temptation'){
  host.innerHTML=`<h3>把“制服诱惑”写成行动计划</h3><p class="muted">练习数据只留在当前页面，不上传个人习惯或消费记录。换一种安排再生成，可比较计划是否更具体。</p><form id="temptationPlan"><label for="planGoal">接下来要完成的具体目标</label><input id="planGoal" name="goal" maxlength="80" value="完成一节课程的笔记" required><label for="planTrigger">可能遇到的诱惑</label><select id="planTrigger" name="trigger">${options(triggers)}</select><label for="planBarrier">提前安排环境</label><select id="planBarrier" name="barrier">${options(barriers)}</select><label for="planResponse">线索出现后的动作</label><select id="planResponse" name="response">${options(responses)}</select><label for="planMinutes">多久后复核一次（分钟）</label><input id="planMinutes" name="minutes" type="number" min="5" max="120" step="1" value="20" required><button type="submit">生成并检查计划</button></form><div id="planResult" role="status" hidden><h4>我的如果—那么计划</h4><p id="planText" class="prose"></p><p id="planFeedback" class="muted"></p></div>`;
  host.querySelector('form').onsubmit=event=>{event.preventDefault();const out=host.querySelector('#planResult');out.hidden=false;try{const result=buildTemptationPlan(Object.fromEntries(new FormData(event.currentTarget)));host.querySelector('#planText').textContent=result.text;host.querySelector('#planFeedback').textContent=result.feedback;}catch(error){host.querySelector('#planText').textContent=error.message;host.querySelector('#planFeedback').textContent='';}};
 }
}
