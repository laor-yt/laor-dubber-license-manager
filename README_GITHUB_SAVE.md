# Save edits to GitHub `db.json`

This version can read and write the remote database used by:

```text
https://laor-yt.github.io/laor-dubber-license-manager/db.json
```

It supports two save methods:

- **Direct GitHub Save**: works on GitHub Pages/static hosting. Enter a GitHub token in **Settings -> API Database Editor**. The token stays in this browser session only.
- **Backend API Save**: run or deploy `server.js`; the server uses `GITHUB_TOKEN` from `.env` to update `db.json`.

For full setup instructions, read `README_API_DATABASE_EDIT.md`.

## Quick static/GitHub Pages setup

1. Open the app.
2. Go to **Settings -> API Database Editor -> Direct GitHub Save**.
3. Paste a new fine-grained GitHub token with **Contents: Read and write**.
4. Click **Test Direct GitHub**.
5. Edit data and click save.

## Quick backend setup

```bash
cp .env.example .env
# edit .env with a NEW GitHub token and ADMIN_KEY
npm start
```

Open:

```text
http://localhost:3000
```

## One-shot upload

To upload the local `db.json` file without opening the app:

```bash
npm run push-db
```

## Important

Never hardcode `GITHUB_TOKEN` inside frontend files like `app.js`, `index.html`, or `config.js`. A token in frontend code can be stolen by anyone who opens the page.
