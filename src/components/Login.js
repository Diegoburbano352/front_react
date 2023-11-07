import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        Swal.fire('Error', 'Por favor, completa todos los campos', 'error');
        return;
      }

      const response = await axios.post('https://prueba-render-agbv.onrender.com/api/users/login', {
        email: email,
        password: password,
      });

      localStorage.setItem("token", JSON.stringify(response.data.token));
      localStorage.setItem("user", JSON.stringify(response.data.user));
      console.log(response);

      if (response.status === 201) {
        Swal.fire('Éxito', 'Has iniciado sesión exitosamente', 'success').then(() => {
          window.location.replace('/');
        });
      }
    } catch (error) {
      console.error(error);

      if (error.response && error.response.status === 401) {
        if (error.response.data === "Contraseña incorrecta") {
          Swal.fire('Error', error.response.data, 'error');
        } else if (error.response.data === "Email no encontrado, asegurese de que tenga una cuenta o verifique que el email este bien escrito") {
          Swal.fire('Error', error.response.data, 'error');
        } else {
          Swal.fire('Error', 'Ocurrió un error al procesar la solicitud', 'error');
        }
      } else {
        Swal.fire('Error', 'Ocurrió un error al procesar la solicitud', 'error');
      }
    }
  };

  return (
    <div
      style={{
        backgroundImage: "url('https://img.freepik.com/vector-premium/salon-aseo-ilustracion-patron-transparente-vector-perros-fondo-animal-tienda-mascotas_682999-74.jpg')",
        backgroundSize: 'cover',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h2 className="card-title text-center mb-4">Iniciar Sesión</h2>
                <form>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Correo electrónico</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Contraseña</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="text-center">
                    <button type="button" onClick={handleLogin} className="btn btn-primary">Iniciar Sesión</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
