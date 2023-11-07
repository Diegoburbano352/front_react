import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2';

const backgroundStyle = {
  backgroundImage: "url('https://png.pngtree.com/thumb_back/fw800/background/20220216/pngtree-dog-with-shopping-cart-shopaholic-retail-indulge-photo-image_35198360.jpg')",
  backgroundSize: 'cover',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center'
};







const CartItems = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [error, setError] = useState(null);
  const [invoiceDetails, setInvoiceDetails] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: token,
          },
        };

        const response = await axios.get('https://prueba-render-agbv.onrender.com/api/cart/total', config);

        setCartItems(response.data.cartItems);
        setTotalPrice(response.data.totalPrice);
      } catch (error) {
        setError('Error al cargar los elementos del carrito');
      }
    };

    fetchCartItems();
  }, []);

  const handleTerminarFactura = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: token,
        },
      };

      const invoiceData = {
        cartItems,
        totalPrice,
      };

      const response = await axios.post('https://prueba-render-agbv.onrender.com/api/invoice/create', invoiceData, config);
      console.log('Factura creada:', response.data);

      Swal.fire({
        icon: 'success',
        title: 'Compra finalizada',
        text: 'Gracias por tu compra de productos para mascotas.',
      });
    } catch (error) {
      console.error('Error al crear la factura:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al intentar finalizar la compra de productos para mascotas.',
      });
    }
  };

  const handleViewInvoice = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: token,
        },
      };

      const response = await axios.get('https://prueba-render-agbv.onrender.com/api/invoice/view', config);
      console.log('Ver factura:', response.data);

      setInvoiceDetails(response.data);
      setShowModal(true);
    } catch (error) {
      console.error('Error al ver la factura:', error);
    }
  };

  const handleCartDeletion = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: token,
        },
      };

      const cartItemIds = cartItems.map(item => item.id);

      cartItemIds.forEach(async id => {
        await axios.delete(`https://prueba-render-agbv.onrender.com/api/cart/remove/${id}`, config);
      });
    } catch (error) {
      console.error('Error al eliminar el carrito:', error);
    }
  };

  const handleClose = () => {
    setInvoiceDetails([]);
    setShowModal(false);
    handleCartDeletion();
  };

  return (
    <div style={backgroundStyle}>
    <div className="container mt-4">
      <h2>Lista de elementos del carrito</h2>
      {error && <p>{error}</p>}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio unitario</th>
            <th>Total por producto</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map(item => (
            <tr key={item.id}>
              <td>{item.product.nombre_producto}</td>
              <td>{item.cantidad}</td>
              <td>Q{item.product.precio}</td>
              <td>Q{item.product.precio * item.cantidad}</td>
            </tr>
          ))}
          <tr>
            <td colSpan="3" className="text-end">
              <strong>Total</strong>
            </td>
            <td>
              <strong>Q{totalPrice}</strong>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="d-flex justify-content-center mt-3">
        <Button onClick={handleTerminarFactura} className="btn btn-success" startIcon={<i className="bi bi-bag"></i>}>
          Terminar compra
        </Button>
        <Button onClick={handleViewInvoice} className="btn btn-info" startIcon={<i className="bi bi-file-earmark-text"></i>}>
          Ver  mis Facturas
        </Button>
      </div>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Detalles de las Facturas</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {invoiceDetails.map((invoice, index) => (
            <div key={index}>
              <p>
                Número de Factura: {invoice.numeroFactura}
              </p>
              <p>
                Fecha de Emisión: {invoice.fechaEmision.split('T')[0]}
              </p>
              <p>
                Detalle:
              </p>
              {invoice.detalle ? (
                invoice.detalle.split('\n').map((item, index) => (
                  <div key={index}>
                    <p>{item}</p>
                  </div>
                ))
              ) : (
                <p>No hay detalles</p>
              )}
              <p>
                Total: Q{invoice.total}
              </p>
              {index < invoice.detalle.length - 1 && <hr />}
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
    </div>
  );
};

export default CartItems;
