# Hidden Love

A private, full-stack social platform: registration with email verification, JWT auth, MongoDB + GridFS media storage, photo/video posts with likes and comments, profiles with avatars and bios, follow/search, and real-time one-to-one chat over Socket.IO.

## Stack
- **Backend:** Node.js, Express 5, MongoDB (Mongoose), Socket.IO, JWT auth, bcrypt, GridFS for media
- **Frontend:** React 19, Vite, axios, socket.io-client, lucide-react icons

## Project structure
```
Hidden-Love-main/
├── backend/           Express API + Socket.IO server
│   ├── src/
│   │   ├── config/        MongoDB connection
│   │   ├── controllers/   auth, users, posts, chat
│   │   ├── middleware/     JWT auth guard, error handler
│   │   ├── models/         User, Post, Conversation, Message
│   │   ├── routes/         REST route definitions
│   │   ├── services/       GridFS bucket helper
│   │   ├── socket/          Socket.IO auth
│   │   └── server.js
│   └── .env            Backend configuration (create from .env.example)
└── frontend/          React app
    ├── src/
    │   ├── api/          axios client
    │   ├── components/    Navbar, PostCard, Avatar, CreatePostModal
    │   ├── context/       AuthContext (global auth state)
    │   ├── pages/         AuthPage, Feed, Chat, Profile
    │   ├── App.jsx
    │   └── main.jsx
    └── .env            Frontend configuration (create from .env.example)
```

## Getting started

### 1. Backend
```bash
cd backend
cp .env.example .env   # a working .env is already included for local dev
npm install
npm run dev
```
Runs on **http://localhost:3000**. Requires a running MongoDB instance matching `MONGO_URI` in `.env` (defaults to `mongodb://localhost:27017/hiddenlove`).

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs on **http://localhost:5173**.

## Environment variables

**backend/.env**
| Key | Description |
|---|---|
| `PORT` | API port (default 3000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign auth tokens — a random one is pre-generated for local dev |
| `JWT_EXPIRES_IN` | Token lifetime (default `7d`) |
| `CLIENT_URL` | Frontend origin, used for CORS (default `http://localhost:5173`) |
| `MAX_FILE_SIZE_MB` | Max upload size per media file (default 100) |

**frontend/.env**
| Key | Description |
|---|---|
| `VITE_API_URL` | Backend REST API base URL |
| `VITE_SOCKET_URL` | Backend Socket.IO URL |
| `VITE_APP_NAME` | Display name shown in the UI |

## Trying it out
1. Register an account in the app.
2. The 6-digit email verification code is printed in the **backend terminal** (no real email is sent in local dev).
3. Enter the code to verify, then log in.
4. Create a post, like/comment, search for people to follow, edit your profile photo and bio, and message another account in real time.

## API quick reference (for Postman/curl)
```
POST /api/auth/register      { name, username, email, password }
POST /api/auth/verify-email  { email, code }
POST /api/auth/login         { email, password }
GET  /api/users/me
PATCH /api/users/me          { name?, bio? }
GET  /api/users/search?q=
POST /api/users/:id/follow
POST /api/users/avatar       (multipart: avatar)
GET  /api/posts/feed
POST /api/posts              (multipart: media[], caption)
POST /api/posts/:id/like
POST /api/posts/:id/comment  { text }
GET  /api/chat/conversations
POST /api/chat/conversations { userId }
GET  /api/chat/conversations/:id/messages
```
Protected routes require `Authorization: Bearer <token>`. Media (posts and avatars) is served from `/api/posts/media/:fileId`, stored in MongoDB GridFS — not a local uploads folder.

## Notes for production
This is set up for local development. Before deploying: enable HTTPS, wire up real SMTP for verification emails, add refresh-token/session handling, stronger file-type scanning on uploads, content moderation, pagination on feeds/messages, and rate limiting/abuse controls beyond the basic ones already in place on auth routes.
