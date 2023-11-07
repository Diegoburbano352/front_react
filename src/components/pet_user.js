import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';

const CreatePet = () => {
  const [nombre, setNombre] = useState('');
  const [raza, setRaza] = useState('');
  const [edad, setEdad] = useState(0);
  const [sexo, setSexo] = useState('true'); // Cambié el estado a una cadena en lugar de un booleano

  //const usuario_cargado = JSON.parse(localStorage.getItem('user'));

  const handleCreatePet = async () => {
    try {
      const token_cargado = localStorage.getItem('token');
      const response = await axios.post(
        'https://prueba-render-agbv.onrender.com/api/pet_user',
        {
          nombre: nombre,
          raza: raza,
          edad: edad,
          sexo: sexo === 'true' ? true : false, // Convirtiendo la cadena en un booleano
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token_cargado,
          },
        }
      );

      console.log(response.data);

      // Mostrar mensaje de éxito con SweetAlert
      Swal.fire({
        icon: 'success',
        title: '¡Mascota creada!',
        text: 'La mascota se ha creado exitosamente waos .',
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Crear Mascota</h2>
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Nombre de la Mascota"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Raza"
        value={raza}
        onChange={(e) => setRaza(e.target.value)}
      />
      <input
        type="number"
        className="form-control mb-2"
        placeholder="Edad"
        value={edad}
        onChange={(e) => setEdad(parseInt(e.target.value))}
      />
      <div className="mb-2">
        <label className="me-2">Sexo:</label>
        <select
          className="form-select mb-2"
          value={sexo}
          onChange={(e) => setSexo(e.target.value)}
        >
          <option value="true">Macho</option>
          <option value="false">Hembra</option>
        </select>
      </div>
      <button onClick={handleCreatePet} className="btn btn-primary">
        Crear Mascota
      </button>
    </div>
  );
};

export default CreatePet;
