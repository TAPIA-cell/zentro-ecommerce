// ============================================================
// 📦 utils/storage.js — Manejo seguro de localStorage (ZENTRO)
// ============================================================

import { productosBase, usuariosBase, blogsBase } from "../data/datosBase.js";

// Claves únicas
const KEYS = {
  productos: "productos",
  usuarios: "usuarios",
  blogs: "blogs",
  seedFlag: "zentro_seed_done"
};

// ✅ Inicializa solo una vez los datos base
export function inicializarDatosBase() {
  if (localStorage.getItem(KEYS.seedFlag)) return; // Ya cargado

  if (!localStorage.getItem(KEYS.productos))
    localStorage.setItem(KEYS.productos, JSON.stringify(productosBase));

  if (!localStorage.getItem(KEYS.usuarios))
    localStorage.setItem(KEYS.usuarios, JSON.stringify(usuariosBase));

  if (!localStorage.getItem(KEYS.blogs))
    localStorage.setItem(KEYS.blogs, JSON.stringify(blogsBase));

  localStorage.setItem(KEYS.seedFlag, "true");
  console.log("🌱 Datos base inicializados");
}

// ✅ Cargar (seguro)
function getJSON(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.warn(`⚠️ Error leyendo ${key}:`, e);
    return fallback;
  }
}

// ✅ Guardar (seguro)
function setJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new StorageEvent("storage", { key }));
}

// -----------------------
// 🔹 Funciones específicas
// -----------------------
export const cargarProductos = () => getJSON(KEYS.productos);
export const guardarProductos = (arr) => setJSON(KEYS.productos, arr);

export const cargarUsuarios = () => getJSON(KEYS.usuarios);
export const guardarUsuarios = (arr) => setJSON(KEYS.usuarios, arr);

export const cargarBlogs = () => getJSON(KEYS.blogs);
export const guardarBlogs = (arr) => setJSON(KEYS.blogs, arr);

// Export default
export default {
  inicializarDatosBase,
  cargarProductos,
  cargarUsuarios,
  cargarBlogs,
  guardarProductos,
  guardarUsuarios,
  guardarBlogs
};
