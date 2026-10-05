import { Category } from "../types/shop";
import { request } from "./client";

let categoriesPromise: Promise<Category[]> | null = null;

export function getCategories(): Promise<Category[]> {
  if (!categoriesPromise) {
    categoriesPromise = request<Category[]>("/categories").catch((err) => {
      categoriesPromise = null;
      throw err;
    });
  }
  return categoriesPromise;
}

export function resetCategoriesCache(): void {
  categoriesPromise = null;
}
