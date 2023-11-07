import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const CreateRoom = () => {
  const [tipoHabitacion, setTipoHabitacion] = useState('');
  const [capacidad, setCapacidad] = useState(0);
  const [comodidades, setComodidades] = useState('');
  const [tarifa, setTarifa] = useState(0);
  const [disponibilidad, setDisponibilidad] = useState(true); // Tipo booleano

  const handleCreateRoom = async () => {
    try {
      var token_cargado = localStorage.getItem("token");
      const response = await axios.post('https://prueba-render-agbv.onrender.com/api/room', {
        tipo_habitacion: tipoHabitacion,
        capacidad: capacidad,
        comodidades: comodidades,
        tarifa: tarifa,
        estado_disponibilidad: disponibilidad, // Aquí debería enviarse directamente el valor booleano
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token_cargado
        }
      });

      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Habitación Creada',
          text: '¡La habitación se ha creado exitosamente!',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: '¡Ups! Hubo un problema al crear la habitación.',
        });
      }

      // Resto del código para manejar la respuesta
      console.log(response.data);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al crear la habitación',
      });
    }
  };

  return (
    <div className="container mt-4">
      <h2>Crear Habitación</h2>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Tipo de Habitación"
          value={tipoHabitacion}
          onChange={(e) => setTipoHabitacion(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <input
          type="number"
          className="form-control"
          placeholder="Capacidad"
          value={capacidad}
          onChange={(e) => setCapacidad(parseInt(e.target.value))}
        />
      </div>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Comodidades"
          value={comodidades}
          onChange={(e) => setComodidades(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <input
          type="number"
          className="form-control"
          placeholder="Tarifa"
          value={tarifa}
          onChange={(e) => setTarifa(parseFloat(e.target.value))}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Disponibilidad:</label>
        <select
          className="form-select"
          value={disponibilidad ? 'true' : 'false'} // Convertir el valor booleano a 'true' o 'false'
          onChange={(e) => setDisponibilidad(e.target.value === 'true')}
        >
          <option value="true">Disponible</option>
          <option value="false">No Disponible</option>
        </select>
      </div>
      <button className="btn btn-primary" onClick={handleCreateRoom}>
        Crear Habitación
      </button>
    </div>
  );
};

export default CreateRoom;
