import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { useAppColorScheme } from '../../contexts/ColorSchemeContext';
import { useFontScale } from '../../contexts/FontScaleContext';
import { escalarEstilos } from '../../utils/escalaTexto';

export default function InputTexto({ placeholder, valor, onChangeText, oculto }) {
    const { colors } = useAppColorScheme();
    const { escala } = useFontScale();
    const estilos = escalarEstilos(styles, escala);

    return (
        <View style={estilos.contenedor}>
            <TextInput
                style={[estilos.input, { backgroundColor: colors.backgroundElement, borderColor: colors.border, color: colors.text }]}
                placeholder={placeholder}
                value={valor}
                onChangeText={onChangeText}
                secureTextEntry={oculto}
                placeholderTextColor={colors.textSecondary}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    contenedor: { marginBottom: 15 },
    input: { 
        backgroundColor: '#fff', 
        padding: 15, 
        borderRadius: 8, 
        borderWidth: 1, 
        borderColor: '#ccc', 
        color: '#000',
        fontSize: 16,
    }
});
