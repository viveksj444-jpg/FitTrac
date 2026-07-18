# 🏋️ FitTrac

FitTrac is a full-stack calorie tracking web application built using the **MERN Stack (MongoDB, Express.js, React, Node.js)**. It helps users monitor their daily nutrition, track meals, calculate calories consumed, log exercises, and work toward their fitness goals.

The project is being developed step by step to demonstrate full-stack development concepts, REST API design, authentication, database modeling, and frontend–backend integration.

---

# ✨ Features

## 🔐 Authentication

- User Registration
- User Login
- JWT Authentication
- Password Encryption using bcrypt
- Protected Routes

---

## 🍎 Food Database

- Food Search
- Nutrition Information
- Calories
- Protein
- Carbohydrates
- Fat
- Seeded Food Database

---

## 🍽️ Meal Tracking

- Add Meal
- View Meals
- Daily Nutrition Summary
- Automatic Nutrition Calculation
- Calories Tracking

---

## 🏃 Exercise Tracking

- Add Exercise
- Track Calories Burned
- Exercise History

*(Currently under development)*

---

## 📊 Dashboard

- Daily Calories
- Daily Protein
- Carbs
- Fat
- Calories Burned
- Remaining Calories

*(Currently under development)*

---

# 🚀 Project Status

## ✅ Completed

- Project Setup
- Express Server
- MongoDB Atlas Connection
- User Authentication
- JWT Authorization
- User Model
- Food Model
- Meal Model
- Food Database
- Meal APIs
- Daily Nutrition Summary API

## 🚧 In Progress

- Exercise Tracking
- Dashboard Integration
- Frontend Integration

## 📌 Planned

- Weekly Reports
- Monthly Reports
- Water Tracker
- AI Meal Suggestions
- PDF Reports
- Deployment

---

# 🛠 Tech Stack

## Frontend

- React
- Vite
- React Router
- Axios
- CSS

## Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- bcryptjs

## Development Tools

- Git
- GitHub
- VS Code
- Postman

---

# 📂 Project Structure

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

# 📚 Documentation

Detailed documentation is available in the **docs** folder.

- API Documentation
- Database Design
- Development Log
- Architecture
- Testing Guide

---

# 🖼️ Screenshots

Screenshots will be added as the project progresses.

- Login Page
- Register Page
- Dashboard
- Add Meal
- Exercise Tracker

---

# 🛣️ Development Roadmap

## Phase 1

- ✅ Authentication

## Phase 2

- ✅ Food Database

## Phase 3

- ✅ Meal Tracking

## Phase 4

- 🚧 Exercise Tracking

## Phase 5

- 🚧 Dashboard

## Phase 6

- Analytics & Reports

## Phase 7

- Deployment

---

# 🎯 Learning Objectives

This project demonstrates:

- REST API Development
- MongoDB Data Modeling
- JWT Authentication
- Password Hashing
- CRUD Operations
- React Hooks
- Frontend–Backend Integration
- State Management
- Git & GitHub Workflow

---

# 🚀 Future Enhancements

- Water Intake Tracker
- AI Food Recommendation
- Barcode Scanner
- Weekly Analytics
- Monthly Analytics
- Goal Progress
- Weight Tracking
- Dark Mode
- Responsive Improvements
- PDF Reports
- Cloud Deployment

---

# 👨‍💻 Author

**Vivek**

GitHub: https://github.com/viveksj444-jpg

LinkedIn: *(Add your LinkedIn profile)*

---

# 📄 License

This project is licensed under the MIT License.