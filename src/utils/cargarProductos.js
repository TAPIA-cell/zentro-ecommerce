// utils/cargarProductos.js

import { productosBase } from "../data/datosBase"; // Tu archivo con los datos base

export const cargarProductos = () => {
  // 1. Intenta obtener los productos guardados en localStorage
  const almacenados = JSON.parse(localStorage.getItem("productos"));
  
  // 2. Si no hay nada o el array está vacío, usa los productos base.
  // IMPORTANTE: Si ya hay productos guardados (p. ej. desde AdminProductos), úsalos.
  const lista = Array.isArray(almacenados) && almacenados.length > 0 
                ? almacenados 
                : productosBase;
                
  // 3. Asegura que todos los productos tengan la propiedad stock (por si se usan datos base antiguos)
  return lista.map(p => ({ 
    ...p, 
    stock: p.stock !== undefined ? p.stock : 0 
  }));
};