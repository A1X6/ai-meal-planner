import { Meal, NutritionTotals } from "./types";

export const calculateDailyTotals = (meals: Meal[]): NutritionTotals => {
  return meals.reduce(
    (totals: NutritionTotals, meal: Meal) => {
      return {
        calories: totals.calories + meal.calories,
      };
    },
    { calories: 0 }
  );
};
