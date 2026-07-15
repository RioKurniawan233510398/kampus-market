import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import ProductCard from "@/components/product-card";
import SearchBar from "@/components/search-bar";
import { Colors } from "@/constants/colors";
import {
  fetchCategories,
  fetchProducts,
  type Category,
  type Product,
} from "@/services/products";
import { router } from "expo-router";

type ScreenState = "loading" | "error" | "empty" | "success";

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [screenState, setScreenState] = useState<ScreenState>("loading");
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [loadingCategories, setLoadingCategories] = useState(true);

  const loadProducts = useCallback(async () => {
    try {
      const response = await fetchProducts();
      if (response.products.length === 0) {
        setScreenState("empty");
      } else {
        setProducts(response.products);
        setScreenState("success");
      }
    } catch {
      setScreenState("error");
    }
  }, []);

  const loadCategories = useCallback(async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch {
      // Categories are non-critical, silently fail
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [loadProducts, loadCategories]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const response = await fetchProducts();
      if (response.products.length === 0) {
        setProducts([]);
        setScreenState("empty");
      } else {
        setProducts(response.products);
        setScreenState("success");
      }
    } catch {
      setScreenState("error");
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleProductPress = useCallback((id: number) => {
    router.push(`/detail?id=${id}`);
  }, []);

  const handleCategorySelect = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);

  const filteredProducts = useMemo(() => {
    let result = products;

    // Filter by category
    if (selectedCategory !== "Semua") {
      result = result.filter(
        (product) =>
          product.category.toLowerCase() === selectedCategory.toLowerCase(),
      );
    }

    // Filter by search text (case-insensitive)
    if (searchText.trim()) {
      const query = searchText.trim().toLowerCase();
      result = result.filter((product) =>
        product.title.toLowerCase().includes(query),
      );
    }

    return result;
  }, [products, selectedCategory, searchText]);

  const renderProduct = useCallback(
    ({ item }: { item: Product }) => (
      <ProductCard product={item} onPress={handleProductPress} />
    ),
    [handleProductPress],
  );

  const keyExtractor = useCallback((item: Product) => item.id.toString(), []);

  const allCategories = useMemo(
    () => ["Semua", ...categories.map((c) => c.name)],
    [categories],
  );

  if (screenState === "loading") {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Memuat produk...</Text>
      </View>
    );
  }

  if (screenState === "error") {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorTitle}>Terjadi Kesalahan</Text>
        <Text style={styles.errorMessage}>
          Gagal memuat produk. Silakan coba lagi.
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={loadProducts}
          activeOpacity={0.8}
        >
          <Text style={styles.retryText}>Coba Lagi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (screenState === "empty") {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.emptyIcon}>📦</Text>
        <Text style={styles.emptyTitle}>Belum Ada Produk</Text>
        <Text style={styles.emptyMessage}>
          Belum ada produk tersedia. Silakan periksa kembali nanti.
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={loadProducts}
          activeOpacity={0.8}
        >
          <Text style={styles.retryText}>Muat Ulang</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Halo 👋</Text>
          <Text style={styles.welcomeTitle}>Temukan produk favoritmu</Text>
        </View>
      </View>

      <SearchBar
        value={searchText}
        onChangeText={setSearchText}
        placeholder="Cari produk..."
      />

      <View style={styles.categoriesSection}>
        {loadingCategories ? (
          <ActivityIndicator
            size="small"
            color={Colors.primary}
            style={styles.categoriesLoader}
          />
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {allCategories.map((category) => {
              const isSelected = category === selectedCategory;
              return (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryChip,
                    isSelected && styles.categoryChipSelected,
                  ]}
                  onPress={() => handleCategorySelect(category)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      isSelected && styles.categoryChipTextSelected,
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
      </View>

      {filteredProducts.length === 0 ? (
        <View style={styles.noResults}>
          <Text style={styles.noResultsIcon}>🔍</Text>
          <Text style={styles.noResultsTitle}>Produk Tidak Ditemukan</Text>
          <Text style={styles.noResultsMessage}>
            Coba sesuaikan pencarian atau filter kamu.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    paddingHorizontal: 32,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: "#f9fafb",
  },
  greeting: {
    fontSize: 16,
    color: Colors.secondary,
    marginBottom: 4,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text,
  },
  categoriesSection: {
    marginBottom: 4,
  },
  categoriesLoader: {
    paddingVertical: 12,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 8,
  },
  categoryChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
  },
  categoryChipTextSelected: {
    color: "#ffffff",
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.secondary,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: Colors.secondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  retryText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
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
  noResults: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  noResultsIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  noResultsTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 8,
  },
  noResultsMessage: {
    fontSize: 14,
    color: Colors.secondary,
    textAlign: "center",
    lineHeight: 20,
  },
});
