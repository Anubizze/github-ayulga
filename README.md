# Auylga Backend (PostgreSQL)

## 1) Install

```bash
cd backend
npm install
```

## 2) Configure environment

Copy `.env.example` to `.env` and set your PostgreSQL credentials.

## 3) Create database schema

Run SQL from `database/schema.sql` in your PostgreSQL database.

## 4) Start API

```bash
npm run dev
```

Server runs on `http://localhost:5000` by default.

## Admin login

- URL: `/admin/login` (frontend)
- Default user from schema:
  - username: `admin`
  - password: `password`
- Recommended for production: set `ADMIN_PASSWORD` in `.env`.
  On backend start, admin password is automatically updated to this value.

## Notes

- Frontend should use `REACT_APP_API_URL=http://localhost:5000/api` (or your production API URL).
- News CRUD endpoints used by admin:
  - `POST /api/auth/login`
  - `GET /api/news`
  - `POST /api/news`
  - `PUT /api/news/:id`
  - `DELETE /api/news/:id`

## Existing static news in admin

On startup backend seeds records from `frontend/public/news-data.json` into PostgreSQL
(`AUTO_SEED_STATIC_NEWS=true` by default). This makes existing site news visible in admin panel.
