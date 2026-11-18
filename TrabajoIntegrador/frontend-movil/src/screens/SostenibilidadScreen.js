import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Boton from '../components/atoms/Boton';

export default function SostenibilidadScreen({ alCerrar }) {
    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Impacto Institucional</Text>
            
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

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f4f4f4' },
    titulo: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#2e7d32' },
    tarjeta: { backgroundColor: '#e8f5e9', padding: 20, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: '#a5d6a7' },
    dato: { fontSize: 16, fontWeight: 'bold', color: '#1b5e20', marginBottom: 10 },
    cajaSupuestos: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 30, borderWidth: 1, borderColor: '#ccc' },
    supuestosTitulo: { fontWeight: 'bold', marginBottom: 10, color: '#333' },
    supuestoItem: { color: '#555', marginBottom: 5, fontSize: 14 }
});