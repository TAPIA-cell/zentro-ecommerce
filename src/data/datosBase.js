// =========================================================
// 🛒 ZENTRO E-COMMERCE — DATOS BASE CORREGIDOS (2025)
// Compatible con React + Vite + Bootstrap
// =========================================================

// ======================
// PRODUCTOS BASE CON STOCK
// ======================
const productosBase = [
  { 
    id: 1, 
    nombre: "One Piece RORONOA ZORO THREE SWORDS set (Wado Ichimonji, Sandai Kitetsu, Enma) 1/1 PROPLICA", 
    precio: 679990, 
    imagenes: ["/img/roronoa2.webp", "/img/roronoa3.webp", "/img/roronoa.webp"], 
    descripcion: "Personaje: THREE SWORDS set. Fabricante: Bandai – Tamashii Nations. Línea: PROPLICA. Tamaño: 95 cm de largo.",
    stock: 2
  },
  { 
    id: 2, 
    nombre: "One Piece Soul of Chogokin General Franky GX-63 Bandai", 
    precio: 820000, 
    imagenes: ["/img/frank.webp", "/img/frank2.webp", "/img/frank3.webp"], 
    descripcion: "Incluye cuerpo Shogun, espada Franky, piezas de black rhinoceros, cabina Burakiotanku, y soporte para exposición.",
    stock: 0
  },
  { 
    id: 3, 
    nombre: "T-51 Nuka Cola Power Armor THREE ZERO", 
    precio: 350000, 
    imagenes: ["/img/nuka.webp", "/img/nuka2.webp", "/img/nuka3.webp"], 
    descripcion: "Figura articulada T-51 Nuka Cola Power Armor de Fallout. Fabricante: Three Zero. Tamaño: 30 cm de alto.",
    stock: 12
  },
  { 
    id: 4, 
    nombre: "Malenia Blade of Miquella — Figura de acción 1/6 escala", 
    precio: 450000, 
    imagenes: ["/img/malenia.webp", "/img/malenia2.webp", "/img/malenia3.webp"], 
    descripcion: "Figura articulada con accesorios y armadura detallada basada en Elden Ring.",
    stock: 1
  },
  { 
    id: 5, 
    nombre: "Figura Coleccionable Rubia Deluxe", 
    precio: 200000, 
    imagenes: ["/img/aa3-3.jpg", "/img/aa2-3.jpg", "/img/aa4-3.jpg"], 
    descripcion: "Figura de colección de mujer rubia con detalles finos y base decorativa.",
    stock: 8
  },
  { 
    id: 6, 
    nombre: "Fullmetal Alchemist: Edward y Alphonse", 
    precio: 180000, 
    imagenes: ["/img/fmab.webp", "/img/fmab2.webp", "/img/fmab3.webp"], 
    descripcion: "Diorama con los hermanos Elric de Fullmetal Alchemist: Brotherhood. Alta calidad de pintura.",
    stock: 5
  },
  { 
    id: 7, 
    nombre: "Vestido estilo gótico con encaje", 
    precio: 18000, 
    imagenes: ["/img/cariñosa1.webp", "/img/cariñosa2.webp", "/img/cariñosa3.webp"], 
    descripcion: "Vestido gótico elegante con detalles de encaje, ideal para cosplay o coleccionismo.",
    stock: 0
  },
  { 
    id: 8, 
    nombre: "Set de Katanas de Colección", 
    precio: 50000, 
    imagenes: ["/img/espada.png", "/img/espada2.png", "/img/espada3.png"], 
    descripcion: "Réplicas metálicas inspiradas en katanas de animes populares. Edición decorativa.",
    stock: 4
  }
];

// ======================
// USUARIOS BASE
// ======================
const usuariosBase = [
  { id: 1, nombre: "Administrador", email: "admin@gmail.com", password: "admin123", rol: "Admin" },
  { id: 2, nombre: "Cliente de prueba", email: "cliente@gmail.com", password: "1234", rol: "Cliente" }
];

// ======================
// BLOGS BASE
// ======================
const blogsBase = [
  {
    id: 1,
    titulo: "Llegó la nueva edición de FRANKY de One Piece",
    autor: "ZENTRO",
    fecha: "2025-09-23",
    imagen: "/img/frank.webp",
    contenido:
      "La llegada de esta nueva edición tiene emocionados a los fanáticos de One Piece. Esta pieza de edición limitada incluye a Chopper y accesorios exclusivos de Bandai.",
  },
  {
    id: 2,
    titulo: "¡Atención! Tenemos nuevo stock de MALENIA",
    autor: "ZENTRO",
    fecha: "2025-10-01",
    imagen: "/img/malenia.webp",
    contenido:
      "Renovamos stock de Malenia tras su éxito total. Esta figura basada en Elden Ring es una de las más solicitadas del año.",
  },
];

// ======================
// 🔄 Inicialización automática (solo si no existen)
// ======================
if (!localStorage.getItem("productos")) {
  localStorage.setItem("productos", JSON.stringify(productosBase));
}

if (!localStorage.getItem("usuarios")) {
  localStorage.setItem("usuarios", JSON.stringify(usuariosBase));
}

if (!localStorage.getItem("blogs")) {
  localStorage.setItem("blogs", JSON.stringify(blogsBase));
}

// ======================
// ✅ Exportación
// ======================
export { productosBase, usuariosBase, blogsBase };
export default { productosBase, usuariosBase, blogsBase };
