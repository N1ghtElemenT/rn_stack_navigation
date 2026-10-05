import { create } from "zustand";
import { getCategories, resetCategoriesCache } from "../api/categories";
import { Category } from "../types/shop";

interface CategoriesStore {
  categories: Category[];
  loading: boolean;
  error: string | null;
  loaded: boolean;
  load: () => Promise<void>;
  reload: () => Promise<void>;
}

export const useCategoriesStore = create<CategoriesStore>((set, get) => ({
  categories: [],
  loading: true,
  error: null,
  loaded: false,

  load: async () => {
    if (get().loaded) return;

    set({ loading: true, error: null });
    try {
      const categories = await getCategories();
      set({ categories, loading: false, loaded: true });
    } catch (err) {
      console.error("Failed to load categories:", err);
      set({
        loading: false,
        error:
          err instanceof Error ? err.message : "Failed to load categories",
      });
    }
  },

  reload: async () => {
    resetCategoriesCache();
    set({ loaded: false, loading: true, error: null });
    await get().load();
  },
}));
