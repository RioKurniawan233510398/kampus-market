import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity } from "react-native";

interface WishlistButtonProps {
  isInWishlist: boolean;
  onToggle: () => void;
  size?: number;
}

export default function WishlistButton({
  isInWishlist,
  onToggle,
  size = 24,
}: WishlistButtonProps) {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onToggle}
      activeOpacity={0.7}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Ionicons
        name={isInWishlist ? "heart" : "heart-outline"}
        size={size}
        color={isInWishlist ? "#EF4444" : "#64748B"}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
});
