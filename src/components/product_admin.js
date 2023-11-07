import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2'; // Importa SweetAlert



const backgroundStyle = {
  backgroundImage: "url('https://previews.123rf.com/images/elenavdovina/elenavdovina1612/elenavdovina161200079/68215669-mercanc%C3%ADas-para-animales-fondo-transparente-de-color-gris-marr%C3%B3n-vector-fondo-transparente-de.jpg')",
  backgroundSize: 'cover',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center'
};

const ProductAdmin = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [updatedProduct, setUpdatedProduct] = useState({}); // Estado para almacenar los datos actualizados

  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://prueba-render-agbv.onrender.com/api/product');
        setProducts(response.data);
      } catch (error) {
        setError('Error al cargar los productos');
      }
    };

    fetchProducts();
  }, []);

  const handleUpdate = async () => {
    const token = localStorage.getItem('token');

    try {
      const config = {
        headers: {
          Authorization: token,
        },
      };

      await axios.put(`https://prueba-render-agbv.onrender.com/api/product/${selectedProduct.id}`, updatedProduct, config);
      setShowModal(false);

      // Muestra mensaje de éxito con SweetAlert al actualizar
      Swal.fire('¡Producto actualizado!', 'El producto ha sido actualizado correctamente.', 'success');
    } catch (error) {
      console.error('Error al actualizar el producto:', error);

      // Muestra mensaje de error con SweetAlert al fallar la actualización
      Swal.fire('Error', 'Hubo un problema al actualizar el producto.', 'error');
    }
  };

  const handleDelete = async (id) => {
    // Mensaje de confirmación antes de eliminar
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'El producto será eliminado permanentemente',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem('token');

        try {
          const config = {
            headers: {
              Authorization: token,
            },
          };

          await axios.delete(`https://prueba-render-agbv.onrender.com/api/product/${id}`, config);
          // Realiza la lógica para actualizar el estado de los productos después de la eliminación exitosa
        } catch (error) {
          console.error('Error al eliminar el producto:', error);
        }
      }
    });
  };

  return (
    <div style={backgroundStyle}>
    <div className="container mt-4">
      <h2>Lista de productos</h2>
      {error && <p>{error}</p>}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Marca</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Disponibilidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.nombre_producto}</td>
              <td>{product.marca}</td>
              <td>{product.precio}</td>
              <td>{product.stock}</td>
              <td>{product.disponibilidad ? 'Disponible' : 'No disponible'}</td>
              <td>
                <button
                  className="btn btn-warning"
                  onClick={() => {
                    setSelectedProduct(product);
                    setUpdatedProduct(product); // Selecciona los datos a ser actualizados
                    setShowModal(true); // Abre el modal
                  }}
                >
                  Actualizar
                </button>{' '}
                <button className="btn btn-danger" onClick={() => handleDelete(product.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Formulario Modal para Actualizar */}
      {showModal && (
        <div className="modal" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Actualizar Producto</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label htmlFor="nombre_producto" className="form-label">
                      Nombre del Producto
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="nombre_producto"
                      value={updatedProduct.nombre_producto}
                      onChange={(e) =>
                        setUpdatedProduct({
                          ...updatedProduct,
                          nombre_producto: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="marca" className="form-label">
                      Marca
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="marca"
                      value={updatedProduct.marca}
                      onChange={(e) =>
                        setUpdatedProduct({ ...updatedProduct, marca: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="precio" className="form-label">
                      Precio
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      id="precio"
                      value={updatedProduct.precio}
                      onChange={(e) =>
                        setUpdatedProduct({ ...updatedProduct, precio: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="stock" className="form-label">
                      Stock
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="stock"
                      value={updatedProduct.stock}
                      onChange={(e) =>
                        setUpdatedProduct({ ...updatedProduct, stock: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={updatedProduct.disponibilidad}
                      onChange={(e) =>
                        setUpdatedProduct({
                          ...updatedProduct,
                          disponibilidad: e.target.checked,
                        })
                      }
                    />
                    <label className="form-check-label">Disponibilidad</label>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cerrar
                </button>
                <button type="button" className="btn btn-primary" onClick={handleUpdate}>
                  Guardar cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default ProductAdmin;
