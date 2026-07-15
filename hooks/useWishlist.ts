import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

const WISHLIST_STORAGE_KEY = "@kampus_market_wishlist";

export interface WishlistItem {
  id: number;
  title: string;
  price: number;
  rating: number;
  category: string;
  thumbnail: string;
  images: string[];
  discountPercentage: number;
  brand?: string;
  stock: number;
  description: string;
}

interface UseWishlistReturn {
  wishlist: WishlistItem[];
  loading: boolean;
  isInWishlist: (id: number) => boolean;
  addToWishlist: (product: WishlistItem) => Promise<void>;
  removeFromWishlist: (id: number) => Promise<void>;
  toggleWishlist: (product: WishlistItem) => Promise<void>;
}

export function useWishlist(): UseWishlistReturn {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadWishlist = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(WISHLIST_STORAGE_KEY);
      if (stored) {
        setWishlist(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Failed to load wishlist:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  const saveWishlist = useCallback(async (items: WishlistItem[]) => {
    try {
      await AsyncStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.error("Failed to save wishlist:", err);
    }
  }, []);

  const isInWishlist = useCallback(
    (id: number): boolean => {
      return wishlist.some((item) => item.id === id);
    },
    [wishlist],
  );

  const addToWishlist = useCallback(
    async (product: WishlistItem) => {
      const updated = [...wishlist, product];
      setWishlist(updated);
      await saveWishlist(updated);
    },
    [wishlist, saveWishlist],
  );

  const removeFromWishlist = useCallback(
    async (id: number) => {
      const updated = wishlist.filter((item) => item.id !== id);
      setWishlist(updated);
      await saveWishlist(updated);
    },
    [wishlist, saveWishlist],
  );

  const toggleWishlist = useCallback(
    async (product: WishlistItem) => {
      if (isInWishlist(product.id)) {
        await removeFromWishlist(product.id);
      } else {
        await addToWishlist(product);
      }
    },
    [isInWishlist, removeFromWishlist, addToWishlist],
  );

  return {
    wishlist,
    loading,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
  };
}
