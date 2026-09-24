import { CartEntry } from "../types/shop";
import { request } from "./client";

export function fetchCart(userId: string): Promise<CartEntry[]> {
  return request<CartEntry[]>(
    `/cartItems?userId=${encodeURIComponent(userId)}`,
  );
}

export function createCartEntry(
  entry: Omit<CartEntry, "id">,
): Promise<CartEntry> {
  return request<CartEntry>("/cartItems", {
    method: "POST",
    body: JSON.stringify(entry),
  });
}

export function patchCartEntry(
  id: string,
  patch: Partial<Pick<CartEntry, "quantity">>,
): Promise<CartEntry> {
  return request<CartEntry>(`/cartItems/${id}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

export function deleteCartEntry(id: string): Promise<void> {
  return request<void>(`/cartItems/${id}`, { method: "DELETE" });
}
