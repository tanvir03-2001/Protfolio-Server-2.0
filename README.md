# Portfolio Server

Express + **MongoDB** API with **Cloudinary** file uploads.

## Setup

```bash
cd server
cp .env.example .env
# Edit .env — add MongoDB URI and Cloudinary credentials
npm install
npm run seed
npm run dev
```

## Environment

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string (local or Atlas) |
| `CLOUDINARY_CLOUD_NAME` | From [Cloudinary Console](https://cloudinary.com/console) |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `JWT_SECRET` | Secret for admin tokens |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Admin login |

## API

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/health` | No | Health check |
| GET | `/api/content` | No | Portfolio content |
| PUT | `/api/content` | JWT | Update content |
| POST | `/api/auth/login` | No | Admin login |
| POST | `/api/upload` | JWT | Upload image/PDF to Cloudinary |

### Upload

`POST /api/upload` with `multipart/form-data`:

- `file` — image (jpg, png, webp, gif) or PDF
- `folder` — `profile`, `projects`, `resume`, or `misc`

Returns `{ url, publicId }`.

## Frontend

`frontend/.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Admin: `http://localhost:3000/admin`
