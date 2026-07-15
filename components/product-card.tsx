import { Image } from "expo-image";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Colors } from "@/constants/colors";
import { useWishlist } from "@/hooks/useWishlist";
import type { Product } from "@/services/products";
import { formatPrice } from "@/utils/format";
import WishlistButton from "./wishlist-button";

interface ProductCardProps {
  product: Product;
  onPress: (id: number) => void;
}

export default function ProductCard({ product, onPress }: ProductCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isLowStock = product.stock > 0 && product.stock <= 10;
  const isOutOfStock = product.stock === 0;

  const handleToggleWishlist = () => {
    toggleWishlist({
      id: product.id,
      title: product.title,
      price: product.price,
      rating: product.rating,
      category: product.category,
      thumbnail: product.thumbnail,
      images: product.images,
      discountPercentage: product.discountPercentage,
      brand: product.brand,
      stock: product.stock,
      description: product.description,
    });
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(product.id)}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.thumbnail }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
        <View style={styles.wishlistOverlay}>
          <WishlistButton
            isInWishlist={isInWishlist(product.id)}
            onToggle={handleToggleWishlist}
          />
        </View>
      </View>
      <View style={styles.content}>
        <Text style={styles.category}>{product.category}</Text>
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {product.description}
        </Text>

        <View style={styles.bottomRow}>
          <Text style={styles.price}>{formatPrice(product.price)}</Text>
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>★ {product.rating.toFixed(1)}</Text>
          </View>
        </View>

        <View style={styles.stockRow}>
          {isOutOfStock ? (
            <Text style={styles.outOfStock}>Stok Habis</Text>
          ) : isLowStock ? (
            <Text style={styles.lowStock}>Sisa {product.stock}</Text>
          ) : (
            <Text style={styles.inStock}>Tersedia</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    overflow: "hidden",
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 200,
    backgroundColor: "#f3f4f6",
  },
  wishlistOverlay: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  content: {
    padding: 16,
  },
  category: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.primary,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: Colors.secondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  price: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.text,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef3c7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#92400e",
  },
  stockRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  inStock: {
    fontSize: 13,
    fontWeight: "600",
    color: "#16a34a",
  },
  lowStock: {
    fontSize: 13,
    fontWeight: "600",
    color: "#ea580c",
  },
  outOfStock: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.danger,
  },
});
