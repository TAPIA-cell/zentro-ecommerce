import { Link } from "react-router-dom";

function ProductCard({ producto, agregarAlCarrito }) {
  return (
    <div className="card shadow-sm h-100">
      <img
        src={producto.imagen}
        alt={producto.nombre}
        className="card-img-top p-3"
      />
      <div className="card-body text-center">
        <h5 className="card-title fw-bold">{producto.nombre}</h5>
        <p className="text-muted small">{producto.descripcion}</p>
        <p className="fw-bold text-success">${producto.precio}</p>

        <div className="d-flex justify-content-center gap-2">
          <button
            className="btn btn-primary btn-sm"
            onClick={() => agregarAlCarrito(producto)}
          >
            Añadir
          </button>
          <Link
            to={`/producto/${producto.id}`}
            className="btn btn-outline-secondary btn-sm"
          >
            Ver
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
