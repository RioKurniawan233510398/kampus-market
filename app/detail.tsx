import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// GUNAKAN RELATIVE PATH
import { Image } from "expo-image";
import { ThemedText } from "../components/themed-text";
import WishlistButton from "../components/wishlist-button";
import { useProductDetail } from "../hooks/useProductDetail";
import { useWishlist } from "../hooks/useWishlist";
import { formatPrice } from "../utils/format";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const IMAGE_HEIGHT = 320;
const IMAGE_GALLERY_PADDING = 20;

export default function DetailScreen() {
  const { id } = useLocalSearchParams();

  const { product, loading, error, fetchProduct } = useProductDetail(
    id as string,
  );
  const { isInWishlist, toggleWishlist } = useWishlist();

  // Loading Screen
  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#1D9BC5" />

        <ThemedText style={styles.loadingText}>Memuat Produk...</ThemedText>
      </SafeAreaView>
    );
  }

  // Error Screen
  if (error) {
    return (
      <SafeAreaView style={styles.center}>
        <Ionicons name="alert-circle-outline" size={70} color="#EF4444" />

        <ThemedText style={styles.errorTitle}>Gagal Memuat Produk</ThemedText>

        <ThemedText style={styles.errorText}>{error}</ThemedText>

        <TouchableOpacity style={styles.retryButton} onPress={fetchProduct}>
          <ThemedText style={styles.retryText}>Coba Lagi</ThemedText>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Product Not Found
  if (!product) {
    return (
      <SafeAreaView style={styles.center}>
        <Ionicons name="search-outline" size={70} color="#94A3B8" />

        <ThemedText style={styles.notFoundTitle}>
          Produk Tidak Ditemukan
        </ThemedText>

        <ThemedText style={styles.notFoundText}>
          Produk yang kamu cari tidak ditemukan.
        </ThemedText>

        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => router.back()}
        >
          <ThemedText style={styles.retryText}>Kembali</ThemedText>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const images =
    product.images && product.images.length > 0
      ? product.images
      : [product.thumbnail];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#1D9BC5" />
        </TouchableOpacity>

        <ThemedText style={styles.headerTitle}>Detail Produk</ThemedText>

        <WishlistButton
          isInWishlist={isInWishlist(product.id)}
          onToggle={() =>
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
            })
          }
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Image Gallery */}
        <View style={styles.galleryWrapper}>
          {images.length > 1 ? (
            <FlatList
              horizontal
              pagingEnabled
              data={images}
              renderItem={({ item }) => (
                <View style={styles.imageSlide}>
                  <Image
                    source={{ uri: item }}
                    style={styles.galleryImage}
                    contentFit="cover"
                    transition={200}
                  />
                </View>
              )}
              keyExtractor={(item, index) => `${item}-${index}`}
              showsHorizontalScrollIndicator={false}
              snapToInterval={SCREEN_WIDTH - IMAGE_GALLERY_PADDING * 2}
              snapToAlignment="start"
              decelerationRate="fast"
              nestedScrollEnabled
            />
          ) : (
            <View style={styles.imageSlide}>
              <Image
                source={{ uri: images[0] }}
                style={styles.galleryImage}
                contentFit="cover"
                transition={200}
              />
            </View>
          )}
        </View>

        {/* Product Info Card */}
        <View style={styles.card}>
          {/* Category Badge */}
          <View style={styles.categoryBadge}>
            <ThemedText style={styles.categoryBadgeText}>
              {product.category}
            </ThemedText>
          </View>

          {/* Title */}
          <ThemedText style={styles.productTitle}>{product.title}</ThemedText>

          {/* Price & Discount Row */}
          <View style={styles.priceRow}>
            <ThemedText style={styles.price}>
              {formatPrice(product.price)}
            </ThemedText>

            {product.discountPercentage > 0 && (
              <View style={styles.discountBadge}>
                <ThemedText style={styles.discountText}>
                  -{Math.round(product.discountPercentage)}%
                </ThemedText>
              </View>
            )}
          </View>

          {/* Rating */}
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={18} color="#F59E0B" />
            <ThemedText style={styles.ratingText}>
              {product.rating.toFixed(1)}
            </ThemedText>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Info Rows */}
          {product.brand && (
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="pricetag-outline" size={16} color="#64748B" />
              </View>
              <ThemedText style={styles.infoLabel}>Merek</ThemedText>
              <ThemedText style={styles.infoValue}>{product.brand}</ThemedText>
            </View>
          )}

          <View style={styles.infoRow}>
            <View style={styles.infoIconContainer}>
              <Ionicons name="folder-outline" size={16} color="#64748B" />
            </View>
            <ThemedText style={styles.infoLabel}>Kategori</ThemedText>
            <ThemedText style={styles.infoValue}>{product.category}</ThemedText>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIconContainer}>
              <Ionicons name="cube-outline" size={16} color="#64748B" />
            </View>
            <ThemedText style={styles.infoLabel}>Stok</ThemedText>
            <ThemedText
              style={[
                styles.infoValue,
                product.stock === 0
                  ? styles.stockOut
                  : product.stock <= 10
                    ? styles.stockLow
                    : styles.stockAvailable,
              ]}
            >
              {product.stock === 0
                ? "Stok Habis"
                : product.stock <= 10
                  ? `Sisa ${product.stock}`
                  : `${product.stock} unit`}
            </ThemedText>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Description */}
          <ThemedText style={styles.descriptionLabel}>Deskripsi</ThemedText>
          <ThemedText style={styles.descriptionText}>
            {product.description}
          </ThemedText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  scrollContent: {
    paddingBottom: 40,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#F8FAFC",
  },

  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: "#64748B",
  },

  errorTitle: {
    marginTop: 20,
    fontSize: 22,
    fontWeight: "700",
    color: "#11181C",
  },

  errorText: {
    textAlign: "center",
    marginVertical: 15,
    color: "#64748B",
    lineHeight: 22,
  },

  retryButton: {
    backgroundColor: "#1D9BC5",
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 15,
    marginTop: 10,
  },

  retryText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },

  notFoundTitle: {
    marginTop: 20,
    fontSize: 22,
    fontWeight: "700",
    color: "#11181C",
  },

  notFoundText: {
    textAlign: "center",
    marginVertical: 15,
    color: "#64748B",
    lineHeight: 22,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#11181C",
  },

  // Image Gallery
  galleryWrapper: {
    marginHorizontal: IMAGE_GALLERY_PADDING,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    backgroundColor: "#FFFFFF",
  },

  imageSlide: {
    width: SCREEN_WIDTH - IMAGE_GALLERY_PADDING * 2,
    height: IMAGE_HEIGHT,
  },

  galleryImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F1F5F9",
  },

  // Product Info Card
  card: {
    margin: 20,
    padding: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },

  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#E0F2FE",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },

  categoryBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0369A1",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  productTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#11181C",
    lineHeight: 32,
    marginBottom: 16,
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },

  price: {
    fontSize: 28,
    fontWeight: "800",
    color: "#11181C",
  },

  discountBadge: {
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FECACA",
  },

  discountText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#DC2626",
  },

  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 20,
  },

  ratingText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#92400E",
  },

  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 16,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  infoIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  infoLabel: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
    flex: 1,
  },

  infoValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#11181C",
  },

  stockAvailable: {
    color: "#16A34A",
  },

  stockLow: {
    color: "#EA580C",
  },

  stockOut: {
    color: "#DC2626",
  },

  descriptionLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#11181C",
    marginBottom: 8,
  },

  descriptionText: {
    fontSize: 15,
    color: "#475569",
    lineHeight: 24,
    letterSpacing: 0.2,
  },
});
