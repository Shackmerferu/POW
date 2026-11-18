import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

export default function InputTexto({ placeholder, valor, onChangeText, oculto }) {
    return (
        <View style={styles.contenedor}>
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                value={valor}
                onChangeText={onChangeText}
                secureTextEntry={oculto}
                placeholderTextColor="#888"
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
        color: '#000' 
    }
});