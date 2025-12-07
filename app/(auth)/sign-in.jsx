import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { COLORS } from "../../constants/colors";

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // --- SIGN IN HANDLER ---
  const onSignInPress = async () => {
    if (!isLoaded) return;

    setError("");

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      const errorMessage =
        err?.errors?.[0]?.message || "Unable to sign in. Try again.";
      setError(errorMessage);
    }
  };

  return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
      <View style={styles.container}>
        <Image
          source={require("../../assets/images/revenue-i4.png")}
          style={styles.image}
        />

        <Text style={styles.title}>Welcome Back</Text>

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
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity onPress={onSignInPress}>
          <Text style={styles.signInButton}>Sign In</Text>
        </TouchableOpacity>

        <View style={styles.switchContainer}>
          <Text style={styles.switchText}>Don't have an account?</Text>
          <Link href="/(auth)/sign-up">
            <Text style={styles.linkText}>Sign Up</Text>
          </Link>
        </View>
      </View>
      </ScrollView>
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

  errorText: {
    color: "red",
    textAlign: "center",
    fontSize: 14,
    marginTop: -5,
  },

  signInButton: {
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    textAlign: "center",
    lineHeight: 50,
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 16,
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
