import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, PanResponder, TouchableOpacity } from 'react-native';

export default function FirmaPad({ onCambioFirma, colores }) {
  const [puntos, setPuntos] = useState([]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        setPuntos((prev) => {
          const nuevos = [...prev, { x: locationX, y: locationY }];
          onCambioFirma?.(nuevos);
          return nuevos;
        });
      },
      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        setPuntos((prev) => {
          const nuevos = [...prev, { x: locationX, y: locationY }];
          onCambioFirma?.(nuevos);
          return nuevos;
        });
      },
    })
  ).current;

  const limpiar = () => {
    setPuntos([]);
    onCambioFirma?.([]);
  };

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, { color: colores?.text || '#333' }]}>
        Dibujá tu firma con el dedo en el recuadro:
      </Text>
      <View
        style={[styles.canvas, { borderColor: colores?.accent || '#003366' }]}
        {...panResponder.panHandlers}
      >
        {puntos.length === 0 && (
          <Text style={styles.placeholder}>Trazá tu firma aquí</Text>
        )}
        {puntos.map((p, idx) => (
          <View
            key={idx}
            style={[styles.punto, { left: p.x - 2, top: p.y - 2 }]}
          />
        ))}
      </View>
      <TouchableOpacity onPress={limpiar} style={styles.btnLimpiar}>
        <Text style={styles.txtLimpiar}>Borrar y volver a firmar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: '100%', marginVertical: 10 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 6 },
  canvas: {
    height: 160,
    width: '100%',
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: { color: '#aaa', fontSize: 14 },
  punto: {
    position: 'absolute',
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#111',
  },
  btnLimpiar: { alignSelf: 'flex-end', marginTop: 6 },
  txtLimpiar: { color: '#c0392b', fontWeight: '600', fontSize: 13 },
});
