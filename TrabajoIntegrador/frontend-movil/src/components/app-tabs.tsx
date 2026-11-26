import { NativeTabs } from 'expo-router/native-tabs';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.backgroundElement}
      labelStyle={{ selected: { color: colors.text } }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Convenios</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf="doc.text.magnifyingglass"
          md="manage_search"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="explore">
        <NativeTabs.Trigger.Label>Modo eco</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf="leaf"
          md="eco"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="qr">
        <NativeTabs.Trigger.Label>Escanear QR</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf="qrcode.viewfinder"
          md="qr_code_scanner"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
