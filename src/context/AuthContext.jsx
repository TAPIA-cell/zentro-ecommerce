import { createContext, useState, useEffect } from "react";
import { usuariosBase } from "../data/datosBase";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);

  // 🔹 Garantizar que los usuarios base estén en localStorage
  useEffect(() => {
    const almacenados = JSON.parse(localStorage.getItem("usuarios"));
    if (!almacenados || almacenados.length === 0) {
      localStorage.setItem("usuarios", JSON.stringify(usuariosBase));
    } else {
      // Combinar base + almacenados sin duplicar emails
      const combinados = [
        ...almacenados,
        ...usuariosBase.filter(
          (base) => !almacenados.some((u) => u.email === base.email)
        ),
      ];
      localStorage.setItem("usuarios", JSON.stringify(combinados));
    }
  }, []);

  // 🔹 Función de login
  const login = (correo, password) => {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const encontrado = usuarios.find(
      (u) => u.email === correo && u.password === password
    );
    if (encontrado) {
      setUsuario(encontrado);
      localStorage.setItem("usuarioActivo", JSON.stringify(encontrado));
      return true;
    }
    return false;
  };

  // 🔹 Función de registro
  const registrar = (nombre, correo, password) => {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    if (usuarios.some((u) => u.email === correo)) return false;

    const nuevo = {
      id: Date.now(),
      nombre,
      email: correo,
      password,
      rol: "Cliente",
    };

    const actualizados = [...usuarios, nuevo];
    localStorage.setItem("usuarios", JSON.stringify(actualizados));
    return true;
  };

  // 🔹 Cerrar sesión
  const logout = () => {
    setUsuario(null);
    localStorage.removeItem("usuarioActivo");
  };

  // 🔹 Mantener sesión activa
  useEffect(() => {
    const activo = JSON.parse(localStorage.getItem("usuarioActivo"));
    if (activo) setUsuario(activo);
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, login, registrar, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
