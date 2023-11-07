import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BiSearch } from 'react-icons/bi';
import Swal from 'sweetalert2';
import {  Button } from 'react-bootstrap';



function ProductList() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [cantidad, setCantidad] = useState(1);

  const loadProducts = () => {
    axios.get('https://prueba-render-agbv.onrender.com/api/product')
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error('Error al cargar los productos:', error);
      });
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    return (
      product.nombre_producto &&
      product.nombre_producto.toLowerCase().includes(search.toLowerCase())
    );
  });

  if (filteredProducts.length === 0 && search) {
    Swal.fire({
      icon: 'warning',
      title: 'Producto no encontrado',
      text: `No se encontraron productos con el nombre '${search}'.`,
    });
  }

  const handleCreateCart = async (product, cantidad) => {
    console.log(product,cantidad)
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: token,
        },
      };
      const cart = {    
        productId: product.id,
        cantidad: cantidad, 
        precio: product.precio,
      }
      const response = await axios.post('https://prueba-render-agbv.onrender.com/api/cart/add',cart,config);
      Swal.fire('¡Éxito!', 'Carrito  creado con éxito.', 'success');
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Error al crear el carrito.', 'error');
    }
   };


  return (
    <div className="container">
      <h1 className="text-center mt-4 mb-4">Lista de Productos</h1>
      <div className="input-group mb-3">
        <span className="input-group-text"><BiSearch /></span>
        <input
          type="text"
          className="form-control"
          placeholder="Ingrese el nombre del producto que desea buscar"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {filteredProducts.map((product) => (
          <div key={product.id} className="col">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{product.nombre_producto}</h5>
                <p className="card-text">Marca: {product.marca}</p>
                <p className="card-text">Precio: Q{product.precio}</p>
                <p className="card-text">Stock: {product.stock}</p>
                <p className="card-text">
                  Disponibilidad: {product.disponibilidad ? 'Disponible' : 'No disponible'}
                </p>
                <div className="d-flex align-items-center">
                  <label htmlFor="quantity" className="me-2">Cantidad:</label>
                  <input type="number" className="form-control form-control-sm" id="quantity" defaultValue="1" onChange={(e) => setCantidad(e.target.value)} />
                </div>
              </div>
              <div className="card-footer d-flex justify-content-center">
                  <Button variant="btn btn-primary me-2" onClick={() => handleCreateCart(product,cantidad)}>
                  Agregar al carrito
                    </Button>
               {/* <button className="btn btn-primary me-2">Agregar al carrito</button> */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
