import api from "./api";

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  stock: number;
  thumbnail: string;
  images: string[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export async function fetchProducts(): Promise<ProductsResponse> {
  const response = await api.get<ProductsResponse>("/products");
  return response.data;
}

export async function fetchCategories(): Promise<string[]> {
  const response = await api.get<string[]>("/products/categories");
  return response.data;
}
