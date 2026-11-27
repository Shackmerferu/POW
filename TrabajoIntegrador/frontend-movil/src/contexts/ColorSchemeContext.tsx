import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

export type AppColorScheme = 'light' | 'dark';

type ColorSchemeContextValue = {
  colorScheme: AppColorScheme;
  colors: (typeof Colors)[AppColorScheme];
  toggleColorScheme: () => void;
};

const STORAGE_KEY = '@tema_aplicacion';
const ColorSchemeContext = createContext<ColorSchemeContextValue | null>(null);

export function ColorSchemeProvider({ children }: React.PropsWithChildren) {
  const systemScheme = useSystemColorScheme();
  const [colorScheme, setColorScheme] = useState<AppColorScheme>(
    systemScheme === 'dark' ? 'dark' : 'light'
  );

  useEffect(() => {
    let mounted = true;

    AsyncStorage.getItem(STORAGE_KEY)
      .then((savedScheme) => {
        if (mounted && (savedScheme === 'light' || savedScheme === 'dark')) {
          setColorScheme(savedScheme);
        }
      })
      .catch(() => undefined);

    return () => {
      mounted = false;
    };
  }, []);

  const toggleColorScheme = useCallback(() => {
    setColorScheme((currentScheme) => {
      const nextScheme = currentScheme === 'light' ? 'dark' : 'light';
      AsyncStorage.setItem(STORAGE_KEY, nextScheme).catch(() => undefined);
      return nextScheme;
    });
  }, []);

  const value = useMemo(
    () => ({ colorScheme, colors: Colors[colorScheme], toggleColorScheme }),
    [colorScheme, toggleColorScheme]
  );

  return <ColorSchemeContext.Provider value={value}>{children}</ColorSchemeContext.Provider>;
}

export function useAppColorScheme() {
  const context = useContext(ColorSchemeContext);
  if (!context) {
    throw new Error('useAppColorScheme debe usarse dentro de ColorSchemeProvider');
  }
  return context;
}
