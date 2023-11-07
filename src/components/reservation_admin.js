import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState({});
  const [roomList, setRoomList] = useState([]);

  useEffect(() => {
    fetchReservations();
    fetchRoomList();
  }, []);

  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://prueba-render-agbv.onrender.com/api/reservation', {
        headers: {
          Authorization: token
        },
      });
      setReservations(response.data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  const fetchRoomList = async () => {
    try {
      const response = await axios.get('https://prueba-render-agbv.onrender.com/api/room');
      setRoomList(response.data);
    } catch (error) {
      console.error('Error fetching room list:', error);
    }
  };

  const handleUpdateReservation = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://prueba-render-agbv.onrender.com/api/reservation/${id}`, selectedReservation, {
        headers: {
          Authorization: token
        },
      });

      Swal.fire({
        icon: 'success',
        title: 'Reservación actualizada',
        text: 'La reservación se actualizó correctamente.',
      });

      setShowModal(false);
      fetchReservations();
    } catch (error) {
      console.error('Error updating reservation:', error);

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al intentar actualizar la reservación.',
      });
    }
  };

  const handleDeleteReservation = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://prueba-render-agbv.onrender.com/api/reservation/${id}`, {
        headers: {
          Authorization: token
        },
      });

      Swal.fire({
        icon: 'success',
        title: 'Reservación eliminada',
        text: 'La reservación se eliminó correctamente.',
      });

      fetchReservations();
    } catch (error) {
      console.error('Error deleting reservation:', error);

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al intentar eliminar la reservación.',
      });
    }
  };

  const handleModal = (reservation) => {
    setSelectedReservation(reservation);
    setShowModal(true);
  };

  const handleRoomChange = (e) => {
    const selectedRoom = e.target.value;
    const room = roomList.find(room => room.habitacion === selectedRoom);
    setSelectedReservation(prevReservation => ({
      ...prevReservation,
      habitacion: selectedRoom,
      precio: room ? room.precio : 0,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'habitacion') {
      const room = roomList.find(room => room.habitacion === value);
      setSelectedReservation(prevReservation => ({
        ...prevReservation,
        habitacion: value,
        precio: room ? room.precio : 0,
      }));
    } else {
      setSelectedReservation(prevReservation => ({
        ...prevReservation,
        [name]: value,
      }));
    }
  };

  return (
    <div className="container mt-4">
      <h2>Reservations</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Tipo Reserva</th>
            <th>Fecha Entrada</th>
            <th>Fecha Salida</th>
            <th>Hora Entrada</th>
            <th>Hora Salida</th>
            <th>Habitación</th>
            <th>Precio por noche</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation) => (
            <tr key={reservation.id}>
              <td>{reservation.tipo_reserva}</td>
              <td>{reservation.fecha_entrada.split('T')[0]}</td>
              <td>{reservation.fecha_salida.split('T')[0]}</td>
              <td>{reservation.hora_entrada}</td>
              <td>{reservation.hora_salida}</td>
              <td>{reservation.habitacion}</td>
              <td>{reservation.precio}</td>
              <td>
                <Button variant="info" onClick={() => handleModal(reservation)}>Actualizar reserva</Button>{' '}
                <Button variant="danger" onClick={() => handleDeleteReservation(reservation.id)}>Eliminar reserva</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Actualizar Reserva</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Habitación</Form.Label>
              <Form.Control as="select" name="habitacion" value={selectedReservation.habitacion} onChange={handleRoomChange}>
                <option value="">Selecciona una habitación</option>
                {roomList.map((room, index) => (
                  <option key={index} value={room.habitacion}>
                    {room.tipo_habitacion}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tipo de Reserva</Form.Label>
              <Form.Control
                type="text"
                name="tipo_reserva"
                value={selectedReservation.tipo_reserva}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fecha de Entrada</Form.Label>
              <Form.Control
                type="date"
                name="fecha_entrada"
                value={selectedReservation.fecha_entrada}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fecha de Salida</Form.Label>
              <Form.Control
                type="date"
                name="fecha_salida"
                value={selectedReservation.fecha_salida}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Hora de Entrada</Form.Label>
              <Form.Control
                type="time"
                name="hora_entrada"
                value={selectedReservation.hora_entrada}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Hora de Salida</Form.Label>
              <Form.Control
                type="time"
                name="hora_salida"
                value={selectedReservation.hora_salida}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Precio por Noche</Form.Label>
              <Form.Control
                type="number"
                name="precio"
                value={selectedReservation.precio}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cerrar</Button>
          <Button variant="primary" onClick={() => handleUpdateReservation(selectedReservation.id)}>Guardar Cambios</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Reservations;
