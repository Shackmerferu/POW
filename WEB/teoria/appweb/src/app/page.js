'use client'
import React, { useState, useEffect } from 'react';
import InputForm from './components/InputForm';
import List from './components/List';
import Detail from './components/Detail';
import Edit from './components/Edit';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Image from 'next/image'
import styles from './page.module.css'

export default function Home() {
  const [tortas, setTortas] = useState([]);
  const [selectedTorta, setSelectedTorta] = useState(null);
  const url = 'http://localhost/api/tortas';
  
  useEffect(() => {
    fetchTortas();
  }, []);

  const fetchTortas = async () => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      setTortas(data.data);
    } catch (error) {
      console.error('Error fetching Tortas:', error);
    }
  };

  const addTorta = async (tortaData) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          /*
          'Accept': 'application/json',
          //'Content-Type': 'multipart/form-data'
          'Content-Type': 'application/json',
          'Access-Control-Request-Method':'POST',
          'Access-Control-Request-Headers':'Content-Type',
          */
        },
        body: JSON.stringify(tortaData),
      });
      const data = await response.json();
      setTortas([...tortas, data]);
    } catch (error) {
      console.error('Error agregando torta:', error);
    }
  };

  const updateTorta = async (tortaData) => {
    try {
      const response = await fetch(`${url}/${tortaData.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tortaData),
      });
      const updatedTorta = await response.json();
      const updatedTortas = tortas.map((torta) =>
        torta.id === updatedTorta.id ? updatedTorta : torta
      );
      setTortas(updatedTortas);
      setSelectedTorta(null);
    } catch (error) {
      console.error('Error actualizando torta:', error);
    }
  };

  const deleteTorta = async (tortaId) => {
    try {
      await fetch(`${url}/${tortaId}`, {
        method: 'DELETE',
      });
      const updatedTortas = tortas.filter((torta) => torta.id !== tortaId);
      setTortas(updatedTortas);
    } catch (error) {
      console.error('Error borrando torta:', error);
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <h1>CRUD de tortas</h1>
          <InputForm addTorta={addTorta} updateTorta={updateTorta} initialData={{ id: '', nombre: '', descripcion: '', precio: '' }} />
          <List tortas={tortas} viewTorta={setSelectedTorta} editTorta={setSelectedTorta} deleteTorta={deleteTorta} />
          {selectedTorta ? (
            <div>
              <Detail torta={selectedTorta} />
              <Edit torta={selectedTorta} updateTorta={updateTorta} />
            </div>
          ) : null}
        </Col>
      </Row>
    </Container>
  )
}
