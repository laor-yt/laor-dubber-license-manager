// One-shot updater: uploads local db.json to GitHub.
// Run with: GITHUB_TOKEN=... node github-update-db.js

const fs = require('fs');
const path = require('path');

loadDotEnv(path.join(__dirname, '.env'));

const OWNER = process.env.GITHUB_OWNER || 'laor-yt';
const REPO = process.env.GITHUB_REPO || 'laor-dubber-license-manager';
const BRANCH = process.env.GITHUB_BRANCH || 'main';
const FILE_PATH = process.env.GITHUB_FILE_PATH || 'db.json';
const TOKEN = process.env.GITHUB_TOKEN;
const API_VERSION = '2022-11-28';

function loadDotEnv(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    if (!process.env[key]) process.env[key] = value;
  }
}

function headers() {
  if (!TOKEN) throw new Error('Missing GITHUB_TOKEN. Put it in .env or export it before running.');
  return {
    'Authorization': `Bearer ${TOKEN}`,
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': API_VERSION,
    'User-Agent': 'laor-license-manager'
  };
}

async function main() {
  const localFile = path.join(__dirname, FILE_PATH);
  const db = JSON.parse(fs.readFileSync(localFile, 'utf8'));
  if (!db || !Array.isArray(db.licenses)) throw new Error('Invalid local db.json: expected { "licenses": [] }');

  const getUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(FILE_PATH)}?ref=${encodeURIComponent(BRANCH)}`;
  const currentResp = await fetch(getUrl, { headers: headers() });
  const current = await currentResp.json();
  if (!currentResp.ok) throw new Error(current.message || `GitHub read failed: ${currentResp.status}`);

  const putUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(FILE_PATH)}`;
  const content = Buffer.from(JSON.stringify(db, null, 2) + '\n', 'utf8').toString('base64');
  const updateResp = await fetch(putUrl, {
    method: 'PUT',
    headers: { ...headers(), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'Update db.json',
      content,
      sha: current.sha,
      branch: BRANCH
    })
  });
  const result = await updateResp.json();
  if (!updateResp.ok) throw new Error(result.message || `GitHub update failed: ${updateResp.status}`);
  console.log(`Updated ${OWNER}/${REPO}/${FILE_PATH}`);
  console.log(`Commit: ${result.commit && result.commit.sha}`);
}

main().catch(error => {
  console.error(error.message);
  process.exit(1);
});
