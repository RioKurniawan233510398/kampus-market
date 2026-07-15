import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// GUNAKAN RELATIVE PATH
import { ThemedText } from "../components/ui/themed-text";
import { useProductDetail } from "../hooks/useProductDetail";

export default function DetailScreen() {
  const { id } = useLocalSearchParams();

  const { product, loading, error, fetchProduct } = useProductDetail(
    id as string,
  );

  // Loading Screen
  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#1D9BC5" />

        <ThemedText style={styles.loadingText}>Loading Product...</ThemedText>
      </SafeAreaView>
    );
  }

  // Error Screen
  if (error) {
    return (
      <SafeAreaView style={styles.center}>
        <Ionicons name="alert-circle-outline" size={70} color="#EF4444" />

        <ThemedText style={styles.errorTitle}>
          Failed to Load Product
        </ThemedText>

        <ThemedText style={styles.errorText}>{error}</ThemedText>

        <TouchableOpacity style={styles.retryButton} onPress={fetchProduct}>
          <ThemedText style={styles.retryText}>Retry</ThemedText>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Product Not Found
  if (!product) {
    return (
      <SafeAreaView style={styles.center}>
        <ThemedText>Product Not Found</ThemedText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#1D9BC5" />
          </TouchableOpacity>

          <ThemedText style={styles.headerTitle}>Product Detail</ThemedText>

          <View style={{ width: 42 }} />
        </View>

        {/* Placeholder */}

        <View style={styles.card}>
          <ThemedText style={styles.productTitle}>{product.title}</ThemedText>

          <ThemedText style={styles.placeholder}>
            Product Detail UI akan dibuat pada Part 7.3
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
  },

  errorTitle: {
    marginTop: 20,
    fontSize: 22,
    fontWeight: "700",
  },

  errorText: {
    textAlign: "center",
    marginVertical: 15,
  },

  retryButton: {
    backgroundColor: "#1D9BC5",
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 15,
  },

  retryText: {
    color: "#FFFFFF",
    fontWeight: "700",
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
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
  },

  card: {
    margin: 20,
    padding: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    elevation: 3,
  },

  productTitle: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 15,
  },

  placeholder: {
    color: "#64748B",
    lineHeight: 24,
  },
});
