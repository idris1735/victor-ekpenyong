# Dr. Victor Ekpenyong Portfolio + CMS

This project now runs as a single Node app with:
- Public site (`/`)
- Admin backend (`/backend`)
- PostgreSQL content store
- File uploads (`/uploads/*`)

## Stack

- React 18 + TypeScript + Vite
- Express 5 API/server
- PostgreSQL (`pg`)
- Cookie session auth + CSRF protection
- Multer uploads (filesystem)

## API Endpoints

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `POST /api/auth/password`
- `GET /api/site`
- `PUT /api/site`
- `GET /api/pages/:slug`
- `PUT /api/pages/:slug`
- `GET /api/posts`
- `GET /api/posts/:slug`
- `POST /api/posts`
- `PUT /api/posts/:id`
- `DELETE /api/posts/:id`
- `POST /api/uploads`
- `GET /api/media`
- `DELETE /api/media/:id`

## Local Setup

```bash
npm install
cp .env.example .env
# edit .env with your PostgreSQL credentials and session secret
npm run setup:local
```

Run frontend and backend in separate terminals:

```bash
npm run dev:api
npm run dev
```

- Frontend: `http://localhost:8080`
- Backend API: `http://localhost:3000`

Default seed admin (change immediately):
- Email: `admin@example.com`
- Password: `ChangeMe123!`

If login fails, reset admin quickly:

```bash
npm run reset:admin
```

## Production Build

```bash
npm run build
npm run start
```

`npm run start` serves:
- built `dist` files
- `/api` routes
- `/uploads` static files

## cPanel Deploy Notes

1. Create PostgreSQL DB/user in cPanel.
2. Set environment variables from `.env.example` in Node App config.
3. Upload project, install deps, and run:
   - `npm run migrate`
   - `npm run seed`
   - `npm run build`
4. Set Node app startup file to: `server/index.js`.
5. Restart Node app from cPanel.

## Admin Usage

- Login: `/backend/login`
- Dashboard: `/backend`
- Edit homepage sections: `/backend/pages`
- Manage blog posts: `/backend/posts`
- Manage uploads: `/backend/media`
- Global settings JSON: `/backend/settings`
- Password change: `/backend/profile`
