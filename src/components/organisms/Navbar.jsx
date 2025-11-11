import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import { CartContext } from "../../context/CartContext.jsx";

function Navbar() {
  const { usuario, logout } = useContext(AuthContext);
  const { totalItems } = useContext(CartContext);

  return (
    <nav className="navbar navbar-expand-lg bg-body-secondary border-bottom">
      <div className="container-fluid">
        {/* Marca */}
        <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
          <img
            src="/img/logo.png"
            alt="Logo Zentro"
            width="40"
            className="me-2"
          />
          Zentro E-commerce
        </Link>

        {/* Botón colapsable */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#menu"
          aria-controls="menu"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menú */}
        <div className="collapse navbar-collapse" id="menu">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">Inicio</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/productos">Productos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/nosotros">Nosotros</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/blogs">Blogs</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contacto">Contacto</Link>
            </li>
          </ul>

          <div className="d-flex align-items-center">
            {!usuario ? (
              <>
                <Link to="/login" className="me-2 small text-dark">
                  Iniciar sesión
                </Link>
                |
                <Link to="/registro" className="ms-2 small text-dark">
                  Registrar usuario
                </Link>
              </>
            ) : (
              <>
                <span className="ms-2 fw-bold text-dark">
                  👤 {usuario.nombre}
                </span>
                {usuario.rol === "Admin" && (
                  <Link
                    to="/admin"
                    className="btn btn-outline-dark ms-2 btn-sm"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="btn btn-outline-danger ms-2 btn-sm"
                >
                  Cerrar sesión
                </button>
              </>
            )}
            {/* Carrito */}
            <Link
              to="/carrito"
              className="btn btn-outline-dark ms-3 position-relative"
            >
              🛒 Carrito
              {totalItems > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  style={{ fontSize: "0.7rem" }}
                >
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
