import { FavoriteEntry } from "../types/shop";
import { request } from "./client";

export function fetchFavorites(userId: string): Promise<FavoriteEntry[]> {
  return request<FavoriteEntry[]>(
    `/favorites?userId=${encodeURIComponent(userId)}`,
  );
}

export function createFavorite(
  entry: Omit<FavoriteEntry, "id">,
): Promise<FavoriteEntry> {
  return request<FavoriteEntry>("/favorites", {
    method: "POST",
    body: JSON.stringify(entry),
  });
}

export function deleteFavorite(id: string): Promise<void> {
  return request<void>(`/favorites/${id}`, { method: "DELETE" });
}
