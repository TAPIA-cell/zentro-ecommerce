describe("Checkout - validaciones", function () {
  function validarFormulario(form) {
    const errors = {};
    if (!form.nombre) errors.nombre = "Nombre requerido";
    if (!form.apellido) errors.apellido = "Apellido requerido";
    if (!form.correo || !form.correo.includes("@")) errors.correo = "Correo inválido";
    return errors;
  }

  it("valida campos vacíos", function () {
    const form = { nombre: "", apellido: "", correo: "" };
    const e = validarFormulario(form);

    if (!e.nombre || !e.apellido || !e.correo)
      throw new Error("No validó campos vacíos");
  });

  it("valida correo incorrecto", function () {
    const form = { nombre: "a", apellido: "b", correo: "xxx" };
    const e = validarFormulario(form);

    if (!e.correo) throw new Error("No detectó correo inválido");
  });
});
