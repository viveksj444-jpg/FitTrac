# 🗄️ Database Design

This document describes the MongoDB database schema used in **FitTrac**.

The application uses **MongoDB Atlas** as the database and **Mongoose** as the ODM (Object Data Modeling) library.

---

# Database Overview

Current Collections:

- Users
- Foods
- Meals
- Exercises

Relationship Diagram

```text
User
 │
 ├──────────────┐
 │              │
 │              │
Meals      Exercises
 │
 │
Food
```

A single user can have multiple meals and multiple exercises.

Each meal references one food item from the food database.

---

# User Collection

Collection Name

```
users
```

Purpose

Stores user account information and fitness profile.

Schema

| Field | Type | Required | Description |
|------|------|----------|-------------|
| name | String | ✅ | User's full name |
| email | String | ✅ | Unique email address |
| password | String | ✅ | Hashed password |
| height | Number | ✅ | Height in centimeters |
| weight | Number | ✅ | Weight in kilograms |
| age | Number | ✅ | User age |
| goal | String | ✅ | Fitness goal |
| createdAt | Date | Auto | Record creation time |
| updatedAt | Date | Auto | Last update time |

Example Document

```json
{
  "_id": "...",
  "name": "Vivek",
  "email": "vivek@gmail.com",
  "password": "Encrypted Password",
  "height": 170,
  "weight": 70,
  "age": 22,
  "goal": "maintain"
}
```

---

# Food Collection

Collection Name

```
foods
```

Purpose

Stores nutritional information for all available food items.

Schema

| Field | Type | Required | Description |
|------|------|----------|-------------|
| foodName | String | ✅ | Name of food |
| calories | Number | ✅ | Calories per serving |
| protein | Number | ✅ | Protein (g) |
| carbs | Number | ✅ | Carbohydrates (g) |
| fat | Number | ✅ | Fat (g) |
| createdAt | Date | Auto | Record creation time |
| updatedAt | Date | Auto | Last update time |

Example Document

```json
{
  "_id": "...",
  "foodName": "Banana",
  "calories": 105,
  "protein": 1.3,
  "carbs": 27,
  "fat": 0.3
}
```

---

# Meal Collection

Collection Name

```
meals
```

Purpose

Stores every meal logged by a user.

Each meal belongs to one user and references one food item.

Schema

| Field | Type | Required | Description |
|------|------|----------|-------------|
| user | ObjectId | ✅ | Reference to User |
| food | ObjectId | ✅ | Reference to Food |
| mealType | String | ✅ | breakfast, lunch, dinner, snack |
| quantity | Number | ✅ | Quantity consumed |
| calories | Number | Auto | Calculated calories |
| protein | Number | Auto | Calculated protein |
| carbs | Number | Auto | Calculated carbs |
| fat | Number | Auto | Calculated fat |
| createdAt | Date | Auto | Record creation time |
| updatedAt | Date | Auto | Last update time |

Example Document

```json
{
  "_id": "...",
  "user": "USER_ID",
  "food": "FOOD_ID",
  "mealType": "breakfast",
  "quantity": 2,
  "calories": 210,
  "protein": 2.6,
  "carbs": 54,
  "fat": 0.6
}
```

---

# Exercise Collection

Collection Name

```
exercises
```

Purpose

Stores exercise records performed by users.

Schema

| Field | Type | Required | Description |
|------|------|----------|-------------|
| user | ObjectId | ✅ | Reference to User |
| exerciseName | String | ✅ | Exercise name |
| duration | Number | ✅ | Duration in minutes |
| caloriesBurned | Number | ✅ | Calories burned |
| createdAt | Date | Auto | Record creation time |
| updatedAt | Date | Auto | Last update time |

Example Document

```json
{
  "_id": "...",
  "user": "USER_ID",
  "exerciseName": "Running",
  "duration": 30,
  "caloriesBurned": 320
}
```

> **Note:** The Exercise module is currently under development. The schema may evolve as new features are added.

---

# Water Collection

Collection Name

```
waters
```

Fields

| Field | Type | Description |
|--------|------|-------------|
| user | ObjectId | Reference to User |
| amount | Number | Water consumed (ml) |
| createdAt | Date | Entry creation time |
| updatedAt | Date | Last update time |

---

# Collection Relationships

```text
User (1)
│
├───────────────< Meal (Many)
│                     │
│                     │
│                     ▼
│                  Food (1)
│
└───────────────< Exercise (Many)
```

Relationship Summary

| Collection | Relationship |
|------------|--------------|
| User → Meal | One-to-Many |
| User → Exercise | One-to-Many |
| Food → Meal | One-to-Many |

---

# Database Indexes

Current Indexes

| Collection | Indexed Field | Purpose |
|------------|--------------|---------|
| Users | email | Prevent duplicate accounts |
| Foods | foodName | Prevent duplicate food items |

Additional indexes may be added later to improve search performance.

---

# Future Database Enhancements

Planned collections:

- Water Intake
- Weight History
- Weekly Reports
- Monthly Reports
- Goals
- Notifications
- AI Recommendations

---

# Database Summary

| Collection | Status |
|------------|--------|
| Users | ✅ Implemented |
| Foods | ✅ Implemented |
| Meals | ✅ Implemented |
| Exercises | 🚧 In Progress |
| Water Intake | 📅 Planned |
| Reports | 📅 Planned |
| Goals | 📅 Planned |
