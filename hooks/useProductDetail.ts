import api from "@/services/api";
import { useCallback, useEffect, useState } from "react";

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
  sku?: string;
  thumbnail: string;
  images: string[];
}

interface UseProductDetailReturn {
  product: Product | null;
  loading: boolean;
  error: string | null;
  fetchProduct: () => Promise<void>;
}

export function useProductDetail(
  productId: string | number,
): UseProductDetailReturn {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!productId) {
      setError("Invalid product ID.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`/products/${productId}`);

      setProduct(response.data);
    } catch (err) {
      console.error("Failed to fetch product:", err);

      setError("Failed to load product. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return {
    product,
    loading,
    error,
    fetchProduct,
  };
}
