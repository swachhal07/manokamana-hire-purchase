# Manokamana Backend

Node/Express API for the Manokamana Hire Purchase site. Files (PDF reports,
blog images, team photos) are uploaded to **Cloudinary**; structured data
(reports list, posts, team roster) is persisted as JSON documents on
Cloudinary too — no separate database needed.

## Folder structure

```
backend/
├── server.js                 # Express app + route mounting
├── .env.example              # Copy to .env and fill in
└── src/
    ├── config/
    │   └── cloudinary.js     # Cloudinary SDK config + upload/delete helpers
    ├── lib/
    │   └── store.js          # JSON-on-Cloudinary document store
    ├── middleware/
    │   ├── auth.js           # JWT admin auth (Bearer token)
    │   └── upload.js         # Multer in-memory upload (15 MB cap)
    └── routes/
        ├── auth.js           # POST /api/auth/login
        ├── reports.js        # Financial reports CRUD + PDF upload
        ├── posts.js          # Blog CRUD + cover image upload
        └── team.js           # BOD / management names, roles, photos
```

## Setup

```bash
cd backend
npm install
copy .env.example .env    # then fill in Cloudinary keys + ADMIN_PASSWORD + JWT_SECRET
npm run dev               # http://localhost:5000
```

Cloudinary keys: dashboard → Settings → API Keys.

## API

Public:

| Method | Path                | Notes                              |
| ------ | ------------------- | ---------------------------------- |
| GET    | /api/reports        | Sorted newest fiscal period first  |
| GET    | /api/posts          | Newest first; `featured` flag      |
| GET    | /api/posts/:slug    |                                    |
| GET    | /api/team           | `{ board: [...], management: [...] }` |

Admin (send `Authorization: Bearer <token>` from `POST /api/auth/login`):

| Method | Path                        | Body (multipart/form-data)                          |
| ------ | --------------------------- | --------------------------------------------------- |
| POST   | /api/reports                | title, year, period (Q1–Q4/Annual), notes, publishedAt, file (PDF) |
| PUT    | /api/reports/:id            | any of the above                                    |
| DELETE | /api/reports/:id            |                                                     |
| POST   | /api/posts                  | title, category, date, excerpt, body (JSON blocks), featured, image |
| PUT    | /api/posts/:slug            | any of the above                                    |
| DELETE | /api/posts/:slug            |                                                     |
| POST   | /api/team/:section          | section = board \| management; name, role, bio, image |
| PUT    | /api/team/:section/:index   | any of name, role, bio, image                       |
| DELETE | /api/team/:section/:index   |                                                     |

`body` blocks are `[{ "type": "p" | "h2", "text": "…" }, …]` — the same shape
the frontend renders.

## Deploying

Deploy this folder to Render / Railway / Fly (anything that runs Node). Set the
env vars from `.env.example`, add your Vercel domain to `CORS_ORIGINS`, then set
`VITE_API_URL=https://your-api.onrender.com/api` in the frontend's Vercel env.
