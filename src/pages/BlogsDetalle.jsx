import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function BlogDetalle() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const blogs = JSON.parse(localStorage.getItem("blogs")) || [];
    const encontrado = blogs.find((b) => String(b.id) === id);
    setBlog(encontrado);
  }, [id]);

  if (!blog) {
    return (
      <div className="container my-5 text-center">
        <div className="alert alert-warning fw-bold">Blog no encontrado 😢</div>
        <Link to="/blogs" className="btn btn-outline-primary mt-3">
          ← Volver a Blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="container my-5 blog-container">
      <div className="card shadow border-0 p-4">
        <img
          src={blog.imagen}
          alt={blog.titulo}
          className="detalle-blog-img rounded mb-4 mx-auto d-block"
          style={{ maxHeight: "300px", objectFit: "cover" }}
        />
        <h2 className="fw-bold text-center mb-3">{blog.titulo}</h2>
        <p className="text-muted text-center">
          Por <strong>{blog.autor}</strong> · {blog.fecha}
        </p>
        <hr />
        <p className="mt-4">{blog.contenido}</p>
        <div className="text-center mt-4">
          <Link to="/blogs" className="btn btn-outline-primary">
            ← Volver a Blogs
          </Link>
        </div>
      </div>
    </div>
  );
}
