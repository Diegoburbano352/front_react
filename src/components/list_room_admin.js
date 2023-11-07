import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Form, FormControl, InputGroup, Button, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BiSearch } from 'react-icons/bi';

const backgroundStyle = {
  backgroundImage: "url('https://static.boredpanda.es/blog/wp-content/uploads/2015/07/gatos-durmiendo-8.jpg')",
  backgroundSize: 'cover',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center'
};




const ListRoomAdmin = () => {
  const [habitaciones, setHabitaciones] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const token_cargado = localStorage.getItem('token');

  useEffect(() => {
    const fetchHabitaciones = async () => {
      try {
        let url = 'https://prueba-render-agbv.onrender.com/api/room';

        const response = await axios.get(url);
        setHabitaciones(response.data);
        setError(false);
      } catch (error) {
        console.error(error);

        if (error.response && error.response.status === 404) {
          setError(true);
        } else {
          Swal.fire('Error', 'Hubo un problema al cargar las habitaciones.', 'error');
        }
      }
    };

    fetchHabitaciones();
  }, [searchTerm]);

  const handleSearch = e => {
    e.preventDefault();
    if (searchTerm.trim() !== '') {
      setSearchTerm(searchTerm);
    }
  };

  const handleModalClose = () => {
    setModalShow(false);
  };

  const handleModalSave = async () => {
    try {
      console.log('Estado de disponibilidad a actualizar:', selectedRoom.estado_disponibilidad);

      const response = await axios.put(
        `https://prueba-render-agbv.onrender.com/api/room/${selectedRoom.id}`,
        selectedRoom,
        {
          headers: {
            Authorization: token_cargado,
          },
        }
      );

      console.log(response.data);
      setModalShow(false);
      Swal.fire('Habitación actualizada', 'La habitación ha sido actualizada correctamente.', 'success');
      // Actualizar el estado o recargar los datos
      // window.location.reload();
    } catch (error) {
      console.error('Error al actualizar la habitación:', error);
      setModalShow(false);
      Swal.fire('Error', 'No se pudo actualizar la habitación.', 'error');
    }
  };

  const handleUpdate = habitacionId => {
    const selectedHabitacion = habitaciones.find(habitacion => habitacion.id === habitacionId);
    if (selectedHabitacion) {
      setSelectedRoom(selectedHabitacion);
      setModalShow(true);
    }
  };

  const handleDelete = async habitacionId => {
    // Implementación para eliminar la habitación
    try {
      const response = await axios.delete(`https://prueba-render-agbv.onrender.com/api/room/${habitacionId}`, {
        headers: {
          Authorization: token_cargado
        },
      });
      console.log(response.data);
      Swal.fire('Habitación eliminada', 'La habitación ha sido eliminada correctamente.', 'success');
      window.location.reload(); // Recargar la página
    } catch (error) {
      console.error('Error al eliminar la habitación:', error);
      Swal.fire('Error', 'No se pudo eliminar la habitación.', 'error');
    }
  };

  const filteredHabitaciones = habitaciones.filter(habitacion =>
    habitacion.tipo_habitacion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filteredHabitaciones.length === 0 && searchTerm) {
    Swal.fire({
      icon: 'warning',
      title: '¡Habitación no encontrada!',
      text: `No se encontraron habitaciones del tipo '${searchTerm}'.`,
    });
  }

  return (
    <div style={backgroundStyle}>
    <div className="container">
      <h2>Listado de Habitaciones</h2>

      <Form onSubmit={handleSearch}>
        <InputGroup className="mb-3">
          <Button variant="outline-secondary" id="button-addon2" type="submit">
            <BiSearch />
          </Button>
          <FormControl
            placeholder="Buscar por tipo de habitación..."
            aria-label="Buscar por tipo de habitación"
            aria-describedby="basic-addon2"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </InputGroup>
      </Form>

      {!error ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Tipo de habitación</th>
              <th>Capacidad</th>
              <th>Comodidades</th>
              <th>Estado</th>
              <th>Tarifa</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredHabitaciones.map(habitacion => (
              <tr key={habitacion.id}>
                <td>{habitacion.tipo_habitacion}</td>
                <td>{habitacion.capacidad}</td>
                <td>{habitacion.comodidades}</td>
                <td>{habitacion.estado_disponibilidad ? 'Disponible' : 'No Disponible'}</td>
                <td>Q{habitacion.tarifa}</td>
                <td>
                  <Button variant="info" onClick={() => handleUpdate(habitacion.id)}>
                    Actualizar
                  </Button>{' '}
                  <Button variant="danger" onClick={() => handleDelete(habitacion.id)}>
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div className="alert alert-danger" role="alert">
          ¡Habitación no encontrada!
        </div>
      )}

      <Modal show={modalShow} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Actualizar Habitación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Tipo de habitación</Form.Label>
            <Form.Control
              type="text"
              value={selectedRoom?.tipo_habitacion || ''}
              onChange={e => setSelectedRoom({ ...selectedRoom, tipo_habitacion: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Capacidad</Form.Label>
            <Form.Control
              type="number"
              value={selectedRoom?.capacidad || ''}
              onChange={e => setSelectedRoom({ ...selectedRoom, capacidad: parseInt(e.target.value) })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Comodidades</Form.Label>
            <Form.Control
              type="text"
              value={selectedRoom?.comodidades || ''}
              onChange={e => setSelectedRoom({ ...selectedRoom, comodidades: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Estado de disponibilidad</Form.Label>
            <Form.Select
              value={selectedRoom?.estado_disponibilidad ? 'Disponible' : 'No Disponible'}
              onChange={e => {
                const value = e.target.value;
                const booleanValue = value === 'Disponible';
                setSelectedRoom({ ...selectedRoom, estado_disponibilidad: booleanValue });
              }}
            >
              <option value={'Disponible'}>Disponible</option>
              <option value={'No Disponible'}>No Disponible</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Tarifa</Form.Label>
            <Form.Control
              type="number"
              value={selectedRoom?.tarifa || ''}
              onChange={e => setSelectedRoom({ ...selectedRoom, tarifa: parseFloat(e.target.value) })}
            />
          </Form.Group>
          {/* Agrega aquí otros campos para actualizar la habitación si es necesario */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleModalSave}>
            Guardar cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
    </div>
  );
};

export default ListRoomAdmin;
