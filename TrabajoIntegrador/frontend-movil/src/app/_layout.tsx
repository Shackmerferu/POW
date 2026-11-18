import { DarkTheme, DefaultTheme, ThemeProvider as ExpoRouterThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import FloatingThemeToggle from '@/components/FloatingThemeToggle';
import AppTabs from '@/components/app-tabs';
import { ColorSchemeProvider, useAppColorScheme } from '@/contexts/ColorSchemeContext';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  return (
    <ColorSchemeProvider>
      <ThemedApplication />
    </ColorSchemeProvider>
  );
}

function ThemedApplication() {
  const { colorScheme, colors } = useAppColorScheme();

  return (
    <ExpoRouterThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <StatusBar
          style={colorScheme === 'dark' ? 'light' : 'dark'}
          backgroundColor={colors.background}
        />
        <AnimatedSplashOverlay />
        <AppTabs />
        <FloatingThemeToggle />
      </View>
    </ExpoRouterThemeProvider>
  );
}
