import { createReadStream, existsSync } from 'node:fs';
import { createServer } from 'node:http';
import { basename, extname, resolve } from 'node:path';

const HOST = '127.0.0.1';
const PORT = Number(process.env.PORT || 8080);
const UPSTREAM_URL = 'https://openspeech.bytedance.com/api/v3/tts/create';
const PUBLIC_DIR = resolve(process.cwd());
const MIME_TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(payload));
}

async function readBody(request) {
  const parts = [];
  let total = 0;
  for await (const part of request) {
    total += part.length;
    if (total > 1_000_000) throw new Error('请求内容过大。');
    parts.push(part);
  }
  return Buffer.concat(parts).toString('utf8');
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url || '/', `http://${request.headers.host || HOST}`);

  if (request.method === 'POST' && url.pathname === '/api/tts') {
    try {
      const apiKey = process.env.DOUBAO_API_KEY || request.headers['x-api-key'];
      if (!apiKey || Array.isArray(apiKey)) return sendJson(response, 400, { message: '请在服务端设置 DOUBAO_API_KEY，或在页面中输入 API Key。' });

      const body = await readBody(request);
      const upstream = await fetch(UPSTREAM_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Api-Key': apiKey },
        body
      });
      const text = await upstream.text();
      response.writeHead(upstream.status, { 'Content-Type': upstream.headers.get('content-type') || 'application/json; charset=utf-8' });
      response.end(text);
    } catch (error) {
      const message = error instanceof Error ? error.message : '转发请求失败。';
      sendJson(response, 502, { message });
    }
    return;
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') return sendJson(response, 405, { message: 'Method not allowed' });
  const requestedFile = url.pathname === '/' ? 'doubao-tts.html' : basename(url.pathname);
  const filePath = resolve(PUBLIC_DIR, requestedFile);
  if (!filePath.startsWith(PUBLIC_DIR) || !existsSync(filePath)) return sendJson(response, 404, { message: 'Not found' });
  response.writeHead(200, { 'Content-Type': MIME_TYPES[extname(filePath)] || 'application/octet-stream' });
  if (request.method === 'HEAD') return response.end();
  createReadStream(filePath).pipe(response);
});

server.listen(PORT, HOST, () => {
  console.log(`豆包音频工具已启动：http://${HOST}:${PORT}`);
  console.log('提示：可设置 DOUBAO_API_KEY 后启动服务，页面就无需输入密钥。');
});
