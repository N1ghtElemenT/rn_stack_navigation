import { Product } from "../types/shop";
import { request } from "./client";

let productsPromise: Promise<Product[]> | null = null;

export function getProducts(): Promise<Product[]> {
  if (!productsPromise) {
    productsPromise = request<Product[]>("/products").catch((err) => {
      productsPromise = null;
      throw err;
    });
  }
  return productsPromise;
}

export function resetProductsCache(): void {
  productsPromise = null;
}

export async function getProduct(id: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((product) => product.id === id) ?? null;
}
