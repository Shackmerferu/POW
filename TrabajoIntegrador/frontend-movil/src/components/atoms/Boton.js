import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useAppColorScheme } from '../../contexts/ColorSchemeContext';

export default function Boton({ titulo, onPress, secundario }) {
    const { colors } = useAppColorScheme();
    return (
        <TouchableOpacity 
            style={[styles.boton, { borderColor: colors.accent }, secundario
                ? { backgroundColor: colors.backgroundSelected }
                : { backgroundColor: '#003366' }]} 
            onPress={onPress}
        >
            <Text style={[styles.texto, { color: secundario ? colors.accent : '#ffffff' }]}>
                {titulo}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    boton: {
        padding: 15, 
        borderRadius: 8, 
        alignItems: 'center', 
        marginBottom: 15, 
        borderWidth: 1, 
        borderColor: '#003366' 
    },
    texto: { fontWeight: 'bold', fontSize: 16 },
});
