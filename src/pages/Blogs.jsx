import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { cargarBlogs } from "../utils/storage";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);

  // 🔁 Carga inicial + actualización en vivo
  useEffect(() => {
    const load = () => setBlogs(cargarBlogs());
    load();
    window.addEventListener("storage", load);
    return () => window.removeEventListener("storage", load);
  }, []);

  // 🖼️ Imagen por defecto si no hay
  const getImg = (src) =>
    src && src.trim() !== "" ? src : "/img/placeholder.jpg";

  return (
    <div className="container my-5 blog-container">
      <h2 className="text-center fw-bold mb-5">📰 Noticias Importantes</h2>

      {blogs.length === 0 ? (
        <p className="text-center text-muted">
          No hay publicaciones disponibles.
        </p>
      ) : (
        <div className="row g-4">
          {blogs.map((blog) => (
            <div className="col-12 col-md-6" key={blog.id}>
              <div className="card h-100 shadow-sm border-0">
                <img
                  src={getImg(blog.imagen)}
                  alt={blog.titulo}
                  className="card-img-top"
                  style={{
                    height: "200px",
                    objectFit: "cover",
                    borderTopLeftRadius: "8px",
                    borderTopRightRadius: "8px",
                  }}
                />

                <div className="card-body d-flex flex-column">
                  <h5 className="fw-bold">{blog.titulo}</h5>
                  <small className="text-muted d-block mb-2">
                    {blog.autor} — {blog.fecha}
                  </small>
                  <p className="text-secondary flex-grow-1">
                    {blog.contenido.substring(0, 150)}...
                  </p>
                  <Link
                    to={`/blogs/${blog.id}`}
                    className="btn btn-outline-primary btn-sm mt-auto"
                  >
                    Ver Detalle
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
