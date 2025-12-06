import SafeScreen from "../components/SafeScreen";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { Slot } from "expo-router";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function RootLayout() {
  return (
    <ClerkProvider
      publishableKey={publishableKey}   // ❗ REQUIRED
      tokenCache={tokenCache}
      options={{
        signUp: {
          captcha: "disabled",   // 🔥 stops Smart CAPTCHA
        },
        signIn: {
          captcha: "disabled",
        },
      }}
    >
      <SafeScreen>
        <Slot />
      </SafeScreen>
    </ClerkProvider>
  );
}
