import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function Boton({ titulo, onPress, secundario }) {
    return (
        <TouchableOpacity 
            style={[styles.boton, secundario ? styles.botonSecundario : styles.botonPrimario]} 
            onPress={onPress}
        >
            <Text style={[styles.texto, secundario ? styles.textoSecundario : styles.textoPrimario]}>
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
    botonPrimario: { backgroundColor: '#003366' },
    botonSecundario: { backgroundColor: '#e6f0fa' },
    texto: { fontWeight: 'bold', fontSize: 16 },
    textoPrimario: { color: '#ffffff' },
    textoSecundario: { color: '#003366' }
});