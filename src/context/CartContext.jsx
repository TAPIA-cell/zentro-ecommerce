import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [carrito, setCarrito] = useState([]);

  // ✅ Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const guardado = JSON.parse(localStorage.getItem("carrito")) || [];
    setCarrito(guardado);
  }, []);

  // ✅ Guardar carrito cada vez que cambia
  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  // ✅ Agregar o actualizar producto con límite de stock
  const agregarAlCarrito = (producto, actualizar = false) => {
    setCarrito((prev) => {
      const existente = prev.find((p) => p.id === producto.id);

      if (existente) {
        // Si es una actualización directa (sumar/restar)
        if (actualizar) {
          if (producto.cantidad > producto.stock) {
            alert(`Solo hay ${producto.stock} unidades disponibles.`);
            return prev;
          }
          if (producto.cantidad <= 0) {
            return prev.filter((p) => p.id !== producto.id);
          }
          return prev.map((p) =>
            p.id === producto.id ? { ...p, cantidad: producto.cantidad } : p
          );
        }

        // Si es un agregado incremental normal (+1)
        const nuevaCantidad = (existente.cantidad || 1) + (producto.cantidad || 1);

        if (nuevaCantidad > (producto.stock ?? existente.stock ?? 0)) {
          alert(`Solo hay ${producto.stock ?? existente.stock ?? 0} unidades disponibles.`);
          return prev;
        }

        return prev.map((p) =>
          p.id === producto.id ? { ...p, cantidad: nuevaCantidad } : p
        );
      } else {
        // ✅ No permitir agregar si no hay stock
        if (producto.stock <= 0) {
          alert("Producto sin stock disponible.");
          return prev;
        }

        return [...prev, { ...producto, cantidad: producto.cantidad || 1 }];
      }
    });
  };

  // ✅ Eliminar producto por ID
  const eliminarDelCarrito = (id) => {
    setCarrito((prev) => prev.filter((p) => p.id !== id));
  };

  // ✅ Vaciar todo el carrito
  const vaciarCarrito = () => {
    setCarrito([]);
    localStorage.removeItem("carrito");
  };

  // ✅ Totales
  const totalItems = carrito.reduce((acc, p) => acc + (p.cantidad || 1), 0);
  const total = carrito.reduce(
    (acc, p) => acc + (p.precio || 0) * (p.cantidad || 1),
    0
  );

  return (
    <CartContext.Provider
      value={{
        carrito,
        agregarAlCarrito,
        eliminarDelCarrito,
        vaciarCarrito,
        total,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
