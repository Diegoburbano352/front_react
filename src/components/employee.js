import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { BsPlus } from 'react-icons/bs';

const backgroundStyle = {
  backgroundImage: "url('https://img.freepik.com/vector-premium/mire-curriculum-vitae-empleador-solicitante-ilustracion-vectorial-ep-10_230920-63.jpg?w=2000')",
  backgroundSize: 'cover',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center'
};




const CreateEmployeeModal = () => {
  const [show, setShow] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [employee, setEmployee] = useState({
    nombre: '',
    apellido: '',
    direccion: '',
    nit: '',
    salario: '',
    telefono: '',
    email: '',
    puesto: '',
    fecha_contratacion: '',
    Genero: true,
  });

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: token,
        },
      };
      const response = await axios.get('https://prueba-render-agbv.onrender.com/api/employee', config);
      setEmployees(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployee({
      ...employee,
      [name]: value,
    });
  };

  const handleCreateEmployee = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: token,
        },
      };

      const response = await axios.post('https://prueba-render-agbv.onrender.com/api/employee', employee, config);
      Swal.fire('¡Éxito!', 'Empleado creado con éxito.', 'success');
      handleClose();
      loadEmployees();
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Error al crear el empleado.', 'error');
    }
  };

  const handleUpdateEmployee = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: token,
        },
      };

      const response = await axios.put(
        `https://prueba-render-agbv.onrender.com/api/employee/${selectedEmployee.id}`,
        employee,
        config
      );

      Swal.fire('¡Éxito!', 'Empleado actualizado con éxito.', 'success');
      handleClose();
      loadEmployees();
      setIsUpdate(false);
      setSelectedEmployee(null);
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Error al actualizar el empleado.', 'error');
    }
  };

  const handleClose = () => {
    setShow(false);
    setEmployee({
      nombre: '',
      apellido: '',
      direccion: '',
      nit: '',
      salario: '',
      telefono: '',
      email: '',
      puesto: '',
      fecha_contratacion: '',
      Genero: true,
    });
  };

  const handleShow = () => {
    setShow(true);
    setIsUpdate(false);
    setSelectedEmployee(null);
  };

  const handleShowUpdate = (emp) => {
    if (emp && emp.id) {
      setSelectedEmployee(emp);
      setEmployee({
        ...emp,
        fecha_contratacion: emp.fecha_contratacion.split('T')[0],
      });
      setIsUpdate(true);
      setShow(true);
    } else {
      console.error('Error: No se pudo obtener el ID del empleado seleccionado');
    }
  };

  const handleDeleteEmployee = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: token,
        },
      };

      const response = await axios.delete(`https://prueba-render-agbv.onrender.com/api/employee/${id}`, config);
      Swal.fire('¡Éxito!', 'Empleado eliminado con éxito.', 'success');
      loadEmployees();
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Error al eliminar el empleado.', 'error');
    }
  };

  return (
    <div style={backgroundStyle}>
    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
      <Button variant="primary" onClick={handleShow}>
        <BsPlus style={{ marginRight: '5px' }} /> Agregar Empleado
      </Button>
     
      <div style={{ marginBottom: '10px' }}></div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{isUpdate ? 'Actualizar Empleado' : 'Crear Empleado'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="nombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={employee.nombre}
                onChange={handleInputChange}
                placeholder="Nombre"
              />
            </Form.Group>
            <Form.Group controlId="apellido">
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                type="text"
                name="apellido"
                value={employee.apellido}
                onChange={handleInputChange}
                placeholder="Apellido"
              />
            </Form.Group>
            <Form.Group controlId="direccion">
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                type="text"
                name="direccion"
                value={employee.direccion}
                onChange={handleInputChange}
                placeholder="Dirección"
              />
            </Form.Group>
            <Form.Group controlId="nit">
              <Form.Label>NIT</Form.Label>
              <Form.Control
                type="text"
                name="nit"
                value={employee.nit}
                onChange={handleInputChange}
                placeholder="NIT"
              />
            </Form.Group>
            <Form.Group controlId="salario">
              <Form.Label>Salario</Form.Label>
              <Form.Control
                type="text"
                name="salario"
                value={employee.salario}
                onChange={handleInputChange}
                placeholder="Salario"
              />
            </Form.Group>
            <Form.Group controlId="telefono">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="text"
                name="telefono"
                value={employee.telefono}
                onChange={handleInputChange}
                placeholder="Teléfono"
              />
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Correo Electrónico</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={employee.email}
                onChange={handleInputChange}
                placeholder="Correo Electrónico"
              />
            </Form.Group>
            <Form.Group controlId="puesto">
              <Form.Label>Puesto</Form.Label>
              <Form.Control
                type="text"
                name="puesto"
                value={employee.puesto}
                onChange={handleInputChange}
                placeholder="Puesto"
              />
            </Form.Group>
            <Form.Group controlId="fecha_contratacion">
              <Form.Label>Fecha de Contratación</Form.Label>
              <Form.Control
                type="date"
                name="fecha_contratacion"
                value={employee.fecha_contratacion}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="Genero">
              <Form.Label>Género</Form.Label>
              <Form.Control as="select" name="Genero" value={employee.Genero} onChange={handleInputChange}>
                <option value={true}>Masculino</option>
                <option value={false}>Femenino</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          {isUpdate ? (
            <Button variant="primary" onClick={handleUpdateEmployee}>
              Actualizar Empleado
            </Button>
          ) : (
            <Button variant="primary" onClick={handleCreateEmployee}>
              Crear Empleado
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Dirección</th>
            <th>NIT</th>
            <th>Salario</th>
            <th>Teléfono</th>
            <th>Correo Electrónico</th>
            <th>Puesto</th>
            <th>Fecha de Contratación</th>
            <th>Género</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp, index) => (
            <tr key={index}>
              <td>{emp.nombre}</td>
              <td>{emp.apellido}</td>
              <td>{emp.direccion}</td>
              <td>{emp.nit}</td>
              <td>{emp.salario}</td>
              <td>{emp.telefono}</td>
              <td>{emp.email}</td>
              <td>{emp.puesto}</td>
              <td>{emp.fecha_contratacion.split('T')[0]}</td> {/* Cambio aquí */}
              <td>{emp.Genero ? 'Masculino' : 'Femenino'}</td>
              <td>
                <Button variant="info" onClick={() => handleShowUpdate(emp)}>
                  Actualizar
                </Button>{' '}
                <Button variant="danger" onClick={() => handleDeleteEmployee(emp.id)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
    </div>
  );
};

export default CreateEmployeeModal;
