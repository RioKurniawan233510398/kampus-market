import {
    StyleSheet,
    Text,
    TouchableOpacity,
    type ViewStyle,
} from "react-native";

import { Colors } from "@/constants/colors";

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: "primary" | "link";
  style?: ViewStyle;
}

export default function CustomButton({
  title,
  onPress,
  disabled = false,
  variant = "primary",
  style,
}: CustomButtonProps) {
  if (variant === "link") {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        style={[styles.linkContainer, style]}
      >
        <Text style={[styles.linkText, disabled && styles.disabledLink]}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, disabled && styles.disabledButton, style]}
      activeOpacity={0.8}
    >
      <Text style={[styles.buttonText, disabled && styles.disabledButtonText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
  },
  disabledButton: {
    backgroundColor: Colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  disabledButtonText: {
    color: "#9ca3af",
  },
  linkContainer: {
    alignItems: "center",
    paddingVertical: 8,
  },
  linkText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.primary,
  },
  disabledLink: {
    color: Colors.border,
  },
});
