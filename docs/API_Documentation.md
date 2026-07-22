# 🌐 FitTrac API Documentation

This document contains all backend API endpoints available in FitTrac.

Base URL:

http://localhost:5000/api

---

# 🔐 Authentication APIs

Authentication endpoints are used to register and login users.

---

## Register User

### Endpoint

POST /auth/register

### Authentication

Not Required

### Request Body

```json
{
  "name": "Vivek",
  "email": "vivek@gmail.com",
  "password": "123456",
  "height": 170,
  "weight": 70,
  "age": 22,
  "goal": "maintain"
}
```

### Success Response

```json
{
  "_id": "user_id",
  "name": "Vivek",
  "email": "vivek@gmail.com",
  "token": "jwt_token"
}
```

### Error Response

```json
{
  "message": "User already exists"
}
```

---

## Login User

### Endpoint

POST /auth/login

### Authentication

Not Required

### Request Body

```json
{
  "email": "vivek@gmail.com",
  "password": "123456"
}
```

### Success Response

```json
{
  "_id": "user_id",
  "name": "Vivek",
  "email": "vivek@gmail.com",
  "token": "jwt_token"
}
```

### Error Response

```json
{
  "message": "Invalid email or password"
}
```

---

# 👤 User APIs

User-related endpoints.

---

## Get User Profile

### Endpoint

GET /users/profile

### Authentication

Required

### Header

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

### Success Response

```json
{
  "_id": "user_id",
  "name": "Vivek",
  "email": "vivek@gmail.com"
}
```

---

# 🍎 Food APIs

Food database endpoints.

---

## Get All Foods

### Endpoint

GET /foods

### Authentication

Not Required

### Success Response

```json
[
  {
    "_id": "food_id",
    "foodName": "Banana",
    "calories": 105,
    "protein": 1.3,
    "carbs": 27,
    "fat": 0.3
  }
]
```

---

## Search Foods

### Endpoint

GET /foods?search=banana

### Authentication

Not Required

### Example

```http
GET /foods?search=banana
```

### Success Response

```json
[
  {
    "foodName": "Banana"
  }
]
```

---

# 🍽️ Meal APIs

Meal tracking endpoints.

All meal routes require authentication.

---

## Add Meal

### Endpoint

POST /meals

### Authentication

Required

### Header

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

### Request Body

```json
{
  "foodId": "food_id",
  "mealType": "breakfast",
  "quantity": 2
}
```

### Success Response

```json
{
  "_id": "meal_id",
  "mealType": "breakfast",
  "quantity": 2,
  "calories": 210
}
```

---

## Get All Meals

### Endpoint

GET /meals

### Authentication

Required

### Header

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

### Success Response

```json
{
  "success": true,
  "count": 1,
  "meals": []
}
```

---

## Get Today's Nutrition Summary

### Endpoint

GET /meals/today

### Authentication

Required

### Header

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

### Success Response

```json
{
  "success": true,
  "mealsCount": 1,
  "summary": {
    "totalCalories": 210,
    "totalProtein": 2.6,
    "totalCarbs": 54,
    "totalFat": 0.6
  }
}
```

---

# 🏃 Exercise APIs

Exercise tracking endpoints.

(Currently under development)

---

## Add Exercise

### Endpoint

POST /exercises

### Authentication

Required

### Status

🚧 In Development

---

## Get Exercises

### Endpoint

GET /exercises

### Authentication

Required

### Status

🚧 In Development

---

# 💧Water Tracker API

## APIs Implemented

### Add Water Entry

POST /api/water

Description:

Adds a new water intake entry for the authenticated user.

Authentication:

Required

Example Request

```json
{
  "amount": 500
}
```

### Get Today's Water Summary

GET /api/water/today

Description:

Returns today's total water intake along with the number of entries logged.

Authentication:

Required

Example Response

```json
{
  "success": true,
  "entries": 4,
  "totalWater": 2000
}
```

# 📊 Dashboard APIs

The Dashboard module aggregates meal, exercise, and user data to provide a daily nutrition overview.

All dashboard routes require JWT authentication.

---

## Get Net Calories Dashboard

### Endpoint

GET /dashboard

### Authentication

Required

### Header

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

---

### Description

Returns the user's daily calorie dashboard including:

- Daily Goal
- Calories Consumed
- Calories Burned
- Net Calories
- Remaining Calories
- Macronutrient Summary
- Today's Meals
- Today's Exercises
- Today's Water Intake

---

### Success Response

```json
{
  "success": true,
  "dashboard": {
    "dailyGoal": 2500,
    "consumed": 1850,
    "burned": 420,
    "netCalories": 1430,
    "remaining": 1070,

    "protein": 98,
    "carbs": 210,
    "fat": 52,

    "water": 2500,

    "mealsToday": 5,
    "exercisesToday": 2
  }
}
```

