import { useContext } from "react";
import { CartContext } from "../context/CartContext.jsx";
import { Link } from "react-router-dom";

function Cart() {
  const { carrito, agregarAlCarrito, eliminarDelCarrito, vaciarCarrito } =
    useContext(CartContext);

  const total = carrito.reduce(
    (sum, p) => sum + (p.precio || 0) * (p.cantidad || 1),
    0
  );

  // ✅ Sumar una unidad
  const sumarCantidad = (producto) => {
    const stockDisponible = producto.stock ?? 0;
    const cantidadActual = producto.cantidad ?? 1;

    if (cantidadActual >= stockDisponible) {
      alert("Stock máximo alcanzado.");
      return;
    }

    const actualizado = { ...producto, cantidad: cantidadActual + 1 };
    agregarAlCarrito(actualizado, true);
  };

  // ✅ Restar una unidad
  const restarCantidad = (producto) => {
    const cantidadActual = producto.cantidad ?? 1;
    if (cantidadActual <= 1) return;

    const actualizado = { ...producto, cantidad: cantidadActual - 1 };
    agregarAlCarrito(actualizado, true);
  };

  if (carrito.length === 0) {
    return (
      <div className="container text-center py-5">
        <h3 className="text-muted mb-3">🛒 Tu carrito está vacío</h3>
        <Link to="/productos" className="btn btn-primary">
          Ver productos
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="alert alert-info shadow-sm mb-4">
        <strong>¡Vista Carrito de Compras!</strong> Gestiona tus productos,
        ajusta cantidades o finaliza tu compra.
      </div>

      <div className="row g-4">
        {/* Lista de productos */}
        <div className="col-md-8">
          <h4 className="fw-bold mb-3 text-light">Carrito de Compras</h4>
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle">
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th>Cantidad</th>
                  <th>Subtotal</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {carrito.map((p) => {
                  const cantidadActual = p.cantidad || 1;
                  const stockDisponible = p.stock ?? 0;
                  const maximoAlcanzado = cantidadActual >= stockDisponible;

                  // 🎨 Cambia color del texto según el stock
                  const stockColor =
                    stockDisponible <= 1
                      ? "text-danger"
                      : stockDisponible <= 3
                        ? "text-warning"
                        : "text-light";

                  return (
                    <tr key={p.id}>
                      <td>
                        <img
                          src={
                            p.imagenes && p.imagenes[0]
                              ? p.imagenes[0]
                              : "/img/placeholder.jpg"
                          }
                          alt={p.nombre}
                          width="60"
                          height="60"
                          style={{
                            objectFit: "contain",
                            backgroundColor: "#fff",
                            borderRadius: "5px",
                            padding: "5px",
                          }}
                        />
                      </td>
                      <td className="fw-semibold">
                        {p.nombre}
                        <br />
                        <small className={stockColor}>
                          Stock disponible: {stockDisponible}
                        </small>
                      </td>
                      <td>${p.precio.toLocaleString("es-CL")}</td>
                      <td>
                        <div className="d-flex align-items-center justify-content-center">
                          <button
                            className="btn btn-sm btn-outline-light me-1"
                            onClick={() => restarCantidad(p)}
                            disabled={cantidadActual <= 1}
                          >
                            −
                          </button>
                          <span className="mx-2">{cantidadActual}</span>
                          <button
                            className="btn btn-sm btn-outline-light"
                            onClick={() => sumarCantidad(p)}
                            disabled={maximoAlcanzado}
                            title={
                              maximoAlcanzado
                                ? "Stock máximo alcanzado"
                                : "Agregar una unidad más"
                            }
                            style={
                              maximoAlcanzado
                                ? { opacity: 0.5, cursor: "not-allowed" }
                                : {}
                            }
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td>
                        $
                        {(p.precio * cantidadActual).toLocaleString("es-CL")}
                      </td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => eliminarDelCarrito(p.id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Resumen */}
        <div className="col-md-4">
          <div className="card bg-dark text-light shadow-sm">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Resumen de Compra</h5>
              <p className="d-flex justify-content-between">
                <span>Total de productos:</span>
                <strong>{carrito.length}</strong>
              </p>
              <p className="d-flex justify-content-between">
                <span>Total:</span>
                <strong>${total.toLocaleString("es-CL")}</strong>
              </p>

              <div className="d-grid gap-2 mt-4">
                <button
                  className="btn btn-outline-danger"
                  onClick={vaciarCarrito}
                >
                  🗑 Limpiar carrito
                </button>
                <Link to="/checkout" className="btn btn-success">
                  💳 Comprar ahora
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
