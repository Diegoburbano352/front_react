import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const token_cargado = localStorage.getItem('token');
  const usuario_cargado = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchReservations = async () => {
      if (!usuario_cargado || !token_cargado) {
        setLoading(false);
        return;
      }

      try {
        const config = {
          headers: {
            Authorization: token_cargado
          }
        };

        const response = await axios.get(`https://prueba-render-agbv.onrender.com/api/reservation_user/view`, config);
        setReservations(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchReservations();
  }, [usuario_cargado, token_cargado]);

  return (
    <div>
      <h2>Reservas del Usuario</h2>
      {loading ? (
        <p>Cargando reservas...</p>
      ) : (
        <div>
          {reservations.length === 0 ? (
            <p>No hay reservas disponibles para este usuario.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Tipo Reserva</th>
                  <th>Fecha Entrada</th>
                  <th>Fecha Salida</th>
                  <th>Hora Entrada</th>
                  <th>Hora Salida</th>
                  <th>Habitación</th>
                  <th>Precio por noche</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map(reservation => (
                  <tr key={reservation.id}>
                    <td>{reservation.tipo_reserva}</td>
                    <td>{reservation.fecha_entrada}</td>
                    <td>{reservation.fecha_salida}</td>
                    <td>{reservation.hora_entrada}</td>
                    <td>{reservation.hora_salida}</td>
                    <td>{reservation.habitacion}</td>
                    <td>{reservation.precio}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default UserReservations;
