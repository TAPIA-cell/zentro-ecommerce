import { useState, useContext } from "react";
import { CartContext } from "../context/CartContext.jsx";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function Checkout() {
  const { carrito, total, vaciarCarrito } = useContext(CartContext);

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    calle: "",
    depto: "",
    region: "",
    comuna: "",
    indicaciones: "",
  });

  const [errors, setErrors] = useState({});
  const [estadoCompra, setEstadoCompra] = useState(null);
  const [procesando, setProcesando] = useState(false);
  const [detalleCompra, setDetalleCompra] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: null }));
    }
  };

  const validarFormulario = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.nombre.trim()) newErrors.nombre = "El nombre es obligatorio";
    if (!form.apellido.trim()) newErrors.apellido = "El apellido es obligatorio";
    if (!form.calle.trim()) newErrors.calle = "La calle es obligatoria";
    if (!form.region) newErrors.region = "Debes seleccionar una región";
    if (!form.comuna.trim()) newErrors.comuna = "La comuna es obligatoria";
    if (!form.correo.trim()) {
      newErrors.correo = "El correo es obligatorio";
    } else if (!emailRegex.test(form.correo)) {
      newErrors.correo = "El formato del correo no es válido";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const pagarAhora = () => {
    if (!validarFormulario()) return;
    if (carrito.length === 0) {
      alert("El carrito está vacío.");
      return;
    }

    setProcesando(true);
    setErrors({});

    setTimeout(async () => {
      setProcesando(false);
      setEstadoCompra("exito");

      const nuevaVenta = {
        id: Date.now(),
        usuario: `${form.nombre} ${form.apellido}`,
        correo: form.correo,
        fecha: new Date().toLocaleString("es-CL"),
        items: carrito.map((p) => ({
          id: p.id,
          nombre: p.nombre,
          cantidad: p.cantidad,
          precio: p.precio,
          imagen: p.imagenes && p.imagenes[0] ? p.imagenes[0] : "/img/placeholder.jpg",
        })),
        total,
      };

      setDetalleCompra(nuevaVenta);

      try {
        const ventasPrevias = JSON.parse(localStorage.getItem("ventas")) || [];
        ventasPrevias.push(nuevaVenta);
        localStorage.setItem("ventas", JSON.stringify(ventasPrevias));

        const productosGuardados =
          JSON.parse(localStorage.getItem("productos")) || [];
        const productosActualizados = productosGuardados.map((prod) => {
          const comprado = carrito.find((p) => p.id === prod.id);
          if (comprado) {
            const nuevoStock = (prod.stock || 0) - (comprado.cantidad || 0);
            return { ...prod, stock: nuevoStock >= 0 ? nuevoStock : 0 };
          }
          return prod;
        });
        localStorage.setItem("productos", JSON.stringify(productosActualizados));
      } catch (error) {
        console.error("Error al guardar la venta:", error);
      }

      vaciarCarrito();
      await generarPDF(nuevaVenta);
    }, 1500);
  };

  const generarPDF = async (ventaData) => {
    const venta = ventaData || detalleCompra;
    if (!venta || !venta.items || venta.items.length === 0) {
      alert("No hay productos para generar boleta.");
      return;
    }

    const loadImageAsBase64 = (url) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL();
          resolve({ dataUrl, width: img.naturalWidth, height: img.naturalHeight });
        };
        img.onerror = () => {
          console.error("Error al cargar imagen:", url);
          resolve({ dataUrl: null });
        };
        try {
          img.src = new URL(url, window.location.origin).href;
        } catch (e) {
          resolve({ dataUrl: null });
        }
      });
    };

    const logo = await loadImageAsBase64("/img/logo.png");

    const itemsConImagenes = await Promise.all(
      venta.items.map(async (p) => {
        const img = await loadImageAsBase64(p.imagen);
        return { ...p, imagenBase64: img.dataUrl };
      })
    );

    const doc = new jsPDF();

    if (logo.dataUrl) {
      const aspect = logo.width / logo.height;
      const w = 40;
      const h = w / aspect;
      doc.addImage(logo.dataUrl, "PNG", 150, 10, w, h);
    }

    doc.setFontSize(14);
    doc.text("Boleta de Compra - Zentro E-Commerce", 20, 20);
    doc.setFontSize(11);
    doc.text(`Fecha: ${venta.fecha}`, 20, 30);
    doc.text(`Cliente: ${venta.usuario}`, 20, 38);
    doc.text(`Correo: ${venta.correo}`, 20, 46);
    doc.text("Detalle de productos:", 20, 58);

    const columnas = ["Imagen", "Producto", "Cantidad", "Precio", "Subtotal"];
    const filas = itemsConImagenes.map((p) => [
      { image: p.imagenBase64 },
      p.nombre,
      p.cantidad,
      `$${p.precio.toLocaleString("es-CL")}`,
      `$${(p.precio * p.cantidad).toLocaleString("es-CL")}`,
    ]);

    autoTable(doc, {
      startY: 62,
      head: [columnas],
      body: filas,
      bodyStyles: { minCellHeight: 20 },
      columnStyles: {
        0: { cellWidth: 22, halign: "center", valign: "middle" },
        1: { valign: "middle" },
        2: { halign: "center", valign: "middle" },
        3: { halign: "right", valign: "middle" },
        4: { halign: "right", valign: "middle" },
      },
      didDrawCell: (data) => {
        if (data.column.index === 0 && data.cell.section === "body") {
          const item = data.cell.raw;
          if (item.image) {
            try {
              const x = data.cell.x + 2;
              const y = data.cell.y + 2;
              const w = 16;
              const h = 16;
              doc.addImage(item.image, "PNG", x, y, w, h);
            } catch (err) {
              console.error("Error al dibujar imagen:", err);
            }
          }
        }
      },
    });

    const totalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(13);
    doc.text(`TOTAL: $${venta.total.toLocaleString("es-CL")}`, 150, totalY);
    doc.save(`boleta_${venta.id}.pdf`);
  };

  const totalFormateado = total.toLocaleString("es-CL");

  return (
    <div className="container py-5">
      <div className="card shadow-sm border-0">
        <div className="card-body">
          {estadoCompra === "exito" && (
            <div className="alert alert-success">
              ✅ Compra confirmada — <strong>Orden #{detalleCompra?.id}</strong>
              <p className="mb-0">
                ¡Gracias por tu compra, {detalleCompra?.usuario || form.nombre}!
              </p>
            </div>
          )}

          <h5 className="fw-bold mb-3">Carrito de compra</h5>
          <div className="table-responsive mb-4">
            <table className="table align-middle">
              <thead className="table-light">
                <tr>
                  <th>Imagen</th>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th>Cantidad</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {carrito.length > 0 ? (
                  carrito.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <img
                          src={
                            p.imagenes && p.imagenes[0]
                              ? p.imagenes[0]
                              : "/img/placeholder.jpg"
                          }
                          alt={p.nombre}
                          width="60"
                          height="60"
                          style={{
                            objectFit: "contain",
                            background: "#f9f9f9",
                          }}
                        />
                      </td>
                      <td>{p.nombre}</td>
                      <td>${p.precio.toLocaleString("es-CL")}</td>
                      <td>{p.cantidad}</td>
                      <td>${(p.precio * p.cantidad).toLocaleString("es-CL")}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      Tu carrito está vacío.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <fieldset disabled={procesando || estadoCompra === "exito"}>
            <h5 className="fw-bold mb-3">Información del cliente</h5>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Nombre*</label>
                <input
                  type="text"
                  name="nombre"
                  className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
                  value={form.nombre}
                  onChange={handleChange}
                />
                {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
              </div>
              <div className="col-md-6">
                <label className="form-label">Apellidos*</label>
                <input
                  type="text"
                  name="apellido"
                  className={`form-control ${errors.apellido ? "is-invalid" : ""}`}
                  value={form.apellido}
                  onChange={handleChange}
                />
                {errors.apellido && (
                  <div className="invalid-feedback">{errors.apellido}</div>
                )}
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Correo*</label>
              <input
                type="email"
                name="correo"
                className={`form-control ${errors.correo ? "is-invalid" : ""}`}
                value={form.correo}
                onChange={handleChange}
              />
              {errors.correo && <div className="invalid-feedback">{errors.correo}</div>}
            </div>

            <h5 className="fw-bold mb-3">Dirección de entrega</h5>
            <div className="row mb-3">
              <div className="col-md-8">
                <label className="form-label">Calle*</label>
                <input
                  type="text"
                  name="calle"
                  className={`form-control ${errors.calle ? "is-invalid" : ""}`}
                  value={form.calle}
                  onChange={handleChange}
                />
                {errors.calle && <div className="invalid-feedback">{errors.calle}</div>}
              </div>
              <div className="col-md-4">
                <label className="form-label">Departamento (opcional)</label>
                <input
                  type="text"
                  name="depto"
                  className="form-control"
                  value={form.depto}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Región*</label>
                <select
                  name="region"
                  className={`form-select ${errors.region ? "is-invalid" : ""}`}
                  value={form.region}
                  onChange={handleChange}
                >
                  <option value="">Selecciona región</option>
                  <option value="Región Metropolitana de Santiago">
                    Región Metropolitana de Santiago
                  </option>
                  <option value="Valparaíso">Valparaíso</option>
                  <option value="Biobío">Biobío</option>
                </select>
                {errors.region && <div className="invalid-feedback">{errors.region}</div>}
              </div>
              <div className="col-md-6">
                <label className="form-label">Comuna*</label>
                <input
                  type="text"
                  name="comuna"
                  className={`form-control ${errors.comuna ? "is-invalid" : ""}`}
                  value={form.comuna}
                  onChange={handleChange}
                />
                {errors.comuna && <div className="invalid-feedback">{errors.comuna}</div>}
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label">
                Indicaciones para la entrega (opcional)
              </label>
              <textarea
                name="indicaciones"
                className="form-control"
                rows="2"
                value={form.indicaciones}
                onChange={handleChange}
                placeholder="Ej: entre calles, color del edificio..."
              ></textarea>
            </div>
          </fieldset>

          <div className="d-flex justify-content-end">
            <button
              className="btn btn-success"
              onClick={pagarAhora}
              disabled={procesando || estadoCompra === "exito" || carrito.length === 0}
            >
              {procesando ? "💳 Procesando pago..." : `Pagar ahora $${total.toLocaleString("es-CL")}`}
            </button>
          </div>

          {estadoCompra === "exito" && (
            <div className="d-flex justify-content-end mt-3">
              <button className="btn btn-danger" onClick={() => generarPDF(detalleCompra)}>
                Imprimir boleta en PDF
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 text-center">
        <Link to="/productos" className="text-decoration-none">
          ← Volver a la tienda
        </Link>
      </div>
    </div>
  );
}

export default Checkout;
