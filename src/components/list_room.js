import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, FormControl, InputGroup, Button, Card } from 'react-bootstrap';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BiSearch } from 'react-icons/bi';

const Habitaciones = () => {
  const [habitaciones, setHabitaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchHabitaciones = async () => {
      try {
        let url = 'https://prueba-render-agbv.onrender.com/api/room';

        const response = await axios.get(url);
        setHabitaciones(response.data);
        setLoading(false);
        setError(false);
      } catch (error) {
        console.error(error);

        if (error.response && error.response.status === 404) {
          setError(true);
        } else {
          Swal.fire('Error', 'Hubo un problema al cargar las habitaciones.', 'error');
        }

        setLoading(false);
      }
    };

    fetchHabitaciones();
  }, [searchTerm]);

  const handleSearch = e => {
    e.preventDefault();
    if (searchTerm.trim() !== '') {
      setLoading(true);
      setSearchTerm(searchTerm);
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

      {!loading && !error ? (
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {filteredHabitaciones.map(habitacion => (
            <div key={habitacion.id} className="col">
              <Card
                bg="info"
                text="white"
                style={{
                  width: '18rem',
                  backgroundColor: '#17a2b8',
                  border: '1px solid #17a2b8',
                  boxShadow: '2px 2px 5px #888888',
                }}
                className="mb-4"
              >
                <Card.Body className="rounded">
                  <Card.Title style={{ fontSize: '1.5rem' }}>{habitacion.nombre}</Card.Title>
                  <Card.Text>
                    <p>Tipo de habitación: {habitacion.tipo_habitacion}</p>
                    <p>Capacidad: {habitacion.capacidad}</p>
                    <p>Comodidades: {habitacion.comodidades}</p>
                    <p>Estado: {habitacion.estado_disponibilidad ? 'Disponible' : 'No disponible'}</p>
                    <p>Tarifa: Q{habitacion.tarifa}</p>
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          ¡Habitación no encontrada!
        </div>
      ) : null}
    </div>
  );
};

export default Habitaciones;
