import { useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    type KeyboardTypeOptions,
} from "react-native";

import { Colors } from "@/constants/colors";

interface CustomInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  error?: string;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  showToggle?: boolean;
}

export default function CustomInput({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  error,
  keyboardType = "default",
  autoCapitalize = "none",
  showToggle = false,
}: CustomInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecureVisible, setIsSecureVisible] = useState(false);

  const inputBorderColor = error
    ? Colors.danger
    : isFocused
      ? Colors.primary
      : Colors.border;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrapper, { borderColor: inputBorderColor }]}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          secureTextEntry={secureTextEntry && !isSecureVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {showToggle && value.length > 0 && (
          <TouchableOpacity
            onPress={() => setIsSecureVisible(!isSecureVisible)}
            style={styles.toggleButton}
          >
            <Text style={styles.toggleText}>
              {isSecureVisible ? "Hide" : "Show"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: Colors.background,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  input: {
    flex: 1,
    height: 52,
    paddingHorizontal: 16,
    fontSize: 16,
    color: Colors.text,
  },
  toggleButton: {
    paddingHorizontal: 16,
    height: 52,
    justifyContent: "center",
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.primary,
  },
  errorText: {
    fontSize: 12,
    color: Colors.danger,
    marginTop: 4,
    marginLeft: 4,
  },
});
