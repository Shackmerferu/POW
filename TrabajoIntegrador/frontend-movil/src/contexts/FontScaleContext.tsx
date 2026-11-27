import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export const FONT_SCALE_STORAGE_KEY = '@perfil_font_scale';

export const ESCALAS_TEXTO = [
  { label: 'Chica', valor: 0.88 },
  { label: 'Mediana', valor: 1 },
  { label: 'Grande', valor: 1.2 },
] as const;

type FontScaleContextValue = {
  escala: number;
  cambiarEscala: (valor: number) => Promise<void>;
};

const FontScaleContext = createContext<FontScaleContextValue | null>(null);

export function FontScaleProvider({ children }: React.PropsWithChildren) {
  const [escala, setEscala] = useState(1);

  useEffect(() => {
    let mounted = true;

    AsyncStorage.getItem(FONT_SCALE_STORAGE_KEY)
      .then((guardada) => {
        const valor = Number(guardada);
        if (mounted && Number.isFinite(valor) && valor >= 0.8 && valor <= 1.5) {
          setEscala(valor);
        }
      })
      .catch(() => undefined);

    return () => {
      mounted = false;
    };
  }, []);

  const cambiarEscala = useCallback(async (valor: number) => {
    const valorSeguro = Number.isFinite(valor) && valor > 0 ? valor : 1;
    setEscala(valorSeguro);
    await AsyncStorage.setItem(FONT_SCALE_STORAGE_KEY, String(valorSeguro));
  }, []);

  const value = useMemo(() => ({ escala, cambiarEscala }), [escala, cambiarEscala]);

  return <FontScaleContext.Provider value={value}>{children}</FontScaleContext.Provider>;
}

export function useFontScale() {
  const context = useContext(FontScaleContext);
  if (!context) {
    throw new Error('useFontScale debe usarse dentro de FontScaleProvider');
  }
  return context;
}
