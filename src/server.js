import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { HttpError } from './HttpError.js';

const PORT = 3000;
const ROOT = new URL('../', import.meta.url);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.md': 'text/plain; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.pdf': 'application/pdf',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.webm': 'video/webm',
  '.mp4': 'video/mp4',
};

const toFilePath = (pathname) => {
  if (pathname.endsWith('/')) return `${pathname}index.html`;
  if (path.extname(pathname) === '') return `${pathname}.html`;
  return pathname;
};

const readFile = async (pathname) => {
  const file = new URL(`.${toFilePath(pathname)}`, ROOT);
  const content = await fs.promises.readFile(file).catch((err) => {
    if (err.code === 'ENOENT' || err.code === 'EISDIR') throw new HttpError(404, 'Not found');
    throw err;
  });
  return { content, type: TYPES[path.extname(file.pathname)] ?? 'application/octet-stream' };
};

const serve = async (message, response) => {
  const { pathname } = new URL(message.url, `http://localhost:${PORT}`);

  let status = 200;
  let result;
  try {
    result = await readFile(pathname);
  } catch (err) {
    status = err.status ?? 500;
    if (status === 500) console.error(err);
    const error = status === 500 ? 'Internal server error' : err.message;
    result = { content: error, type: 'text/plain; charset=utf-8' };
  }

  response.writeHead(status, { 'Content-Type': result.type });
  response.end(result.content);
};

http.createServer(serve).listen(PORT, () => console.log(`http://localhost:${PORT}`));
