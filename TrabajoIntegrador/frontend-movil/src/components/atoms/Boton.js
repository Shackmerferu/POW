import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useAppColorScheme } from '../../contexts/ColorSchemeContext';
import { useFontScale } from '../../contexts/FontScaleContext';
import { escalarEstilos } from '../../utils/escalaTexto';

export default function Boton({ titulo, onPress, secundario }) {
    const { colors } = useAppColorScheme();
    const { escala } = useFontScale();
    const estilos = escalarEstilos(styles, escala);

    return (
        <TouchableOpacity 
            style={[estilos.boton, { borderColor: colors.accent }, secundario
                ? { backgroundColor: colors.backgroundSelected }
                : { backgroundColor: '#003366' }]} 
            onPress={onPress}
        >
            <Text style={[estilos.texto, { color: secundario ? colors.accent : '#ffffff' }]}>
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
