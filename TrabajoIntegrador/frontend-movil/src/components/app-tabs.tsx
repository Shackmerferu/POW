import { NativeTabs } from 'expo-router/native-tabs';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useFontScale } from '@/contexts/FontScaleContext';
import { useTabBar } from '@/contexts/TabBarContext';

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const { escala } = useFontScale();
  const { tabBarHidden } = useTabBar();

  return (
    <NativeTabs
      hidden={tabBarHidden}
      backgroundColor={colors.background}
      indicatorColor={scheme === 'dark' ? colors.backgroundElement : '#d7e1eb'}
      iconColor={{
        default: scheme === 'dark' ? colors.textSecondary : '#465363',
        selected: colors.accent,
      }}
      labelStyle={{
        default: { color: scheme === 'dark' ? colors.textSecondary : '#465363', fontSize: 11 * escala },
        selected: { color: colors.accent, fontWeight: '700', fontSize: 11 * escala },
      }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Convenios</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf="doc.text.magnifyingglass"
          md="manage_search"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="qr">
        <NativeTabs.Trigger.Label>Escanear QR</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf="qrcode.viewfinder"
          md="qr_code_scanner"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="explore">
        <NativeTabs.Trigger.Label>Modo eco</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf="leaf"
          md="eco"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>Perfil</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="person.crop.circle" md="account_circle" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
