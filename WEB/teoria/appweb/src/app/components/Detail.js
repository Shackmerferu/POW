import React from 'react';

const Detail = ({ torta }) => {
  return (
    <div>
      <h2>Detalle torta</h2>
      <p>Nombre: {torta.nombre}</p>
      <p>Descripocion: {torta.descripcion}</p>
      <p>Precio: {torta.precio}</p>
    </div>
  );
};

export default Detail;