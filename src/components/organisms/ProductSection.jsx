import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";
import { productosBase } from "../../data/datosBase";

/**
 * 🔹 ProductSection — Muestra una galería de productos destacados
 * con fallback automático al localStorage o base de datos inicial.
 */
export default function ProductSection() {
  const { agregarAlCarrito } = useContext(CartContext);
  const { usuario } = useContext(AuthContext);
  const [productos, setProductos] = useState([]);
  
  // Constante para definir cuántos productos mostrar (p. ej., 4 columnas)
  const MAX_PRODUCTOS_DESTACADOS = 4;

  // ✅ Cargar, Filtrar y Seleccionar Productos Aleatorios
  useEffect(() => {
    try {
      // 1. Cargar datos (siempre asegurándose de obtener la versión con stock)
      const guardados = JSON.parse(localStorage.getItem("productos"));
      
      let listaCompleta;
      
      if (Array.isArray(guardados) && guardados.length > 0) {
        listaCompleta = guardados;
      } else {
        // Si no existen o están vacíos → usar los base y guardarlos (para futuros usos)
        listaCompleta = productosBase;
        // Solo guardamos si estamos usando los datos base, para que la próxima vez se carguen
        localStorage.setItem("productos", JSON.stringify(productosBase));
      }
      
      // 2. Filtrar: Solo productos que tienen stock > 0
      const productosEnStock = listaCompleta.filter(p => p.stock > 0);
      
      // 3. Seleccionar Aleatoriamente (Variabilidad)
      // Función de comparación aleatoria: devuelve un número entre -0.5 y 0.5
      // Al usar sort con una función aleatoria, se ordena el array de forma aleatoria.
      productosEnStock.sort(() => Math.random() - 0.5);
      
      // 4. Limitar: Tomar solo el número máximo de elementos para mostrar
      const destacados = productosEnStock.slice(0, MAX_PRODUCTOS_DESTACADOS);
      
      setProductos(destacados);

    } catch (error) {
      console.error("Error al cargar productos:", error);
      // Fallback seguro si algo falla
      setProductos([]); 
    }

    // Nota: No se añade 'storage' listener aquí, ya que queremos que el listado 
    // sea estático después de la carga inicial (hasta que se recargue la página).

  }, []); // Se ejecuta solo al montar la componente

  // ✅ Función para agregar al carrito con validación
  const handleAgregarCarrito = (producto) => {
    if (!usuario) {
      alert("⚠️ Debes iniciar sesión para agregar productos al carrito.");
      return;
    }
    // Opcional: Podrías verificar stock aquí también, aunque los mostrados tienen stock > 0.
    agregarAlCarrito(producto);
    alert("✅ Producto agregado al carrito.");
  };

  const listaDestacada = productos; // Ya está filtrada y limitada

  return (
    <section className="container my-5">
      <h2 className="fw-bold text-center mb-4">✨ Productos Destacados ✨</h2>

      {listaDestacada.length === 0 ? (
        <p className="text-center text-muted">No hay productos disponibles en stock actualmente.</p>
      ) : (
        <div className="row g-4">
          {listaDestacada.map((p) => (
            <div className="col-sm-6 col-md-4 col-lg-3" key={p.id}>
              <div className="card h-100 shadow-sm border-0">
                {/* Imagen del producto */}
                <img
                  src={
                    p.imagenes && p.imagenes[0]
                      ? p.imagenes[0]
                      : "/img/placeholder.jpg"
                  }
                  alt={p.nombre}
                  className="card-img-top"
                  style={{
                    height: "230px",
                    objectFit: "contain",
                    backgroundColor: "#f8f9fa",
                    padding: "10px",
                  }}
                />

                {/* Info del producto */}
                <div className="card-body d-flex flex-column text-center">
                  <h6 className="card-title fw-bold">{p.nombre}</h6>
                  <p className="text-success fw-semibold mb-2">
                    ${p.precio.toLocaleString("es-CL")}
                  </p>

                  <div className="mt-auto">
                    {/* Ver detalle */}
                    <Link
                      to={`/producto/${p.id}`}
                      className="btn btn-outline-primary btn-sm me-2"
                    >
                      Ver
                    </Link>

                    {/* Agregar al carrito (No requiere check de stock aquí, ya están filtrados) */}
                    <button
                      className="btn btn-dark btn-sm"
                      onClick={() => handleAgregarCarrito(p)}
                    >
                      🛒 Agregar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🔗 Enlace a todos los productos */}
      <div className="text-center mt-5">
        <Link to="/productos" className="btn btn-primary btn-lg shadow-sm">
          Ver todos los productos →
        </Link>
      </div>
    </section>
  );
}