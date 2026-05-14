# Edit the API database (`db.json`)

The public URL below is a static GitHub Pages JSON file:

```text
https://laor-yt.github.io/laor-dubber-license-manager/db.json
```

Static GitHub Pages files are read-only from the browser. To edit the API database, this project now includes a small backend API that updates GitHub `db.json` through the GitHub Contents API. The frontend can run locally or on GitHub Pages and send edits to that backend.

## Files added/updated

- `server.js` - backend API with:
  - `GET /api/status` - test backend configuration
  - `GET /api/db` - read the latest GitHub `db.json`
  - `PUT /api/db` - update GitHub `db.json`
- `app.js` - add/edit/delete/import/device changes now save to the backend API when configured.
- `index.html` - Settings page now has an API Database Editor section.
- `config.js` - optional public frontend config for your backend URL.
- `.env.example` - server secret configuration template.

## Local setup

1. Create a new GitHub token. Do not reuse a token that was pasted into chat.
2. Give it access to this repo with **Contents: Read and write**.
3. Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

4. Edit `.env`:

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

5. Start the API + web app:

```bash
npm start
```

6. Open:

```text
http://localhost:3000
```

Now Add, Edit, Delete, Import, Add Device, and Remove Device will save to GitHub `db.json` after you enter the `ADMIN_KEY`.

## Use from GitHub Pages

If your frontend is hosted at GitHub Pages, deploy `server.js` to a Node host such as Render, Railway, Fly.io, or your VPS.

Then either:

1. Open the app, go to **Settings -> API Database Editor**, and set your backend URL, for example:

```text
https://your-laor-api.onrender.com
```

or

2. Edit `config.js` before uploading the frontend:

```js
window.LAOR_API_BASE_URL = "https://your-laor-api.onrender.com";
```

Do not include `/api/db` in the field. Use only the base URL.

## Security notes

- Never put `GITHUB_TOKEN` in `app.js`, `index.html`, `config.js`, or any GitHub Pages file.
- `ADMIN_KEY` is not a GitHub token. It is just a password your browser sends to your backend.
- For production, set `ALLOWED_ORIGINS=https://laor-yt.github.io` instead of `*`.
- Use HTTPS for the deployed backend.
