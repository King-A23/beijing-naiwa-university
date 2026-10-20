# 全塘共享登记接口

前端与域名保留在 King-A23/beijing-naiwa-university 的 GitHub Pages。本项目只承载登记 API，使用 Sites 提供的 Cloudflare Worker 和 D1 持久化数据库。

## 接口

- `GET /api/enrollments?limit=12&cursor=...`：按最新入学顺序返回公开名册和数据库总人数。
- `GET /api/enrollment-ticket`：为允许的前端来源颁发短期匿名登记凭据。
- `POST /api/enrollments`：JSON 蛙名、蛙号、头像和 UUID 请求凭据；携带 `X-Naiwa-Ticket`。
- `GET /api/health`：检查数据库连接。
- `GET /api/maintenance/export`：携带管理员 Bearer 密钥分页导出名册。
- `DELETE /api/maintenance/qa`：携带管理员 Bearer 密钥，仅可删除命名为「上线验证奶蛙」、蛙号符合 `QA_PROBE_XXXXXXXX` 的验证记录。

请求限制为 4 KiB；字段由服务端校验。蛙号规范化后只允许大写字母、数字、下划线和短横线，数据库 CHECK 和 UNIQUE 约束共同保证唯一性。入学与毕业年份分别固定为 0、4。重复请求返回原有记录，不再次计数。创建、查找记录、统计总数使用 D1 原子批次。

允许现有自定义域名与 GitHub Pages 来源，浏览器跨域响应不允许任意来源。接口供匿名访客登记，不依赖 ChatGPT 登录。短期凭据绑定服务端识别的 IP 摘要；凭据签发每 IP 每分钟 30 次，新登记每小时 120 次。原始 IP 不写入数据库。

## 维护

`REGISTRY_SIGNING_KEY` 和 `REGISTRY_ADMIN_KEY` 只配置为 Sites 运行时机密，不进入前端、源码或托管配置。迁移由 Sites 发布时应用；后续迁移必须追加，不能改写已应用的 SQL 和 Drizzle 元数据。更新应用不能清空数据库。GitHub Pages 回退不会改动 D1 数据。

需要备份时，使用授权维护请求分页导出公开登记字段，并记录导出时间。此项目未创建定时备份任务。不要把本地测试数据库导入正式环境。

验证命令：`node --test tests/registry.test.mjs`。测试使用临时 Miniflare D1，结束时释放进程。
