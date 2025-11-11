// src/components/ProtectedRoute.jsx
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

/**
 * Este componente sirve para proteger rutas según si el usuario está logeado
 * y/o su rol (por ejemplo, solo "Admin").
 * 
 * Uso:
 * <ProtectedRoute role="Admin">
 *   <AdminHome />
 * </ProtectedRoute>
 */
function ProtectedRoute({ children, role }) {
  const { usuario } = useContext(AuthContext);

  // 🔒 Si no hay usuario logeado, redirige al login
  if (!usuario) {
    alert("⚠️ Debes iniciar sesión para acceder a esta sección.");
    return <Navigate to="/login" replace />;
  }

  // 🔐 Si tiene rol requerido y no coincide, redirige al inicio
  if (role && usuario.rol !== role) {
    alert("⛔ No tienes permisos para acceder a esta sección.");
    return <Navigate to="/" replace />;
  }

  // ✅ Si pasa las validaciones, renderiza el contenido
  return children;
}

export default ProtectedRoute;