---

## Dashboard Calculations

### Net Calories

```
Net Calories = Calories Consumed − Calories Burned
```

### Remaining Calories

```
Remaining = Daily Goal − Net Calories
```

---

# 🥗 Smart Nutrition Recommendation APIs

The Smart Recommendation module analyzes the user's daily nutrition and provides personalized food and hydration suggestions.

All recommendation routes require JWT authentication.

---

## Get Smart Recommendations

### Endpoint

GET /api/recommendations

### Authentication

Required

### Header

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

---

### Description

Analyzes today's nutrition and returns intelligent recommendations based on:

- Calories consumed
- Protein intake
- Carbohydrates
- Fat intake
- Water intake
- User fitness goal

---

### Recommendation Rules

#### Protein

If protein intake is below the daily target:

Suggested Foods:

- Chicken Breast
- Eggs
- Paneer
- Greek Yogurt
- Fish
- Tofu
- Soya Chunks
- Whey Protein

---

#### Calories

If calories are below target:

Suggestions

- Eat another balanced meal
- Increase complex carbohydrates
- Increase lean protein intake

If calories exceed target:

Suggestions

- Reduce calorie intake
- Avoid sugary beverages
- Increase physical activity

---

#### Carbohydrates

Low carbohydrate intake:

Suggestions

- Brown Rice
- Oats
- Sweet Potato
- Whole Wheat Bread

---

#### Fat

High fat intake:

Suggestions

- Reduce fried foods
- Use healthy oils
- Prefer grilled food

---

#### Water

Low hydration:

Suggestions

- Drink more water
- Consume water-rich fruits
- Maintain hydration throughout the day

---

### Success Response

```json
{
  "success": true,
  "summary": {
    "goal": "maintain",
    "calories": 1850,
    "protein": 82,
    "carbs": 210,
    "fat": 48,
    "water": 2200
  },
  "recommendations": [
    {
      "type": "protein",
      "title": "Increase Protein Intake",
      "description": "Consume approximately 20g more protein today.",
      "foods": [
        "Chicken Breast",
        "Eggs",
        "Paneer",
        "Greek Yogurt"
      ]
    }
  ]
}
```

---

## Status Codes

| Code | Description |
|------|-------------|
|200|Recommendations Generated|
|401|Unauthorized|
|500|Server Error|

## HTTP Status Codes

| Code | Description |
|------|-------------|
|200|Dashboard Loaded|
|401|Unauthorized|
|500|Server Error|


# 🔒 Protected Routes

Protected routes require JWT authentication.

Example Header:

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

---

# 📈 Weekly Analytics APIs

The Weekly Analytics module provides a comprehensive overview of the user's fitness and nutrition data for the previous seven days.

All analytics routes require JWT authentication.

---

## Get Weekly Analytics

### Endpoint

GET /api/analytics/weekly

### Authentication

Required

### Header

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## Description

Returns weekly statistics including:

- Daily Calories Consumed
- Daily Calories Burned
- Net Calories
- Protein Intake
- Carbohydrates Intake
- Fat Intake
- Water Intake
- Goal Completion
- Weekly Trends
- Weekly Summary

---

## Success Response

```json
{
  "success": true,
  "summary": {
    "averageCalories": 2140,
    "averageBurned": 430,
    "averageNetCalories": 1710,
    "averageWater": 2450,
    "averageProtein": 112,
    "averageCarbs": 236,
    "averageFat": 58,
    "goalCompletion": 86,
    "highestCalorieDay": "Wednesday",
    "lowestCalorieDay": "Sunday",
    "mostActiveDay": "Friday",
    "leastActiveDay": "Monday",
    "totalMeals": 31,
    "totalExercises": 8
  },
  "dailyData": [
    {
      "day": "Monday",
      "consumed": 2200,
      "burned": 450,
      "net": 1750,
      "protein": 110,
      "carbs": 230,
      "fat": 55,
      "water": 2500
    }
  ]
}
```

---

## Analytics Calculations

Average Calories

```
Total Weekly Calories ÷ 7
```

Average Calories Burned

```
Total Weekly Burned ÷ 7
```

Net Calories

```
Calories Consumed − Calories Burned
```

Goal Completion

```
(Number of Goal Achieved Days ÷ 7) × 100
```

---

## HTTP Status Codes

| Code | Description |
|------|-------------|
|200|Weekly Analytics Generated|
|401|Unauthorized|
|404|No Weekly Data Found|
|500|Internal Server Error|

# 📌 HTTP Status Codes

| Code | Meaning |
|--------|----------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
| 500 | Server Error |

---

# 🚀 Future APIs

Planned endpoints:

- Water Tracker
- Weekly Reports
- Monthly Reports
- Goal Progress
- AI Food Suggestions
- PDF Reports
