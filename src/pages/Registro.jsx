import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

function Registro() {
  const { registrar } = useContext(AuthContext);
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Trae usuarios actuales
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Validar duplicado
    if (usuarios.some((u) => u.email.toLowerCase() === correo.toLowerCase())) {
      setError("⚠️ Este correo ya está registrado.");
      return;
    }

    // Crear nuevo usuario
    const nuevoUsuario = {
      id: Date.now(),
      nombre,
      email: correo,
      password,
      rol: "Cliente",
    };

    usuarios.push(nuevoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    // 🔔 Avisar al resto de la app (AdminUsuarios.jsx)
    window.dispatchEvent(new Event("usuariosActualizados"));

    alert("✅ Registro exitoso. Ahora puedes iniciar sesión.");
    navigate("/login");
  };

  return (
    <main className="container my-5 text-center">
      <div className="mb-3">
        <img src="/img/logo.png" alt="Logo" width="120" className="img-fluid" />
      </div>
      <h2 className="mb-4">Registro de Usuario</h2>

      <form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: "500px" }}>
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">Nombre completo</label>
          <input
            type="text"
            id="nombre"
            className="form-control"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="correo" className="form-label">Correo electrónico</label>
          <input
            type="email"
            id="correo"
            className="form-control"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Contraseña</label>
          <input
            type="password"
            id="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="text-danger">{error}</p>}

        <button type="submit" className="btn btn-success w-100">
          Registrarme
        </button>

        <p className="text-center mt-3">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </form>
    </main>
  );
}

export default Registro;
