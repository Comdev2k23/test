import SafeScreen from '@/components/SafeScreen';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import '../global.css';

// Prevent splash from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    async function prepare() {
      try {
        // ⏳ Load resources (fonts, API check, etc.)
        await new Promise(resolve => setTimeout(resolve, 40000)); // fake delay
      } catch (e) {
        console.warn(e);
      } finally {
        // ✅ Hide splash when ready
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <SafeScreen>
        <Slot />
      </SafeScreen>
      <StatusBar style="dark" />
    </View>
  );
}
