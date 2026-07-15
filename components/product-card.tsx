import { Image } from "expo-image";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Colors } from "@/constants/colors";
import type { Product } from "@/services/products";

interface ProductCardProps {
  product: Product;
  onPress: (id: number) => void;
}

export default function ProductCard({ product, onPress }: ProductCardProps) {
  const isLowStock = product.stock > 0 && product.stock <= 10;
  const isOutOfStock = product.stock === 0;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(product.id)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: product.thumbnail }}
        style={styles.image}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.content}>
        <Text style={styles.category}>{product.category}</Text>
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {product.description}
        </Text>

        <View style={styles.bottomRow}>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>★ {product.rating.toFixed(1)}</Text>
          </View>
        </View>

        <View style={styles.stockRow}>
          {isOutOfStock ? (
            <Text style={styles.outOfStock}>Out of Stock</Text>
          ) : isLowStock ? (
            <Text style={styles.lowStock}>Only {product.stock} left</Text>
          ) : (
            <Text style={styles.inStock}>In Stock</Text>
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
  image: {
    width: "100%",
    height: 200,
    backgroundColor: "#f3f4f6",
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
