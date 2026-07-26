import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="(modals)/customize" 
          options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }} 
        />
        <Stack.Screen 
          name="(modals)/ai-assistant" 
          options={{ presentation: 'modal', animation: 'slide_from_bottom' }} 
        />
        <Stack.Screen 
          name="(modals)/cart" 
          options={{ presentation: 'modal', animation: 'slide_from_bottom' }} 
        />
        <Stack.Screen name="artwork/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="artist/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="product/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="gift/[id]" options={{ presentation: 'card' }} />
      </Stack>
    </SafeAreaProvider>
  );
}
