import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';


const InputForm = ({ addTorta, updateUser, initialData }) => {
  const [formData, setFormData] = useState(initialData);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (formData.id) {
      updateUser(formData);
    } else {
      addTorta(formData);
    }
    setFormData({ id: '', nombre: '', descripcion: '', precio: '' });
  };

  return (
    <Row>
      <Col>
        <Card>
          <Card.Body>
            <Card.Title>Nueva Torta</Card.Title>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col><input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} placeholder='Nombre'/></Col>
                <Col><input type="text" name="descripcion" value={formData.descripcion} onChange={handleInputChange} placeholder='Descripcion'/></Col>
                <Col><input type="text" name="precio" value={formData.precio} onChange={handleInputChange} placeholder='Precio'/></Col>
                <Col><Button variant="primary" type="submit">Guardar</Button></Col>
              </Row>              
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default InputForm;