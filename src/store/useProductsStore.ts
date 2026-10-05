import { create } from "zustand";
import { getProducts, resetProductsCache } from "../api/products";
import { Product } from "../types/shop";

interface ProductsStore {
  products: Product[];
  loading: boolean;
  error: string | null;
  loaded: boolean;
  load: () => Promise<void>;
  reload: () => Promise<void>;
}

export const useProductsStore = create<ProductsStore>((set, get) => ({
  products: [],
  loading: true,
  error: null,
  loaded: false,

  load: async () => {
    if (get().loaded) return;

    set({ loading: true, error: null });
    try {
      const products = await getProducts();
      set({ products, loading: false, loaded: true });
    } catch (err) {
      console.error("Failed to load products:", err);
      set({
        loading: false,
        error:
          err instanceof Error ? err.message : "Failed to load products",
      });
    }
  },

  reload: async () => {
    resetProductsCache();
    set({ loaded: false, loading: true, error: null });
    await get().load();
  },
}));
