import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import { productosBase } from "../data/datosBase";

function DetalleProducto() {
  const { id } = useParams();
  const { agregarAlCarrito } = useContext(CartContext);
  const [producto, setProducto] = useState(null);

  // 🔹 Cargar el producto desde localStorage o base
  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem("productos"));
    const lista = Array.isArray(guardados) && guardados.length > 0 ? guardados : productosBase;
    
    const encontrado = lista.find((p) => p.id === parseInt(id));
    
    if (encontrado) {
        setProducto({ ...encontrado, stock: encontrado.stock !== undefined ? encontrado.stock : 0 });
    } else {
        setProducto(null);
    }
  }, [id]);

  if (!producto) {
    return (
      <div className="container text-center py-5">
        <h2 className="text-danger">Producto no encontrado 😢</h2>
      </div>
    );
  }

  // ✅ Aseguramos que todas las imágenes sean válidas
  const imagenesValidas = (producto.imagenes || []).filter(
    (img) => typeof img === "string" && img.trim() !== ""
  );

  // ✅ LÓGICA DE STOCK MINIMALISTA
  const stock = producto.stock || 0;
  const stockDisponible = stock > 0;
  
  let stockBadgeClass = 'text-muted';
  let stockMessage = 'Agotado';

  if (stockDisponible) {
    if (stock <= 5) {
      stockBadgeClass = 'text-warning'; // Stock bajo
      stockMessage = `¡Solo ${stock} en stock!`;
    } else {
      stockBadgeClass = 'text-success'; // Stock suficiente
      stockMessage = 'En stock';
    }
  }
  // ----------------------------------

  return (
    <div className="container py-5">
      <div className="row align-items-center g-4">
        {/* Carrusel de imágenes (Mismo código) */}
        <div className="col-md-6">
          <div
            id="carouselProducto"
            className="carousel slide shadow-sm"
            data-bs-ride="carousel"
          >
            <div className="carousel-inner">
              {imagenesValidas.length > 0 ? (
                imagenesValidas.map((img, index) => (
                  <div
                    key={index}
                    className={`carousel-item ${index === 0 ? "active" : ""}`}
                  >
                    <img
                      src={img}
                      onError={(e) => (e.target.src = "/img/placeholder.jpg")}
                      className="d-block w-100 detalle-img rounded"
                      alt={`${producto.nombre} ${index + 1}`}
                      style={{
                        maxHeight: "420px",
                        objectFit: "contain",
                        backgroundColor: "#f8f9fa",
                      }}
                    />
                  </div>
                ))
              ) : (
                <div className="carousel-item active">
                  <img
                    src="/img/placeholder.jpg"
                    className="d-block w-100 detalle-img rounded"
                    alt="Sin imagen disponible"
                    style={{
                      maxHeight: "420px",
                      objectFit: "contain",
                      backgroundColor: "#f8f9fa",
                    }}
                  />
                </div>
              )}
            </div>

            {/* Botones de control */}
            {imagenesValidas.length > 1 && (
              <>
                <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target="#carouselProducto"
                  data-bs-slide="prev"
                >
                  <span
                    className="carousel-control-prev-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden">Anterior</span>
                </button>
                <button
                  className="carousel-control-next"
                  type="button"
                  data-bs-target="#carouselProducto"
                  data-bs-slide="next"
                >
                  <span
                    className="carousel-control-next-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden">Siguiente</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Información del producto */}
        <div className="col-md-6">
          <h2 className="fw-bold mb-3">{producto.nombre}</h2>
          <p className="text-muted">{producto.descripcion}</p>
          
          {/* ✅ PRECIO Y BADGE DE STOCK MINIMALISTA */}
          <div className="d-flex align-items-center mb-4">
            <h4 className="fw-bold me-3 mb-0">
              ${producto.precio.toLocaleString("es-CL")}
            </h4>
            
            <span className={`badge bg-light ${stockBadgeClass} border border-2 border-opacity-25`}>
              {stockMessage}
            </span>
          </div>
          {/* -------------------------------------- */}


          <button
            className={`btn ${stockDisponible ? 'btn-dark' : 'btn-outline-secondary disabled'} me-2`}
            onClick={() => { if (stockDisponible) agregarAlCarrito(producto); }}
            disabled={!stockDisponible}
          >
            {stockDisponible ? '🛒 Añadir al carrito' : 'Agotado'}
          </button>

          <button
            className="btn btn-outline-secondary"
            onClick={() => window.history.back()}
          >
            ⬅ Volver
          </button>
        </div>
      </div>
    </div>
  );
}

export default DetalleProducto;