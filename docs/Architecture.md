# 🏗️ FitTrac Architecture

This document describes the overall architecture of the **FitTrac** application, including the frontend, backend, database, authentication flow, and request lifecycle.

---

# Architecture Overview

FitTrac follows the **MERN (MongoDB, Express.js, React, Node.js)** architecture.

```text
                    User
                     │
                     ▼
          React Frontend (Vite)
                     │
          HTTP Requests (Axios)
                     │
                     ▼
        Express.js REST API Server
                     │
        JWT Authentication Middleware
                     │
        Controllers (Business Logic)
                     │
                Mongoose ODM
                     │
                     ▼
             MongoDB Atlas
```

The frontend communicates with the backend through REST APIs. The backend validates requests, performs business logic, and stores or retrieves data from MongoDB.

---

# Technology Stack

## Frontend

- React
- Vite
- React Router DOM
- Axios
- CSS

### Responsibilities

- User Interface
- Routing
- API Requests
- Form Validation
- Dashboard
- State Management

---

## Backend

- Node.js
- Express.js

### Responsibilities

- REST API
- Authentication
- Business Logic
- Validation
- Database Operations
- Error Handling

---

## Database

- MongoDB Atlas
- Mongoose ODM

### Responsibilities

- Store Users
- Store Foods
- Store Meals
- Store Exercises

---

# Backend Folder Structure

```text
backend/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── foodController.js
│   ├── mealController.js
│   ├── dashboardController.js
│   └── exerciseController.js
│
├── middleware/
│   └── authMiddleware.js
│
├── models/
│   ├── User.js
│   ├── Food.js
│   ├── Meal.js
│   └── Exercise.js
│
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── foodRoutes.js
│   ├── mealRoutes.js
│   └── exerciseRoutes.js
│
├── data/
│   └── foods.js
│
├── utils/
│   └── generateToken.js
│
└── server.js
```

---

# Frontend Folder Structure

```text
frontend/
│
├── src/
│
├── components/
│
├── context/
│
├── hooks/
│
├── pages/
│
├── services/
│
├── assets/
│
├── App.jsx
│
└── main.jsx
```

---

# Authentication Flow

```text
User Login
     │
     ▼
POST /api/auth/login
     │
     ▼
Verify Email & Password
     │
     ▼
Generate JWT Token
     │
     ▼
Return Token
     │
     ▼
Store Token (Frontend)
     │
     ▼
Authorization Header
     │
     ▼
Protected APIs
```

Every protected request sends:

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

The backend verifies the token before allowing access to protected resources.

---

# Request Lifecycle

Example: Add Meal

```text
React Form
      │
      ▼
Axios POST Request
      │
      ▼
Express Route
      │
      ▼
Authentication Middleware
      │
      ▼
Meal Controller
      │
      ▼
Food Lookup
      │
      ▼
Nutrition Calculation
      │
      ▼
Save Meal
      │
      ▼
MongoDB
      │
      ▼
JSON Response
```

---

# Database Relationships

```text
          User
            │
      ┌─────┴─────┐
      │           │
      ▼           ▼
   Meals      Exercises
      │
      ▼
     Food
```

### Relationships

| From | To | Relationship |
|------|----|--------------|
| User | Meal | One-to-Many |
| User | Exercise | One-to-Many |
| Food | Meal | One-to-Many |

---

---

# Dashboard Architecture

The Dashboard acts as the application's analytics layer.

Instead of storing dashboard data, it calculates values dynamically using data from multiple collections.

```text
                User
                  │
        ┌─────────┴─────────┐
        │                   │
      Meals            Exercises
        │                   │
        ▼                   ▼
Calories Consumed     Calories Burned
        │                   │
        └─────────┬─────────┘
                  │
                  ▼
          Dashboard Controller
                  │
                  ▼
         Net Calories Calculation
                  │
                  ▼
           Dashboard Response
```

---

## Dashboard Responsibilities

The Dashboard Controller is responsible for:

- Fetching today's meals
- Fetching today's exercises
- Fetching today's water intake
- Calculating calories consumed
- Calculating calories burned
- Calculating net calories
- Calculating remaining calories
- Returning nutrition statistics

---

## Dashboard Formula

```text
Calories Consumed
        │
        ▼
Calories Burned
        │
        ▼
Net Calories

Net Calories = Consumed − Burned

Remaining Calories = Goal − Net Calories
```

The dashboard does not store calculated values in MongoDB. All values are generated dynamically when requested.

# Current Application Modules

## Authentication

- Register User
- Login User
- JWT Authentication
- Protected Routes

---

## User Management

- User Profile
- Fitness Goal
- Height
- Weight
- Age

---

## Food Management

- Food Database
- Food Search
- Nutrition Information

---

## Meal Tracking

- Add Meal
- View Meals
- Daily Nutrition Summary
- Macronutrient Calculation

---

## Exercise Tracking

- Add Exercise
- View Exercises
- Calories Burned
- Daily Exercise Summary

---

## Dashboard

Current Features

- Daily Calories
- Calories Burned
- Remaining Calories
- Macronutrient Summary
- Today's Meals
- Today's Exercises

---

# Security

FitTrac uses several security practices:

- Password hashing with bcrypt
- JWT Authentication
- Protected API routes
- Environment variables for secrets
- MongoDB Atlas authentication

---

# Scalability

The project follows a modular architecture.

Each feature is separated into:

- Model
- Controller
- Route
- Service (Frontend)
- Hook (Frontend)
- UI Components

This makes the project easy to maintain and extend.

---

# Future Architecture Enhancements

Planned improvements include:

- Water Tracking Module
- AI Meal Recommendations
- Weekly Analytics
- Monthly Reports
- Email Notifications
- Cloud Storage
- Docker Support
- CI/CD Pipeline
- Deployment on Render or Railway

---

# Architecture Summary

| Layer | Technology |
|--------|------------|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| Database | MongoDB Atlas |
| Authentication | JWT |
| Password Security | bcrypt |
| API Style | REST |
| Communication | Axios + JSON |
| Database ODM | Mongoose |

---

# Design Principles

The FitTrac architecture follows these principles:

- Modular folder structure
- Separation of concerns
- RESTful API design
- Reusable React components
- Secure authentication
- Scalable project organization
- Maintainable codebase
