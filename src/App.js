import React from 'react';
import { Route, Routes, Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { FaShoppingCart, FaUserCircle } from 'react-icons/fa';
import Login from './components/Login';
import Signup from './components/Signup1';
import Room from './components/room';
import Pet_user from './components/pet_user';
import Product from './components/product';
import Reservation_user from './components/reservation_user';
import Product_list from './components/product_list';
import List_reservation_user from './components/list_reservation_users';
import List_room from './components/list_room';
import Pet_user_list from './components/pet_user_list';
import Product_admin from './components/product_admin';
import List_room_admin from './components/list_room_admin';
import Employee from './components/employee';
import Client_user from './components/client_user';
import User_admin from './components/user_admin';
import Cart_view from './components/cart_view';
import Reservation_admin from './components/reservation_admin';
import Pet_admin from './components/pet_admin';

function Home() {
  return (
    <div>
      <Product_list />
    </div>
  );
}

function App() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/'); // Redirige a la página principal (Product List)
  };

  const user = JSON.parse(localStorage.getItem('user'));
  const userRole = user ? user.rol : 'usuario';

  return (
    <div>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand as={Link} to="/">Paw's Mansion</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavDropdown title={<FaUserCircle />} id="basic-nav-dropdown" className="ml-0">
              <Link to="/login" className="dropdown-item">Iniciar Sesión</Link>
              <Link to="/signup" className="dropdown-item">Registrarse</Link>
              <Link to="/client_user" className="dropdown-item">Mi perfil</Link>
              <NavDropdown.Item onClick={handleLogout}>Cerrar Sesión</NavDropdown.Item>
            </NavDropdown>
            {userRole !== 'usuario' && (
              <NavDropdown title="Administracion" id="basic-nav-dropdown" className="ml-0">
                {userRole !== 'usuario' && <Link to="/product">Crear Productos</Link>}
                {userRole !== 'usuario' && <Link to="/product_admin">Productos</Link>}
                {userRole !== 'usuario' && <Link to="/list_room_admin">Habitaciones admin</Link>}
                {userRole !== 'usuario' && userRole !== 'empleado' && <Link to="/employee">Empleados</Link>}
                {userRole !== 'usuario' && userRole !== 'empleado' && <Link to="/user_admin">Usuarios</Link>}
                {userRole !== 'usuario' && <Link to="/reservation_admin">Reservaciones</Link>}
                {userRole !== 'usuario' && <Link to="/pet_admin">Todas las mascotas</Link>}
              </NavDropdown>
            )}
            <NavDropdown title="Habitaciones" id="basic-nav-dropdown" className="ml-0">
              {userRole !== 'usuario' && <Link to="/room">Crear Habitaciones</Link>}
              <Link to="/list_room">Habitaciones</Link>
            </NavDropdown>
            <NavDropdown title="Reservaciones" id="basic-nav-dropdown" className="ml-0">
              <Link to="/reservation_user">Crear reservacion</Link>{' '}
              <Link to="/list_reservation_user">Mis reservaciones</Link>
            </NavDropdown>
            <NavDropdown title="Mascotas" id="basic-nav-dropdown" className="ml-0">
              <Link to="/pet_user">Crear mascotas</Link>
              <Link to="/pet_user_list">Mis mascotas</Link>
            </NavDropdown>
          </Nav>
          <Nav>
            <Link to="/cart_view" className="nav-link">
              <FaShoppingCart /> Carrito
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/room" element={<Room />} />
        <Route path="/pet_user" element={<Pet_user />} />
        <Route path="/product" element={<Product />} />
        <Route path="/reservation_user" element={<Reservation_user />} />
        <Route path="/list_reservation_user" element={<List_reservation_user />} />
        <Route path="/list_room" element={<List_room />} />
        <Route path="/pet_user_list" element={<Pet_user_list />} />
        <Route path="/product_admin" element={<Product_admin />} />
        <Route path="/list_room_admin" element={<List_room_admin />} />
        <Route path="/employee" element={<Employee />} />
        <Route path="/client_user" element={<Client_user />} />
        <Route path="/user_admin" element={<User_admin />} />
        <Route path="/cart_view" element={<Cart_view />} />
        <Route path="/reservation_admin" element={<Reservation_admin />} />
        <Route path="/pet_admin" element={<Pet_admin />} />
      </Routes>
    </div>
  );
}

export default App;
