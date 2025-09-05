import SafeScreen from '@/components/SafeScreen';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import '../global.css';





export default function RootLayout() {
  return (
        <View style={{ flex: 1 }}>
          <SafeScreen>
            <Slot />
          </SafeScreen>
          <StatusBar style="dark" />
        </View>
  );
}
