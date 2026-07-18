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

# 📊 Dashboard APIs

Dashboard-related endpoints.

(Currently under development)

---

## Get Dashboard Summary

### Endpoint

GET /dashboard

### Authentication

Required

### Status

🚧 In Development

---

# 🔒 Protected Routes

Protected routes require JWT authentication.

Example Header:

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

---

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
