# 📅 FitTrac Development Log

This document tracks the day-by-day progress of the FitTrac project.

Each development day records:
- Goals
- Features completed
- Files created or modified
- APIs implemented
- Challenges encountered
- Git commit message

---

# Day 1 — Project Initialization

## Goal

Set up the project structure and development environment.

## Completed Tasks

- Created GitHub repository
- Initialized Git repository
- Created frontend using Vite
- Created backend using Node.js and Express
- Installed required dependencies
- Configured project folder structure
- Created README.md
- Configured .gitignore

## Backend

- Express server created
- Basic server running
- CORS enabled
- JSON middleware added

## Frontend

- React + Vite initialized
- Development server running

## Files Created

Backend

- server.js
- package.json

Frontend

- Vite project files

## Git Commit

```
Initial project setup
```

---

# Day 2 — MongoDB Connection

## Goal

Connect backend to MongoDB Atlas.

## Completed Tasks

- Created MongoDB Atlas cluster
- Added database user
- Configured IP whitelist
- Added MONGO_URI
- Connected Express server to MongoDB

## Files Created

- config/db.js
- .env

## Result

Backend successfully connected to MongoDB Atlas.

## Git Commit

```
Connect backend to MongoDB Atlas
```

---

# Day 3 — User Model

## Goal

Create User database schema.

## Completed Tasks

- Created User model
- Added validation
- Configured timestamps

## User Fields

- name
- email
- password
- height
- weight
- age
- goal

## Files Created

- models/User.js

## Git Commit

```
Create User model
```

---

# Day 4 — User Registration

## Goal

Implement user registration.

## Completed Tasks

- Register controller
- Register route
- Password hashing using bcrypt
- Duplicate email validation

## API

POST /api/auth/register

## Files Modified

- authController.js
- authRoutes.js

## Git Commit

```
Implement user registration API
```

---

# Day 5 — User Login

## Goal

Implement login functionality.

## Completed Tasks

- Login controller
- Password verification
- JWT generation

## API

POST /api/auth/login

## Files Modified

- authController.js
- generateToken.js

## Git Commit

```
Implement login API
```

---

# Day 6 — Authentication Middleware

## Goal

Protect private routes.

## Completed Tasks

- JWT verification
- Authentication middleware
- User identification

## Files Created

- middleware/authMiddleware.js

## Result

Protected APIs require:

Authorization: Bearer TOKEN

## Git Commit

```
Implement JWT authentication middleware
```

---

# Day 7 — User Profile

## Goal

Create user profile endpoints.

## Completed Tasks

- Protected profile route
- Fetch logged-in user information

## API

GET /api/users/profile

## Files Modified

- userController.js
- userRoutes.js

## Git Commit

```
Add user profile API
```

---

# Day 8 — Food Database

## Goal

Design the food database.

## Completed Tasks

- Created Food schema
- Planned nutrition fields
- Started food collection design

## Git Commit

```
Create Food model
```

---

# Day 9 — Food APIs

## Goal

Implement food search functionality.

## Completed Tasks

- Food controller
- Food routes
- Search by keyword

## APIs

GET /api/foods

GET /api/foods?search=banana

## Git Commit

```
Implement food search API
```

---

# Day 10 — Food Seeding

## Goal

Populate the food database.

## Completed Tasks

- Created foods.js
- Created seedFoods.js
- Imported food records into MongoDB

## Result

Food database successfully populated.

## Git Commit

```
Seed food database
```

---

# Day 11 — Meal Model

## Goal

Create meal tracking system.

## Completed Tasks

- Created Meal schema
- Linked Meal with User
- Linked Meal with Food

## Git Commit

```
Create Meal model
```

---

# Day 12 — Meal APIs

## Goal

Implement meal tracking APIs.

## Completed Tasks

- Add Meal API
- Get Meals API
- Nutrition calculation

## APIs

POST /api/meals

GET /api/meals

## Git Commit

```
Implement meal tracking APIs
```

---

# Day 13 — Daily Nutrition Summary

## Goal

Calculate today's nutrition totals.

## Completed Tasks

- Daily calories
- Protein
- Carbs
- Fat summary

## API

GET /api/meals/today

## Git Commit

```
Add daily nutrition summary API
```

---

# Day 14 — Exercise Tracking

## Goal

Implement a complete exercise tracking system to record workouts and calculate calories burned.

## Completed Tasks

- Created Exercise schema
- Created Exercise model
- Implemented Exercise controller
- Created Exercise routes
- Added protected Exercise APIs
- Added Add Exercise functionality
- Added Get Exercises functionality
- Calculated calories burned
- Connected Exercise module with User
- Tested all Exercise APIs using Postman
- Integrated Exercise Tracking with Dashboard

## APIs

### Add Exercise

POST /api/exercises

### Get All Exercises

GET /api/exercises

### Get Today's Exercise Summary

GET /api/exercises/today

## Files Created

Backend

- models/Exercise.js
- controllers/exerciseController.js
- routes/exerciseRoutes.js

Frontend

- pages/AddExercise.jsx
- pages/AddExercise.css
- hooks/useExercises.js
- services/exerciseService.js
- components/dashboard/TodayExercises.jsx
- components/dashboard/TodayExercises.css

## Result

Users can:

- Add daily exercises
- View logged exercises
- Track calories burned
- Display today's exercises on the dashboard

## Challenges

- Implemented JWT-protected exercise routes
- Connected exercise data with the authenticated user
- Verified API responses using Postman

## Git Commit

```
Implement complete exercise tracking module
```
## 💧 Water Tracker

- Add Daily Water Intake
- View Today's Water Consumption
- Track Water Intake Progress
- Daily Hydration Goal
- Quick Add Water (250ml, 500ml, 750ml, 1L)
- Delete Water Entries
- Dashboard Water Summary
