import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  createFavorite,
  deleteFavorite,
  fetchFavorites,
} from "../api/favorites";
import { FavoriteEntry } from "../types/shop";
import { getUserId } from "../utils/userId";

interface FavoritesContextType {
  items: FavoriteEntry[];
  loading: boolean;
  initialized: boolean;
  error: string | null;
  reload: () => void;
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (productId: string) => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType>({
  items: [],
  loading: true,
  initialized: false,
  error: null,
  reload: () => {},
  isFavorite: () => false,
  toggleFavorite: async () => {},
});

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [items, setItems] = useState<FavoriteEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);
  const pendingRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);

      try {
        const id = await getUserId();
        if (cancelled) return;
        setUserId(id);

        const data = await fetchFavorites(id);
        if (cancelled) return;
        setItems(data);
      } catch (err) {
        console.error("Failed to load favorites:", err);
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load favorites",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          setInitialized(true);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [version]);

  const reload = useCallback(() => {
    setVersion((v) => v + 1);
  }, []);

  const favoriteIds = useMemo(
    () => new Set(items.map((item) => item.productId)),
    [items],
  );

  const isFavorite = useCallback(
    (productId: string) => favoriteIds.has(productId),
    [favoriteIds],
  );

  const toggleFavorite = useCallback(
    async (productId: string) => {
      if (!userId) return;
      if (pendingRef.current.has(productId)) return;
      pendingRef.current.add(productId);

      try {
        const existing = items.find((item) => item.productId === productId);
        const previous = items;

        if (existing) {
          setItems((prev) => prev.filter((item) => item.id !== existing.id));
          try {
            await deleteFavorite(existing.id);
          } catch (err) {
            console.error("Failed to remove favorite:", err);
            setItems(previous);
          }
          return;
        }

        const optimistic: FavoriteEntry = {
          id: `local-${Date.now()}`,
          userId,
          productId,
        };
        setItems((prev) => [...prev, optimistic]);

        try {
          const created = await createFavorite({ userId, productId });
          setItems((prev) =>
            prev.map((item) => (item.id === optimistic.id ? created : item)),
          );
        } catch (err) {
          console.error("Failed to add favorite:", err);
          setItems(previous);
        }
      } finally {
        pendingRef.current.delete(productId);
      }
    },
    [userId, items],
  );

  return (
    <FavoritesContext.Provider
      value={{ items, loading, initialized, error, isFavorite, toggleFavorite, reload }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
