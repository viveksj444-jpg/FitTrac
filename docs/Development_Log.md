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
# Day 15 — Water Tracker

## Goal

Implement a complete water intake tracking system to help users monitor their daily hydration.

## Completed Tasks

- Created Water schema
- Created Water model
- Implemented Water controller
- Created Water routes
- Added protected Water APIs
- Added Add Water functionality
- Added Get Water Entries functionality
- Implemented Daily Water Summary
- Connected Water module with User
- Integrated Water Tracker with Dashboard
- Tested all Water APIs using Postman

## APIs

### Add Water Entry

POST /api/water

### Get All Water Entries

GET /api/water

### Get Today's Water Summary

GET /api/water/today

## Files Created

Backend

- models/Water.js
- controllers/waterController.js
- routes/waterRoutes.js

Frontend

- pages/AddWater.jsx
- pages/AddWater.css
- hooks/useWater.js
- services/waterService.js
- components/dashboard/TodayWater.jsx
- components/dashboard/TodayWater.css

## Result

Users can:

- Add daily water intake
- View today's water entries
- Track total water consumed
- Monitor hydration progress
- Display water intake on the dashboard

## Challenges

- Implemented JWT-protected water routes
- Connected water data with authenticated users
- Calculated daily water totals
- Verified API responses using Postman

## Git Commit

```
Implement complete water tracking module
```
# Day 16 — Net Calories Dashboard

## Goal

Develop a centralized Dashboard that combines meal tracking, exercise tracking, and water tracking into a single daily health summary.

---

## Objectives

- Build Dashboard Controller
- Calculate Calories Consumed
- Calculate Calories Burned
- Calculate Net Calories
- Calculate Remaining Calories
- Display Daily Nutrition Summary
- Integrate Water Tracker
- Create Dashboard API

---

## Completed Tasks

### Backend

- Created Dashboard Controller
- Created Dashboard Routes
- Calculated Total Calories Consumed
- Calculated Total Calories Burned
- Calculated Net Calories
- Calculated Remaining Calories
- Calculated Today's Protein
- Calculated Today's Carbohydrates
- Calculated Today's Fat
- Calculated Today's Water Intake

### Frontend

- Dashboard Cards
- Nutrition Summary
- Today's Meals
- Today's Exercises
- Water Summary
- Net Calories Card
- Remaining Calories Card
- Daily Goal Card

---

## Formula Used

### Calories Consumed

```
Sum of all meal calories
```

### Calories Burned

```
Sum of all exercise calories
```

### Net Calories

```
Net Calories = Consumed − Burned
```

### Remaining Calories

```
Remaining = Daily Goal − Net Calories
```

---

## API

### Get Dashboard

```
GET /api/dashboard
```

---

## Files Created

Backend

```
controllers/dashboardController.js
routes/dashboardRoutes.js
```

Frontend

```
pages/Dashboard.jsx
pages/Dashboard.css

hooks/useDashboard.js

services/dashboardService.js

components/dashboard/
```

---

## Result

Users can now:

- View daily calorie goal
- View calories consumed
- View calories burned
- View net calories
- View remaining calories
- View water intake
- View macronutrients
- Monitor today's activity from a single dashboard

---

## Testing

Verified:

- Dashboard API
- JWT Authentication
- Meal calculations
- Exercise calculations
- Water calculations
- Net calorie calculations

---

## Git Commit

```
Implement Net Calories Dashboard
```

---

# Day 17 — Smart Nutrition Recommendations

## Goal

Develop an intelligent recommendation engine that analyzes the user's daily nutrition and provides personalized food and hydration suggestions.

---

## Objectives

- Build Recommendation Controller
- Analyze daily nutrition
- Compare intake against fitness goals
- Generate food recommendations
- Generate hydration tips
- Integrate recommendations with Dashboard

---

## Completed Tasks

### Backend

- Created Recommendation Controller
- Created Recommendation Routes
- Implemented Recommendation Engine
- Added JWT-protected Recommendation API
- Calculated nutrition totals
- Compared intake with daily goals
- Generated personalized suggestions

### Frontend

- Created Recommendations Page
- Created Recommendation Service
- Created useRecommendations Hook
- Created Recommendation Cards
- Added Nutrition Summary Cards
- Added Suggested Food Cards
- Integrated Recommendations into Dashboard

---

## Recommendation Categories

- Protein Recommendations
- Calorie Recommendations
- Carbohydrate Recommendations
- Fat Recommendations
- Hydration Recommendations
- Goal-Based Suggestions

