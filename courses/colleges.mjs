// School profiles and course associations; public navigation metadata only.
export const colleges = [
  {
    "id": "computer-science",
    "name": "奶蛙计算机学院",
    "englishName": "College of Computing",
    "tagline": "把一段代码，做成能解释、能恢复的小系统。",
    "introduction": "从程序的输入与状态出发，学习算法、数据组织、系统与网络，再把知识连成可验证的工具。计算机科学与技术方向强调系统原理，软件工程方向关注契约、测试与交付。跟随奶蛙的借阅和协作任务，练习从需求到可运行系统的完整过程。",
    "focus": [
      "程序与算法",
      "数据与信息系统",
      "系统和网络",
      "软件测试与交付"
    ],
    "projects": [
      {
        "title": "可恢复的本地借阅库",
        "description": "交付书目、副本和借阅关系，给出重复借出拒绝、幂等归还、事务回滚及备份回读证据；数据全部虚构，项目按课程公开标准人工评阅。",
        "courseIds": [
          "database-systems",
          "database-project"
        ]
      },
      {
        "title": "有状态的校园网页工具",
        "description": "围绕合成活动完成检索、详情、报名和取消，在手机与键盘上核对状态一致性，说明本地演示与正式认证的边界。",
        "courseIds": [
          "interaction-design",
          "web-application-project"
        ]
      }
    ],
    "learningRoutes": [
      {
        "title": "先把程序和数据结构学扎实",
        "description": "从表达式与数据契约进入结构，再用离散数学和正确性论证支持算法选择。",
        "courseIds": [
          "python-foundations",
          "discrete-mathematics",
          "data-structures",
          "algorithm-analysis"
        ]
      },
      {
        "title": "从数据到可用网页",
        "description": "先建立查询与约束，再理解界面任务，最后完成有失败分支的网页课程设计。",
        "courseIds": [
          "python-foundations",
          "design-foundations",
          "database-systems",
          "interaction-design",
          "web-application-project"
        ]
      }
    ],
    "programIds": [
      "computer-science",
      "software-engineering"
    ],
    "associatedCourseIds": [
      "python-foundations",
      "discrete-mathematics",
      "data-structures",
      "algorithm-analysis",
      "digital-logic",
      "computer-organization",
      "operating-systems",
      "database-systems",
      "computer-networks",
      "design-foundations",
      "interaction-design",
      "programming-project",
      "web-application-project",
      "database-project",
      "web",
      "queue"
    ],
    "scopeNote": "先修程序设计，再进入数据结构与系统课程；实践项目按公开量规提交与批改。"
  },
  {
    "id": "communication",
    "name": "呱声通信学院",
    "englishName": "College of Communication and Electronics",
    "tagline": "让一声呱，经过有依据的信号链。",
    "introduction": "把电路中的电压电流、数字逻辑中的状态、通信中的消息与噪声连起来看。通信工程方向关注可靠传递，电子信息方向补强器件、小信号与数字系统。以奶蛙校园提示牌和巡塘报文为线索，用计算与仿真检验信号链。",
    "focus": [
      "电路与器件",
      "信号与系统",
      "数字系统",
      "可靠通信"
    ],
    "projects": [
      {
        "title": "可解释的电路与通信实验报告",
        "description": "用安全仿真或给定数据比较电路响应与数字通信方案，列明输入、单位、误差、失效条件和复现方法，不连接市电或未知电源。",
        "courseIds": [
          "circuit-foundations",
          "digital-logic",
          "circuits-communication-project"
        ]
      },
      {
        "title": "巡塘报文的可靠传递模型",
        "description": "区分校验、确认、重传和业务幂等，用小规模纸面报文序列说明重复和丢失如何处理。",
        "courseIds": [
          "communication-networks",
          "information-theory"
        ]
      }
    ],
    "learningRoutes": [
      {
        "title": "从守恒方程到电子信号链",
        "description": "按先修顺序完成微积分、物理、电路、模拟电子和信号系统，允许同一建议学期内依次完成。",
        "courseIds": [
          "calculus-1",
          "calculus-2",
          "physics-1",
          "circuit-foundations",
          "analog-electronics",
          "signals-systems"
        ]
      },
      {
        "title": "从数字逻辑到通信不确定性",
        "description": "先学习离散数学和逻辑，再结合概率课程理解网络和信息量；信息论之前需先完成高数Ⅱ。",
        "courseIds": [
          "discrete-mathematics",
          "digital-logic",
          "communication-networks",
          "calculus-1",
          "calculus-2",
          "probability-statistics",
          "information-theory"
        ]
      }
    ],
    "programIds": [
      "communication-engineering",
      "electronic-information"
    ],
    "associatedCourseIds": [
      "calculus-1",
      "calculus-2",
      "linear-algebra",
      "discrete-mathematics",
      "physics-1",
      "physics-2",
      "physics-lab",
      "probability-statistics",
      "python-foundations",
      "circuit-foundations",
      "analog-electronics",
      "digital-logic",
      "signals-systems",
      "communication-networks",
      "information-theory",
      "circuits-communication-project",
      "scientific-computing",
      "signal"
    ],
    "scopeNote": "学习以电路分析、纸面推导与安全仿真为主，实验任务以课程公布的要求为准。"
  },
  {
    "id": "digital-media",
    "name": "蛙鸣数字媒体学院",
    "englishName": "College of Digital Media",
    "tagline": "好看要有理由，互动要有结果。",
    "introduction": "在视觉表达、图像处理、交互和三维之间建立联系，既讨论画面怎样被理解，也检查作品能否实际使用。数字媒体技术方向侧重技术基础，数字创意设计方向连接视觉语言与数字叙事。围绕奶蛙校园导览制作作品，把表达、无障碍与性能一起考虑。",
    "focus": [
      "视觉与叙事",
      "交互设计",
      "图像处理",
      "三维与实时内容"
    ],
    "projects": [
      {
        "title": "可读、可操作的校园导览作品",
        "description": "交付有明确受众任务的视觉与交互作品，提供素材许可、手机布局、字幕或替代文本，以及失败路径的验证记录。",
        "courseIds": [
          "visual-language",
          "interaction-design",
          "digital-media-project"
        ]
      },
      {
        "title": "有尺度的三维教学场景",
        "description": "以自创建筑小场景解释单位、网格、材质、碰撞和资源预算，区分效果示意与真实建筑测绘。",
        "courseIds": [
          "three-dimensional-modeling"
        ]
      }
    ],
    "learningRoutes": [
      {
        "title": "从形式到叙事",
        "description": "先学形态、色彩与构图，再用主题、分镜和声画安排组织可理解的短叙事。",
        "courseIds": [
          "design-foundations",
          "visual-language",
          "digital-storytelling"
        ]
      },
      {
        "title": "从技术基础到交互作品",
        "description": "图像处理需要Python与线代；交互和综合创作先完成设计基础与视觉语言，再汇合技术与表达。",
        "courseIds": [
          "python-foundations",
          "linear-algebra",
          "design-foundations",
          "digital-image-processing",
          "visual-language",
          "interaction-design",
          "digital-media-project"
        ]
      }
    ],
    "programIds": [
      "digital-media",
      "digital-creative-design"
    ],
    "associatedCourseIds": [
      "design-foundations",
      "visual-language",
      "digital-image-processing",
      "interaction-design",
      "three-dimensional-modeling",
      "digital-storytelling",
      "digital-media-project",
      "python-foundations",
      "linear-algebra",
      "database-systems",
      "web-application-project",
      "art-appreciation"
    ],
    "scopeNote": "从设计基础与视觉语言出发，再进入图像、交互与综合创作；三维课程和校园漫游分别进入。"
  },
  {
    "id": "life-science",
    "name": "荷塘生活学院",
    "englishName": "College of Life and Society",
    "tagline": "关心生活，也把证据和边界讲清。",
    "introduction": "从生命过程、生态关系与食品信息，走向社会调查和组织协作。生命科学与社会生活方向提供广泛起点，应用生命科学方向增加统计与证据报告训练。奶蛙同学可以从纸面观察与合成记录中学习提问、比较和解释日常现象。",
    "focus": [
      "生命与生态",
      "食品安全与营养识读",
      "动物科学入门",
      "调查与组织"
    ],
    "projects": [
      {
        "title": "虚构校园生活调查报告",
        "description": "明确研究对象、抽样、变量和统计口径，区分人数与次数，提交可复核的数据表、分析和限制。",
        "courseIds": [
          "social-research",
          "probability-statistics",
          "social-data-project"
        ]
      },
      {
        "title": "非侵入观察与交接练习",
        "description": "从纸面动物或环境资料中分离观察事实、待核实解释和专业报告事项，不提出治疗或现场干预方案。",
        "courseIds": [
          "life-science",
          "animal-science",
          "ecology-foundations"
        ]
      }
    ],
    "learningRoutes": [
      {
        "title": "从生命到环境与日常识读",
        "description": "以细胞和生命过程为基础，分别理解生态收支、食品流程与物种差异，避免将科普等同诊疗。",
        "courseIds": [
          "life-science",
          "ecology-foundations",
          "food-nutrition",
          "animal-science"
        ]
      },
      {
        "title": "从提问到证据报告",
        "description": "先补写作与微积分，再完成概率和调查方法，最后提交社会调查与数据报告。",
        "courseIds": [
          "academic-writing",
          "calculus-1",
          "calculus-2",
          "probability-statistics",
          "social-research",
          "social-data-project"
        ]
      }
    ],
    "programIds": [
      "life-and-society",
      "applied-life-sciences"
    ],
    "associatedCourseIds": [
      "life-science",
      "ecology-foundations",
      "food-nutrition",
      "social-research",
      "organization-communication",
      "animal-science",
      "social-data-project",
      "calculus-1",
      "calculus-2",
      "probability-statistics",
      "academic-writing",
      "environmental-science",
      "public-administration",
      "morning",
      "sow-care",
      "temptation"
    ],
    "scopeNote": "生命、食品与动物课程以知识识读和纸面分析为主；特色短课按原学分规则认定。"
  },
  {
    "id": "science",
    "name": "知行理学院",
    "englishName": "College of Mathematical and Computational Sciences",
    "tagline": "先写假设，再让计算接受检验。",
    "introduction": "以数学结构、物理模型和可复现计算为共同语言，从微积分与线性代数进入数学建模和科学计算。奶蛙同学可以围绕排队、资源与测量建立小模型，用手算和程序结果相互核验，解释数值误差与现实不确定性。",
    "focus": [
      "数学建模",
      "数值与科学计算",
      "数学结构",
      "物理与证据"
    ],
    "projects": [
      {
        "title": "有敏感性分析的小模型",
        "description": "对一个合成校园资源问题给出变量、约束、目标、参数来源和至少两种条件比较，说明预测为何不能直接当现实保证。",
        "courseIds": [
          "mathematical-modeling"
        ]
      },
      {
        "title": "可复现的数值计算记录",
        "description": "把手算基准与程序结果对照，记录单位、步长、误差和停止条件，不以更多小数位代替精度证据。",
        "courseIds": [
          "scientific-computing",
          "physics-lab"
        ]
      }
    ],
    "learningRoutes": [
      {
        "title": "模型从数学基础长出来",
        "description": "先完成高数Ⅰ和线代，再进入建模；随后继续高数Ⅱ和概率统计补充不确定性分析。",
        "courseIds": [
          "calculus-1",
          "linear-algebra",
          "mathematical-modeling",
          "calculus-2",
          "probability-statistics"
        ]
      },
      {
        "title": "把计算写成别人能复现的过程",
        "description": "程序设计与线性代数支持科学计算，大学物理及实验再提供数据与模型核验场景。",
        "courseIds": [
          "python-foundations",
          "linear-algebra",
          "scientific-computing",
          "calculus-1",
          "physics-1",
          "physics-lab"
        ]
      }
    ],
    "programIds": [
      "mathematics-and-computation"
    ],
    "associatedCourseIds": [
      "mathematical-modeling",
      "scientific-computing",
      "calculus-1",
      "calculus-2",
      "linear-algebra",
      "probability-statistics",
      "discrete-mathematics",
      "python-foundations",
      "physics-1",
      "physics-2",
      "physics-lab",
      "data-structures",
      "algorithm-analysis",
      "digital-image-processing"
    ],
    "scopeNote": "数学与计算方向提供首年基础路径；建模与科学计算须先完成对应的数学和程序设计课程。"
  },
  {
    "id": "humanities-languages",
    "name": "听荷人文与外国语学院",
    "englishName": "College of Humanities and Languages",
    "tagline": "细读一句话，也理解它所在的语境。",
    "introduction": "把文学阅读、语言学习、跨文化交流与证据表达连接起来。通过中国文学导读练习细读与解释，通过语言交流课程理解语境、澄清误会。奶蛙读书会和虚构协作小组提供练习场景，让每一处引用和每一个判断都有依据。",
    "focus": [
      "文本与文学细读",
      "语言与跨文化交流",
      "学术写作",
      "叙事与公共表达"
    ],
    "projects": [
      {
        "title": "文本细读与语境说明",
        "description": "选择课程给定或合法公开文本，以具体词句支持解释，区分作者、叙述者和读者推断，列出来源与其他可能读法。",
        "courseIds": [
          "chinese-literature",
          "academic-writing"
        ]
      },
      {
        "title": "跨文化沟通情境分析",
        "description": "分析虚构对话中的语境、称呼、预期与修复，提出两种有理由的表达方案，不把国别标签当行为定律。",
        "courseIds": [
          "intercultural-communication"
        ]
      }
    ],
    "learningRoutes": [
      {
        "title": "从阅读到语言交流",
        "description": "将写作与文本阅读、公共英语和跨文化分析衔接；方向提供基础训练，不以课名宣称达到任何语言证书等级。",
        "courseIds": [
          "academic-writing",
          "chinese-literature",
          "college-english-1",
          "college-english-2",
          "intercultural-communication"
        ]
      },
      {
        "title": "把研究表达成可理解叙事",
        "description": "调查问题需要写作和方法，数字叙事需要设计基础与视觉语言，两条证据与表达线可在小作品中汇合。",
        "courseIds": [
          "academic-writing",
          "social-research",
          "design-foundations",
          "visual-language",
          "digital-storytelling"
        ]
      }
    ],
    "programIds": [
      "language-and-humanities"
    ],
    "associatedCourseIds": [
      "chinese-literature",
      "intercultural-communication",
      "academic-writing",
      "college-english-1",
      "college-english-2",
      "organization-communication",
      "social-research",
      "design-foundations",
      "visual-language",
      "digital-storytelling",
      "interaction-design",
      "digital-media-project",
      "art-appreciation"
    ],
    "scopeNote": "文学课程可直接开始；跨文化交流先修大学英语Ⅰ，项目以文字情境分析与沟通方案为主。"
  },
  {
    "id": "economics-management",
    "name": "荷叶经济与管理学院",
    "englishName": "College of Economics and Management",
    "tagline": "每次选择有代价，每张账表有口径。",
    "introduction": "从资源稀缺与选择入手，分别学习微观经济模型、会计记录与组织协作，再用统计和调查检验解释。围绕奶蛙读书会的合成预算、需求表和活动账本，理解机会成本、账表勾稽与有证据的管理决策。",
    "focus": [
      "微观经济模型",
      "会计与记录",
      "组织决策",
      "数据与调查"
    ],
    "projects": [
      {
        "title": "虚构活动的账表核对",
        "description": "以合成交易说明账户、借贷与报表勾稽，保留假设和更正记录；不处理正式经费、真实账单或投资交易。",
        "courseIds": [
          "accounting-foundations"
        ]
      },
      {
        "title": "资源选择与调查证据",
        "description": "用明确约束比较至少两种分配方案，说明机会成本与适用条件，再通过调查方法解释哪些结论尚待验证。",
        "courseIds": [
          "microeconomics",
          "social-research",
          "social-data-project"
        ]
      }
    ],
    "learningRoutes": [
      {
        "title": "把选择与记录分开学清楚",
        "description": "经济模型解释取舍，会计说明记录与报告，组织课程关注决策如何交接，三者互补但不能相互代替。",
        "courseIds": [
          "microeconomics",
          "accounting-foundations",
          "organization-communication"
        ]
      },
      {
        "title": "用数量基础支持调查",
        "description": "由写作、微积分到概率与调查，再完成一份口径一致的数据报告；数字精确不自动证明因果。",
        "courseIds": [
          "academic-writing",
          "calculus-1",
          "calculus-2",
          "probability-statistics",
          "social-research",
          "social-data-project"
        ]
      }
    ],
    "programIds": [
      "economics-and-management"
    ],
    "associatedCourseIds": [
      "microeconomics",
      "accounting-foundations",
      "organization-communication",
      "academic-writing",
      "calculus-1",
      "calculus-2",
      "probability-statistics",
      "social-research",
      "public-administration",
      "social-data-project",
      "python-foundations",
      "linear-algebra",
      "scientific-computing",
      "mathematical-modeling",
      "queue"
    ],
    "scopeNote": "微观经济学与会计学可作为起点，再沿数量基础、调查方法和数据报告继续学习。"
  },
  {
    "id": "environment-public-affairs",
    "name": "清波环境与公共事务学院",
    "englishName": "College of Environment and Public Affairs",
    "tagline": "看见一池水，也看见共同办事的规则。",
    "introduction": "把生命生态证据、环境问题与公共服务放在一起研究。通过环境科学学习收支、指标与不确定性，通过公共管理分析职责、流程和评价。奶蛙同学可以从合成水量记录与服务案例中建立证据链，比较有依据的改进方案。",
    "focus": [
      "环境过程与证据",
      "公共管理基础",
      "社会调查",
      "服务与协作治理"
    ],
    "projects": [
      {
        "title": "环境问题的证据链",
        "description": "对虚构环境资料明确空间时间边界、指标、收支和缺失信息，提出需要补充的证据，不自行取样、投放或开展生态干预。",
        "courseIds": [
          "life-science",
          "ecology-foundations",
          "environmental-science"
        ]
      },
      {
        "title": "可解释的公共服务改进报告",
        "description": "选一个合成服务任务，梳理对象、责任、流程与评价指标，区分效率、公平、合法性和满意度，不冒充正式校务政策。",
        "courseIds": [
          "public-administration",
          "organization-communication",
          "social-research"
        ]
      }
    ],
    "learningRoutes": [
      {
        "title": "从生命生态到环境问题",
        "description": "先理解生命过程与生态尺度，再进入环境科学，保持单位、采样代表性与不确定性说明。",
        "courseIds": [
          "life-science",
          "ecology-foundations",
          "environmental-science"
        ]
      },
      {
        "title": "从服务问题到调查与治理",
        "description": "公共管理与组织课程提供职责框架，学术写作和社会调查支持收集与表达证据。",
        "courseIds": [
          "academic-writing",
          "organization-communication",
          "public-administration",
          "social-research"
        ]
      }
    ],
    "programIds": [
      "environment-and-public-affairs"
    ],
    "associatedCourseIds": [
      "environmental-science",
      "public-administration",
      "life-science",
      "ecology-foundations",
      "organization-communication",
      "academic-writing",
      "calculus-1",
      "calculus-2",
      "probability-statistics",
      "social-research",
      "social-data-project",
      "food-nutrition",
      "animal-science",
      "microeconomics",
      "chinese-literature"
    ],
    "scopeNote": "环境科学先修生命科学；公共管理可直接开始。环境项目使用课程提供的合成资料。"
  }
];
export const findCollege = id => colleges.find(college => college.id === id);
