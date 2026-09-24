export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  image: string;
  sizes: string[];
  colors: ProductColor[];
}

export interface CartEntry {
  id: string;
  userId: string;
  productId: string;
  size: string;
  color: string;
  quantity: number;
}

export interface CartLine {
  entry: CartEntry;
  product: Product;
}
