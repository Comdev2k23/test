import SafeScreen from '@/components/SafeScreen';
import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import '../global.css';

export default function RootLayout() {
  return (
      <ClerkProvider tokenCache={tokenCache}>
      <View style={{ flex: 1 }}>
        <SafeScreen>
          <Slot />
        </SafeScreen>
        <StatusBar style="dark" />
      </View>
    </ClerkProvider>
  )
}
