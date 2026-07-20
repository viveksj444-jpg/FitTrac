# Calorie Tracker

Calorie Tracker is a modern, responsive, full-stack web application built using the MERN stack (MongoDB, Express, React, Node.js) with Vite.

This repository is structured as a monorepo containing both the frontend and backend of the application in separate directories.

## Project Structure

```text
FitTrac
│
├── backend
│   ├── config
│   ├── controllers
│   ├── data
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── scripts
│   ├── utils
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── context
│   │   ├── hooks
│   │   ├── pages
│   │   ├── services
│   │   └── assets
│   ├── package.json
│   └── vite.config.js
│
├── docs
│   ├── API_Documentation.md
│   ├── Database_Design.md
│   ├── Development_Log.md
│   ├── Architecture.md
│   ├── Testing.md
│   └── screenshots
│
├── README.md
└── LICENSE
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/viveksj444-jpg/FitTrac.git
```

Move into the project directory.

```bash
cd FitTrac
```

---

## Backend Setup

Move to the backend folder.

```bash
cd backend
```

Install dependencies.

```bash
npm install
```

Create a `.env` file.

```env
PORT=5000

MONGO_URI=YOUR_MONGODB_CONNECTION_STRING

JWT_SECRET=YOUR_SECRET_KEY
```

Run the backend server.

```bash
npm run dev
```

---

## Frontend Setup

Move to the frontend folder.

```bash
cd frontend
```

Install dependencies.

```bash
npm install
```

Run the frontend.

```bash
npm run dev
```

---

# 🔐 Authentication

The backend uses JSON Web Tokens (JWT).

Protected APIs require the following header.

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## GitHub Repository Setup Instructions

If you want to push this project to a new repository on GitHub, run the following commands in the root directory:

```bash
# Rename the default branch to main
git branch -M main

# Add your GitHub remote repository (replace with your repository URL)
git remote add origin https://github.com/YOUR_USERNAME/calorie-tracker.git

# Push the initial commit to main branch
git push -u origin main
```
