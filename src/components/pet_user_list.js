import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Form, FormControl, InputGroup, Button, Modal } from 'react-bootstrap';
import { BiSearch } from 'react-icons/bi';
import Swal from 'sweetalert2';

const Mascotas = () => {
  const [mascotas, setMascotas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [nombre, setNombre] = useState('');
  const [raza, setRaza] = useState('');
  const [edad, setEdad] = useState(0);
  const [sexo, setSexo] = useState(true); // Set to 'Macho' by default
  const [modalMascotaId, setModalMascotaId] = useState(null); // Added state to store selected mascota ID

  const token_cargado = localStorage.getItem('token');
  //const usuario_cargado = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const obtenerMascotas = async () => {
      try {
        if (!token_cargado) {
          console.error('No hay un token válido');
          return;
        }

        const url = 'https://prueba-render-agbv.onrender.com/api/pet_user';
        const response = await axios.get(url, {
          headers: {
            Authorization: token_cargado
          }
        });

        setMascotas(response.data);
      } catch (error) {
        if (error.response) {
          console.error('Error de respuesta:', error.response.data);
        } else if (error.request) {
          console.error('No se recibió respuesta:', error.request);
        } else {
          console.error('Error en la solicitud:', error.message);
        }
      }
    };

    obtenerMascotas();
  }, [token_cargado]);

  const searchHandler = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleUpdate = async (mascotaId) => {
    try {
      const selectedMascota = mascotas.find((mascota) => mascota.id === mascotaId);
      if (selectedMascota) {
        setModalMascotaId(mascotaId);
        setNombre(selectedMascota.nombre);
        setRaza(selectedMascota.raza);
        setEdad(selectedMascota.edad);
        setSexo(selectedMascota.sexo);

        setShowModal(true);
      }
    } catch (error) {
      console.error('Error al actualizar la mascota:', error);
    }
  };

  const handleModalSave = async () => {
    try {
      const response = await axios.put(
        `https://prueba-render-agbv.onrender.com/api/pet_user/update/${modalMascotaId}`,
        {
          nombre: nombre,
          raza: raza,
          edad: edad,
          sexo: sexo,
        },
        {
          headers: {
            Authorization: token_cargado,
          },
        }
      );

      console.log(response.data);
      setShowModal(false);
      Swal.fire('Mascota actualizada', 'La mascota ha sido actualizada correctamente.', 'success');
      window.location.reload(); // Recargar la página
    } catch (error) {
      console.error('Error al actualizar la mascota:', error);
      setShowModal(false);
      Swal.fire('Error', 'No se pudo actualizar la mascota.', 'error');
    }
  };

  const handleDelete = async (mascotaId) => {
    const confirmDelete = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la mascota de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (confirmDelete.isConfirmed) {
      try {
        const response = await axios.delete(`https://prueba-render-agbv.onrender.com/api/pet_user/delete/${mascotaId}`, {
          headers: {
            Authorization: token_cargado
          }
        });
        console.log(response.data);
        Swal.fire('Mascota eliminada', 'La mascota ha sido eliminada correctamente.', 'success');
        window.location.reload(); // Recargar la página
      } catch (error) {
        console.error('Error al eliminar la mascota:', error);
        Swal.fire('Error', 'No se pudo eliminar la mascota.', 'error');
      }
    }
  };

  const filteredMascotas = mascotas.filter((mascota) =>
    mascota.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (filteredMascotas.length === 0 && searchTerm) {
      Swal.fire({
        icon: 'warning',
        title: 'Mascota no encontrada',
        text: `No se encontraron mascotas con el nombre '${searchTerm}'.`,
      });
    }
  }, [filteredMascotas, searchTerm]);

  return (
    <div className="container">
      <h2>Mis Mascotas</h2>

      <Form className="mb-3">
        <InputGroup>
          <InputGroup.Text>
            <BiSearch />
          </InputGroup.Text>
          <FormControl
            placeholder="Buscar por nombre..."
            aria-label="Buscar por nombre"
            aria-describedby="basic-addon2"
            value={searchTerm}
            onChange={searchHandler}
          />
        </InputGroup>
      </Form>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Actualizar Mascota</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Nombre de la Mascota</Form.Label>
              <Form.Control
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Raza</Form.Label>
              <Form.Control
                type="text"
                value={raza}
                onChange={(e) => setRaza(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Edad</Form.Label>
              <Form.Control
                type="number"
                value={edad}
                onChange={(e) => setEdad(parseInt(e.target.value))}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Sexo</Form.Label>
              <Form.Select value={sexo} onChange={(e) => setSexo(e.target.value)}>
                <option value="true">Macho</option>
                <option value="false">Hembra</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleModalSave}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="row row-cols-1 row-cols-md-3 g-4">
        {filteredMascotas.map((mascota) => (
          <div key={mascota.id} className="col">
            <Card>
              <Card.Body>
                <Card.Title>{mascota.nombre}</Card.Title>
                <Card.Text>
                  <p>Raza: {mascota.raza}</p>
                  <p>Edad: {mascota.edad}</p>
                  <p>Sexo: {mascota.sexo ? 'Macho' : 'Hembra'}</p>
                  <Button variant="primary" onClick={() => handleUpdate(mascota.id)}>Actualizar</Button>{' '}
                  <Button variant="danger" onClick={() => handleDelete(mascota.id)}>Eliminar</Button>
                </Card.Text>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Mascotas;
