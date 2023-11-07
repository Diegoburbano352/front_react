import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BiSearch } from 'react-icons/bi';

const PetManagement = () => {
  const [pets, setPets] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [show, setShow] = useState(false);
  const [selectedPet, setSelectedPet] = useState({
    id: 0,
    nombre: '',
    raza: '',
    edad: 0,
    sexo: false
  });

  useEffect(() => {
    fetchAllPets();
  }, []);

  const fetchAllPets = () => {
    const token = localStorage.getItem('token');
    axios.get('https://prueba-render-agbv.onrender.com/api/pet', {
      headers: {
        Authorization: token
      }
    })
      .then(response => {
        setPets(response.data);
      })
      .catch(error => {
        console.error('Error fetching pets:', error);
      });
  };

  useEffect(() => {
    if (searchName.trim() === '') {
      fetchAllPets();
    } else {
      const token = localStorage.getItem('token');
      axios.get(`https://prueba-render-agbv.onrender.com/api/pet/${searchName}`, {
        headers: {
          Authorization: token
        }
      })
        .then(response => {
          if (response.data.length === 0) {
            Swal.fire({
              icon: 'warning',
              title: 'Pet not found',
              text: `No pets found with the name '${searchName}'.`,
            });
          } else {
            setPets(response.data);
          }
        })
        .catch(error => {
          console.error('Error fetching pets by name:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to fetch pets by name',
          });
        });
    }
  }, [searchName]);

  const handleUpdatePet = () => {
    const token = localStorage.getItem('token');
    axios.put(`https://prueba-render-agbv.onrender.com/api/pet/${selectedPet.id}`, selectedPet, {
      headers: {
        Authorization: token
      }
    })
      .then(response => {
        Swal.fire({
          icon: 'success',
          title: 'Pet updated',
          text: response.data.message,
        });
        fetchAllPets();
        setShow(false);
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response.data.message,
        });
      });
  };

  const handleDeletePet = (id) => {
    const token = localStorage.getItem('token');
    axios.delete(`https://prueba-render-agbv.onrender.com/api/pet/${id}`, {
      headers: {
        Authorization: token
      }
    })
      .then(response => {
        Swal.fire({
          icon: 'success',
          title: 'Pet deleted',
          text: response.data.message,
        });
        fetchAllPets();
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response.data.message,
        });
      });
  };

  const handleClose = () => setShow(false);

  const handleShow = (pet) => {
    setSelectedPet(pet);
    setShow(true);
  };

  return (
    <div className="container mt-4">
      <h2>Administración de mascotas</h2>
      <div className="mb-3 input-group">
        <span className="input-group-text"><BiSearch /></span>
        <input
          type="text"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="form-control"
          placeholder="Buscar mascota por nombre"
        />
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Raza</th>
            <th>Edad</th>
            <th>Sexo</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pets.map((Pet) => (
            <tr key={Pet.id}>
              <td>{Pet.nombre}</td>
              <td>{Pet.raza}</td>
              <td>{Pet.edad}</td>
              <td>{Pet.sexo ? 'Macho' : 'Hembra'}</td>
              <td>
                <Button variant="info" onClick={() => handleShow(Pet)}>Update</Button>{' '}
                <Button variant="danger" onClick={() => handleDeletePet(Pet.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Actualizar mascota</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="nombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={selectedPet.nombre}
                onChange={(e) => setSelectedPet({ ...selectedPet, nombre: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="raza">
              <Form.Label>Raza</Form.Label>
              <Form.Control
                type="text"
                value={selectedPet.raza}
                onChange={(e) => setSelectedPet({ ...selectedPet, raza: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="edad">
              <Form.Label>Edad</Form.Label>
              <Form.Control
                type="number"
                value={selectedPet.edad}
                onChange={(e) => setSelectedPet({ ...selectedPet, edad: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="sexo">
              <Form.Label>Sexo</Form.Label>
              <Form.Control
                as="select"
                value={selectedPet.sexo}
                onChange={(e) => setSelectedPet({ ...selectedPet, sexo: e.target.value === 'true' })}
              >
                <option value="true">Macho</option>
                <option value="false">Hembra</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdatePet}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PetManagement;