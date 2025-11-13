describe("Productos - lógica básica", function () {
  const productos = [
    { id: 1, nombre: "Pizza Italiana", categoria: "Pizzas" },
    { id: 2, nombre: "Pizza Pepperoni", categoria: "Pizzas" },
    { id: 3, nombre: "Empanada", categoria: "Snacks" }
  ];

  function filtrarPorCategoria(lista, cat) {
    return lista.filter((p) => p.categoria === cat);
  }

  function buscarProducto(lista, texto) {
    return lista.filter((p) => p.nombre.toLowerCase().includes(texto.toLowerCase()));
  }

  it("filtra productos por categoría", function () {
    const r = filtrarPorCategoria(productos, "Pizzas");
    if (r.length !== 2) throw new Error("Filtro por categoría falló");
  });

  it("busca productos por texto", function () {
    const r = buscarProducto(productos, "pep");
    if (r.length !== 1) throw new Error("Búsqueda falló");
  });
});
