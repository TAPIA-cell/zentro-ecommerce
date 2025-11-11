import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import { cargarProductos } from "../utils/cargarProductos";

function Productos() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState("default");
  const { agregarAlCarrito } = useContext(CartContext);
  const { usuario } = useContext(AuthContext);

  useEffect(() => {
    const actualizar = () => setProductos(cargarProductos());
    actualizar();
    window.addEventListener("storage", actualizar);
    return () => window.removeEventListener("storage", actualizar);
  }, []);

  // ✅ MODIFICACIÓN CLAVE: Quitamos el filtro de stock > 0
  const filtrarProductos = () => {
    let resultado = productos.filter((p) =>
      // Solo filtramos por búsqueda (y asumimos que la propiedad p.stock existe en todos)
      p.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    // 2. Ordenar
    if (orden === "precioAsc") resultado.sort((a, b) => a.precio - b.precio);
    if (orden === "precioDesc") resultado.sort((a, b) => b.precio - a.precio);

    return resultado;
  };
  // ----------------------------------------------------

  const productosFiltrados = filtrarProductos();

  return (
    <div className="container my-5">
      <h2 className="fw-bold text-center mb-4">Nuestros Productos</h2>

      <div className="row mb-4 align-items-center">
        <div className="col-md-6 mb-2 mb-md-0">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="col-md-6 text-md-end">
          <select
            className="form-select w-auto d-inline"
            value={orden}
            onChange={(e) => setOrden(e.target.value)}
          >
            <option value="default">Ordenar por</option>
            <option value="precioAsc">Precio: menor a mayor</option>
            <option value="precioDesc">Precio: mayor a menor</option>
          </select>
        </div>
      </div>

      <div className="row g-4">
        {productosFiltrados.length === 0 ? (
          <p className="text-center text-muted">
            No se encontraron productos que coincidan con la búsqueda.
          </p>
        ) : (
          productosFiltrados.map((p) => {
            // Determinamos si hay stock (asumimos que si no está definido, es 0)
            const hayStock = p.stock > 0;
            
            return (
              <div className="col-sm-6 col-md-4 col-lg-3" key={p.id}>
                <div className="card h-100 shadow-sm border-0">
                  <img
                    src={
                      p.imagenes && p.imagenes[0]
                        ? p.imagenes[0]
                        : "/img/placeholder.jpg"
                    }
                    alt={p.nombre}
                    className="card-img-top"
                    style={{
                      height: "220px",
                      objectFit: "contain",
                      backgroundColor: "#f8f9fa",
                      padding: "10px",
                      // Estilo para indicar que está agotado, manteniendo la imagen visible
                      opacity: hayStock ? 1 : 0.7, 
                    }}
                  />
                  <div className="card-body d-flex flex-column text-center">
                    <h6 className="card-title fw-bold">{p.nombre}</h6>
                    <p className="text-success fw-semibold mb-2">
                      ${p.precio.toLocaleString("es-CL")}
                    </p>

                    <div className="mt-auto">
                      <Link
                        to={`/producto/${p.id}`}
                        className="btn btn-outline-primary btn-sm me-2"
                      >
                        Ver
                      </Link>
                      
                      {/* ✅ LÓGICA CONDICIONAL DE STOCK */}
                      {hayStock ? (
                        <button
                          className="btn btn-dark btn-sm"
                          onClick={() => {
                            if (!usuario) {
                              alert(
                                "⚠️ Debes iniciar sesión para agregar productos al carrito."
                              );
                              return;
                            }
                            agregarAlCarrito(p);
                            alert("✅ Producto agregado al carrito.");
                          }}
                        >
                          🛒 Agregar
                        </button>
                      ) : (
                        <button className="btn btn-danger btn-sm disabled" disabled>
                            🚫 Sin Stock
                        </button>
                      )}
                      {/* ---------------------------------- */}
                      
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Productos;