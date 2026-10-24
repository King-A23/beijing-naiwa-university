// 原创课程；12个独立教学单元。来源与学时见课程大纲，结课题库仅后端持有。
export const course = {
  "id": "college-english-2",
  "title": "大学英语Ⅱ",
  "college": "公共基础教学中心",
  "category": "general",
  "credits": 2,
  "code": "ENG102",
  "prerequisiteIds": [
    "college-english-1"
  ],
  "recommendedSemester": 2,
  "version": "1.0",
  "durationWeeks": 12,
  "creditSystem": "semester",
  "contactHours": 32,
  "selfStudyHours": 32,
  "hours": "12周，教学32学时＋自主学习32学时",
  "audience": "能阅读基础通知，准备进入说明、论证与学术交流的学生",
  "prerequisites": "先修大学英语Ⅰ；能够识别基本句子结构与时态",
  "objectives": [
    "分析长句、限定结构与作者立场",
    "用证据范围评价英文论证",
    "写出准确摘要、图表说明和讨论回应",
    "形成可复查的阅读与修订流程"
  ],
  "assessment": "完成12周随堂练习后参加12题结课测验，测验占100%，按答对比例折算百分制；60分通过，可重考，保留历史记录。",
  "experiment": null,
  "sources": [
    {
      "title": "British Council：Reading",
      "url": "https://learnenglish.britishcouncil.org/free-resources/reading",
      "checkedAt": "2026-10-23"
    },
    {
      "title": "British Council：Grammar",
      "url": "https://learnenglish.britishcouncil.org/free-resources/grammar",
      "checkedAt": "2026-10-23"
    }
  ],
  "chapters": [
    {
      "id": "week-1",
      "title": "第1周 · 主从句与信息层级",
      "body": "<p>复合句可以把原因、条件或补充信息放入从句。阅读先标主句，再判断从句承担什么作用。that、because、if并不互换；断句不是在每个长词后停顿，而是依据结构形成语义组。</p><p>原创短文：Although the new study room is small, students who need quiet workspaces often choose it because it is away from the main road. 主干是students choose it；who限定哪类学生，because解释选择原因，although让步。</p><p>把句子拆成四条信息，再合成两句不改变逻辑的英文。检查small与quiet并非矛盾事实，转折表达的是房间小但仍被选择，而不是学生因为小才喜欢。</p><p>本句描述经常选择，不说明所有学生偏好，也没证明安静能提高成绩。长句拆分应保留often、who等限制，删掉这些词可能把特定人群改成普遍命题。</p><p>检验推理：学生选择此房间的明示原因是什么？ 可核对的判断是“it is away from the main road”。另外的三种说法“it is the largest”“all students must use it”“the room has no windows”分别代表本题需排除的误读。</p><aside class=\"naiwaCase\" aria-label=\"奶蛙校园案例\"><h3>奶蛙校园案例</h3><p>以下为教学假设。奶蛙同学在荷塘读书会读到：Although it rains, the group meets indoors. 主干是the group meets indoors，although带出下雨这一让步条件；它没有说会议取消，也没解释谁决定改室内。写摘要时可拆开两条信息，却不能补造决定者或结果。用两句重述时，应保留下雨与室内开会两条信息，以及它们之间的让步关系。</p></aside>",
      "practice": {
        "question": "学生选择此房间的明示原因是什么？",
        "options": [
          "it is away from the main road",
          "it is the largest",
          "all students must use it",
          "the room has no windows"
        ],
        "correct": 0,
        "explanation": "it is away from the main road。关注限定词和证据范围；语言上可能成立的表达，不一定受到材料支持。"
      }
    },
    {
      "id": "week-2",
      "title": "第2周 · 定语从句与范围",
      "body": "<p>限制性定语从句决定谈的是哪一部分对象；补充信息常用逗号分开。标点影响含义，不能仅当装饰。关系词的选择与所指对象及从句缺少的成分有关。</p><p>原创两句：Students who submitted a draft received feedback. The students, who submitted a draft, received feedback. 第一句只谈提交草稿者；第二句在既定学生群体上补充他们提交了草稿。没有上下文时不应擅自扩展群体。</p><p>将第一句翻成带有范围限制的中文，再写一个关于借书者的限制性从句。核对从句是否紧接被修饰名词，避免让读者误以为修饰的是后面另一个人或物。</p><p>逗号规则帮助表达，但现实文本也可能写得含糊。若两种解读影响任务，就询问作者或核查其他资料；不要靠一条语法规则推断现实中未交代的人数。</p><p>检验推理：第一句是否说明所有学生都收到反馈？ 可核对的判断是“没有，只说明提交草稿的学生收到反馈”。另外的三种说法“明确说明所有人”“说明无人提交”“说明反馈一定提高成绩”分别代表本题需排除的误读。</p>",
      "practice": {
        "question": "第一句是否说明所有学生都收到反馈？",
        "options": [
          "明确说明所有人",
          "没有，只说明提交草稿的学生收到反馈",
          "说明无人提交",
          "说明反馈一定提高成绩"
        ],
        "correct": 1,
        "explanation": "没有，只说明提交草稿的学生收到反馈。关注限定词和证据范围；语言上可能成立的表达，不一定受到材料支持。"
      }
    },
    {
      "id": "week-3",
      "title": "第3周 · 被动语态与责任",
      "body": "<p>被动语态把动作承受者放到主题位置，适合方法和过程描述；它也可能隐去执行者。读者应区分语法焦点与事实责任，缺少by短语不表示动作自动发生。</p><p>原创实验说明：The samples were labelled before they were stored. Two records were excluded because their dates were missing. 样本先标记再存储；两条记录因日期缺失被排除。文本没有告诉谁执行，不能补写实验员姓名。</p><p>把第一句改为主动句时暂用The team并注明这是为练语法而补入的虚构主语。再说明第二句为什么需要保留排除理由，否则方法部分难以复查。</p><p>被动并非天生更客观，主动也不天然不学术。只要动作顺序、条件和责任交代清楚，可依写作目的选用；本例不涉及真实实验或敏感样本资料。</p><p>检验推理：两条记录为何被排除？ 可核对的判断是“their dates were missing”。另外的三种说法“their values were low”“they contradicted expectations”“the text names a careless worker”分别代表本题需排除的误读。</p>",
      "practice": {
        "question": "两条记录为何被排除？",
        "options": [
          "their values were low",
          "they contradicted expectations",
          "their dates were missing",
          "the text names a careless worker"
        ],
        "correct": 2,
        "explanation": "their dates were missing。关注限定词和证据范围；语言上可能成立的表达，不一定受到材料支持。"
      }
    },
    {
      "id": "week-4",
      "title": "第4周 · 完成时与结果边界",
      "body": "<p>现在完成时连接过去事件与当前时点，常与since、for或尚未结束的时间范围搭配。一般过去时则把叙述放在结束的过去。读者要看参照时间，不把所有已完成动作都自动写成完成时。</p><p>原创进展：The group has collected twelve responses since Monday. It collected five responses yesterday. The survey is still open. 第一条累计到当前，第二条是昨天这一段；不能把12和5相加成17，因为昨日五条可能已经包含在累计数里。</p><p>画一条从周一到今天的时间线，将累计12与昨天5放到合适位置。写两句介绍虚构阅读进度，一句累计、一句指定过去某日，避免重复统计。</p><p>完成时不保证行动以后继续，也不说明资料已经足以发表。时间短语必须与实际参照一致，this week是否结束取决于语境；不能只背单个词机械选择时态。</p><p>检验推理：当前总响应数应怎样读？ 可核对的判断是“12，其中可能包含昨天的5份”。另外的三种说法“一定17”“只有5”“已经全部结束”分别代表本题需排除的误读。</p>",
      "practice": {
        "question": "当前总响应数应怎样读？",
        "options": [
          "一定17",
          "只有5",
          "已经全部结束",
          "12，其中可能包含昨天的5份"
        ],
        "correct": 3,
        "explanation": "12，其中可能包含昨天的5份。关注限定词和证据范围；语言上可能成立的表达，不一定受到材料支持。"
      }
    },
    {
      "id": "week-5",
      "title": "第5周 · 谨慎措辞与证据强度",
      "body": "<p>may、suggest、in this sample等表达标示不确定性和适用范围。谨慎不等于模糊：应说清不确定在哪里。prove、always、all会显著提高断言强度，需要相应强的证据。</p><p>原创摘要：In a small volunteer sample, participants using reminders submitted work earlier. The result suggests that reminders may help some students plan tasks. 选择参加者可能原本更自律，因而不能从这段材料证明提醒适用于所有学生。</p><p>给结论分别写过强、过弱与适当三个版本。适当版本保留volunteer sample、may与具体结果，不把早提交改成更高成绩，也不把研究未测的人群纳入。</p><p>谨慎词不是掩护错误数据的办法；若计算或来源有问题，仍应纠正。相反，对已经明确的时间地点不必塞进大量may，以免使读者无法判断具体安排。</p><p>检验推理：哪句最符合证据范围？ 可核对的判断是“Reminders may help some participants plan tasks”。另外的三种说法“Reminders prove all students will succeed”“Everyone achieved higher grades”“No information can be described”分别代表本题需排除的误读。</p>",
      "practice": {
        "question": "哪句最符合证据范围？",
        "options": [
          "Reminders may help some participants plan tasks",
          "Reminders prove all students will succeed",
          "Everyone achieved higher grades",
          "No information can be described"
        ],
        "correct": 0,
        "explanation": "Reminders may help some participants plan tasks。关注限定词和证据范围；语言上可能成立的表达，不一定受到材料支持。"
      }
    },
    {
      "id": "week-6",
      "title": "第6周 · 论点、理由与反例",
      "body": "<p>论证文本需要区分作者主张、支持理由和反驳对象。引用对手意见不等于赞同，However、Some argue等提示立场转换，但最终仍需完整阅读后续回应。</p><p>原创段落：Some argue that online meetings save travel time. This is true, but unstable connections can exclude participants. A fair policy should therefore keep an alternative way to contribute. 作者承认节时，却要求替代参与方式，不是主张禁止所有在线会议。</p><p>按主张、让步、问题与建议四栏整理段落。再写一个合理反例说明只看出勤数字可能遗漏什么，例如有人因网络中断未能发言；不要编造真实同学经历。</p><p>一段文字并未比较所有会议成本。反例应针对论证条件，不做人身攻击；提出公平原则也不自动证明某个技术实现最好，还需检查实际可用性与资源。</p><p>检验推理：作者最终建议是什么？ 可核对的判断是“保留替代参与方式”。另外的三种说法“禁止所有在线会议”“只统计在线人数”“不需要考虑网络障碍”分别代表本题需排除的误读。</p><aside class=\"naiwaCase\" aria-label=\"巡塘小练习\"><h3>巡塘小练习</h3><p>教学假设：奶蛙讨论卡写着：Online meetings save time, but some students lose connection. We should offer text replies. 最终建议是什么？是否取消全部线上会议？</p><details><summary>展开思路</summary><p>建议提供文字回应，给网络受限者替代渠道，并未取消全部线上会议。but指出限制；some不可扩大成人人掉线，“提供选择”也不能改成问题已经全解决。摘要的范围应与原句一致。</p></details></aside>",
      "practice": {
        "question": "作者最终建议是什么？",
        "options": [
          "禁止所有在线会议",
          "保留替代参与方式",
          "只统计在线人数",
          "不需要考虑网络障碍"
        ],
        "correct": 1,
        "explanation": "保留替代参与方式。关注限定词和证据范围；语言上可能成立的表达，不一定受到材料支持。"
      }
    },
    {
      "id": "week-7",
      "title": "第7周 · 图表文字说明",
      "body": "<p>图表说明先报告可直接读到的趋势，再解释可能原因并明确是推测。单位、基期与分母必须一致。increase by表示增加量，increase to表示增加后的水平，两者不能混用。</p><p>原创数据：Attendance rose from 40 to 50 between Week 1 and Week 2, then fell to 45 in Week 3. 增加10人相对增幅25%，第三周比第二周少5人。只有三个点，不能说稳步持续增长，也不能声称新政策造成变化。</p><p>写三句英文：一条首尾比较、一条峰值、一条限制。句中保留people或participants，避免把人数误写成百分比；再核对每句均可由表格直接复算。</p><p>图表没有给出总报名人数，所以无法计算出勤率。文字不应通过省略第三周制造持续增长印象；若纵轴截断，要解释刻度，不让视觉夸张替代数值判断。</p><p>检验推理：从40到50的相对增幅是多少？ 可核对的判断是“25%”。另外的三种说法“10%”“50%”“125个百分点”分别代表本题需排除的误读。</p>",
      "practice": {
        "question": "从40到50的相对增幅是多少？",
        "options": [
          "10%",
          "50%",
          "25%",
          "125个百分点"
        ],
        "correct": 2,
        "explanation": "25%。关注限定词和证据范围；语言上可能成立的表达，不一定受到材料支持。"
      }
    },
    {
      "id": "week-8",
      "title": "第8周 · 摘要与学术转述",
      "body": "<p>学术摘要保留研究问题、资料方法、结果与限制。转述可改变词序和句型，但不能改变量词或因果强度。正确摘要和引用格式是两个问题：忠实转述仍需要适当署名。</p><p>原创研究梗概：A class compared two poster layouts with twelve volunteers. Eight found layout B easier to scan. The task measured search time and preference, not long-term learning. 可以说多数志愿者偏好B，不能写B已被证实提高长期学习。</p><p>用60至80个英文词概括，并在末句写出未测长期学习。标出原文中每条摘要信息的依据；若加入你自己的解释，另起句注明This may be because并说明未检验。</p><p>本例材料为原创教学构造，不代表已发表研究。摘要不应靠照抄长串字句凑长度，也不要删除12名志愿者这一关键范围，使其看似代表全体学生。</p><p>检验推理：摘要必须保留哪项限制？ 可核对的判断是“没有测量长期学习效果”。另外的三种说法“B对所有人最有效”“研究证明因果”“样本来自全体大学生”分别代表本题需排除的误读。</p>",
      "practice": {
        "question": "摘要必须保留哪项限制？",
        "options": [
          "B对所有人最有效",
          "研究证明因果",
          "样本来自全体大学生",
          "没有测量长期学习效果"
        ],
        "correct": 3,
        "explanation": "没有测量长期学习效果。关注限定词和证据范围；语言上可能成立的表达，不一定受到材料支持。"
      }
    },
    {
      "id": "week-9",
      "title": "第9周 · 讨论与回应",
      "body": "<p>讨论回应先准确复述对方观点，再提出自己的理由或问题；礼貌并不要求无条件同意。Could you clarify…适合请求澄清，I agree that…, but…可保留共同点同时指出范围。</p><p>原创对话：A: We should remove all printed guides. B: I agree that digital guides are easier to update, but some visitors may need a printed option. Could we keep a small supply? B讨论访问需求，不是在指责A不关心他人。</p><p>用四句英文回应一个虚构方案：复述、认可一点、提出有依据的顾虑、给出可试建议。避免you always等绝对评价，把分歧指向方案和条件。</p><p>对语言表达的反馈不应变成身份嘲笑。讨论也不意味着必须透露个人障碍或健康状况；可以用匿名访客情景说明可访问性需要，且不声称替所有人发言。</p><p>检验推理：B的回应策略是什么？ 可核对的判断是“承认更新优势，同时提出保留纸质选择”。另外的三种说法“完全同意取消纸张”“攻击A本人”“证明所有访客无网络”分别代表本题需排除的误读。</p>",
      "practice": {
        "question": "B的回应策略是什么？",
        "options": [
          "承认更新优势，同时提出保留纸质选择",
          "完全同意取消纸张",
          "攻击A本人",
          "证明所有访客无网络"
        ],
        "correct": 0,
        "explanation": "承认更新优势，同时提出保留纸质选择。关注限定词和证据范围；语言上可能成立的表达，不一定受到材料支持。"
      }
    },
    {
      "id": "week-10",
      "title": "第10周 · 说明流程与条件",
      "body": "<p>流程文本依赖顺序词和条件分支。first、then、finally组织步骤；if和unless改变进入步骤的条件。复述流程时既要保留动作，也要保留触发条件和异常处理。</p><p>原创说明：First, save a copy of the file. Then check the title and date. If either is missing, ask the author before sharing it. Finally, share the approved version. 若日期缺失，不能直接分享；应先询问并取得认可。</p><p>将说明画成文字流程：保存副本—检查—缺失则询问—认可后分享。用一份虚构文件走一遍，再用日期缺失文件走另一遍，检查是否有绕过审批的路径。</p><p>这是课堂资料流程，不是现实系统的权限授权。保存副本应避免把敏感材料复制到不受控位置；对真实机构文件，按其现行要求处理，不能凭本课说明代替审批。</p><p>检验推理：标题或日期缺失时应做什么？ 可核对的判断是“分享前先询问作者”。另外的三种说法“直接公开”“删除作者姓名”“跳过检查”分别代表本题需排除的误读。</p>",
      "practice": {
        "question": "标题或日期缺失时应做什么？",
        "options": [
          "直接公开",
          "分享前先询问作者",
          "删除作者姓名",
          "跳过检查"
        ],
        "correct": 1,
        "explanation": "分享前先询问作者。关注限定词和证据范围；语言上可能成立的表达，不一定受到材料支持。"
      }
    },
    {
      "id": "week-11",
      "title": "第11周 · 结构性修订",
      "body": "<p>修订先检查中心问题、段落顺序和证据，再处理词汇与标点。连贯不只是多加连接词：代词指向、主题延续和信息顺序都要一致。每次修改应能说明改善了什么。</p><p>原创草稿：Our survey was successful. Six students answered. The campus is beautiful. Therefore all students support the plan. 主要缺口是样本小且未给回答内容，美丽校园与支持率无关。即使语法无误，推理仍不成立。</p><p>将结论改成只描述六份回答并标明尚不知总体态度；删除无关句，补一个需要查证的问题。保留修改前后版本，用中文或英文解释两处实质性修订。</p><p>更换高级词不能修复证据缺口。教师反馈应帮助清晰表达，不把某种口音或写作背景当成能力标签；工具建议也需由作者逐条核对，不能自动接受。</p><p>检验推理：这段草稿首先要修复什么？ 可核对的判断是“结论超出样本和已报告内容”。另外的三种说法“只把successful换成高级词”“增加感叹号”“删除人数以显得普遍”分别代表本题需排除的误读。</p>",
      "practice": {
        "question": "这段草稿首先要修复什么？",
        "options": [
          "只把successful换成高级词",
          "增加感叹号",
          "结论超出样本和已报告内容",
          "删除人数以显得普遍"
        ],
        "correct": 2,
        "explanation": "结论超出样本和已报告内容。关注限定词和证据范围；语言上可能成立的表达，不一定受到材料支持。"
      }
    },
    {
      "id": "week-12",
      "title": "第12周 · 综合：一页证据简报",
      "body": "<p>证据简报面向需要作决定的读者，交代问题、可用资料、主要发现、限制和下一步。语言应短而准确；提出建议时说明依据，而不是把愿望写成已经实现的结果。</p><p>原创情景：A library tested longer opening hours on two evenings. Visits increased, but staffing costs also rose. No satisfaction survey was conducted. 简报可建议进一步试行并采集成本和需求信息，不能宣布满意度大幅提升。</p><p>写120至160词英文简报，分Background、Findings、Limitations、Next step四段；用一条数字或条件支撑每个判断。交给读者后，问他能否区分观察结果与建议。</p><p>结课任务评价信息组织和语言判断，不认证专业英语水平。没有真实数据时明确使用虚构情景；不要为了使结论有力而捏造百分比、引用或不存在的研究机构。</p><p>检验推理：本例不能声称哪项已被测量？ 可核对的判断是“读者满意度提高”。另外的三种说法“访问人次变化”“人员成本上升”“试行两个晚上”分别代表本题需排除的误读。</p>",
      "practice": {
        "question": "本例不能声称哪项已被测量？",
        "options": [
          "访问人次变化",
          "人员成本上升",
          "试行两个晚上",
          "读者满意度提高"
        ],
        "correct": 3,
        "explanation": "读者满意度提高。关注限定词和证据范围；语言上可能成立的表达，不一定受到材料支持。"
      }
    }
  ],
  "project": null,
  "language": "中文讲解 / 英文阅读与练习",
  "weeklyHours": 5.3,
  "applicablePrograms": [
    "计算机科学与技术方向",
    "通信工程方向",
    "数字媒体技术方向",
    "生命科学与社会生活方向"
  ]
};
