import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, PanResponder, TouchableOpacity } from 'react-native';

import { useFontScale } from '../../contexts/FontScaleContext';
import { escalarEstilos } from '../../utils/escalaTexto';

const MAX_PUNTOS = 2000;

export default function FirmaPad({ onCambioFirma, colores }) {
  const { escala } = useFontScale();
  const estilos = escalarEstilos(styles, escala);

  const [puntos, setPuntos] = useState([]);
  const [medidas, setMedidas] = useState({ ancho: 0, alto: 0 });
  const onCambioFirmaRef = useRef(onCambioFirma);

  useEffect(() => {
    onCambioFirmaRef.current = onCambioFirma;
  }, [onCambioFirma]);

  // Notificamos al componente padre fuera del updater de estado para evitar
  // ciclos de render (el bug de "bucle infinito" al salir del recuadro).
  useEffect(() => {
    onCambioFirmaRef.current?.(puntos);
  }, [puntos]);

  const panResponder = useMemo(() => {
    const agregarPunto = (x, y) => {
      if (!Number.isFinite(x) || !Number.isFinite(y)) return;

      // Si el dedo sale del recuadro no registramos el trazo. El responder
      // sigue activo, por lo que al volver a entrar se continúa dibujando.
      if (x < 0 || y < 0) return;
      if (medidas.ancho > 0 && x > medidas.ancho) return;
      if (medidas.alto > 0 && y > medidas.alto) return;

      setPuntos((actuales) => {
        if (actuales.length >= MAX_PUNTOS) return actuales;

        const ultimo = actuales[actuales.length - 1];
        if (ultimo && Math.abs(ultimo.x - x) < 0.5 && Math.abs(ultimo.y - y) < 0.5) {
          return actuales;
        }

        return [...actuales, { x, y }];
      });
    };

    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        agregarPunto(locationX, locationY);
      },
      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        agregarPunto(locationX, locationY);
      },
    });
  }, [medidas.ancho, medidas.alto]);

  const limpiar = () => {
    setPuntos([]);
  };

  return (
    <View style={estilos.wrapper}>
      <Text style={[estilos.label, { color: colores?.text || '#333' }]}>
        Dibujá tu firma con el dedo en el recuadro:
      </Text>
      <View
        style={[estilos.canvas, { borderColor: colores?.accent || '#003366' }]}
        onLayout={(evento) => {
          const { width, height } = evento.nativeEvent.layout;
          setMedidas({ ancho: width, alto: height });
        }}
        {...panResponder.panHandlers}
      >
        {puntos.length === 0 && (
          <Text style={estilos.placeholder}>Trazá tu firma aquí</Text>
        )}
        {puntos.map((p, idx) => (
          <View
            key={idx}
            style={[estilos.punto, { left: p.x - 2, top: p.y - 2 }]}
          />
        ))}
      </View>
      <TouchableOpacity onPress={limpiar} style={estilos.btnLimpiar}>
        <Text style={estilos.txtLimpiar}>Borrar y volver a firmar</Text>
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
