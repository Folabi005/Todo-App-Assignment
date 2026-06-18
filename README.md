# Todo Application Assessment

A simple Node.js todo app with user authentication, task states, and a clean EJS UI.

## Features

- User registration and login with secure password hashing
- User-specific tasks with access control
- Task states: `pending`, `completed`, `deleted`
- Filter tasks by status
- Global error handling with friendly error pages
- Structured logs with timestamps
- Simple responsive EJS frontend
- MongoDB backend with session persistence via `connect-mongo`

## Project Structure

- `app.js` — Express app setup and middleware
- `server.js` — MongoDB connection and server start
- `routes/` — Authentication and task routes
- `models/` — Mongoose models for `User` and `Task`
- `middleware/` — Authentication and error handling middleware
- `views/` — EJS templates
- `public/` — Simple CSS styles
- `tests/` — Jest / SuperTest test coverage

## ER Diagram

See `ER-DIAGRAM.md` for the relationship between users and tasks.

## Setup

1. Copy `.env.example` or create a `.env` file with:

```text
PORT=5000
MONGO_URI=<your MongoDB connection URI>
SESSION_SECRET=<your session secret>
```

2. Install dependencies:

```bash
npm install
```

3. Run in development:

```bash
npm run dev
```

4. Run tests:

```bash
npm test
```

## Deploying to Render

1. Push this repository to GitHub.
2. Create a new Web Service in Render.
3. Set the build command to `npm install` and the start command to `npm start`.
4. Add environment variables on Render: `MONGO_URI`, `SESSION_SECRET`, `PORT`.

## Notes

- Only authenticated users can view and modify their own tasks.
- Deleted tasks are soft deleted and excluded from the UI.
- The app is designed to keep the UI simple and easy to use.
