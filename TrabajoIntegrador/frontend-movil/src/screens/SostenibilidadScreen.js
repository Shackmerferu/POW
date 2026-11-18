import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Boton from '../components/atoms/Boton';
import { useAppColorScheme } from '../contexts/ColorSchemeContext';

export default function SostenibilidadScreen({ alCerrar }) {
    const { colors } = useAppColorScheme();
    const styles = createStyles(colors);
    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.titulo, { color: colors.positive }]}>Impacto Institucional</Text>
            
            <View style={styles.tarjeta}>
                <Text style={styles.dato}>🌳 5.000 Hojas de papel ahorradas</Text>
                <Text style={styles.dato}>⏱️ 1.200 Horas de gestión optimizadas</Text>
                <Text style={styles.dato}>🚗 300 Viajes físicos de firma evitados</Text>
            </View>

            <View style={styles.cajaSupuestos}>
                <Text style={styles.supuestosTitulo}>Supuestos utilizados (Proyección Anual):</Text>
                <Text style={styles.supuestoItem}>• 100 convenios procesados al año por la UNLPam.</Text>
                <Text style={styles.supuestoItem}>• 50 fojas impresas por cada expediente físico.</Text>
                <Text style={styles.supuestoItem}>• 12 horas de cadetería y seguimiento por trámite.</Text>
            </View>

            <Boton titulo="Volver al Panel" onPress={alCerrar} />
        </View>
    );
}

const createStyles = (colors) => StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: colors.background },
    titulo: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
    tarjeta: { backgroundColor: colors.positiveBackground, padding: 20, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: colors.border },
    dato: { fontSize: 16, fontWeight: 'bold', color: colors.positive, marginBottom: 10 },
    cajaSupuestos: { backgroundColor: colors.backgroundElement, padding: 15, borderRadius: 8, marginBottom: 30, borderWidth: 1, borderColor: colors.border },
    supuestosTitulo: { fontWeight: 'bold', marginBottom: 10, color: colors.text },
    supuestoItem: { color: colors.textSecondary, marginBottom: 5, fontSize: 14 }
});
