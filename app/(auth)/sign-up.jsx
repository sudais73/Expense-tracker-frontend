import * as React from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { COLORS } from "../../constants/colors";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState("");

  // --- HANDLE SIGN UP ---
  const onSignUpPress = async () => {
    if (!isLoaded) return;
    setError("");

    try {
      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setPendingVerification(true);
    } catch (err) {
      const errorMessage = err?.errors?.[0]?.message || "Something went wrong";
      setError(errorMessage);
    }
  };

  // --- HANDLE VERIFY OTP ---
  const onVerifyPress = async () => {
    if (!isLoaded) return;
    setError("");

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/");
      } else {
        setError("Invalid verification code");
      }
    } catch (err) {
      const errorMessage = err?.errors?.[0]?.message || "Invalid verification code";
      setError(errorMessage);
    }
  };

  // --- OTP SCREEN ---
  if (pendingVerification) {
    return (
      <View style={styles.verifyContainer}>
        <Text style={styles.title}>Verify your email</Text>

        <TextInput
          style={styles.input}
          value={code}
          placeholder="Enter verification code"
          onChangeText={setCode}
        />

        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}

        <TouchableOpacity onPress={onVerifyPress}>
          <Text style={styles.verifyButton}>Verify</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --- MAIN SIGN UP SCREEN ---
  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <Image
          source={require("../../assets/images/revenue-i1.png")}
          style={styles.image}
        />

        <Text style={styles.title}>Create Account</Text>

        <TextInput
          style={styles.input}
          autoCapitalize="none"
          placeholderTextColor="gray"
          value={emailAddress}
          placeholder="Enter email"
          onChangeText={setEmailAddress}
        />

        <TextInput
          style={styles.input}
          value={password}
          placeholder="Enter password"
          placeholderTextColor="gray"
          secureTextEntry
          onChangeText={setPassword}
        />

        {/* ERROR MESSAGE */}
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}

        <TouchableOpacity onPress={onSignUpPress}>
          <Text style={styles.signUpButton}>Sign up</Text>
        </TouchableOpacity>

        <View style={styles.switchContainer}>
          <Text style={styles.switchText}>Already have an account?</Text>
          <Link href="/sign-in">
            <Text style={styles.linkText}>Sign in</Text>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 100,
    padding: 20,
    gap: 15,
  },

  verifyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    gap: 15,
  },

  errorText: {
    color: "red",
    textAlign: "center",
    fontSize: 14,
    marginTop: -5,
  },

  verifyButton: {
    marginTop: 20,
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    textAlign: "center",
    lineHeight: 50,
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 16,
    width: 200,
  },

  image: {
    width: 300,
    height: 200,
    resizeMode: "contain",
    alignSelf: "center",
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 10,
  },

  input: {
    height: 50,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.white,
  },

  signUpButton: {
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    textAlign: "center",
    lineHeight: 50,
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
    marginTop: 10,
  },

  switchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
    marginTop: 10,
  },

  switchText: {
    color: COLORS.primary,
    fontWeight: "600",
  },

  linkText: {
    color: COLORS.dark,
    fontWeight: "600",
  },
});
