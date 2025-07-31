import SafeScreen from '@/components/SafeScreen';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import '../global.css';

SplashScreen.preventAutoHideAsync(); // keep splash screen visible

function AuthGate({ children }: { children: React.ReactNode }) {
  const { isLoaded } = useAuth();

  useEffect(() => {
    if (isLoaded) {
      SplashScreen.hideAsync(); // hide when Clerk is ready
    }
  }, [isLoaded]);

  if (!isLoaded) return null;

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <AuthGate>
        <View style={{ flex: 1 }}>
          <SafeScreen>
            <Slot />
          </SafeScreen>
          <StatusBar style="dark" />
        </View>
      </AuthGate>
    </ClerkProvider>
  );
}