---

## API

### Get Recommendations

```
GET /api/recommendations
```

---

## Files Created

### Backend

```
controllers/recommendationController.js
routes/recommendationRoutes.js
```

### Frontend

```
pages/Recommendations.jsx
pages/Recommendations.css

services/recommendationService.js

hooks/useRecommendations.js

components/recommendations/

RecommendationCard.jsx
NutritionSummary.jsx
FoodSuggestionCard.jsx
```

---

## Features Added

- Personalized food recommendations
- Goal-based nutrition analysis
- Protein suggestions
- Hydration reminders
- Healthy carbohydrate suggestions
- Healthy fat recommendations
- Dashboard quick access

---

## Testing

Verified:

- Recommendation API
- JWT Authentication
- Protein analysis
- Calorie analysis
- Water analysis
- Goal-based recommendation generation

---

## Result

Users can now:

- Receive personalized nutrition advice
- Identify nutritional deficiencies
- Improve hydration habits
- Follow recommendations based on their fitness goal
- View intelligent food suggestions from the dashboard

---

## Challenges

- Designing reusable recommendation rules
- Comparing nutrition against personalized targets
- Keeping recommendations dynamic and maintainable
- Integrating recommendation data with existing dashboard calculations

---

## Git Commit

```
Implement Smart Nutrition Recommendation module
```

---

# Day 18 — Weekly Analytics

## Goal

Develop a Weekly Analytics module that provides users with historical insights into their nutrition, exercise, hydration, and fitness progress over the last seven days.

---

## Objectives

- Build Weekly Analytics API
- Calculate daily nutrition statistics
- Calculate weekly averages
- Calculate net calories
- Measure goal completion
- Generate trend analysis
- Display charts and insights on the frontend

---

## Completed Tasks

### Backend

- Created Analytics Controller
- Created Analytics Routes
- Implemented Weekly Analytics API
- Aggregated Meal Data
- Aggregated Exercise Data
- Aggregated Water Data
- Calculated Daily Nutrition Totals
- Calculated Weekly Averages
- Calculated Goal Completion Percentage
- Generated Weekly Trends

### Frontend

- Created Weekly Analytics Page
- Created Analytics Service
- Created useWeeklyAnalytics Hook
- Added Weekly Summary Cards
- Added Daily Statistics Table
- Added Weekly Charts
- Added Weekly Insights Section

---

## Analytics Calculated

- Average Calories Consumed
- Average Calories Burned
- Average Net Calories
- Average Water Intake
- Average Protein
- Average Carbohydrates
- Average Fat
- Highest Calorie Day
- Lowest Calorie Day
- Most Active Day
- Least Active Day
- Weekly Goal Completion

---

## API

### Weekly Analytics

```
GET /api/analytics/weekly
```

---

## Files Created

### Backend

```
controllers/analyticsController.js
routes/analyticsRoutes.js
```

### Frontend

```
pages/WeeklyAnalytics.jsx
pages/WeeklyAnalytics.css

services/analyticsService.js

hooks/useWeeklyAnalytics.js

components/analytics/

WeeklySummaryCard.jsx
WeeklyCaloriesChart.jsx
WeeklyMacrosChart.jsx
WeeklyWaterChart.jsx
GoalCompletionCard.jsx
WeeklyInsights.jsx
```

---

## Features Added

- Seven-day analytics
- Daily nutrition tracking
- Weekly averages
- Goal completion tracking
- Net calorie trend
- Water intake trend
- Macronutrient trend
- Interactive charts
- Personalized weekly insights

---

## Testing

Verified:

- Weekly Analytics API
- JWT Authentication
- Daily aggregation
- Weekly averages
- Goal completion calculation
- Trend generation
- Empty dataset handling

---

## Result

Users can now:

- Analyze the previous seven days
- View daily calorie trends
- Track hydration progress
- Monitor macronutrient intake
- Identify their most and least active days
- Measure consistency with fitness goals
- Gain actionable weekly insights

---

## Challenges

- Aggregating data across multiple collections
- Handling days without activity
- Calculating accurate weekly averages
- Designing reusable analytics logic
- Preparing data for chart visualization

---

## Git Commit

```
Implement Weekly Analytics module
```

---

## Next Steps

- Monthly Analytics
- PDF Report Generation
- Dark Mode
- Deployment

## Next Steps

- Monthly Analytics
- PDF Reports
- Dark Mode
- Deployment


