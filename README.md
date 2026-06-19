# Calorie Tracker

Calorie Tracker is a modern, responsive, full-stack web application built using the MERN stack (MongoDB, Express, React, Node.js) with Vite.

This repository is structured as a monorepo containing both the frontend and backend of the application in separate directories.

## Project Structure

```text
calorie-tracker/
├── .gitignore             # Root gitignore rules
├── README.md              # Project documentation and setup instructions
├── frontend/              # React.js + Vite client application
└── backend/               # Node.js + Express.js API server
```

---

## Getting Started

### Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v16.x or higher recommended)
- [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas) or a local MongoDB instance

---

### Installation & Setup

#### 1. Clone & Initialize Git Repository
To initialize or clone the repository:
```bash
git init
git add .
git commit -m "Initial commit - Day 1 setup"
```

#### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Duplicate `.env.example` and rename it to `.env`.
   - Update the `MONGO_URI` with your MongoDB connection string and specify your desired `PORT` (default is `5000`).
4. Start the server:
   - For development (with hot-reloading):
     ```bash
     npm run dev
     ```
   - For production:
     ```bash
     npm start
     ```

#### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the client:
   ```bash
   npm run dev
   ```

---

## API Documentation (Day 1)

The backend exposes a health-check endpoint to verify the server and database status.

### Health Check
- **URL:** `/api/health`
- **Method:** `GET`
- **Response Status:** `200 OK`
- **Response Body:**
  ```json
  {
    "status": "ok",
    "message": "Server is running...",
    "database": "connected" // or "disconnected"
  }
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
