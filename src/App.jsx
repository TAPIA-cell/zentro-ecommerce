import { Routes, Route } from "react-router-dom";
import Navbar from "./components/organisms/Navbar";
import FooterInfo from "./components/molecules/FooterInfo";
import ProtectedRoute from "./components/ProtectedRoute";

// Páginas públicas
import Home from "./pages/Home";
import Productos from "./pages/Productos";
import Nosotros from "./pages/Nosotros";
import Blogs from "./pages/Blogs";
import BlogDetalle from "./pages/BlogsDetalle";
import Contacto from "./pages/Contacto";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout"; // ✅ NUEVO
import Login from "./pages/Login";
import Register from "./pages/Registro";
import DetalleProducto from "./pages/DetalleProducto";

// Páginas de administrador
import AdminHome from "./pages/AdminHome";
import AdminUsuarios from "./pages/AdminUsuarios";
import AdminProductos from "./pages/AdminProductos";
import AdminBlogs from "./pages/AdminBlogs";
import AdminVentas from "./pages/AdminVentas"; // ✅ Nuevo import

function App() {
  return (
    <div className="app-layout d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">
        <Routes>
          {/* 🔹 Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/producto/:id" element={<DetalleProducto />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:id" element={<BlogDetalle />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/carrito" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} /> {/* ✅ NUEVA RUTA */}
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />

          {/* 🔐 Rutas protegidas para administrador */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="Admin">
                <AdminHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/usuarios"
            element={
              <ProtectedRoute role="Admin">
                <AdminUsuarios />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/productos"
            element={
              <ProtectedRoute role="Admin">
                <AdminProductos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/blogs"
            element={
              <ProtectedRoute role="Admin">
                <AdminBlogs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/ventas"
            element={
              <ProtectedRoute role="Admin">
                <AdminVentas />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <FooterInfo />
    </div>
  );
}

export default App;
