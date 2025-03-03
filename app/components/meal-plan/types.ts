export interface Meal {
  type: string;
  name: string;
  calories: number;
  description: string;
}

export interface DayPlan {
  day: string;
  meals: Meal[];
}

export interface NutritionTotals {
  calories: number;
}

export interface Preferences {
  dietType: string;
  calorieTarget: number;
  allergies: string[];
  excludedIngredients: string[];
}

export interface MealPlanResponse {
  mealPlan?: {
    [day: string]: {
      [meal: string]: { ingredients: string; calories: number };
    };
  };
  usage?: {
    count: number;
    limit: number | null;
    isSubscribed: boolean;
  };
  error?: string;
  limitReached?: boolean;
}

export interface SavedMealPlan {
  id: string;
  userId: string;
  name: string;
  mealPlanData: DayPlan[];
  createdAt: string;
  updatedAt: string;
}

export const dietTypes = [
  { value: "balanced", label: "Balanced" },
  { value: "low-carb", label: "Low Carb" },
  { value: "keto", label: "Keto" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "paleo", label: "Paleo" },
  { value: "mediterranean", label: "Mediterranean" },
];

export const allergyOptions = [
  { value: "dairy", label: "Dairy" },
  { value: "egg", label: "Eggs" },
  { value: "gluten", label: "Gluten" },
  { value: "grain", label: "Grain" },
  { value: "peanut", label: "Peanuts" },
  { value: "seafood", label: "Seafood" },
  { value: "sesame", label: "Sesame" },
  { value: "shellfish", label: "Shellfish" },
  { value: "soy", label: "Soy" },
  { value: "tree-nut", label: "Tree Nuts" },
  { value: "wheat", label: "Wheat" },
];
