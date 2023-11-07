import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';

const ReservationManagement = () => {
  const [newReservation, setNewReservation] = useState({
    tipo_reserva: '',
    fecha_entrada: '',
    fecha_salida: '',
    hora_entrada: '',
    hora_salida: '',
    roomId: '',
    precio: 0,
    userId: ''
  });

  const [roomTypes, setRoomTypes] = useState([]);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function fetchRoomTypes() {
      try {
        const response = await axios.get('https://prueba-render-agbv.onrender.com/api/room');
        setRoomTypes(response.data);
        setUser(JSON.parse(localStorage.getItem('user')));
      } catch (error) {
        console.error(error);
      }
    }
    fetchRoomTypes();
  }, []);

  const findRoomPrice = (roomId) => {
    const selectedRoom = roomTypes.find((room) => room.id.toString() === roomId);
    const roomPrice = selectedRoom ? selectedRoom.tarifa : 0;
    const price = roomPrice ? parseInt(roomPrice, 10) : 0;
    return isNaN(price) ? 0 : price;
  };

  const calculateTotal = () => {
    const { fecha_entrada, fecha_salida } = newReservation;
    const start = new Date(fecha_entrada);
    const end = new Date(fecha_salida);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays * newReservation.precio;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'roomId') {
      const roomPrice = findRoomPrice(value);
      setNewReservation((prevState) => ({
        ...prevState,
        roomId: value,
        precio: roomPrice
      }));
    } else {
      setNewReservation((prevState) => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleCreateReservation = async () => {
    try {
      const token_cargado = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: token_cargado
        }
      };

      setNewReservation((prevReservation) => ({
        ...prevReservation,
        userId: user.id
      }));

      if (user.rol === 'usuario') {
        // Acciones para el rol de "usuario"
      }

      const response = await axios.post(
        'https://prueba-render-agbv.onrender.com/api/reservation_user/create',
        newReservation,
        config
      );

      console.log(response.data);
      Swal.fire('¡Éxito!', 'Reserva creada con éxito.', 'success');
    } catch (error) {
      console.error(error);

      if (error.response) {
        const errorMessage = error.response.data.message;
        if (errorMessage.includes('Por favor, proporcione todos los campos necesarios.')) {
          Swal.fire('Error', 'Por favor, complete todos los campos requeridos.', 'error');
        } else if (errorMessage.includes('La habitación ya está reservada por este usuario en esas fechas.')) {
          Swal.fire('Error', 'La habitación ya está reservada por este usuario en esas fechas.', 'error');
        } else if (errorMessage.includes('La habitación ya está reservada en esas fechas.')) {
          Swal.fire('Error', 'La habitación ya está reservada en esas fechas.', 'error');
        } else {
          Swal.fire('Error', 'Error al crear la reserva.', 'error');
        }
      } else {
        Swal.fire('Error', 'Error en la solicitud.', 'error');
      }
    }
  };

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  return (
    <div
      style={{
        backgroundImage: "url('https://st3.depositphotos.com/6134934/13443/v/450/depositphotos_134430528-stock-illustration-vector-pattern-seamless-of-background.jpg')",
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <h2 style={{ textAlign: 'center' }}>Crear Reserva</h2>
      <Button variant="primary" onClick={handleShow} style={{ display: 'block', margin: '0 auto', marginTop: '20px', marginBottom: '20px' }}>
        Crear una nueva reservación
      </Button>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title style={{ margin: 'auto' }}>Crear Reserva</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Campos de entrada */}
          <label htmlFor="tipo_reserva">Tipo de Reserva:</label>
          <input
            type="text"
            name="tipo_reserva"
            placeholder="Tipo de Reserva"
            value={newReservation.tipo_reserva}
            onChange={handleInputChange}
            className="form-control mb-2"
          />
          <label htmlFor="fecha_entrada">Fecha de Entrada:</label>
          <input
            type="date"
            name="fecha_entrada"
            placeholder="Fecha de Entrada"
            value={newReservation.fecha_entrada}
            onChange={handleInputChange}
            className="form-control mb-2"
          />
          <label htmlFor="fecha_salida">Fecha de Salida:</label>
          <input
            type="date"
            name="fecha_salida"
            placeholder="Fecha de Salida"
            value={newReservation.fecha_salida}
            onChange={handleInputChange}
            className="form-control mb-2"
          />
          <label htmlFor="hora_entrada">Hora de Entrada:</label>
          <input
            type="time"
            name="hora_entrada"
            placeholder="Hora de Entrada"
            value={newReservation.hora_entrada}
            onChange={handleInputChange}
            className="form-control mb-2"
          />
          <label htmlFor="hora_salida">Hora de Salida:</label>
          <input
            type="time"
            name="hora_salida"
            placeholder="Hora de Salida"
            value={newReservation.hora_salida}
            onChange={handleInputChange}
            className="form-control mb-2"
          />
          <label htmlFor="roomId">Selecciona una habitación:</label>
          <select name="roomId" value={newReservation.roomId} onChange={handleInputChange} className="form-select mb-2">
            <option value="">Selecciona una habitación</option>
            {roomTypes.map((roomType) => (
              <option key={roomType.id} value={roomType.id}>
                {roomType.tipo_habitacion}
              </option>
            ))}
          </select>
          <label htmlFor="precio">Precio por noche:</label>
          <input
            type="number"
            name="precio"
            placeholder="Precio"
            value={newReservation.precio}
            readOnly
            className="form-control mb-2"
          />
          {/* <p style={{ marginLeft: '10px' }}>{newReservation.precio === 0 ? '' : `Q${newReservation.precio}`}</p> */}
          <p htmlFor="total">Total: {newReservation.precio === 0 ? '' : `Q${calculateTotal()}`}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleCreateReservation}>
            Crear Reserva
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ReservationManagement;
