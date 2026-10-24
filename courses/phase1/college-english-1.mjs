// 原创课程；12个独立教学单元。来源与学时见课程大纲，结课题库仅后端持有。
export const course = {
  "id": "college-english-1",
  "title": "大学英语Ⅰ",
  "college": "公共基础教学中心",
  "category": "general",
  "credits": 2,
  "code": "ENG101",
  "prerequisiteIds": [],
  "recommendedSemester": 1,
  "version": "1.0",
  "durationWeeks": 12,
  "creditSystem": "semester",
  "contactHours": 32,
  "selfStudyHours": 32,
  "hours": "12周，教学32学时＋自主学习32学时",
  "audience": "准备阅读大学生活通知并进行清楚交流的学生",
  "prerequisites": "能识别常见英文词和基本句子；无需其他课程",
  "objectives": [
    "识别句子主干与时间线索",
    "从原创通知邮件中提取事实而非猜测",
    "写清楚请求、比较与简短说明",
    "区分事实、推断和观点"
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
      "title": "第1周 · 主干：谁在做什么",
      "body": "<p>英语陈述句通常用主语和谓语组织信息；长修饰语不会自动改变主语。先找有时态的动词，再问谁执行或处于这个状态。单数第三人称的一般现在时常需要动词词尾变化。</p><p>原创短文：The library near the lake opens at eight. Two volunteers help visitors after lunch. The notice beside the door lists quiet rooms. 三个主语分别是library、volunteers、notice；near the lake只是修饰位置。</p><p>逐句标出主语、谓语与时间表达，再将第一句改成复数主语The libraries，观察opens需要改成open。不要因为lake距离动词最近，就把它当主语。</p><p>本周只练基本陈述句，不把这一顺序强加给倒装句和疑问句。检查时看完整句，不只记某个词；复数和时态是语法信息，不能据此推断通知是否真实。</p><p>检验推理：The library near the lake opens at eight. 句子主语是什么？ 可核对的判断是“The library”。另外的三种说法“the lake”“eight”“opens”分别代表本题需排除的误读。</p><aside class=\"naiwaCase\" aria-label=\"奶蛙校园案例\"><h3>奶蛙校园案例</h3><p>这是教学假设中的奶蛙校园公告：The library by the pond opens at eight. 奶蛙同学先认出主语The library和谓语opens，再把by the pond看作位置修饰；pond不是主语。如果改成复数The libraries，动词须用open。位置短语不改变主语的单复数，主谓一致要随主语变化，不能只凭相邻单词判断。</p></aside>",
      "practice": {
        "question": "The library near the lake opens at eight. 句子主语是什么？",
        "options": [
          "The library",
          "the lake",
          "eight",
          "opens"
        ],
        "correct": 0,
        "explanation": "The library。先定位原文依据，再检查时态、限定词与句子指向；不能把推断当成原文事实。"
      }
    },
    {
      "id": "week-2",
      "title": "第2周 · 现在与过去",
      "body": "<p>一般现在时可表习惯或相对稳定的事实；一般过去时把事件放在过去时间范围。时间副词能提供线索，但仍须检查动词形式。yesterday与every Monday指向的时间关系不同。</p><p>原创日记：Mina studies in Room 3 every Monday. Yesterday she studied at home because the room was closed. Today the room is open again. 每周习惯用studies，昨天完成的学习用studied；不能把昨天的关闭推成永久停用。</p><p>写两句关于虚构人物的习惯与昨天安排，分别保留明确时间词，再把yesterday换为last Friday。核对动词是否仍为过去式，理由是时间范围而不是词的长度。</p><p>过去式本身不表示事件反复，也不等于现在的状态。真实叙述需要资料支持；课堂日记均属原创虚构材料，不索要学生实际行踪或私人生活记录。</p><p>检验推理：哪一句明确描述昨天的事件？ 可核对的判断是“Yesterday she studied at home”。另外的三种说法“She studies every Monday”“The room opens daily”“She usually studies here”分别代表本题需排除的误读。</p>",
      "practice": {
        "question": "哪一句明确描述昨天的事件？",
        "options": [
          "She studies every Monday",
          "Yesterday she studied at home",
          "The room opens daily",
          "She usually studies here"
        ],
        "correct": 1,
        "explanation": "Yesterday she studied at home。先定位原文依据，再检查时态、限定词与句子指向；不能把推断当成原文事实。"
      }
    },
    {
      "id": "week-3",
      "title": "第3周 · 指代与连贯",
      "body": "<p>代词依靠语境找到先行词，this有时指整个前句。阅读不能只挑最近名词，还要检查数、语义和动作是否合理。指代含糊时，写作者应重复关键词而不是让读者猜。</p><p>原创段落：A tutor sent a map to the new students. They used it to find the science building. This saved them time. They指students，it指map，This概括使用地图找楼的做法；不是说建筑自己节省时间。</p><p>画出They、it、This到对应内容的箭头，并将末句改写为Using the map saved the students time. 比较改写前后的意思，检查是否无意新增人数、地点或时间。</p><p>某些代词有两个合理先行词，不能靠猜测装成唯一答案。写作时若出现这种情况，用具体名词重写；本例通过复数与用途能确认指向，但不能推广到所有段落。</p><p>检验推理：本段They used it中的it指什么？ 可核对的判断是“the map”。另外的三种说法“the tutor”“the building”“the students”分别代表本题需排除的误读。</p>",
      "practice": {
        "question": "本段They used it中的it指什么？",
        "options": [
          "the tutor",
          "the building",
          "the map",
          "the students"
        ],
        "correct": 2,
        "explanation": "the map。先定位原文依据，再检查时态、限定词与句子指向；不能把推断当成原文事实。"
      }
    },
    {
      "id": "week-4",
      "title": "第4周 · 通知中的时间地点",
      "body": "<p>校园通知常压缩活动、日期、开始结束时间和条件。快速阅读先提取这些字段，再看变化或例外。by表示截止边界，from…to…给出区间；不要把提交截止当成活动开始。</p><p>原创通知：Writing Workshop. Friday, 14:00–15:30, Room 204. Book a place by Thursday noon. Bring a draft, not a finished paper. 工作坊周五开始，预约最迟周四中午，需要带草稿而非已完成论文。</p><p>把原文改成四行中文信息卡，保留星期、时间和地点；再写一句英文问询只针对未给出的信息，例如是否有无障碍入口，不能重复询问已明确的开课时间。</p><p>通知没有年份与时区时，不能当作现实活动安排。by的具体截止是否包含某一时点可能需组织者确认；教学示例只考已明示的信息，不虚构真实校园预约。</p><p>检验推理：预约截止是哪一个时间？ 可核对的判断是“Thursday noon”。另外的三种说法“Friday 14:00”“Friday 15:30”“Room 204”分别代表本题需排除的误读。</p>",
      "practice": {
        "question": "预约截止是哪一个时间？",
        "options": [
          "Friday 14:00",
          "Friday 15:30",
          "Room 204",
          "Thursday noon"
        ],
        "correct": 3,
        "explanation": "Thursday noon。先定位原文依据，再检查时态、限定词与句子指向；不能把推断当成原文事实。"
      }
    },
    {
      "id": "week-5",
      "title": "第5周 · 礼貌请求与邮件",
      "body": "<p>邮件应让收件人迅速知道谁在问什么、何时需要回应以及有哪些可行选项。Could you…通常比直接命令温和，但清楚与尊重比堆砌礼貌词重要。主题行需要与请求一致。</p><p>原创邮件：Subject: Request to change our meeting. Dear Dr Lee, I have a class at ten on Tuesday. Could we meet at eleven, or on Wednesday afternoon? Thank you for considering these options. Best wishes, Lin. 这里提出两个替代时段，没有假定老师已经同意。</p><p>用虚构身份写一封四句邮件，包含原因、一项具体请求和两个选择。收到回信前，把安排记为待确认；不要写成I will arrive at eleven unless对方已经批准。</p><p>邮件不需透露身份证、病历或其他敏感原因。礼貌句式不会使不合理要求自动成立；对方可以拒绝或提出新方案，课内评分看表达是否明确而非私人理由是否充分。</p><p>检验推理：这封邮件对十一点会面的状态是什么？ 可核对的判断是“提出请求，仍待对方确认”。另外的三种说法“已经获准”“必须执行的命令”“已取消所有会面”分别代表本题需排除的误读。</p>",
      "practice": {
        "question": "这封邮件对十一点会面的状态是什么？",
        "options": [
          "提出请求，仍待对方确认",
          "已经获准",
          "必须执行的命令",
          "已取消所有会面"
        ],
        "correct": 0,
        "explanation": "提出请求，仍待对方确认。先定位原文依据，再检查时态、限定词与句子指向；不能把推断当成原文事实。"
      }
    },
    {
      "id": "week-6",
      "title": "第6周 · 数量与比较",
      "body": "<p>比较级连接相同维度的两项，例如cheaper比较价格，faster比较速度。先核对单位与条件，再使用than。twice as many表示数量为两倍，不应与增加两倍混用。</p><p>原创表格：Bus A takes 20 minutes and costs 3 yuan. Bus B takes 30 minutes and costs 2 yuan. A is faster but more expensive than B. A节省10分钟，多花1元，无法仅用更好概括所有使用者的选择。</p><p>分别用faster和cheaper写一句比较，再写一条条件选择：If cost matters most, B is cheaper. 不新增“更安全”或“更舒适”，因为表格未测量这些方面。</p><p>时间估计不保证真实交通结果；表格只是教学设定。进行比较要保持出发终点一致，不能用一条线路的最低价去比另一线路的最高价而不说明。</p><p>检验推理：哪种比较受表格支持？ 可核对的判断是“A is faster but more expensive than B”。另外的三种说法“A is cheaper”“B is faster”“A is always safer”分别代表本题需排除的误读。</p><aside class=\"naiwaCase\" aria-label=\"巡塘小练习\"><h3>巡塘小练习</h3><p>教学假设：奶蛙同学从荷塘去图书馆，A路12分钟、2元，B路18分钟、1元，两路起终点相同。请用faster和cheaper各写一句比较，计算A节省多久，并判断能否再说A更安全。</p><details><summary>展开思路</summary><p>A is faster than B. B is cheaper than A. A节省6分钟，却多花1元。题中未测安全，不能写A is safer；若费用最重要，选择也可能偏向B。比较句应说清“更快”和“更便宜”分别比较什么。</p></details></aside>",
      "practice": {
        "question": "哪种比较受表格支持？",
        "options": [
          "A is cheaper",
          "A is faster but more expensive than B",
          "B is faster",
          "A is always safer"
        ],
        "correct": 1,
        "explanation": "A is faster but more expensive than B。先定位原文依据，再检查时态、限定词与句子指向；不能把推断当成原文事实。"
      }
    },
    {
      "id": "week-7",
      "title": "第7周 · 因果与转折连接词",
      "body": "<p>because引出原因，so引出结果，although表达让步，however常连接转折。连接词呈现作者的逻辑，但不能单凭用了because就认定现实因果已经被证明。</p><p>原创短文：It rained heavily, so the outdoor reading event moved indoors. Although the room was smaller, everyone found a seat. However, the music session was cancelled. 室内阅读仍进行，取消的是音乐环节，不能把所有活动一并视为取消。</p><p>把三句拆成事件表：原因、改变、保留事项和取消事项。试把although替换成because，观察意思怎样变化；不是所有语法可接的词都适合当前逻辑。</p><p>作者说明的原因与读者推测不同。文章只说雨导致换场地，没有说房间小导致音乐取消；若要写后者，必须有额外证据，不可用连接词制造来源没有的关系。</p><p>检验推理：哪一项被取消？ 可核对的判断是“the music session”。另外的三种说法“the whole reading event”“all seats”“the indoor room”分别代表本题需排除的误读。</p>",
      "practice": {
        "question": "哪一项被取消？",
        "options": [
          "the whole reading event",
          "all seats",
          "the music session",
          "the indoor room"
        ],
        "correct": 2,
        "explanation": "the music session。先定位原文依据，再检查时态、限定词与句子指向；不能把推断当成原文事实。"
      }
    },
    {
      "id": "week-8",
      "title": "第8周 · 情态动词与规则",
      "body": "<p>must表达强要求，may可能表示许可或可能性，should常表示建议。阅读规则要区分must not与do not have to：前者禁止，后者不必，意思相反而不是语气程度不同。</p><p>原创规则：Visitors must wear an ID badge. They may use the reading room. They must not enter the storage area. They do not have to book a desk in advance. 佩牌必需、库房禁止进入，而提前预约并非必需。</p><p>将四条规则分为义务、许可、禁止和非必要四格；再写一条建议用should。不要用should替换禁止条款，否则会削弱原规则的强制程度并造成误读。</p><p>本例不是现实场所的通行许可，实际使用必须查看当地最新规定。may的含义需结合完整句，The room may close early是可能提前关闭，不能一律译成允许。</p><p>检验推理：do not have to book a desk表示什么？ 可核对的判断是“不必提前预约桌位”。另外的三种说法“禁止提前预约”“必须预约”“预约后禁止进入”分别代表本题需排除的误读。</p>",
      "practice": {
        "question": "do not have to book a desk表示什么？",
        "options": [
          "禁止提前预约",
          "必须预约",
          "预约后禁止进入",
          "不必提前预约桌位"
        ],
        "correct": 3,
        "explanation": "不必提前预约桌位。先定位原文依据，再检查时态、限定词与句子指向；不能把推断当成原文事实。"
      }
    },
    {
      "id": "week-9",
      "title": "第9周 · 段落主题与支持",
      "body": "<p>主题句概括段落重点，支持句提供理由、例子或细节。主题不等于最醒目的单个词；把文章所有句子逐字翻译，也可能仍未理解作者在说明什么。</p><p>原创段落：A shared calendar can make group work clearer. It shows deadlines in one place. Team members can also see who is responsible for each task. However, the group still needs to update it regularly. 重点是共享日历帮助协作且依赖维护。</p><p>选一句最适合作标题的表达，并说明每个支持句如何服务主题。接着补一条符合主题的新句，例如Members should record changes promptly，不要突然转去介绍个人旅游。</p><p>段落并未证明日历一定提高成绩，不能将工具便利夸成学习效果保证。主题句有时在末尾或隐含于全文；本例首句明示只是用于入门，不应形成机械定位法。</p><p>检验推理：本段主旨最合适是什么？ 可核对的判断是“共享日历有助协作，但需要持续更新”。另外的三种说法“日历能保证高分”“所有任务都已结束”“团队不再需要沟通”分别代表本题需排除的误读。</p>",
      "practice": {
        "question": "本段主旨最合适是什么？",
        "options": [
          "共享日历有助协作，但需要持续更新",
          "日历能保证高分",
          "所有任务都已结束",
          "团队不再需要沟通"
        ],
        "correct": 0,
        "explanation": "共享日历有助协作，但需要持续更新。先定位原文依据，再检查时态、限定词与句子指向；不能把推断当成原文事实。"
      }
    },
    {
      "id": "week-10",
      "title": "第10周 · 听读前的关键词预测",
      "body": "<p>预测帮助形成注意目标，但需要与实际输入核对。先看主题、问题和数字单位，再听读寻找信息；没有听清的地方标记不确定，不用自己期待的答案填补。</p><p>原创播报稿：The campus shuttle leaves the north gate at nine fifteen. The journey takes twenty-five minutes. Please arrive five minutes early. 车辆9:15出发，建议9:10到；若准时行驶，9:40到达，不是9:35。</p><p>自行朗读稿件或请同学按正常速度读，记录出发、提前到场与行程三个数字。第二遍只核对不确定信息；无音频设备也可以完成读稿练习，不把它冒充听力认证。</p><p>预测不是证据，听辨也会受口音、语速和环境影响。课堂不用录制他人声音或上传个人录音；若真正要赶车，应核对官方实时班次，不能沿用本课虚构时刻。</p><p>检验推理：按稿件建议，应几点到北门？ 可核对的判断是“9:10”。另外的三种说法“9:15”“9:20”“9:40”分别代表本题需排除的误读。</p>",
      "practice": {
        "question": "按稿件建议，应几点到北门？",
        "options": [
          "9:15",
          "9:10",
          "9:20",
          "9:40"
        ],
        "correct": 1,
        "explanation": "9:10。先定位原文依据，再检查时态、限定词与句子指向；不能把推断当成原文事实。"
      }
    },
    {
      "id": "week-11",
      "title": "第11周 · 摘要与忠实转述",
      "body": "<p>摘要删去非核心细节，却保留重要限制和转折。用自己的句子重新组织意思，而不是复制长句后删几个词。摘要不加入个人评价，也不把文章未测量的结果写进去。</p><p>原创材料：Twenty students tested two note-taking formats for one week. Twelve preferred a table, while eight preferred a list. The activity measured preference, not exam results. 忠实摘要应保留20人、一周、偏好表格较多和未测成绩的边界。</p><p>写两句英文摘要，并检查是否把preferred误写成performed better。再写一句个人评论并明确标记为comment，让读者知道它不是原文结果，不索取真实同学成绩。</p><p>偏好不是效果，小样本也不能代表全体学生。课堂原创材料可用于改写练习；正式写作若转述真实资料，仍需按要求注明来源，不因换成英语就免除引用责任。</p><p>检验推理：材料实际测量的是什么？ 可核对的判断是“学生对笔记形式的偏好”。另外的三种说法“考试成绩提升”“长期记忆效果”“全校学生意见”分别代表本题需排除的误读。</p>",
      "practice": {
        "question": "材料实际测量的是什么？",
        "options": [
          "考试成绩提升",
          "长期记忆效果",
          "学生对笔记形式的偏好",
          "全校学生意见"
        ],
        "correct": 2,
        "explanation": "学生对笔记形式的偏好。先定位原文依据，再检查时态、限定词与句子指向；不能把推断当成原文事实。"
      }
    },
    {
      "id": "week-12",
      "title": "第12周 · 综合：写一页学习说明",
      "body": "<p>综合说明需要让读者凭文本完成一个任务：识别目的、找到时间与地点、知道行动与限制。写作先列信息清单，再写简短连贯段落，最后用读者测试检查是否遗漏关键步骤。</p><p>原创任务：A peer reading group meets on Wednesday at 16:00 in Room 105. New members may join without booking. Bring one short article. The meeting lasts forty minutes. 可以据此推算16:40结束，但不能假定提供文章或饮料。</p><p>以虚构社团写一份80至100词说明，包含目的、时地、参加条件与准备事项。与同学互换后让对方只凭文字回答五个问题；没有伙伴时用清单自查，不收集个人联系信息。</p><p>语法准确服务于清楚交流，而不是堆长词。结课测验只评这些语言判断，不能换算成官方英语考试分数；同一信息若表达清楚合理，可以有多种合格写法。</p><p>检验推理：根据例文，新成员参加需要什么？ 可核对的判断是“带一篇短文，无需预约”。另外的三种说法“必须预订座位”“自带饮料才可入场”“16:40才开始”分别代表本题需排除的误读。</p>",
      "practice": {
        "question": "根据例文，新成员参加需要什么？",
        "options": [
          "必须预订座位",
          "自带饮料才可入场",
          "16:40才开始",
          "带一篇短文，无需预约"
        ],
        "correct": 3,
        "explanation": "带一篇短文，无需预约。先定位原文依据，再检查时态、限定词与句子指向；不能把推断当成原文事实。"
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
