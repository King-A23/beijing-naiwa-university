# 阿里云 ECS 共享登记服务

GitHub Pages 继续托管前端；香港 ECS 托管 HTTPS API，解决旧 chatgpt.site 接口被大陆网络拦截的问题。页面设计与功能入口不变。

- 域名：`https://api.xn--1lq90ic7f9iv6f088h.cn/api`
- Node.js 24 + SQLite WAL；Caddy 自动管理 HTTPS 证书。
- `naiwa-registry` 仅监听 `127.0.0.1:8787`，Caddy 覆盖来源 IP 后反向代理。数据库从不公开下载。
- 数据库：`/var/lib/naiwa/students.sqlite`；环境：`/etc/naiwa-registry.env`（0600）。不能提交密钥、真实名册或数据库。
- 数据库的 `NOCASE UNIQUE` 约束及事务保证蛙号不重复；请求 UUID 保证重试不重复计数。
- 旧记录通过 `createStore().importStudent(row)` 在服务器本地导入，保留 ID、头像、年份、时间与请求 UUID。冲突会中止，迁移重复执行不会重复计数。HTTP 导入入口默认关闭。

## 部署和维护

安装官方 Node.js 24 和 Caddy 后，将本目录部署到 `/opt/naiwa-registry`，以 root 执行 `bash install.sh`。安全组只需公开 TCP 80/443；不要开放 8787 或数据库端口。

更新源码后执行 `systemctl restart naiwa-registry`；健康检查 `curl --fail https://api.xn--1lq90ic7f9iv6f088h.cn/api/health`。日志使用 `journalctl -u naiwa-registry` 和 `journalctl -u caddy`。

`/etc/cron.daily/naiwa-backup` 每日使用 SQLite 一致性备份，文件在 `/var/lib/naiwa/backups`，保留约 14 天。它与主数据库在同一块云盘，不能替代服务器外备份；迁移或释放服务器前必须另行导出。应用更新不删除数据库。

停止生产接口：`systemctl stop naiwa-registry caddy`。仅停止应用不会停止 ECS 计费，试用额度用尽前应在阿里云控制台检查余量并决定续费或迁移；不要直接释放包含唯一数据库副本的服务器。

本次用户接受 300 元试用额度，选定配置约 0.167 元/小时、约 1796 小时（75 天）。额度有效期截至 2027-01-20，但持续运行的免费时长不等于整个有效期；费用以阿里云账单及流量额度为准。

## 有针对性的检查

`node --test backend/aliyun-ecs/registry.test.mjs`

覆盖同时提交、大小写重复、网络重试、迁移完整性、重启持久化、CORS 和登记凭据。
