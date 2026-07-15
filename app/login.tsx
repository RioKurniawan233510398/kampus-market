import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import CustomButton from "@/components/custom-button";
import CustomInput from "@/components/custom-input";
import { Colors } from "@/constants/colors";
import { router } from "expo-router";

interface LoginErrors {
  email: string;
  password: string;
}

function validateEmail(email: string): string {
  if (!email.trim()) {
    return "Email is required";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return "Invalid email format";
  }
  return "";
}

function validatePassword(password: string): string {
  if (!password) {
    return "Password is required";
  }
  if (password.length < 8) {
    return "Password must be at least 8 characters";
  }
  return "";
}

function validateForm(email: string, password: string): LoginErrors {
  return {
    email: validateEmail(email),
    password: validatePassword(password),
  };
}

function isFormValid(email: string, password: string): boolean {
  const errors = validateForm(email, password);
  return !errors.email && !errors.password;
}

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginErrors>({
    email: "",
    password: "",
  });
  const [touched, setTouched] = useState({ email: false, password: false });

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (touched.email) {
      setErrors((prev) => ({ ...prev, email: validateEmail(text) }));
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (touched.password) {
      setErrors((prev) => ({ ...prev, password: validatePassword(text) }));
    }
  };

  const handleEmailBlur = () => {
    setTouched((prev) => ({ ...prev, email: true }));
    setErrors((prev) => ({ ...prev, email: validateEmail(email) }));
  };

  const handlePasswordBlur = () => {
    setTouched((prev) => ({ ...prev, password: true }));
    setErrors((prev) => ({ ...prev, password: validatePassword(password) }));
  };

  const handleLogin = () => {
    const validationErrors = validateForm(email, password);
    setErrors(validationErrors);
    setTouched({ email: true, password: true });

    if (!validationErrors.email && !validationErrors.password) {
      router.replace("/(tabs)");
    }
  };

  const formValid = isFormValid(email, password);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>KM</Text>
          </View>
          <Text style={styles.welcomeTitle}>Welcome Back</Text>
          <Text style={styles.welcomeSubtitle}>
            Sign in to continue shopping
          </Text>
        </View>

        <View style={styles.form}>
          <CustomInput
            label="Email"
            value={email}
            onChangeText={handleEmailChange}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            error={touched.email ? errors.email : undefined}
          />

          <CustomInput
            label="Password"
            value={password}
            onChangeText={handlePasswordChange}
            placeholder="Enter your password"
            secureTextEntry
            showToggle
            error={touched.password ? errors.password : undefined}
          />

          <CustomButton
            title="Login"
            onPress={handleLogin}
            disabled={!formValid}
          />

          <CustomButton
            title="Don't have an account? Register"
            onPress={() => router.push("/register")}
            variant="link"
            style={styles.linkButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  logoText: {
    fontSize: 32,
    fontWeight: "800",
    color: "#ffffff",
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: Colors.secondary,
  },
  form: {
    width: "100%",
  },
  linkButton: {
    marginTop: 8,
  },
});
