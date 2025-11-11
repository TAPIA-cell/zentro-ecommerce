import { useState, useEffect } from "react";
import { cargarBlogs, guardarBlogs } from "../utils/storage";

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [blogActual, setBlogActual] = useState({
    id: null,
    titulo: "",
    autor: "",
    fecha: "",
    contenido: "",
    imagen: "",
  });
  const [preview, setPreview] = useState("");

  // ✅ Carga inicial una sola vez
  useEffect(() => {
    setBlogs(cargarBlogs());
  }, []);

  // ✅ Escucha cambios externos en el localStorage
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === "blogs") {
        setBlogs(cargarBlogs());
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // ======================
  // 📩 GUARDAR / ACTUALIZAR BLOG
  // ======================
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!blogActual.titulo || !blogActual.autor || !blogActual.fecha) {
      alert("⚠️ Completa todos los campos obligatorios");
      return;
    }

    let lista = [...blogs];
    if (blogActual.id) {
      lista = lista.map((b) => (b.id === blogActual.id ? blogActual : b));
    } else {
      const nuevo = {
        ...blogActual,
        id: blogs.length > 0 ? Math.max(...blogs.map((b) => b.id)) + 1 : 1,
        imagen: blogActual.imagen || "/img/placeholder.jpg",
      };
      lista.push(nuevo);
    }

    setBlogs(lista);
    guardarBlogs(lista); // ✅ Guardar solo aquí, no en cada render
    limpiarFormulario();
  };

  // ======================
  // ✏️ EDITAR
  // ======================
  const handleEditar = (blog) => {
    setBlogActual(blog);
    setPreview(blog.imagen);
  };

  // ======================
  // 🗑️ ELIMINAR
  // ======================
  const handleEliminar = (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este blog?")) {
      const actualizados = blogs.filter((b) => b.id !== id);
      setBlogs(actualizados);
      guardarBlogs(actualizados);
    }
  };

  // ======================
  // 📂 CARGAR IMAGEN
  // ======================
  const handleFiles = (files) => {
    const file = files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBlogActual({ ...blogActual, imagen: e.target.result });
        setPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => e.preventDefault();

  // ======================
  // 🧹 LIMPIAR FORMULARIO
  // ======================
  const limpiarFormulario = () => {
    setBlogActual({
      id: null,
      titulo: "",
      autor: "",
      fecha: "",
      contenido: "",
      imagen: "",
    });
    setPreview("");
  };

  return (
    <div className="container mt-4">
      <h2 className="fw-bold text-center mb-4">📰 Gestión de Blogs</h2>

      {/* === FORMULARIO === */}
      <form onSubmit={handleSubmit} className="row g-3 mb-4 border p-4 bg-light rounded">
        <div className="col-md-4">
          <input
            type="text"
            name="titulo"
            placeholder="Título"
            value={blogActual.titulo}
            onChange={(e) => setBlogActual({ ...blogActual, titulo: e.target.value })}
            className="form-control"
            required
          />
        </div>

        <div className="col-md-4">
          <input
            type="text"
            name="autor"
            placeholder="Autor"
            value={blogActual.autor}
            onChange={(e) => setBlogActual({ ...blogActual, autor: e.target.value })}
            className="form-control"
            required
          />
        </div>

        <div className="col-md-4">
          <input
            type="date"
            name="fecha"
            value={blogActual.fecha}
            onChange={(e) => setBlogActual({ ...blogActual, fecha: e.target.value })}
            className="form-control"
            required
          />
        </div>

        <div className="col-12">
          <textarea
            name="contenido"
            placeholder="Contenido del blog"
            value={blogActual.contenido}
            onChange={(e) => setBlogActual({ ...blogActual, contenido: e.target.value })}
            rows="4"
            className="form-control"
            required
          />
        </div>

        <div
          className="col-md-4 border border-2 border-secondary rounded p-3 text-center bg-white"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => document.getElementById("imagenBlogInput").click()}
        >
          Arrastra la imagen o haz clic
          <input
            id="imagenBlogInput"
            type="file"
            className="d-none"
            accept="image/*"
            onChange={(e) => handleFiles(e.target.files)}
          />
          {preview && (
            <div className="mt-3">
              <img src={preview} alt="preview" className="img-thumbnail" width="120" />
            </div>
          )}
        </div>

        <div className="col-12 d-flex gap-2">
          <button type="submit" className="btn btn-success">
            💾 {blogActual.id ? "Actualizar" : "Guardar"}
          </button>
          <button type="button" className="btn btn-secondary" onClick={limpiarFormulario}>
            ❌ Cancelar
          </button>
        </div>
      </form>

      {/* === TABLA === */}
      <div className="table-responsive">
        <table className="table table-bordered table-striped shadow-sm align-middle">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Autor</th>
              <th>Fecha</th>
              <th>Imagen</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {blogs.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center text-muted">
                  No hay blogs registrados.
                </td>
              </tr>
            ) : (
              blogs.map((b) => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{b.titulo}</td>
                  <td>{b.autor}</td>
                  <td>{b.fecha}</td>
                  <td>
                    <img src={b.imagen} alt={b.titulo} width="80" className="rounded" />
                  </td>
                  <td>
                    <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditar(b)}>
                      ✏️
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleEliminar(b.id)}>
                      🗑️
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
