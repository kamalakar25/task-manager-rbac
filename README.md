# Task Manager with Role-Based Access

A MERN stack assignment that delivers JWT-backed authentication, role-aware task management, and a minimal React dashboard for both end-users and admins.

## Tech Stack

- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT, bcrypt, Joi
- **Frontend:** React (Vite), React Router, Axios

## Features

- User registration/login with hashed passwords and JWT sessions
- Role support (`user`, `admin`)
- Users manage only their own tasks (CRUD)
- Admins can view/delete any task
- Task metadata: title, description, status, timestamps, creator
- Dashboard with filters (status/search) and pagination
- Protected client routes + token stored in `localStorage`

## Project Structure

```
task-manager-rbac/
├── backend/        # Express API + MongoDB models
├── frontend/       # React single-page app
└── README.md
```

## Prerequisites

- Node.js 20+
- MongoDB running locally or in the cloud

## Backend Setup (`/backend`)

1. Install dependencies
   ```bash
   cd backend
   npm install
   ```
2. Configure environment variables by copying `env.example` to `.env` (same keys):
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017
   MONGO_DB_NAME=task_manager_rbac
   JWT_SECRET=supersecretkey
   JWT_EXPIRES_IN=7d
   ```
3. Start the API
   ```bash
   npm run dev
   ```

## Frontend Setup (`/frontend`)

1. Install dependencies
   ```bash
   cd frontend
   npm install
   ```
2. Copy `env.example` to `.env` if you need to override the default API URL.
3. Start the React dev server
   ```bash
   npm run dev
   ```
4. Visit the printed Vite URL (default: `http://localhost:5173`).

## API Overview

| Method | Route             | Description                        | Auth |
| ------ | ----------------- | ---------------------------------- | ---- |
| POST   | `/api/register`   | Register a user/admin              | ❌   |
| POST   | `/api/login`      | Login and receive JWT              | ❌   |
| POST   | `/api/tasks`      | Create a task                      | ✅   |
| GET    | `/api/tasks`      | List tasks (admin sees all)        | ✅   |
| GET    | `/api/tasks/:id`  | Fetch a single task (RBAC enforced)| ✅   |
| PUT    | `/api/tasks/:id`  | Update own task (admin = any)      | ✅   |
| DELETE | `/api/tasks/:id`  | Delete own task (admin = any)      | ✅   |

> All protected routes expect `Authorization: Bearer <token>`.

## Testing Tips

- Use a tool like Postman to verify auth + task endpoints.
- Create both a `user` and an `admin` via `/api/register` to explore role differences.
- Frontend will automatically include JWT from `localStorage` via Axios interceptor.

## Notes & Future Enhancements

- Swap MongoDB URI for Atlas/Compose in production.
- Extend pagination & filtering to include date ranges or role filters.
- Add automated tests (Jest + React Testing Library / Supertest) for more confidence.

Happy hacking! 🎯


