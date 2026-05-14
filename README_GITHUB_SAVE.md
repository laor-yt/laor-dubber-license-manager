# Direct GitHub save for `db.json`

This version can read and write the remote `db.json` used by:

```text
https://laor-yt.github.io/laor-dubber-license-manager/db.json
```

The browser does not write to GitHub directly. It sends edits to `server.js`; the server uses `GITHUB_TOKEN` from `.env` to update `db.json` safely.

For full setup instructions, read `README_API_DATABASE_EDIT.md`.

## Quick local setup

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

Never put `GITHUB_TOKEN` inside frontend files like `app.js`, `index.html`, or `config.js`. A token in frontend code can be stolen by anyone who opens the page.
