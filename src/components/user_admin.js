import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Form, FormControl, InputGroup, Button, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';

const UserAdminComponent = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://prueba-render-agbv.onrender.com/api/user_admin', {
          headers: {
            Authorization: token,
          },
        });
        setUsers(response.data);
        setError(false);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setError(true);
        } else {
          Swal.fire('Error', 'Hubo un problema al cargar los usuarios.', 'error');
        }
      }
    };

    fetchUsers();
  }, [searchTerm, token]);

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
      const response = await axios.put(`https://prueba-render-agbv.onrender.com/api/user_admin/${selectedUser.id}`, selectedUser, {
        headers: {
          Authorization: token,
        },
      });

      setModalShow(false);
      Swal.fire('Usuario actualizado', 'El usuario ha sido actualizado correctamente.', 'success');
    } catch (error) {
      setModalShow(false);
      Swal.fire('Error', 'No se pudo actualizar el usuario.', 'error');
    }
  };

  const handleUpdate = userId => {
    const selectedUser = users.find(user => user.id === userId);
    if (selectedUser) {
      setSelectedUser(selectedUser);
      setModalShow(true);
    }
  };

  const handleDelete = async userId => {
    const confirmDelete = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Eliminar a este usuario dejará a muchas mascotas tristes.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (confirmDelete.isConfirmed) {
      try {
        await axios.delete(`https://prueba-render-agbv.onrender.com/api/user_admin/${userId}`, {
          headers: {
            Authorization: token,
          },
        });

        Swal.fire('Usuario eliminado', 'El usuario ha sido eliminado correctamente.', 'success');
        window.location.reload(); // Recargar la página
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar el usuario.', 'error');
      }
    }
  };

  const filteredUsers = users.filter(user => user.userName.toLowerCase().includes(searchTerm.toLowerCase()));

  if (filteredUsers.length === 0 && searchTerm) {
    Swal.fire({
      icon: 'warning',
      title: '¡Usuario no encontrado!',
      text: `No se encontraron usuarios con el nombre '${searchTerm}'.`,
    });
  }

  return (
    <div className="container">
      <h2>Administración de Usuarios</h2>

      <Form onSubmit={handleSearch}>
        <InputGroup className="mb-3">
          <Button variant="outline-secondary" id="button-addon2" type="submit">
            Buscar
          </Button>
          <FormControl
            placeholder="Buscar usuarios..."
            aria-label="Search users"
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
              <th>ID</th>
              <th>Nombre de usuario</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.userName}</td>
                <td>{user.email}</td>
                <td>{user.rol}</td>
                <td>
                  <Button variant="info" onClick={() => handleUpdate(user.id)}>
                    Actualizar
                  </Button>{' '}
                  <Button variant="danger" onClick={() => handleDelete(user.id)}>
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div className="alert alert-danger" role="alert">
          User not found!
        </div>
      )}

      <Modal show={modalShow} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Actualizar Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nombre de Usuario</Form.Label>
            <Form.Control
              type="text"
              value={selectedUser?.userName || ''}
              onChange={e => setSelectedUser({ ...selectedUser, userName: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={selectedUser?.email || ''}
              onChange={e => setSelectedUser({ ...selectedUser, email: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Rol</Form.Label>
            <Form.Control
              type="text"
              value={selectedUser?.rol || ''}
              onChange={e => setSelectedUser({ ...selectedUser, rol: e.target.value })}
            />
          </Form.Group>
          {/* Otros campos para actualizar */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleModalSave}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserAdminComponent;
