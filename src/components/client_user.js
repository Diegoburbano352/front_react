import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { BsPlus } from 'react-icons/bs';

const ClientUser = () => {
  const [show, setShow] = useState(false);
 // const [clients, setClients] = useState([]);
  const [client, setClient] = useState({
    nombre: '',
    apellido: '',
    direccion: '',
    nit: '',
    telefono: '',
    email: '',
    estado: true,
  });

  const [selectedClient, setSelectedClient] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: token,
        },
      };
      const response = await axios.get('https://prueba-render-agbv.onrender.com/api/client_user', config);
      setClient(response.data);
      console.log(response.data);
    } catch (error) {
        //setClient(null)
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClient({
      ...client,
      [name]: value,
    });
  };

  const handleCreateClient = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: token,
        },
      };

      const response = await axios.post('https://prueba-render-agbv.onrender.com/api/client_user', client, config);
      Swal.fire('¡Éxito!', 'Cliente creado con éxito.', 'success');
      handleClose();
      loadClients();
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Error al crear el cliente.', 'error');
    }
  };

  const handleUpdateClient = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: token,
        },
      };

      const response = await axios.put(
        `https://prueba-render-agbv.onrender.com/api/client_user`,
        client,
        config
      );

      Swal.fire('¡Éxito!', 'Cliente actualizado con éxito.', 'success');
      handleClose();
      loadClients();
      setIsUpdate(false);
      setSelectedClient(null);
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Error al actualizar el cliente.', 'error');
    }
  };

  const handleClose = () => {
    setShow(false);
    setClient({
      nombre: '',
      apellido: '',
      direccion: '',
      nit: '',
      telefono: '',
      email: '',
      estado: true,
    });
  };

  const handleShow = () => {
    setShow(true);
    setIsUpdate(false);
    setSelectedClient(null);
  };

  const handleShowUpdate = (client) => {
    if (client && client.id) {
      setSelectedClient(client);
      setClient({
        ...client,
      });
      setIsUpdate(true);
      setShow(true);
    } else {
      console.error('Error: No se pudo obtener el ID del cliente seleccionado');
    }
  };

  const handleDeleteClient = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: token,
        },
      };
      const usuario_cargado = JSON.parse(localStorage.getItem('user'));
      const response = await axios.delete(`https://prueba-render-agbv.onrender.com/api/client_user/${usuario_cargado.id}`, config);
      Swal.fire('¡Éxito!', 'Cliente eliminado con éxito.', 'success');
      loadClients();
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Error al eliminar el cliente.', 'error');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
     {

client.nombre === '' ? (

<Button variant="primary" onClick={handleShow}>
        <BsPlus style={{ marginRight: '5px' }} /> Agregar Cliente
      </Button>
)
: null 
}

      <div style={{ marginBottom: '10px' }}></div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{isUpdate ? 'Actualizar Cliente' : 'Crear Cliente'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="nombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={client.nombre}
                onChange={handleInputChange}
                placeholder="Nombre"
              />
            </Form.Group>
            <Form.Group controlId="apellido">
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                type="text"
                name="apellido"
                value={client.apellido}
                onChange={handleInputChange}
                placeholder="Apellido"
              />
            </Form.Group>
            <Form.Group controlId="direccion">
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                type="text"
                name="direccion"
                value={client.direccion}
                onChange={handleInputChange}
                placeholder="Dirección"
              />
            </Form.Group>
            <Form.Group controlId="nit">
              <Form.Label>NIT</Form.Label>
              <Form.Control
                type="text"
                name="nit"
                value={client.nit}
                onChange={handleInputChange}
                placeholder="NIT"
              />
            </Form.Group>
            <Form.Group controlId="telefono">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="text"
                name="telefono"
                value={client.telefono}
                onChange={handleInputChange}
                placeholder="Teléfono"
              />
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Correo Electrónico</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={client.email}
                onChange={handleInputChange}
                placeholder="Correo Electrónico"
              />
            </Form.Group>
            <Form.Group controlId="estado">
              <Form.Check
                type="checkbox"
                name="estado"
                checked={client.estado}
                onChange={handleInputChange}
                label="Estado"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          {isUpdate ? (
            <Button variant="primary" onClick={handleUpdateClient}>
              Actualizar Cliente
            </Button>
          ) : (
            <Button variant="primary" onClick={handleCreateClient}>
              Crear Cliente
            </Button>
          )}
        </Modal.Footer>
      </Modal>
            {   
            client.nombre !== '' ? (

<Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Dirección</th>
            <th>NIT</th>
            <th>Teléfono</th>
            <th>Correo Electrónico</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
            <tr>
              <td>{client.nombre}</td>
              <td>{client.apellido}</td>
              <td>{client.direccion}</td>
              <td>{client.nit}</td>
              <td>{client.telefono}</td>
              <td>{client.email}</td>
              <td>{client.estado ? 'Activo' : 'Inactivo'}</td>
              <td>
                <Button variant="info" onClick={() => handleShowUpdate(client)}>
                  Actualizar
                </Button>{' '}
                <Button variant="danger" onClick={() => handleDeleteClient(client.id)}>
                  Eliminar
                </Button>
              </td>
            </tr>
        </tbody>
      </Table>
            )
              : null
               }      
    </div>
  );
};

export default ClientUser;
