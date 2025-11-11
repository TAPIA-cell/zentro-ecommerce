import { useState, useEffect } from "react";

function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [usuarioActual, setUsuarioActual] = useState({
    id: null,
    nombre: "",
    email: "",
    rol: "Cliente",
    password: "",
  });

  // 🔹 Cargar usuarios desde localStorage (sin borrar los existentes)
  const cargarUsuarios = () => {
    const lista = JSON.parse(localStorage.getItem("usuarios")) || [];
    setUsuarios(lista);
  };

  useEffect(() => {
    cargarUsuarios();

    // 🔁 Escuchar evento de actualización de usuarios (disparado desde Registro.jsx)
    const actualizar = () => cargarUsuarios();
    window.addEventListener("usuariosActualizados", actualizar);

    // 🔁 También escucha cambios de localStorage (p. ej., en otra pestaña)
    const storageListener = (e) => {
      if (e.key === "usuarios") cargarUsuarios();
    };
    window.addEventListener("storage", storageListener);

    return () => {
      window.removeEventListener("usuariosActualizados", actualizar);
      window.removeEventListener("storage", storageListener);
    };
  }, []);

  // 🔹 Agregar usuario manual desde admin
  const handleAgregar = (e) => {
    e.preventDefault();

    if (!usuarioActual.nombre || !usuarioActual.email || !usuarioActual.password) {
      alert("⚠️ Todos los campos son obligatorios.");
      return;
    }

    const usuariosActuales = JSON.parse(localStorage.getItem("usuarios")) || [];
    const existe = usuariosActuales.some(
      (u) => u.email.toLowerCase() === usuarioActual.email.toLowerCase()
    );
    if (existe) {
      alert("⚠️ Ya existe un usuario con ese correo.");
      return;
    }

    const nuevo = { ...usuarioActual, id: Date.now() };
    const actualizados = [...usuariosActuales, nuevo];
    localStorage.setItem("usuarios", JSON.stringify(actualizados));
    setUsuarios(actualizados);
    window.dispatchEvent(new Event("usuariosActualizados"));

    setUsuarioActual({ id: null, nombre: "", email: "", rol: "Cliente", password: "" });
  };

  // 🔹 Editar
  const handleEditar = (usuario) => {
    setModoEdicion(true);
    setUsuarioActual(usuario);
  };

  const handleActualizar = (e) => {
    e.preventDefault();
    const actualizados = usuarios.map((u) =>
      u.id === usuarioActual.id ? usuarioActual : u
    );
    localStorage.setItem("usuarios", JSON.stringify(actualizados));
    setUsuarios(actualizados);
    setModoEdicion(false);
    setUsuarioActual({ id: null, nombre: "", email: "", rol: "Cliente", password: "" });
  };

  // 🔹 Eliminar
  const handleEliminar = (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este usuario?")) {
      const actualizados = usuarios.filter((u) => u.id !== id);
      localStorage.setItem("usuarios", JSON.stringify(actualizados));
      setUsuarios(actualizados);
    }
  };

  // 🔹 Manejo de inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuarioActual({ ...usuarioActual, [name]: value });
  };

  return (
    <div className="container mt-4">
      <h2 className="fw-bold text-center mb-4">👥 Gestión de Usuarios</h2>

      <form
        onSubmit={modoEdicion ? handleActualizar : handleAgregar}
        className="p-4 border rounded bg-light mb-4 shadow-sm"
      >
        <div className="row g-3">
          <div className="col-md-3">
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={usuarioActual.nombre}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-3">
            <input
              type="email"
              name="email"
              placeholder="Correo"
              value={usuarioActual.email}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-2">
            <select
              name="rol"
              value={usuarioActual.rol}
              onChange={handleChange}
              className="form-select"
            >
              <option value="Cliente">Cliente</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div className="col-md-2">
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={usuarioActual.password}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-2 d-flex">
            <button className="btn btn-primary w-100">
              {modoEdicion ? "Actualizar" : "Agregar"}
            </button>
          </div>
        </div>
      </form>

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  No hay usuarios registrados.
                </td>
              </tr>
            ) : (
              usuarios.map((u, i) => (
                <tr key={u.id}>
                  <td>{i + 1}</td>
                  <td>{u.nombre}</td>
                  <td>{u.email}</td>
                  <td>
                    <span
                      className={`badge ${
                        u.rol === "Admin" ? "bg-danger" : "bg-secondary"
                      }`}
                    >
                      {u.rol}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => handleEditar(u)}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleEliminar(u.id)}
                    >
                      🗑️ Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminUsuarios;
