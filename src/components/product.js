import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';


const backgroundStyle = {
  backgroundImage: "url('https://img.freepik.com/vector-premium/suministros-perros-gatos-dibujos-animados-equipo-tienda-mascotas-accesorios-tienda-mascotas-comida-mascotas-domesticas-juguetes-hogar-conjunto-ilustraciones-vectoriales-cuencos-equipo-cuidado-perros-gatos_533884-41.jpg?w=2000')",
  backgroundSize: 'cover',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center'
};

const ProductManagement = () => {
  const [newProduct, setNewProduct] = useState({
    nombre_producto: '',
    marca: '',
    precio: 0,
    stock: 0,
    disponibilidad: true,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: name === 'disponibilidad' ? (value === 'true' ? true : false) : value,
    });
  };

  const handleCreateProduct = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se encontró el token de autenticación',
        });
        return;
      }

      var token_cargado = localStorage.getItem('token');
      const response = await axios.post('https://prueba-render-agbv.onrender.com/api/product', newProduct, {
        headers: {
          Authorization: token_cargado 
        },
      });

      if (response.data.message === 'Producto creado con éxito') {
        Swal.fire({
          icon: 'success',
          title: 'Producto Creado',
          text: '¡El producto se ha creado exitosamente!',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al crear el producto',
        });
      }

      // Resto del código para actualizar la lista de productos si es necesario
      console.log(response.data);

    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al crear el producto',
      });
    }
  };

  return (
    <div style={backgroundStyle}>
    <div className="container mt-4">
      <h2>Crear Producto</h2>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          name="nombre_producto"
          placeholder="Nombre del Producto"
          value={newProduct.nombre_producto}
          onChange={handleInputChange}
        />
      </div>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          name="marca"
          placeholder="Marca"
          value={newProduct.marca}
          onChange={handleInputChange}
        />
      </div>
      <div className="mb-3">
        <input
          type="number"
          className="form-control"
          name="precio"
          placeholder="Precio"
          value={newProduct.precio}
          onChange={handleInputChange}
        />
      </div>
      <div className="mb-3">
        <input
          type="number"
          className="form-control"
          name="stock"
          placeholder="Stock"
          value={newProduct.stock}
          onChange={handleInputChange}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Disponibilidad:</label>
        <select
          className="form-select"
          name="disponibilidad"
          value={newProduct.disponibilidad}
          onChange={handleInputChange}
        >
          <option value={true}>Disponible</option>
          <option value={false}>No disponible</option>
        </select>
      </div>
      <button className="btn btn-primary" onClick={handleCreateProduct}>
        Crear Producto
      </button>
    </div>
    </div>
  );
};

export default ProductManagement;
