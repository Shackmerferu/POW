import React from 'react';
import InputForm from './InputForm';

const Edit = ({ torta, updateTorta }) => {
  return (
    <div>
      <h2>Editar Torta</h2>
      <InputForm initialData={torta} updateTorta={updateTorta} />
    </div>
  );
};

export default Edit;