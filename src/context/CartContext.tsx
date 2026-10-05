import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  createCartEntry,
  deleteCartEntry,
  fetchCart,
  patchCartEntry,
} from "../api/cart";
import { CartEntry, Product } from "../types/shop";
import { getUserId } from "../utils/userId";

interface CartContextType {
  items: CartEntry[];
  cartCount: number;
  loading: boolean;
  error: string | null;
  reload: () => void;
  addToCart: (product: Product, size: string, color: string) => Promise<void>;
  updateQuantity: (entryId: string, quantity: number) => Promise<void>;
}

const CartContext = createContext<CartContextType>({
  items: [],
  cartCount: 0,
  loading: true,
  error: null,
  reload: () => {},
  addToCart: async () => {},
  updateQuantity: async () => {},
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [items, setItems] = useState<CartEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);

      try {
        const id = await getUserId();
        if (cancelled) return;
        setUserId(id);

        const data = await fetchCart(id);
        if (cancelled) return;
        setItems(data);
      } catch (err) {
        console.error("Failed to load cart:", err);
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load cart",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [version]);

  const reload = useCallback(() => {
    setVersion((v) => v + 1);
  }, []);

  const updateQuantity = useCallback(
    async (entryId: string, quantity: number) => {
      const previous = items;

      if (quantity <= 0) {
        setItems((prev) => prev.filter((item) => item.id !== entryId));
      } else {
        setItems((prev) =>
          prev.map((item) =>
            item.id === entryId ? { ...item, quantity } : item,
          ),
        );
      }

      try {
        if (quantity <= 0) {
          await deleteCartEntry(entryId);
        } else {
          await patchCartEntry(entryId, { quantity });
        }
      } catch (err) {
        console.error("Failed to update cart:", err);
        setItems(previous);
      }
    },
    [items],
  );

  const addToCart = useCallback(
    async (product: Product, size: string, color: string) => {
      if (!userId) return;

      const existing = items.find(
        (item) =>
          item.productId === product.id &&
          item.size === size &&
          item.color === color,
      );

      if (existing) {
        await updateQuantity(existing.id, existing.quantity + 1);
        return;
      }

      const previous = items;
      const optimistic: CartEntry = {
        id: `local-${Date.now()}`,
        userId,
        productId: product.id,
        size,
        color,
        quantity: 1,
      };
      setItems((prev) => [...prev, optimistic]);

      try {
        const created = await createCartEntry({
          userId,
          productId: product.id,
          size,
          color,
          quantity: 1,
        });
        setItems((prev) =>
          prev.map((item) => (item.id === optimistic.id ? created : item)),
        );
      } catch (err) {
        console.error("Failed to add to cart:", err);
        setItems(previous);
      }
    },
    [userId, items, updateQuantity],
  );

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, cartCount, loading, error, reload, addToCart, updateQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
