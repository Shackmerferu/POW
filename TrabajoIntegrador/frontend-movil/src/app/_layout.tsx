import React, { useMemo, useRef, useState } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider as ExpoRouterThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { View } from 'react-native';
import { BlurTargetView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import FloatingThemeToggle from '@/components/FloatingThemeToggle';
import AppTabs from '@/components/app-tabs';
import { ColorSchemeProvider, useAppColorScheme } from '@/contexts/ColorSchemeContext';
import { FontScaleProvider } from '@/contexts/FontScaleContext';
import { BlurTargetContext } from '@/contexts/BlurTargetContext';
import { TabBarContext } from '@/contexts/TabBarContext';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  return (
    <ColorSchemeProvider>
      <FontScaleProvider>
        <ThemedApplication />
      </FontScaleProvider>
    </ColorSchemeProvider>
  );
}

function ThemedApplication() {
  const { colorScheme, colors } = useAppColorScheme();
  const blurTargetRef = useRef<React.ComponentRef<typeof View> | null>(null);
  const [tabBarHidden, setTabBarHidden] = useState(false);

  const tabBarValue = useMemo(
    () => ({ tabBarHidden, setTabBarHidden }),
    [tabBarHidden]
  );

  return (
    <ExpoRouterThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <BlurTargetContext.Provider value={blurTargetRef}>
        <TabBarContext.Provider value={tabBarValue}>
          <View style={{ flex: 1, backgroundColor: colors.background }}>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
            <BlurTargetView ref={blurTargetRef} style={{ flex: 1 }}>
              <AnimatedSplashOverlay />
              <AppTabs />
              <FloatingThemeToggle />
            </BlurTargetView>
          </View>
        </TabBarContext.Provider>
      </BlurTargetContext.Provider>
    </ExpoRouterThemeProvider>
  );
}
