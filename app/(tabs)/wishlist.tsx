import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Colors } from "@/constants/colors";
import { useWishlist } from "@/hooks/useWishlist";
import { formatPrice } from "@/utils/format";

export default function WishlistScreen() {
  const { wishlist, loading, isInWishlist, toggleWishlist } = useWishlist();

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Memuat favorit...</Text>
      </View>
    );
  }

  if (wishlist.length === 0) {
    return (
      <View style={styles.centeredContainer}>
        <View style={styles.emptyIconContainer}>
          <Ionicons name="heart-outline" size={64} color="#CBD5E1" />
        </View>
        <Text style={styles.emptyTitle}>Belum Ada Produk Favorit</Text>
        <Text style={styles.emptyMessage}>
          Jelajahi dan tambahkan produk favoritmu ke daftar ini.
        </Text>
        <TouchableOpacity
          style={styles.browseButton}
          onPress={() => router.push("/(tabs)")}
          activeOpacity={0.8}
        >
          <Ionicons name="search" size={18} color="#FFFFFF" />
          <Text style={styles.browseButtonText}>Lihat Produk</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleProductPress = (id: number) => {
    router.push(`/detail?id=${id}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favorit</Text>
        <Text style={styles.headerCount}>{wishlist.length} item</Text>
      </View>

      <FlatList
        data={wishlist}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleProductPress(item.id)}
            activeOpacity={0.7}
          >
            <Image source={{ uri: item.thumbnail }} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <Text style={styles.cardCategory}>{item.category}</Text>
              <Text style={styles.cardTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <View style={styles.cardBottomRow}>
                <Text style={styles.cardPrice}>{formatPrice(item.price)}</Text>
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingText}>
                    ★ {item.rating.toFixed(1)}
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => toggleWishlist(item)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name={isInWishlist(item.id) ? "heart" : "heart-outline"}
                size={22}
                color="#EF4444"
              />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 32,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.secondary,
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text,
  },

  headerCount: {
    fontSize: 14,
    color: Colors.secondary,
    fontWeight: "500",
  },

  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 8,
  },

  emptyMessage: {
    fontSize: 14,
    color: Colors.secondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },

  browseButton: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },

  browseButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    alignItems: "center",
  },

  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
  },

  cardContent: {
    flex: 1,
    marginLeft: 12,
  },

  cardCategory: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.primary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
  },

  cardBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  cardPrice: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.text,
  },

  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef3c7",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },

  ratingText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#92400e",
  },

  removeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FEF2F2",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
});
