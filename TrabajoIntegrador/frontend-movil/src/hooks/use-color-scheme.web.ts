import { useAppColorScheme } from '@/contexts/ColorSchemeContext';

export function useColorScheme() {
  return useAppColorScheme().colorScheme;
}
