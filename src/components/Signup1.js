import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const Signup1 = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    try {
      const response = await axios.post('https://prueba-render-agbv.onrender.com/api/users/signup', {
        userName: userName,
        email: email,
        password: password,
      });

      console.log(response);

      if (response.status === 201) {
        Swal.fire('Éxito', 'Felicidades te has registrado con nosotros exitosamente', 'success')
          .then((result) => {
            if (result.isConfirmed) {
              navigate('/login');
            }
          });
      }
    } catch (error) {
      if (error.response) {
        Swal.fire('Error', error.response.data.error, 'error');
      } else if (error.request) {
        Swal.fire('Error', 'No se pudo obtener una respuesta del servidor', 'error');
      } else {
        Swal.fire('Error', 'Ocurrió un error al procesar la solicitud', 'error');
      }
    }
  };

  return (
    <div
      style={{
        backgroundImage: "url('https://cdn.pixabay.com/photo/2019/04/02/22/00/dog-4099038_1280.jpg')",
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
                <h2 className="card-title text-center mb-4">Regístrate!</h2>
                <form>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">Nombre de usuario</label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      placeholder="Username"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                    />
                  </div>
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
                    <button type="button" onClick={handleSignup} className="btn btn-primary">Signup</button>
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

export default Signup1;
