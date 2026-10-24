export const course = {
  "id": "database-project",
  "title": "数据库课程设计",
  "college": "奶蛙计算机学院",
  "category": "practice",
  "credits": 2,
  "code": "CSPR203",
  "prerequisiteIds": [
    "database-systems"
  ],
  "recommendedSemester": 3,
  "version": "1.0",
  "durationWeeks": 12,
  "contactHours": 32,
  "selfStudyHours": 48,
  "creditSystem": "semester",
  "hours": "12周 · 32课内学时 + 48自主学时",
  "audience": "已学数据库原理、准备完成可验证小型数据库设计的学生",
  "prerequisites": "数据库系统原理；能执行基本SELECT与理解主外键",
  "description": "用完全虚构的图书副本借阅库完成需求、关系设计、约束、查询、索引、事务、备份与交付。",
  "objectives": [
    "将借阅规则转成关系键与数据库约束",
    "执行并解释查询、索引计划和事务失败结果",
    "提交可复现设计、测试与恢复证据供人工评阅"
  ],
  "assessment": "完成12章随堂练习后参加12题客观测验；测验40%，200至4000字项目文本由教师按公开100分rubric人工评分占60%，综合60分通过。项目待评阅不生成最终成绩、不发学分；可重考保留历史，同一课程学分不重复发放。本站不执行学生提交的SQL或代码。",
  "experiment": null,
  "sources": [
    {
      "title": "SQLite：CREATE TABLE",
      "url": "https://www.sqlite.org/lang_createtable.html"
    },
    {
      "title": "SQLite：外键",
      "url": "https://www.sqlite.org/foreignkeys.html"
    },
    {
      "title": "SQLite：事务",
      "url": "https://www.sqlite.org/lang_transaction.html"
    },
    {
      "title": "SQLite：查询计划",
      "url": "https://www.sqlite.org/eqp.html"
    },
    {
      "title": "SQLite：VACUUM与备份副本",
      "url": "https://www.sqlite.org/lang_vacuum.html"
    },
    {
      "title": "SQLite：条件索引",
      "url": "https://www.sqlite.org/partialindex.html"
    },
    {
      "title": "Python：sqlite3参数绑定",
      "url": "https://docs.python.org/3/library/sqlite3.html"
    }
  ],
  "chapters": [
    {
      "id": "week-01",
      "title": "第1周 · 需求与验收口径",
      "body": "<h3>原理与判据</h3><p>本课程设计一个完全本地、数据全部虚构的借阅数据库，研究书目、副本、读者与借阅记录。一本书目可以有多个实体副本，一个副本同一时刻最多有一条未归还借阅；归还后历史仍保留，读者改名不应改变历史归属。核心任务包括查询可借副本、借出、归还、统计、备份和恢复，不涉及真实学籍、收费或线上服务。先写规则与预期结果，后写SQL，才能避免以程序当前输出作为唯一正确标准。项目需提交200至4000字设计说明，由教师人工评阅，不运行上传代码。</p><h3>推演与核对</h3><p>先用独立SQL核对统计定义：WITH loan(id,returned_at) AS (VALUES(1,NULL),(2,'2026-03-02')) SELECT COUNT(*) AS total,SUM(returned_at IS NULL) AS active FROM loan; 结果为total=2、active=1。总借阅次数按历史记录计，当前在借按未归还记录计，二者不能都标为借书人数。若两条记录属于同一个读者，借阅人数还要按member_id去重，而不是照抄2。</p><h3>适用边界</h3><p>验收样例至少包括空库、重复借同一副本、归还两次、无此读者、引用中书目删除失败及备份回读。不把课堂库连到任何正式系统；单文件本地练习也应明确谁可读写，数据库存在不代表已经具有应用认证。</p><h3>方法连接</h3><p></p><aside class=\"naiwaCase\" aria-label=\"奶蛙校园案例\"><h3>奶蛙校园案例</h3><p>奶蛙在课程借阅库里做一次虚构报表核对。教学假设：同一读者N1有三条借阅，副本C1已归还、C2与C3未归还。历史借阅次数为3，当前在借副本数2，当前借阅读者数却为1。把三个数都叫“借书人数”，再精确的SQL也无法弥补指标含义错误。借阅对象和姓名都是合成数据，荷塘读书会只是业务背景；报告应先定义集合与去重键，再展示查询输出，不能拿示例数字冒充正式统计。</p></aside>",
      "practice": {
        "question": "两条借阅一条未归还，历史次数与当前在借数？",
        "options": [
          "2与1",
          "1与2",
          "2与2",
          "1与1"
        ],
        "correct": 0,
        "explanation": "先用独立SQL核对统计定义：WITH loan(id,returned_at) AS (VALUES(1,NULL),(2,'2026-03-02')) SELECT COUNT(*) AS total,SUM(returned_at IS NULL) AS active FROM loan; 结果为total=2、active=1。总借阅次数按历史记录计，当前在借按未归还记录计，二者不能都标为借书人数。若两条记录属于同一个读者，借阅人数还要按member_id去重，而不是照抄2。 验收样例至少包括空库、重复借同一副本、归还两次、无此读者、引用中书目删除失败及备份回读。不把课堂库连到任何正式系统；单文件本地练习也应明确谁可读写，数据库存在不代表已经具有应用认证。"
      }
    },
    {
      "id": "week-02",
      "title": "第2周 · 实体关系与多重性",
      "body": "<h3>原理与判据</h3><p>先区分书目与实体副本：同名不同版本可能是不同书目，同一书目的两个实体条码是两个副本。读者与副本之间跨时间构成多次借阅关系，借阅本身有日期和状态，应作为独立实体，而非把当前读者姓名直接填进书目表。ER图中book到copy为一对多，member到loan为一对多，copy到loan也是一对多历史关系，但同一时刻的未归还关系另有约束。</p><h3>推演与核对</h3><p>可执行小例：WITH book(id,title) AS (VALUES(1,'关系设计'),(2,'数据实践')),copy(id,book_id) AS (VALUES(11,1),(12,1),(21,2)) SELECT b.id,COUNT(c.id) AS copies FROM book b LEFT JOIN copy c ON c.book_id=b.id GROUP BY b.id ORDER BY b.id; 结果为(1,2)、(2,1)。用副本计数而非COUNT(*)可在未来加入无副本书目时正确显示0。</p><h3>适用边界</h3><p>ER图还应注明必选与可选：副本必须属于存在书目，但书目可以暂时没有副本。不要为了让每条关系看起来对称就伪造副本。图与DDL需双向核对，画出外键但未实际启用外键检查，不能算规则已经落地；本课不依赖绘图软件即可提交文字关系说明。</p><h3>方法连接</h3><p></p>",
      "practice": {
        "question": "同一书目两个条码应表示为？",
        "options": [
          "两个读者",
          "两个副本关联一个书目",
          "一个副本含两个主键",
          "只保留一本导致数量丢失"
        ],
        "correct": 1,
        "explanation": "可执行小例：WITH book(id,title) AS (VALUES(1,'关系设计'),(2,'数据实践')),copy(id,book_id) AS (VALUES(11,1),(12,1),(21,2)) SELECT b.id,COUNT(c.id) AS copies FROM book b LEFT JOIN copy c ON c.book_id=b.id GROUP BY b.id ORDER BY b.id; 结果为(1,2)、(2,1)。用副本计数而非COUNT(*)可在未来加入无副本书目时正确显示0。 ER图还应注明必选与可选：副本必须属于存在书目，但书目可以暂时没有副本。不要为了让每条关系看起来对称就伪造副本。图与DDL需双向核对，画出外键但未实际启用外键检查，不能算规则已经落地；本课不依赖绘图软件即可提交文字关系说明。"
      }
    },
    {
      "id": "week-03",
      "title": "第3周 · 候选键与业务唯一性",
      "body": "<h3>原理与判据</h3><p>主键标识一行，候选键是能唯一标识且不含多余属性的选择。稳定整数ID可作为代理主键，书目标题和读者昵称不应自然视为唯一；同名和改名都可能发生。外键关联稳定ID而非显示名称。借阅行ID唯一并不能阻止同一副本同时借出两次，还需要表达业务唯一性。针对未归还记录，可用带条件的唯一索引限制copy_id，而不妨碍已经归还的历史重复出现。</p><h3>推演与核对</h3><p>独立案例：CREATE TABLE active_demo(id INTEGER PRIMARY KEY,copy_id INTEGER NOT NULL,returned_at TEXT); CREATE UNIQUE INDEX one_active_demo ON active_demo(copy_id) WHERE returned_at IS NULL; INSERT INTO active_demo VALUES(1,11,NULL); 再插入(2,11,NULL)应报唯一约束错误，原行仍在；插入(3,11,'2026-03-02')则允许。可在新内存连接执行，避免污染后续主库。</p><h3>适用边界</h3><p>条件唯一索引的谓词是SQL约定，空字符串不是NULL，不应把未知归还时间写成空字符串来绕开规则。日期格式应由应用校验，所有访问路径使用同一空值语义。把错误作为验收结果，不为了通过演示而删除索引或覆盖旧记录。</p><h3>方法连接</h3><p></p>",
      "practice": {
        "question": "已有copy11未归还，第二条未归还插入应？",
        "options": [
          "自动覆盖旧借阅",
          "允许两条在借",
          "拒绝且保留原记录",
          "删除副本"
        ],
        "correct": 2,
        "explanation": "独立案例：CREATE TABLE active_demo(id INTEGER PRIMARY KEY,copy_id INTEGER NOT NULL,returned_at TEXT); CREATE UNIQUE INDEX one_active_demo ON active_demo(copy_id) WHERE returned_at IS NULL; INSERT INTO active_demo VALUES(1,11,NULL); 再插入(2,11,NULL)应报唯一约束错误，原行仍在；插入(3,11,'2026-03-02')则允许。可在新内存连接执行，避免污染后续主库。 条件唯一索引的谓词是SQL约定，空字符串不是NULL，不应把未知归还时间写成空字符串来绕开规则。日期格式应由应用校验，所有访问路径使用同一空值语义。把错误作为验收结果，不为了通过演示而删除索引或覆盖旧记录。"
      }
    },
    {
      "id": "week-04",
      "title": "第4周 · 函数依赖与规范化",
      "body": "<h3>原理与判据</h3><p>规范化用于减少更新、插入与删除异常，不是表越多越好。若平面表重复保存loan_id、member_id、member_name、copy_id、book_id、title，就隐含member_id决定姓名、copy_id决定book_id、book_id决定标题等依赖。姓名出现在多条借阅中时，改名必须重复修改，漏改即产生互相矛盾的同一读者。拆为member、book、copy、loan后，各项事实在适当实体保存，查询再连接获得展示。</p><h3>推演与核对</h3><p>可执行反例：WITH flat(loan_id,member_id,member_name) AS (VALUES(1,7,'样本甲'),(2,7,'旧样本甲')) SELECT member_id,COUNT(DISTINCT member_name) AS names FROM flat GROUP BY member_id HAVING COUNT(DISTINCT member_name)>1; 返回(7,2)，暴露同一ID存在两个名字。这个查询指出冲突，却不能决定哪一个才是正确新名；需要核对变更记录，而非任取最大字符串覆盖。</p><h3>适用边界</h3><p>函数依赖来自业务规则，不是看到当前三行碰巧唯一就证明永远唯一。设计报告说明每张表的键、依赖与拆分理由，同时保留可重建原来查询的连接方式。分析报表有时可以合理冗余，但须写清权威来源、刷新时机和一致性策略，不能以性能为借口不定义语义。</p><h3>方法连接</h3><p></p>",
      "practice": {
        "question": "同一member_id在多行保存姓名的主要风险？",
        "options": [
          "外键自动消失",
          "SQL不能连接",
          "主键必须改为姓名",
          "改名造成更新不一致"
        ],
        "correct": 3,
        "explanation": "可执行反例：WITH flat(loan_id,member_id,member_name) AS (VALUES(1,7,'样本甲'),(2,7,'旧样本甲')) SELECT member_id,COUNT(DISTINCT member_name) AS names FROM flat GROUP BY member_id HAVING COUNT(DISTINCT member_name)>1; 返回(7,2)，暴露同一ID存在两个名字。这个查询指出冲突，却不能决定哪一个才是正确新名；需要核对变更记录，而非任取最大字符串覆盖。 函数依赖来自业务规则，不是看到当前三行碰巧唯一就证明永远唯一。设计报告说明每张表的键、依赖与拆分理由，同时保留可重建原来查询的连接方式。分析报表有时可以合理冗余，但须写清权威来源、刷新时机和一致性策略，不能以性能为借口不定义语义。"
      }
    },
    {
      "id": "week-05",
      "title": "第5周 · DDL与最小样本库",
      "body": "<h3>原理与判据</h3><p>新建一个本地练习连接，先在事务外执行PRAGMA foreign_keys=ON并查询返回1。建立member(id INTEGER PRIMARY KEY,name TEXT NOT NULL)、book(id INTEGER PRIMARY KEY,title TEXT NOT NULL)、copy(id INTEGER PRIMARY KEY,book_id INTEGER NOT NULL REFERENCES book(id))，再建立loan(id INTEGER PRIMARY KEY,member_id INTEGER NOT NULL REFERENCES member(id),copy_id INTEGER NOT NULL REFERENCES copy(id),borrowed_at TEXT NOT NULL,returned_at TEXT)。借阅状态用returned_at是否NULL派生，不另设一个可能互相矛盾的布尔列。</p><h3>推演与核对</h3><p>SQL初始化如下，按本章顺序执行：CREATE TABLE member(id INTEGER PRIMARY KEY,name TEXT NOT NULL); CREATE TABLE book(id INTEGER PRIMARY KEY,title TEXT NOT NULL); CREATE TABLE copy(id INTEGER PRIMARY KEY,book_id INTEGER NOT NULL REFERENCES book(id)); CREATE TABLE loan(id INTEGER PRIMARY KEY,member_id INTEGER NOT NULL REFERENCES member(id),copy_id INTEGER NOT NULL REFERENCES copy(id),borrowed_at TEXT NOT NULL,returned_at TEXT); CREATE UNIQUE INDEX loan_active_copy ON loan(copy_id) WHERE returned_at IS NULL; INSERT INTO member VALUES(1,'样本甲'),(2,'样本乙'); INSERT INTO book VALUES(1,'关系设计'),(2,'数据实践'); INSERT INTO copy VALUES(11,1),(12,1),(21,2); INSERT INTO loan VALUES(101,1,11,'2026-03-01',NULL),(102,2,21,'2026-02-20','2026-02-25'); SELECT COUNT(*) FROM copy; 返回3。</p><h3>适用边界</h3><p>所有名称均为虚构示例。外键开启属于连接配置，新连接也要验证；不在事务中途才试图切换。NOT NULL不禁止空字符串，应用仍需校验名称和日期。默认ON DELETE行为不应被误写成自动级联，本例保留有引用的书目和副本，删除失败应给可理解提示。</p><h3>方法连接</h3><p></p>",
      "practice": {
        "question": "本章初始化后副本总数？",
        "options": [
          "3",
          "2",
          "1",
          "5"
        ],
        "correct": 0,
        "explanation": "SQL初始化如下，按本章顺序执行：CREATE TABLE member(id INTEGER PRIMARY KEY,name TEXT NOT NULL); CREATE TABLE book(id INTEGER PRIMARY KEY,title TEXT NOT NULL); CREATE TABLE copy(id INTEGER PRIMARY KEY,book_id INTEGER NOT NULL REFERENCES book(id)); CREATE TABLE loan(id INTEGER PRIMARY KEY,member_id INTEGER NOT NULL REFERENCES member(id),copy_id INTEGER NOT NULL REFERENCES copy(id),borrowed_at TEXT NOT NULL,returned_at TEXT); CREATE UNIQUE INDEX loan_active_copy ON loan(copy_id) WHERE returned_at IS NULL; INSERT INTO member VALUES(1,'样本甲'),(2,'样本乙'); INSERT INTO book VALUES(1,'关系设计'),(2,'数据实践'); INSERT INTO copy VALUES(11,1),(12,1),(21,2); INSERT INTO loan VALUES(101,1,11,'2026-03-01',NULL),(102,2,21,'2026-02-20','2026-02-25'); SELECT COUNT(*) FROM copy; 返回3。 所有名称均为虚构示例。外键开启属于连接配置，新连接也要验证；不在事务中途才试图切换。NOT NULL不禁止空字符串，应用仍需校验名称和日期。默认ON DELETE行为不应被误写成自动级联，本例保留有引用的书目和副本，删除失败应给可理解提示。"
      }
    },
    {
      "id": "week-06",
      "title": "第6周 · 增删改与幂等归还",
      "body": "<h3>原理与判据</h3><p>操作应围绕业务不变量而非提供任意表格编辑。借出需核对读者、副本存在并满足唯一在借规则；归还只更新当前未归还记录，重复提交归还不应修改已经记录的第一次归还时间。读者改名更新member表，不改稳定ID，也不批量改历史外键。删除记录与撤销业务要区分，历史借阅不应随意物理删除来让统计好看。</p><h3>推演与核对</h3><p>在第五章初始化后执行UPDATE loan SET returned_at='2026-03-04' WHERE id=101 AND returned_at IS NULL; SELECT changes(); 第一次返回1，再执行同样更新返回0。随后SELECT returned_at FROM loan WHERE id=101仍为2026-03-04。若第二次请求写不同日期，WHERE条件仍阻止覆盖首次归还。把归还结果显示为已归还而非创建第二条借阅，状态效果就是幂等。</p><h3>适用边界</h3><p>changes只描述当前连接最近修改语句，需在下一条写入前读取；不同业务中0行也可能表示ID不存在，应通过受权查询区分，而不能一律说归还成功。删除引用行可能触发外键失败，错误处理应回滚当前操作并保留记录，禁止以关闭外键掩盖问题。</p><h3>方法连接</h3><p></p><aside class=\"naiwaCase\" aria-label=\"巡塘小练习\"><h3>巡塘小练习</h3><p>教学假设：奶蛙借阅记录id=201，returned_at初始NULL。首次归还请求写2026-04-03，第二次重复请求想写2026-04-04；两次均附条件returned_at IS NULL。各影响几行，最终日期为何？</p><details><summary>展开思路</summary><p>首次命中未归还记录，影响1行并保存2026-04-03；第二次条件不再成立，影响0行，日期保持不变。这是设置归还状态的幂等效果。0行还可能来自ID不存在，应经受权查询区分，不能一概宣称已归还。</p></details></aside>",
      "practice": {
        "question": "重复同样归还更新，第二次changes通常？",
        "options": [
          "1且新建借阅",
          "0且首次归还日期保留",
          "2且清空日期",
          "数据库自动删除副本"
        ],
        "correct": 1,
        "explanation": "在第五章初始化后执行UPDATE loan SET returned_at='2026-03-04' WHERE id=101 AND returned_at IS NULL; SELECT changes(); 第一次返回1，再执行同样更新返回0。随后SELECT returned_at FROM loan WHERE id=101仍为2026-03-04。若第二次请求写不同日期，WHERE条件仍阻止覆盖首次归还。把归还结果显示为已归还而非创建第二条借阅，状态效果就是幂等。 changes只描述当前连接最近修改语句，需在下一条写入前读取；不同业务中0行也可能表示ID不存在，应通过受权查询区分，而不能一律说归还成功。删除引用行可能触发外键失败，错误处理应回滚当前操作并保留记录，禁止以关闭外键掩盖问题。"
      }
    },
    {
      "id": "week-07",
      "title": "第7周 · 连接、空值与统计",
      "body": "<h3>原理与判据</h3><p>报表口径须先定义对象：书目数、副本数、历史借阅数、当前在借数和借阅读者数不同。LEFT JOIN可保留没有借阅的副本，COUNT(l.id)只统计匹配借阅，COUNT(*)会把左表保留的空匹配也算一行。过滤未归还条件应放在合适连接条件中，避免WHERE把无借阅副本从报表删掉。聚合字段和分组键应有明确关系，不依赖SQLite宽松选择非分组列的偶然结果。</p><h3>推演与核对</h3><p>重新使用第五章初始数据执行SELECT c.id,COUNT(l.id) AS active FROM copy c LEFT JOIN loan l ON l.copy_id=c.id AND l.returned_at IS NULL GROUP BY c.id ORDER BY c.id; 结果为(11,1)、(12,0)、(21,0)。若要可借副本，可用NOT EXISTS(SELECT 1 FROM loan l WHERE l.copy_id=c.id AND l.returned_at IS NULL)，初始可借12与21。不要在已执行第六章归还的连接中还预期11在借，应为每个测试重置样本或说明前置状态。</p><h3>适用边界</h3><p>SQL中NULL比较用IS NULL，不用= NULL；后者不为真，会使条件结果出错。日期范围统计采用固定格式且边界写清，可用左闭右开避免重叠。报表应记录数据时点，不把当前可借数量承诺为稍后一定可借，最终借出仍由事务和约束判定。</p><h3>方法连接</h3><p></p>",
      "practice": {
        "question": "保留无借阅副本计0应优先用？",
        "options": [
          "INNER JOIN只看有借阅",
          "COUNT(*)必为0",
          "LEFT JOIN并COUNT匹配借阅ID",
          "WHERE id=NULL"
        ],
        "correct": 2,
        "explanation": "重新使用第五章初始数据执行SELECT c.id,COUNT(l.id) AS active FROM copy c LEFT JOIN loan l ON l.copy_id=c.id AND l.returned_at IS NULL GROUP BY c.id ORDER BY c.id; 结果为(11,1)、(12,0)、(21,0)。若要可借副本，可用NOT EXISTS(SELECT 1 FROM loan l WHERE l.copy_id=c.id AND l.returned_at IS NULL)，初始可借12与21。不要在已执行第六章归还的连接中还预期11在借，应为每个测试重置样本或说明前置状态。 SQL中NULL比较用IS NULL，不用= NULL；后者不为真，会使条件结果出错。日期范围统计采用固定格式且边界写清，可用左闭右开避免重叠。报表应记录数据时点，不把当前可借数量承诺为稍后一定可借，最终借出仍由事务和约束判定。"
      }
    },
    {
      "id": "week-08",
      "title": "第8周 · 索引与查询计划",
      "body": "<h3>原理与判据</h3><p>索引是数据结构，能帮助查找、排序与连接，但会增加写入和存储成本。先从实际查询条件出发选择列顺序，不能为每列随意创建多份索引。条件唯一索引loan_active_copy已经为只查未归还副本提供候选路径；历史按读者与日期查询则是另一访问模式。应使用EXPLAIN QUERY PLAN理解计划，区分扫描与带条件搜索，并在相同数据与版本下比较。</p><h3>推演与核对</h3><p>在第五章库执行CREATE INDEX loan_member_date ON loan(member_id,borrowed_at); EXPLAIN QUERY PLAN SELECT id FROM loan WHERE member_id=1 AND borrowed_at>='2026-01-01' ORDER BY borrowed_at; 当前常见计划显示通过loan_member_date搜索，左端member_id等值后可利用日期范围与顺序。再执行真实SELECT，应返回101；加索引前后结果必须相同，索引不是改变业务答案的手段。</p><h3>适用边界</h3><p>查询计划文本随SQLite版本变化，测试不应死板匹配整行字符串。小样本耗时受缓存与计时精度影响，不能据两行数据的几微秒承诺百万行性能。可用独立合成批量数据验证，但记录规模和环境，避免长时间压测或把练习库索引直接推到生产。</p><h3>方法连接</h3><p></p>",
      "practice": {
        "question": "上述历史查询最贴合的索引列顺序？",
        "options": [
          "仅returned_at",
          "先随机标题",
          "完全不看条件",
          "member_id,borrowed_at"
        ],
        "correct": 3,
        "explanation": "在第五章库执行CREATE INDEX loan_member_date ON loan(member_id,borrowed_at); EXPLAIN QUERY PLAN SELECT id FROM loan WHERE member_id=1 AND borrowed_at>='2026-01-01' ORDER BY borrowed_at; 当前常见计划显示通过loan_member_date搜索，左端member_id等值后可利用日期范围与顺序。再执行真实SELECT，应返回101；加索引前后结果必须相同，索引不是改变业务答案的手段。 查询计划文本随SQLite版本变化，测试不应死板匹配整行字符串。小样本耗时受缓存与计时精度影响，不能据两行数据的几微秒承诺百万行性能。可用独立合成批量数据验证，但记录规模和环境，避免长时间压测或把练习库索引直接推到生产。"
      }
    },
    {
      "id": "week-09",
      "title": "第9周 · 事务、冲突与失败恢复",
      "body": "<h3>原理与判据</h3><p>一次业务若有多步修改，应明确事务边界；单条语句约束失败不总意味着前面已执行的其他语句自动回滚。对借阅而言，创建借阅与写操作记录应一起成功或一起撤销。BEGIN IMMEDIATE可较早申请写事务，遇到其他写入可能返回忙，应用应有有限等待、重试或清楚失败，不能无限循环占用CPU。约束仍是并发下防止同一副本重复在借的最后一道规则。</p><h3>推演与核对</h3><p>在新初始化连接执行CREATE TABLE action_log(loan_id INTEGER NOT NULL REFERENCES loan(id),note TEXT NOT NULL); BEGIN IMMEDIATE; INSERT INTO loan VALUES(103,2,12,'2026-03-05',NULL); INSERT INTO action_log VALUES(103,'借出'); ROLLBACK; SELECT COUNT(*) FROM loan WHERE id=103; 返回0，日志对应行也为0。将ROLLBACK改COMMIT则两者都为1。之后尝试给已有在借的copy11再插一条会报唯一约束错，应捕获后按业务范围回滚，不留下半套日志。</p><h3>适用边界</h3><p>本课示例在串行本地连接中核对原子性，不能据此保证任意分布式服务的一致性。BEGIN事务不能直接嵌套，局部撤销可研究SAVEPOINT。错误后先确认连接事务状态再继续，避免把未提交数据误当已持久化成功。</p><h3>方法连接</h3><p></p>",
      "practice": {
        "question": "借阅与日志写入后ROLLBACK，新增两表记录？",
        "options": [
          "都不保留",
          "仅借阅保留",
          "仅日志保留",
          "都已永久保留"
        ],
        "correct": 0,
        "explanation": "在新初始化连接执行CREATE TABLE action_log(loan_id INTEGER NOT NULL REFERENCES loan(id),note TEXT NOT NULL); BEGIN IMMEDIATE; INSERT INTO loan VALUES(103,2,12,'2026-03-05',NULL); INSERT INTO action_log VALUES(103,'借出'); ROLLBACK; SELECT COUNT(*) FROM loan WHERE id=103; 返回0，日志对应行也为0。将ROLLBACK改COMMIT则两者都为1。之后尝试给已有在借的copy11再插一条会报唯一约束错，应捕获后按业务范围回滚，不留下半套日志。 本课示例在串行本地连接中核对原子性，不能据此保证任意分布式服务的一致性。BEGIN事务不能直接嵌套，局部撤销可研究SAVEPOINT。错误后先确认连接事务状态再继续，避免把未提交数据误当已持久化成功。"
      }
    },
    {
      "id": "week-10",
      "title": "第10周 · 备份、回读与迁移",
      "body": "<h3>原理与判据</h3><p>备份不是复制一个文件后就宣布可恢复，必须验证副本能独立打开、表结构和记录完整。SQLite运行中可能存在WAL等关联状态，不能把随意复制主文件当一致性备份通用方法。练习可在无事务的专用文件库执行VACUUM INTO，或使用驱动提供的在线备份接口；目标位置应是新的练习文件，不覆盖唯一原件。</p><h3>推演与核对</h3><p>在专用文件库、无活动事务时执行VACUUM INTO 'library-backup.sqlite'; 目标文件必须不存在或为空。然后使用新连接打开副本，执行PRAGMA integrity_check; 应返回ok；执行PRAGMA foreign_key_check; 应无行，再核对member2、book2、copy3、loan2等初始计数。若此前已增加或归还记录，应与备份瞬间快照清单比较，而非机械要求仍为初始值。</p><h3>适用边界</h3><p>完整性检查不是业务正确性证明，数据库可以结构完整却有错误日期。恢复演练应在另一练习路径，不直接覆盖运行中原库；迁移前后比较键、约束和样本查询。备份含数据也需要保护，不能把真实账号、成绩或私密文件放入课程附件，演练完成关闭连接并清理仅供测试的副本。</p><h3>方法连接</h3><p></p>",
      "practice": {
        "question": "备份完成后最关键验证？",
        "options": [
          "只看文件名",
          "新连接回读并核对结构与业务记录",
          "只看文件非零",
          "直接删原库"
        ],
        "correct": 1,
        "explanation": "在专用文件库、无活动事务时执行VACUUM INTO 'library-backup.sqlite'; 目标文件必须不存在或为空。然后使用新连接打开副本，执行PRAGMA integrity_check; 应返回ok；执行PRAGMA foreign_key_check; 应无行，再核对member2、book2、copy3、loan2等初始计数。若此前已增加或归还记录，应与备份瞬间快照清单比较，而非机械要求仍为初始值。 完整性检查不是业务正确性证明，数据库可以结构完整却有错误日期。恢复演练应在另一练习路径，不直接覆盖运行中原库；迁移前后比较键、约束和样本查询。备份含数据也需要保护，不能把真实账号、成绩或私密文件放入课程附件，演练完成关闭连接并清理仅供测试的副本。"
      }
    },
    {
      "id": "week-11",
      "title": "第11周 · 参数化、权限与输入边界",
      "body": "<h3>原理与判据</h3><p>SQL参数绑定把数据与SQL语法分开，是处理用户输入的基本方式；字符串拼接可能让引号和控制片段改变语句结构。参数通常绑定值而非表名或排序方向，动态标识符需要固定白名单。SQLite本身不是网络身份服务，应用仍需校验角色、对象归属和数据库文件权限；使用参数不能让普通学生自动获得查看全体读者的权利。</p><h3>推演与核对</h3><p>Python标准库示例：conn.execute('SELECT id,name FROM member WHERE id=?',(1,)).fetchall() 应得到[(1,'样本甲')]。若搜索名字，用WHERE name=?并绑定\"' OR 1=1 --\"，它只作为完整名称字符串比较，在本样本无匹配，不会返回所有人。数值ID先按契约校验类型和范围，用户名可同名但ID稳定；测试时只用这类无真实身份的演示数据。</p><h3>适用边界</h3><p>不在本站服务器执行提交者SQL或代码，项目只交可读文本与证据。授权必须在服务端围绕当前身份进行，前端隐藏按钮和长ID都不能替代。错误消息不应向无权用户暴露全库路径、其他读者姓名或连接密钥，日志也只保留定位问题所需内容。</p><h3>方法连接</h3><p></p>",
      "practice": {
        "question": "参数绑定的主要作用？",
        "options": [
          "自动实现全部权限",
          "让任意表名安全绑定",
          "把输入数据与SQL语法分离",
          "保证所有查询都快"
        ],
        "correct": 2,
        "explanation": "Python标准库示例：conn.execute('SELECT id,name FROM member WHERE id=?',(1,)).fetchall() 应得到[(1,'样本甲')]。若搜索名字，用WHERE name=?并绑定\"' OR 1=1 --\"，它只作为完整名称字符串比较，在本样本无匹配，不会返回所有人。数值ID先按契约校验类型和范围，用户名可同名但ID稳定；测试时只用这类无真实身份的演示数据。 不在本站服务器执行提交者SQL或代码，项目只交可读文本与证据。授权必须在服务端围绕当前身份进行，前端隐藏按钮和长ID都不能替代。错误消息不应向无权用户暴露全库路径、其他读者姓名或连接密钥，日志也只保留定位问题所需内容。"
      }
    },
    {
      "id": "week-12",
      "title": "第12周 · 验收矩阵与人工项目交付",
      "body": "<h3>原理与判据</h3><p>最终项目提交200至4000字文本，包含需求与范围、ER文字关系、主外键与规范化理由、核心DDL、初始化数据、三类查询、索引计划、事务失败、备份恢复以及参数绑定。允许附链接，但不能只交链接或数据库二进制；平台不运行学生代码，老师根据可见说明与测试证据人工评分。未实际运行的结果明确标为预测，不能伪称已经执行。</p><h3>推演与核对</h3><p>至少给十个验收用例：初始计数、无借阅副本计0、两个同名读者可共存、缺外键被拒、重复在借被拒、归还重复无覆盖、借阅日志回滚一致、索引前后结果相同、参数输入不改变查询结构、备份回读计数一致。公开项目rubric100分：需求与模型20、DDL与约束20、查询与索引20、事务/恢复/边界测试25、文档与真实性15。测验占40%、人工项目占60%，例如测验80、项目70综合为74。</p><h3>适用边界</h3><p>项目待批不得先发综合成绩或学分，重考和修改应保留历史版本，不能自动给提交者满分。课程结束关闭所有数据库连接，停止自己启动的临时进程，保留源稿和恢复说明。限制至少说明本地单库、未实现生产认证、不处理真实个人数据，避免把教学成果包装成正式高校可直接上线系统。</p><h3>方法连接</h3><p></p>",
      "practice": {
        "question": "测验80占40%、人工项目70占60%，综合？",
        "options": [
          "72分",
          "75分",
          "80分",
          "74分"
        ],
        "correct": 3,
        "explanation": "至少给十个验收用例：初始计数、无借阅副本计0、两个同名读者可共存、缺外键被拒、重复在借被拒、归还重复无覆盖、借阅日志回滚一致、索引前后结果相同、参数输入不改变查询结构、备份回读计数一致。公开项目rubric100分：需求与模型20、DDL与约束20、查询与索引20、事务/恢复/边界测试25、文档与真实性15。测验占40%、人工项目占60%，例如测验80、项目70综合为74。 项目待批不得先发综合成绩或学分，重考和修改应保留历史版本，不能自动给提交者满分。课程结束关闭所有数据库连接，停止自己启动的临时进程，保留源稿和恢复说明。限制至少说明本地单库、未实现生产认证、不处理真实个人数据，避免把教学成果包装成正式高校可直接上线系统。"
      }
    }
  ],
  "language": "中文",
  "weeklyHours": 6.7,
  "project": {
    "title": "本地图书副本借阅数据库课程设计",
    "prompt": "提交200至4000字本地虚构图书借阅数据库设计报告：需求边界；book/copy/member/loan关系、键与规范化理由；核心SQLite DDL及样本数据；可借查询、LEFT JOIN计零与统计；索引和EXPLAIN解释；借阅与日志事务失败回滚；重复归还幂等；备份新连接回读；参数化与角色边界；至少10个含失败/边界的输入、预期、实际结果（未运行必须标为预测）；启动复现方式、来源和资源清理。不能只交链接、二进制或代码压缩包，不使用真实账号/成绩/个人资料。平台不执行代码，由教师人工按公开rubric评分。",
    "minLength": 200,
    "maxLength": 4000,
    "rubric": [
      {
        "criterion": "需求范围、ER关系与规范化理由",
        "points": 20
      },
      {
        "criterion": "DDL、主外键及业务唯一约束",
        "points": 20
      },
      {
        "criterion": "查询口径、索引与计划解释",
        "points": 20
      },
      {
        "criterion": "事务、恢复及至少十项边界测试证据",
        "points": 25
      },
      {
        "criterion": "文档复现、数据虚构与限制如实说明",
        "points": 15
      }
    ]
  },
  "applicablePrograms": [
    "计算机科学与技术方向"
  ]
};
