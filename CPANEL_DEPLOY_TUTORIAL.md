# cPanel Deployment and Update Tutorial (Beginner Friendly)

This guide explains how to update your live site after you make changes.

It covers:
- Content updates from `/backend` (no Git needed)
- Code/design updates from your computer (Git + cPanel pull)
- Safe database migrations
- Common errors and quick fixes

---

## 1. Two Types of Updates

### A) Content updates (easy mode)
If you change text, images, pages, posts, or settings inside:
- `https://victorekpenyong.com/backend`

Then changes are saved in PostgreSQL immediately.
No Git, no terminal, no restart needed.

### B) Code/design updates (developer mode)
If you change files in:
- `src/*`
- `server/*`
- `package.json`
- styles/components

Then you must:
1. Commit and push to GitHub.
2. Pull on cPanel.
3. Restart Node app.

---

## 2. One-Time cPanel Setup Checklist

In cPanel Node.js App:
1. Keep only one app for the main domain root.
2. `Application root`: `apps/ekpenyong`
3. `Application startup file`: `passenger-start.cjs`
4. Mode: `production`
5. Confirm app is `started`.

In file manager:
1. Confirm this file exists:
   - `/home/victprqt/apps/ekpenyong/passenger-start.cjs`

---

## 3. Local Computer Workflow (When You Edit Code)

Run these in your local project folder:

```bash
npm install
npm run build
git add .
git commit -m "describe your change"
git push origin main
```

Important for your hosting:
- Your cPanel server has low memory for Vite build.
- So build locally (`npm run build`) and push `dist` to GitHub.

---

## 4. cPanel Terminal Workflow (After You Push)

Open cPanel Terminal and run:

```bash
source /home/victprqt/nodevenv/apps/ekpenyong/18/bin/activate
cd /home/victprqt/apps/ekpenyong
git pull origin main
```

If `package.json` changed, run:

```bash
npm ci
```

If database schema changed, run:

```bash
npm run migrate
```

Then restart app from cPanel Node.js page:
- Click `Restart App`

---

## 5. Quick Safe Rules

Use this decision table:

1. Changed only content in `/backend`:
   - Do nothing else.
2. Changed frontend/backend code:
   - Push to GitHub, pull on cPanel, restart app.
3. Changed DB schema/migrations:
   - Push, pull, run `npm run migrate`, restart app.
4. Changed dependencies:
   - Push, pull, run `npm ci`, restart app.

---

## 6. First Deploy on New Server (Fresh Install)

On cPanel terminal:

```bash
source /home/victprqt/nodevenv/apps/ekpenyong/18/bin/activate
cd /home/victprqt/apps/ekpenyong
npm ci
npm run migrate
npm run seed
```

Then restart app in cPanel Node.js UI.

---

## 7. Verify Everything Is Working

Open:
- `https://victorekpenyong.com/` (public site)
- `https://victorekpenyong.com/backend/login` (admin login)
- `https://victorekpenyong.com/api/site` (should return JSON)

If all open correctly, deploy is successful.

---

## 8. Common Problems and Fixes

### Problem: `503 Service Unavailable`
Fix:
1. Ensure startup file is `passenger-start.cjs`.
2. Ensure app root is `apps/ekpenyong`.
3. Ensure only one Node app handles `/` (remove duplicate `/public` app).
4. Restart app.

### Problem: `Frontend build not found`
Fix:
1. Build locally with `npm run build`.
2. Commit and push `dist`.
3. Pull on cPanel.
4. Restart app.

### Problem: `Invalid email/password` on backend
Fix:
1. Ensure DB migrated and seeded.
2. Run:

```bash
npm run reset:admin
```

3. Restart app and login again.

### Problem: DB auth failed
Fix:
1. Check `DATABASE_URL` in cPanel env vars.
2. Confirm DB username/password and DB name are correct.
3. Confirm DB user is assigned to DB.

---

## 9. Security Checklist (Do This)

1. Use a strong random `SESSION_SECRET`.
2. Change default admin email/password after first login.
3. Rotate DB password if it was ever shared.
4. Never commit real `.env` values to GitHub.
5. Keep dependencies updated periodically.

---

## 10. Daily Update Cheatsheet

Local:

```bash
npm run build
git add .
git commit -m "update"
git push origin main
```

cPanel:

```bash
source /home/victprqt/nodevenv/apps/ekpenyong/18/bin/activate
cd /home/victprqt/apps/ekpenyong
git pull origin main
```

Then click `Restart App`.

Done.
