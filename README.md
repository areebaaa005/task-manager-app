# Task Manager — MERN Stack

A fully responsive Task Manager application built with MongoDB, Express, React (Vite), Node.js and Tailwind CSS.

## Features

- **Auth** — signup/login with JWT, admin sign-up via a 6‑digit invite token
- **User Dashboard** — task totals, pending/in‑progress/completed counts, distribution pie chart, priority bar chart, recent tasks table
- **Task Management** — create, update, delete tasks with title, description, priority, due date
- **Automated Status Updates** — a task's status (Pending / In Progress / Completed) is derived automatically from its TODO checklist completion
- **Team Collaboration** — assign a task to multiple users via a picker modal
- **Priority & Progress Tracking** — Low/Medium/High priority badges, per‑task progress bars
- **Task Report Downloads (CSV)** — export all tasks, or a per‑user task summary
- **Attachments** — add/view file links on a task
- **Mobile Responsive UI** — works on desktop, tablet, and mobile, built with Tailwind CSS

## Project Structure

```
task-manager/
├── backend/          Express + MongoDB API
│   ├── config/        DB connection
│   ├── controllers/    Route handlers (auth, tasks, users)
│   ├── middleware/     JWT auth middleware
│   ├── models/         Mongoose schemas (User, Task)
│   ├── routes/          API routes
│   └── server.js
└── frontend/         React (Vite) + Tailwind CSS
    └── src/
        ├── api/          Axios instance
        ├── components/    Sidebar, TaskCard, modals, layout
        ├── context/       AuthContext (global user state)
        └── pages/         Login, Signup, Dashboard, ManageTasks, CreateTask, TaskDetails, TeamMembers
```

## Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB database (local install or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)

### 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/task-manager
JWT_SECRET=some_long_random_string
JWT_EXPIRES_IN=7d
ADMIN_INVITE_TOKEN=112233
CLIENT_URL=http://localhost:5173
```

Run the server:
```bash
npm run dev
```
The API will run at `http://localhost:5000`.

### 2. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
```

`.env`:
```
VITE_API_URL=http://localhost:5000/api
```

Run the dev server:
```bash
npm run dev
```
The app will run at `http://localhost:5173`.

### 3. Create your first account

1. Go to `http://localhost:5173/signup`.
2. To sign up as an **Admin** (who can create tasks, assign them, view team members, and download reports), enter the `ADMIN_INVITE_TOKEN` value from your backend `.env` (default `112233`) in the "Admin Invite Token" field.
3. Leave that field blank to sign up as a regular **team member** (who can only view/update tasks assigned to them).
