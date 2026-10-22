import React from 'react';
import Table from 'react-bootstrap/Table';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const List = ({ tortas, viewTorta, editTorta, deleteTorta }) => {
  return (
    <Row>
      <Col>
        <h2>Listado de Tortas</h2>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Descripcion</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tortas.map((torta) => (
              <tr>
                <td>{torta.id}</td>
                <td>{torta.nombre}</td>
                <td>{torta.descripcion}</td>
                <td>{torta.precio}</td>
                <td>
                  <button onClick={() => viewTorta(torta)}>Ver</button>
                  <button onClick={() => editTorta(torta)}>Editar</button>
                  <button onClick={() => deleteTorta(torta.id)}>Borrar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Col>
    </Row>
  );
};

export default List;