import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import { useAppColorScheme } from '../contexts/ColorSchemeContext';
import { useFontScale } from '../contexts/FontScaleContext';
import { createStyles } from '../styles/SostenibilidadScreen.styles';

export default function SostenibilidadScreen() {
    const { colors } = useAppColorScheme();
    const { escala } = useFontScale();
    const styles = useMemo(() => createStyles(colors, escala), [colors, escala]);
    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.titulo, { color: colors.positive }]}>Ahorro con la gestión digital</Text>
            
            <View style={styles.tarjeta}>
                <Text style={styles.dato}>🌳 5.000 hojas de papel ahorradas</Text>
                <Text style={styles.dato}>⏱️ 1.200 horas de gestión ahorradas</Text>
                <Text style={styles.dato}>🚗 300 viajes para firmar evitados</Text>
            </View>

            <View style={styles.cajaSupuestos}>
                <Text style={styles.supuestosTitulo}>¿Cómo se estimó este ahorro?</Text>
                <Text style={styles.supuestoItem}>• Se calcula sobre 100 convenios gestionados por año.</Text>
                <Text style={styles.supuestoItem}>• Se estima que cada convenio reemplaza 50 hojas impresas.</Text>
                <Text style={styles.supuestoItem}>• Se consideran 12 horas de traslados y seguimiento ahorradas por trámite.</Text>
            </View>
        </View>
    );
}