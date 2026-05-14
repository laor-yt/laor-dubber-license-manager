# Edit the API database (`db.json`)

The public URL below is the database the app reads:

```text
https://laor-yt.github.io/laor-dubber-license-manager/db.json
```

This fixed version can save changes in two ways:

1. **Backend API Save** - recommended for production. `server.js` keeps the GitHub token in `.env` and exposes `GET /api/db`, `PUT /api/db`, and `GET /api/status`.
2. **Direct GitHub Save** - fixes the GitHub Pages/static hosting error. Go to **Settings -> API Database Editor -> Direct GitHub Save**, enter a GitHub token for the current browser session, then click **Save Current Data to API Database**.

## What was fixed

The old warning said:

```text
Local change only. Run server.js to save directly to GitHub.
```

That happened when the app was opened from GitHub Pages without a running backend API. This version no longer gets stuck in local-only mode. If no backend URL is configured, it falls back to Direct GitHub Save and updates `db.json` with the GitHub Contents API from your browser session.

## Direct GitHub Save setup

1. Create a new GitHub token. Do not reuse any token pasted into chat.
2. Give it repository permission: **Contents: Read and write** for `laor-yt/laor-dubber-license-manager`.
3. Open the app.
4. Go to **Settings -> API Database Editor -> Direct GitHub Save**.
5. Paste the token into **GitHub Token**.
6. Click **Save Token for Session**.
7. Click **Test Direct GitHub**.
8. Edit a license or click **Save Current Data to API Database**.

The token is stored only in `sessionStorage` for the current browser session. It is not written to `app.js`, `index.html`, `config.js`, or `db.json`.

## Backend API Save setup

1. Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

2. Edit `.env`:

```env
GITHUB_TOKEN=your_new_token_here
GITHUB_OWNER=laor-yt
GITHUB_REPO=laor-dubber-license-manager
GITHUB_BRANCH=main
GITHUB_FILE_PATH=db.json
ADMIN_KEY=make_a_private_password_here
ALLOWED_ORIGINS=*
PORT=3000
```

3. Start the API + web app:

```bash
npm start
```

4. Open:

```text
http://localhost:3000
```

Now Add, Edit, Delete, Import, Add Device, and Remove Device will save to GitHub `db.json` after you enter the `ADMIN_KEY`.

## Use from GitHub Pages

For the easiest static setup, use **Direct GitHub Save** in Settings.

For production, deploy `server.js` to a Node host such as Render, Railway, Fly.io, or your VPS. Then set the backend URL in **Settings -> API Database Editor**, or edit `config.js` before uploading the frontend:

```js
window.LAOR_API_BASE_URL = "https://your-laor-api.onrender.com";
```

Do not include `/api/db` in the field. Use only the base URL.

## Security notes

- Do not hardcode a GitHub token in `app.js`, `index.html`, `config.js`, or any GitHub Pages file.
- Direct GitHub Save is convenient for your private admin use. Backend API Save is safer for public/production use.
- `ADMIN_KEY` is not a GitHub token. It is just a password your browser sends to your backend.
- For production backend hosting, set `ALLOWED_ORIGINS=https://laor-yt.github.io` instead of `*`.
- Use HTTPS for the deployed backend.
