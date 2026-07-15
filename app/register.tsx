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

interface RegisterErrors {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

function validateFullName(name: string): string {
  if (!name.trim()) {
    return "Full name is required";
  }
  if (name.trim().length < 3) {
    return "Full name must be at least 3 characters";
  }
  return "";
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

function validateConfirmPassword(
  password: string,
  confirmPassword: string,
): string {
  if (!confirmPassword) {
    return "Please confirm your password";
  }
  if (password !== confirmPassword) {
    return "Passwords do not match";
  }
  return "";
}

function validateForm(
  fullName: string,
  email: string,
  password: string,
  confirmPassword: string,
): RegisterErrors {
  return {
    fullName: validateFullName(fullName),
    email: validateEmail(email),
    password: validatePassword(password),
    confirmPassword: validateConfirmPassword(password, confirmPassword),
  };
}

function isFormValid(
  fullName: string,
  email: string,
  password: string,
  confirmPassword: string,
): boolean {
  const errors = validateForm(fullName, email, password, confirmPassword);
  return (
    !errors.fullName &&
    !errors.email &&
    !errors.password &&
    !errors.confirmPassword
  );
}

export default function RegisterScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<RegisterErrors>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const handleFullNameChange = (text: string) => {
    setFullName(text);
    if (touched.fullName) {
      setErrors((prev) => ({ ...prev, fullName: validateFullName(text) }));
    }
  };

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

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    if (touched.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: validateConfirmPassword(password, text),
      }));
    }
  };

  const handleFullNameBlur = () => {
    setTouched((prev) => ({ ...prev, fullName: true }));
    setErrors((prev) => ({ ...prev, fullName: validateFullName(fullName) }));
  };

  const handleEmailBlur = () => {
    setTouched((prev) => ({ ...prev, email: true }));
    setErrors((prev) => ({ ...prev, email: validateEmail(email) }));
  };

  const handlePasswordBlur = () => {
    setTouched((prev) => ({ ...prev, password: true }));
    setErrors((prev) => ({ ...prev, password: validatePassword(password) }));
  };

  const handleConfirmPasswordBlur = () => {
    setTouched((prev) => ({ ...prev, confirmPassword: true }));
    setErrors((prev) => ({
      ...prev,
      confirmPassword: validateConfirmPassword(password, confirmPassword),
    }));
  };

  const handleRegister = () => {
    const validationErrors = validateForm(
      fullName,
      email,
      password,
      confirmPassword,
    );
    setErrors(validationErrors);
    setTouched({
      fullName: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    const hasNoErrors =
      !validationErrors.fullName &&
      !validationErrors.email &&
      !validationErrors.password &&
      !validationErrors.confirmPassword;

    if (hasNoErrors) {
      router.push("/login");
    }
  };

  const formValid = isFormValid(fullName, email, password, confirmPassword);

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
          <Text style={styles.welcomeTitle}>Create Account</Text>
          <Text style={styles.welcomeSubtitle}>Join us and start shopping</Text>
        </View>

        <View style={styles.form}>
          <CustomInput
            label="Full Name"
            value={fullName}
            onChangeText={handleFullNameChange}
            placeholder="Enter your full name"
            autoCapitalize="words"
            error={touched.fullName ? errors.fullName : undefined}
          />

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

          <CustomInput
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={handleConfirmPasswordChange}
            placeholder="Confirm your password"
            secureTextEntry
            showToggle
            error={touched.confirmPassword ? errors.confirmPassword : undefined}
          />

          <CustomButton
            title="Register"
            onPress={handleRegister}
            disabled={!formValid}
          />

          <CustomButton
            title="Already have an account? Login"
            onPress={() => router.push("/login")}
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
