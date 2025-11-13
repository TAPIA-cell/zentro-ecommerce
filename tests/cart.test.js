describe("Carrito - lógica", function () {
  function agregarAlCarrito(carrito, producto) {
    const existente = carrito.find((p) => p.id === producto.id);
    if (existente) {
      existente.cantidad += producto.cantidad;
    } else {
      carrito.push({ ...producto });
    }
    return carrito;
  }

  function calcularTotal(carrito) {
    return carrito.reduce((sum, p) => sum + p.precio * p.cantidad, 0);
  }

  it("agrega un producto al carrito", function () {
    const carrito = [];
    agregarAlCarrito(carrito, { id: 1, nombre: "Pizza", precio: 10000, cantidad: 1 });

    if (carrito.length !== 1) throw new Error("No se agregó producto");
  });

  it("acumula cantidades si el producto ya existe", function () {
    const carrito = [
      { id: 1, nombre: "Pizza", precio: 10000, cantidad: 1 }
    ];
    agregarAlCarrito(carrito, { id: 1, nombre: "Pizza", precio: 10000, cantidad: 2 });

    if (carrito[0].cantidad !== 3) throw new Error("Cantidad incorrecta");
  });

  it("calcula total correctamente", function () {
    const carrito = [
      { id: 1, precio: 10000, cantidad: 1 },
      { id: 2, precio: 5000, cantidad: 2 }
    ];

    const total = calcularTotal(carrito);
    if (total !== 20000) throw new Error("Total incorrecto");
  });
});
