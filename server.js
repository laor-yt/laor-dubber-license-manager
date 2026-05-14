// Laor License Manager secure GitHub db.json updater
// Run with: node server.js
// Put secrets in .env. Never put a GitHub token in frontend JavaScript.

const http = require('http');
const fs = require('fs');
const path = require('path');

loadDotEnv(path.join(__dirname, '.env'));

const PORT = Number(process.env.PORT || 3000);
const OWNER = process.env.GITHUB_OWNER || 'laor-yt';
const REPO = process.env.GITHUB_REPO || 'laor-dubber-license-manager';
const BRANCH = process.env.GITHUB_BRANCH || 'main';
const FILE_PATH = process.env.GITHUB_FILE_PATH || 'db.json';
const TOKEN = process.env.GITHUB_TOKEN || '';
const ADMIN_KEY = process.env.ADMIN_KEY || '';
const API_VERSION = '2022-11-28';
const STATIC_DIR = __dirname;
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '*')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

function loadDotEnv(filePath) {
  if (!fs.existsSync(filePath)) return;
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

function setCorsHeaders(req, res) {
  const origin = req.headers.origin || '';
  if (ALLOWED_ORIGINS.includes('*')) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  } else if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-key');
  res.setHeader('Access-Control-Max-Age', '86400');
}

function sendJson(res, status, data) {
  const body = JSON.stringify(data, null, 2);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Content-Length': Buffer.byteLength(body)
  });
  res.end(body);
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 2_000_000) {
        reject(new Error('Request body is too large'));
        req.destroy();
      }
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

function assertConfigForWrite() {
  if (!TOKEN) throw new Error('Missing GITHUB_TOKEN in .env');
  if (!ADMIN_KEY) throw new Error('Missing ADMIN_KEY in .env');
}

function assertAdmin(req) {
  const got = req.headers['x-admin-key'];
  if (!ADMIN_KEY || got !== ADMIN_KEY) {
    const err = new Error('Invalid admin key');
    err.status = 401;
    throw err;
  }
}

function githubHeaders() {
  const headers = {
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': API_VERSION,
    'User-Agent': 'laor-license-manager'
  };
  if (TOKEN) headers.Authorization = `Bearer ${TOKEN}`;
  return headers;
}

function contentsUrl() {
  return `https://api.github.com/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(FILE_PATH)}?ref=${encodeURIComponent(BRANCH)}`;
}

function updateUrl() {
  return `https://api.github.com/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(FILE_PATH)}`;
}

async function getGitHubFile() {
  const response = await fetch(contentsUrl(), { headers: githubHeaders(), cache: 'no-store' });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || `GitHub read failed: ${response.status}`);
  const content = Buffer.from(String(data.content || '').replace(/\n/g, ''), 'base64').toString('utf8');
  return { sha: data.sha, json: JSON.parse(content) };
}

function validateDbJson(data) {
  if (!data || !Array.isArray(data.licenses)) {
    throw new Error('Invalid db.json: expected top-level { "licenses": [] }');
  }
}

async function updateGitHubFile(nextDb) {
  validateDbJson(nextDb);
  assertConfigForWrite();
  const current = await getGitHubFile();
  const content = Buffer.from(JSON.stringify(nextDb, null, 2) + '\n', 'utf8').toString('base64');
  const response = await fetch(updateUrl(), {
    method: 'PUT',
    headers: {
      ...githubHeaders(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: 'Update db.json from Laor License Manager',
      content,
      sha: current.sha,
      branch: BRANCH
    })
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || `GitHub update failed: ${response.status}`);
  return data;
}

function serveStatic(req, res) {
  const requested = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const safePath = requested === '/' ? '/index.html' : requested;
  const filePath = path.normalize(path.join(STATIC_DIR, safePath));
  if (!filePath.startsWith(STATIC_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const types = {
      '.html': 'text/html; charset=utf-8',
      '.js': 'application/javascript; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.json': 'application/json; charset=utf-8',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.svg': 'image/svg+xml'
    };
    res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  try {
    setCorsHeaders(req, res);
    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    const url = new URL(req.url, `http://${req.headers.host}`);

    if (url.pathname === '/api/status' && req.method === 'GET') {
      sendJson(res, 200, {
        ok: true,
        owner: OWNER,
        repo: REPO,
        branch: BRANCH,
        file_path: FILE_PATH,
        can_write: Boolean(TOKEN && ADMIN_KEY)
      });
      return;
    }

    if (url.pathname === '/api/db' && req.method === 'GET') {
      const current = await getGitHubFile();
      sendJson(res, 200, current.json);
      return;
    }

    if (url.pathname === '/api/db' && req.method === 'PUT') {
      assertAdmin(req);
      const body = await readRequestBody(req);
      const nextDb = JSON.parse(body);
      const result = await updateGitHubFile(nextDb);
      sendJson(res, 200, {
        ok: true,
        commit: result.commit && result.commit.sha,
        content: result.content && result.content.path
      });
      return;
    }

    serveStatic(req, res);
  } catch (error) {
    const status = error.status || 500;
    sendJson(res, status, { error: error.message || 'Server error' });
  }
});

server.listen(PORT, () => {
  console.log(`Laor License Manager running at http://localhost:${PORT}`);
  console.log(`Reading/writing ${OWNER}/${REPO}/${FILE_PATH} on branch ${BRANCH}`);
});
