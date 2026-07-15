import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Colors } from "@/constants/colors";
import { useSession } from "@/hooks/useSession";

interface MenuItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  action: () => void;
  color?: string;
}

export default function ProfileScreen() {
  const { session, loading, clearSession } = useSession();
  const [showAbout, setShowAbout] = useState(false);

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.loadingText}>Memuat profil...</Text>
      </View>
    );
  }

  if (!session) {
    router.replace("/login");
    return null;
  }

  const handleLogout = () => {
    Alert.alert("Keluar", "Apakah kamu yakin ingin keluar?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Keluar",
        style: "destructive",
        onPress: async () => {
          await clearSession();
          router.replace("/login");
        },
      },
    ]);
  };

  const menuItems: MenuItem[] = [
    {
      icon: "create-outline",
      label: "Edit Profil",
      action: () =>
        Alert.alert("Segera Hadir", "Edit Profil akan segera tersedia."),
    },
    {
      icon: "information-circle-outline",
      label: "Tentang Aplikasi",
      action: () => setShowAbout(true),
    },
    {
      icon: "shield-checkmark-outline",
      label: "Kebijakan Privasi",
      action: () =>
        Alert.alert("Segera Hadir", "Kebijakan Privasi akan segera tersedia."),
    },
    {
      icon: "help-circle-outline",
      label: "Bantuan",
      action: () =>
        Alert.alert("Segera Hadir", "Bantuan akan segera tersedia."),
    },
    {
      icon: "log-out-outline",
      label: "Keluar",
      action: handleLogout,
      color: "#EF4444",
    },
  ];

  const infoFields: { label: string; value: string | undefined }[] = [
    { label: "Nama", value: session.fullName },
    { label: "Email", value: session.email },
    { label: "NIM", value: session.studentId },
    { label: "Universitas", value: session.university },
    { label: "Fakultas", value: session.faculty },
    { label: "Program Studi", value: session.studyProgram },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {session.fullName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </Text>
          </View>
        </View>
        <Text style={styles.profileName}>{session.fullName}</Text>
        <Text style={styles.profileEmail}>{session.email}</Text>
      </View>

      {/* Profile Info Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Informasi Akun</Text>
        {infoFields.map((field, index) => (
          <View key={field.label} style={styles.infoRow}>
            <Text style={styles.infoLabel}>{field.label}</Text>
            <Text
              style={[styles.infoValue, !field.value && styles.infoValueMuted]}
            >
              {field.value || "Tidak Tersedia"}
            </Text>
            {index < infoFields.length - 1 && (
              <View style={styles.infoDivider} />
            )}
          </View>
        ))}
      </View>

      {/* Menu Items */}
      <View style={styles.menuCard}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={item.label}
            style={[
              styles.menuItem,
              index < menuItems.length - 1 && styles.menuItemBorder,
            ]}
            onPress={item.action}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View
                style={[
                  styles.menuIconContainer,
                  item.color && { backgroundColor: "#FEF2F2" },
                ]}
              >
                <Ionicons
                  name={item.icon}
                  size={20}
                  color={item.color || Colors.primary}
                />
              </View>
              <Text
                style={[
                  styles.menuItemLabel,
                  item.color && { color: item.color },
                ]}
              >
                {item.label}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
          </TouchableOpacity>
        ))}
      </View>

      {/* About Application Modal */}
      {showAbout && (
        <View style={styles.aboutOverlay}>
          <View style={styles.aboutCard}>
            <View style={styles.aboutHeader}>
              <View style={styles.aboutLogo}>
                <Text style={styles.aboutLogoText}>KM</Text>
              </View>
              <TouchableOpacity
                style={styles.aboutClose}
                onPress={() => setShowAbout(false)}
              >
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>
            <Text style={styles.aboutAppName}>KampusMarket</Text>
            <Text style={styles.aboutVersion}>Versi 1.0.0</Text>
            <Text style={styles.aboutDeveloper}>Pengembang: Rio Kurniawan</Text>
            <Text style={styles.aboutDescription}>
              KampusMarket adalah aplikasi marketplace mobile yang dirancang
              untuk mahasiswa agar dapat membeli dan menjual produk di dalam
              lingkungan kampus.
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
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

  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },

  loadingText: {
    fontSize: 16,
    color: Colors.secondary,
  },

  // Profile Header
  profileHeader: {
    alignItems: "center",
    paddingTop: 24,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },

  avatarContainer: {
    marginBottom: 16,
  },

  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  avatarText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  profileName: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 4,
  },

  profileEmail: {
    fontSize: 14,
    color: Colors.secondary,
  },

  // Info Card
  card: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 16,
  },

  infoRow: {
    paddingVertical: 4,
  },

  infoLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.secondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },

  infoValue: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text,
  },

  infoValueMuted: {
    color: "#94A3B8",
    fontStyle: "italic",
  },

  infoDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 10,
  },

  // Menu Card
  menuCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    overflow: "hidden",
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#E0F2FE",
    justifyContent: "center",
    alignItems: "center",
  },

  menuItemLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text,
  },

  // About Modal
  aboutOverlay: {
    marginHorizontal: 20,
    marginBottom: 16,
  },

  aboutCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },

  aboutHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },

  aboutLogo: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  aboutLogoText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  aboutClose: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },

  aboutAppName: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 4,
  },

  aboutVersion: {
    fontSize: 14,
    color: Colors.secondary,
    marginBottom: 4,
  },

  aboutDeveloper: {
    fontSize: 14,
    color: Colors.secondary,
    marginBottom: 16,
  },

  aboutDescription: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 22,
  },
});
