const foods = [
  {
    name: "Banana",
    category: "Fruit",
    unitType: "piece",

    sizes: {
      small: {
        calories: 72,
        protein: 0.9,
        carbs: 18.5,
        fat: 0.2
      },

      medium: {
        calories: 105,
        protein: 1.3,
        carbs: 27,
        fat: 0.3
      },

      large: {
        calories: 121,
        protein: 1.5,
        carbs: 31,
        fat: 0.4
      }
    }
  },

  {
    name: "Milk",
    category: "Dairy",
    unitType: "volume",

    nutritionPer100: {
      calories: 61,
      protein: 3.2,
      carbs: 4.8,
      fat: 3.3
    }
  },

  {
    name: "Rice",
    category: "Grain",
    unitType: "gram",

    nutritionPer100: {
      calories: 130,
      protein: 2.7,
      carbs: 28,
      fat: 0.3
    }
  },

  {
    name: "Soya Chunks",
    category: "Protein",
    unitType: "gram",

    nutritionPer100: {
      calories: 345,
      protein: 52,
      carbs: 33,
      fat: 0.5
    }
  },

  {
    name: "Peanut",
    category: "Nut",
    unitType: "gram",

    nutritionPer100: {
      calories: 567,
      protein: 26,
      carbs: 16,
      fat: 49
    }
  },

  {
    name: "Moong Dal",
    category: "Pulse",
    unitType: "gram",

    nutritionPer100: {
      calories: 347,
      protein: 24,
      carbs: 63,
      fat: 1.2
    }
  },

  {
    name: "Dal Tadka",
    category: "Indian Food",
    unitType: "serving",

    servings: [
        {
        name: "Cup",
        capacity: "250 ml",

        calories: 180,
        protein: 8,
        carbs: 25,
        fat: 4
        },

        {
        name: "Bowl",
        capacity: "250 g",

        calories: 220,
        protein: 10,
        carbs: 30,
        fat: 5
        }
    ]
    },

  {
  name: "Cooked Rice",
  category: "Indian Food",
  unitType: "serving",

  servings: [
    {
      name: "1 Katori",
      capacity: "150 g",

      calories: 195,
      protein: 4,
      carbs: 42,
      fat: 0.4
    },

    {
      name: "2 Katori",
      capacity: "300 g",

      calories: 390,
      protein: 8,
      carbs: 84,
      fat: 0.8
    },

    {
      name: "Plate",
      capacity: "450 g",

      calories: 585,
      protein: 12,
      carbs: 126,
      fat: 1.2
    }
  ]
}
];

module.exports = foods;