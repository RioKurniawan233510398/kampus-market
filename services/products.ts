import api from "./api";

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand?: string;
  thumbnail: string;
  images: string[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface Category {
  slug: string;
  name: string;
  url: string;
}

export async function fetchProducts(): Promise<ProductsResponse> {
  const response = await api.get<ProductsResponse>("/products");
  return response.data;
}

export async function fetchCategories(): Promise<Category[]> {
  const response = await api.get<Category[]>("/products/categories");
  return response.data;
}
