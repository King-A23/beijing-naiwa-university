import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRegistryStore, RegistryError } from './registry.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp' };
const publicFiles = new Set(['index.html','article.html','news.html','gallery.html','style.css','portal.css','portal.js','content.js','enrollment.css','enrollment.js','favicon.svg']);
function json(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }); res.end(JSON.stringify(body));
}
async function parseBody(req) {
  if (!/^application\/json(?:\s*;|$)/i.test(req.headers['content-type'] || '')) throw new RegistryError(415, 'JSON_REQUIRED', '请使用入塘登记表提交。');
  let size = 0; const chunks = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 4096) throw new RegistryError(413, 'BODY_TOO_LARGE', '填写内容太长，请精简后再试。');
    chunks.push(chunk);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); }
  catch { throw new RegistryError(400, 'BAD_JSON', '登记内容没有读完整，请再试一次。'); }
}
export function createApp({ databasePath = resolve(root, '.local/students.sqlite') } = {}) {
  const store = createRegistryStore(databasePath);
  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://localhost');
      if (url.pathname === '/api/enrollments') {
        if (req.method === 'GET') {
          const limit = url.searchParams.has('limit') ? Number(url.searchParams.get('limit')) : 12;
          const cursor = url.searchParams.has('cursor') ? Number(url.searchParams.get('cursor')) : null;
          return json(res, 200, store.list({ limit, cursor }));
        }
        if (req.method === 'POST') {
          // The local preview accepts only its own browser origins.
          if (req.headers.origin && ![`http://127.0.0.1:${server.address().port}`, `http://localhost:${server.address().port}`].includes(req.headers.origin)) throw new RegistryError(403, 'ORIGIN_DENIED', '请从奶蛙大学页面提交登记。');
          const result = store.enroll(await parseBody(req));
          return json(res, result.created ? 201 : 200, result);
        }
        res.setHeader('Allow', 'GET, POST'); return json(res, 405, { message: '这个入口只办理查询与入塘登记。' });
      }
      if (url.pathname.startsWith('/api/')) return json(res, 404, { message: '这个蛙务入口暂未开放。' });
      if (!['GET', 'HEAD'].includes(req.method)) return json(res, 405, { message: '请求方式不支持。' });
      let name;
      try { name = decodeURIComponent(url.pathname).slice(1) || 'index.html'; }
      catch { return json(res, 400, { message: '地址格式不正确。' }); }
      // Never serve source, database files, dotfiles or arbitrary filesystem paths.
      if (!publicFiles.has(name) && !/^assets\/[a-zA-Z0-9_-]+\.(jpg|png|svg|webp)$/.test(name)) return json(res, 404, { message: '没有找到这个页面。' });
      const file = resolve(root, name);
      const meta = await stat(file);
      if (!meta.isFile()) return json(res, 404, { message: '没有找到这个页面。' });
      res.writeHead(200, { 'Content-Type': types[extname(file)], 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff' });
      res.end(req.method === 'HEAD' ? undefined : await readFile(file));
    } catch (error) {
      if (res.headersSent) { res.end(); return; }
      if (error instanceof RegistryError) return json(res, error.status, { code: error.code, message: error.message, field: error.field });
      if (error.code === 'ENOENT') return json(res, 404, { message: '没有找到这个文件。' });
      console.error('Registry request failed:', error.message);
      return json(res, 500, { message: '登记处暂时忙碌，请稍后重试。' });
    }
  });
  server.requestTimeout = 15000;
  server.on('close', () => store.close());
  return server;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.NAIWA_PORT || 8765);
  const app = createApp({ databasePath: process.env.NAIWA_DATABASE_PATH || undefined });
  app.listen(port, '127.0.0.1', () => console.log(`Naiwa local preview: http://127.0.0.1:${port} (PID ${process.pid})`));
  app.on('error', error => { console.error(error.message); process.exitCode = 1; });
  for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => { app.close(); app.closeIdleConnections(); });
}
