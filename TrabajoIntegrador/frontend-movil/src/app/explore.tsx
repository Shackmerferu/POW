import { Platform, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function HelpScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };
  const theme = useTheme();

  const contentPlatformStyle = Platform.select({
    android: {
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      paddingBottom: insets.bottom,
    },
    web: {
      paddingTop: Spacing.six,
      paddingBottom: Spacing.four,
    },
  });

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.background }]}
      contentInset={insets}
      contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="subtitle">Ayuda</ThemedText>
          <ThemedText style={styles.centerText} themeColor="textSecondary">
            Guía rápida para buscar, consultar y firmar convenios.
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.sectionsWrapper}>
          <Collapsible title="¿Cómo busco un convenio?">
            <ThemedText type="small">
              Escribí el nombre o número del convenio en el buscador. Para acotar los resultados,
              elegí «Más filtros» y buscá por año o estado.
            </ThemedText>
          </Collapsible>

          <Collapsible title="¿Qué significa «Pendiente de firma»?">
            <ThemedText type="small">
              El convenio está listo para que lo firmes. Abrilo para revisar sus datos y documentos
              antes de continuar.
            </ThemedText>
          </Collapsible>

          <Collapsible title="¿Cómo reviso los documentos?">
            <ThemedText type="small">
              Abrí un convenio y elegí «Abrir documento» para leer el archivo. También podés
              compartirlo o consultar su información de verificación.
            </ThemedText>
          </Collapsible>

          <Collapsible title="¿Cómo firmo un convenio?">
            <ThemedText type="small">
              Abrí un convenio pendiente de firma, dibujá tu firma en el recuadro y confirmá tu
              identidad con la huella o el reconocimiento facial del dispositivo.
            </ThemedText>
          </Collapsible>

          <Collapsible title="¿Qué puedo hacer sin conexión?">
            <ThemedText type="small">
              Podés consultar los convenios pendientes de firma guardados en el dispositivo. Para
              buscar, comentar, adjuntar documentos o firmar, necesitás conexión a internet.
            </ThemedText>
          </Collapsible>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: { flex: 1 },
  contentContainer: { flexDirection: 'row', justifyContent: 'center' },
  container: { maxWidth: MaxContentWidth, flexGrow: 1 },
  titleContainer: {
    gap: Spacing.three,
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.six,
  },
  centerText: { textAlign: 'center' },
  sectionsWrapper: {
    gap: Spacing.five,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
  },
});
