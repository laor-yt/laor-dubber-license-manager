# Direct GitHub save for `db.json`

This version can read and write `db.json` through a small Node server. The GitHub token stays in `.env` on the server and is never placed in frontend JavaScript.

## Setup

1. Revoke the token you pasted into chat and create a new GitHub token.
2. Give the new token access to `laor-yt/laor-dubber-license-manager` with **Contents: Read and write**.
3. Copy `.env.example` to `.env`.
4. Put your new token in `.env` as `GITHUB_TOKEN=...`.
5. Set `ADMIN_KEY` to any private password you want.
6. Run:

```bash
node server.js
```

7. Open:

```text
http://localhost:3000
```

When you add, edit, delete, import, or change devices, the app asks for the admin key and saves the new JSON to GitHub `db.json`.

## One-shot upload

To upload the local `db.json` file without opening the app:

```bash
node github-update-db.js
```

## Important

Do not host this exact server publicly unless you use a strong `ADMIN_KEY` and HTTPS. Never put `GITHUB_TOKEN` inside `app.js`, `index.html`, or any GitHub Pages file.
