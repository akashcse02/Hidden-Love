# SocialHub Full Stack

Instagram-style social website for learning: registration, email verification code, bcrypt password hashing, JWT login, MongoDB, MongoDB GridFS media, image/video posts, likes, comments, follow/search, and real-time one-to-one Socket.IO chat.

## Backend
cd backend
npm install
npm run dev

Uses `mongodb://localhost:27017/socialapp` from `.env`.

## Frontend
cd frontend
npm install
npm run dev

Open http://localhost:5173

## Verification
Register in the website. The 6-digit verification code is printed in the backend terminal for local testing. Enter it, then login.

## Postman
POST /api/auth/register JSON: {"name":"Akash","username":"akash01","email":"akash@example.com","password":"pass1234"}
POST /api/auth/verify-email JSON: {"email":"akash@example.com","code":"123456"}
POST /api/auth/login JSON: {"email":"akash@example.com","password":"pass1234"}
Use `Authorization: Bearer TOKEN` for protected routes.

Media is stored in MongoDB GridFS, not in a local uploads folder.

For production add HTTPS, real SMTP email delivery, refresh-token/session management, stronger file scanning, moderation, pagination, and abuse controls.
