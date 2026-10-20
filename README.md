# 北京奶蛙大学

非官方校园创意网站，发布于 https://北京奶蛙大学.cn/ 。学校、院系和活动均为虚构设定。

## 本地查看

无构建步骤与第三方运行时依赖。在仓库目录执行：

```sh
python3 -m http.server 18766 --bind 127.0.0.1
```

打开 `http://127.0.0.1:18766/`。检查完毕后用 Ctrl+C 停止服务。

## 文件分工

- `index.html`、`home.js`：首页、香农容量演示、UTF-8 消息/丢包重传模拟、生活频道与本地清单。
- `content.js`：27 篇内容及分类、关联阅读、活动元信息、行动入口。
- `article.html`、`news.html`、`gallery.html`、`portal.js`：文章阅读、筛选搜索与相册。
- `site.js`、`style.css`：共用导航、站内搜索、页脚、响应式样式和动态偏好。
- `inner.css`：内页样式。
- `assets/`：原创奶蛙图标及保留来源说明的校园图片，展示优先使用 WebP。

清单只保存在浏览器的 `naiwa-small-things-v1` localStorage 项中。消息传输是当前页面内的模拟，无后端与真实发送。信道容量使用 `C = B log₂(1 + 10^(SNR_dB/10))`；带宽以 MHz 输入，容量以 Mbps 显示。

## 发布与验证

GitHub Pages 从 `main` 分支根目录发布。保留 `CNAME` 和 `.nojekyll`，不使用其他托管平台。推送后等待 `pages-build-deployment` 成功，并在现有域名核对新版本。

关键回归：手机导航及键盘焦点、搜索命中/空结果、分类前进后退、消息丢包与重传、清单刷新保留/重置、文章字号与复制回退、相册方向键/Escape/焦点恢复、未知文章恢复页。检查 320/390/768/1440 宽度和 `prefers-reduced-motion` 初始及运行中变更。
