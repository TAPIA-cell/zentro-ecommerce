describe("Ventas - almacenamiento", function () {

  // Antes de cada test limpiamos el localStorage interno del navegador
  beforeEach(function () {
    localStorage.clear();
  });

  function guardarVenta(venta) {
    const ventas = JSON.parse(localStorage.getItem("ventas")) || [];
    ventas.push(venta);
    localStorage.setItem("ventas", JSON.stringify(ventas));
  }

  it("guarda una venta correctamente", function () {
    const venta = { id: 1, total: 15000 };
    guardarVenta(venta);

    const stored = JSON.parse(localStorage.getItem("ventas"));

    if (!stored || stored.length !== 1) {
      throw new Error("No guardó la venta correctamente");
    }
  });

  it("acumula múltiples ventas", function () {
    guardarVenta({ id: 1 });
    guardarVenta({ id: 2 });

    const stored = JSON.parse(localStorage.getItem("ventas"));

    if (stored.length !== 2) {
      throw new Error("No acumuló las ventas");
    }
  });
});
