import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

export default function AdminVentas() {
  const [ventas, setVentas] = useState([]);

  useEffect(() => {
    const cargarVentas = () => {
      const data = JSON.parse(localStorage.getItem("ventas")) || [];
      setVentas(data);
    };
    cargarVentas();
    window.addEventListener("storage", cargarVentas);
    const interval = setInterval(cargarVentas, 2000);
    return () => {
      window.removeEventListener("storage", cargarVentas);
      clearInterval(interval);
    };
  }, []);

  // =====================================================
  // 📤 Exportar a Excel con formato visual y monetario
  // =====================================================
  const exportarVentas = () => {
    if (ventas.length === 0) {
      alert("⚠️ No hay ventas para exportar.");
      return;
    }

    // Transformar las ventas para exportarlas por producto
    const datos = ventas.flatMap((v) =>
      v.items.map((item) => ({
        ID_Venta: v.id,
        Fecha: v.fecha,
        Usuario: v.usuario,
        Correo: v.correo,
        Producto: item.nombre,
        Cantidad: item.cantidad,
        PrecioUnitario: item.precio,
        Subtotal: item.precio * item.cantidad,
        TotalVenta: v.total,
      }))
    );

    const ws = XLSX.utils.json_to_sheet(datos);

    // ================================
    // Ajustar anchos de columnas
    // ================================
    const colAnchos = Object.keys(datos[0]).map((key) => ({
      wch: Math.max(
        key.length,
        ...datos.map((fila) => String(fila[key] || "").length)
      ) + 2,
    }));
    ws["!cols"] = colAnchos;

    // ================================
    // Estilos personalizados (básicos)
    // ================================
    const range = XLSX.utils.decode_range(ws["!ref"]);
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
        const cell = ws[cellRef];
        if (!cell) continue;

        // Encabezados (primera fila)
        if (R === 0) {
          cell.s = {
            font: { bold: true, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "4F81BD" } },
            alignment: { horizontal: "center", vertical: "center" },
            border: {
              top: { style: "thin", color: { rgb: "999999" } },
              bottom: { style: "thin", color: { rgb: "999999" } },
              left: { style: "thin", color: { rgb: "999999" } },
              right: { style: "thin", color: { rgb: "999999" } },
            },
          };
        } else {
          // Filas alternadas de color y bordes
          cell.s = {
            fill: {
              fgColor: {
                rgb: R % 2 === 0 ? "FFFFFF" : "F2F2F2",
              },
            },
            alignment: { vertical: "center", horizontal: "center" },
            border: {
              top: { style: "thin", color: { rgb: "CCCCCC" } },
              bottom: { style: "thin", color: { rgb: "CCCCCC" } },
              left: { style: "thin", color: { rgb: "CCCCCC" } },
              right: { style: "thin", color: { rgb: "CCCCCC" } },
            },
          };

          // Formatear las columnas monetarias
          if (
            ["PrecioUnitario", "Subtotal", "TotalVenta"].includes(
              Object.keys(datos[0])[C]
            )
          ) {
            cell.z = '"$"#,##0';
          }
        }
      }
    }

    // ================================
    // Crear libro y guardar
    // ================================
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ventas");
    XLSX.writeFile(wb, "ventas_zentro.xlsx");
  };

  return (
    <div className="container mt-4">
      <h2 className="fw-bold mb-3 text-center">🧾 Ventas Registradas</h2>
      <p className="text-muted text-center mb-4">
        Consulta las ventas realizadas en la tienda
      </p>

      {ventas.length === 0 ? (
        <div className="alert alert-warning text-center">
          ⚠️ No hay ventas registradas todavía.
        </div>
      ) : (
        <div className="table-responsive shadow-sm">
          <table className="table table-bordered table-striped align-middle">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Correo</th>
                <th>Fecha</th>
                <th>Productos</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {ventas.map((v) => (
                <tr key={v.id}>
                  <td>{v.id}</td>
                  <td>{v.usuario}</td>
                  <td>{v.correo}</td>
                  <td>{v.fecha}</td>
                  <td>
                    {v.items.map((item, idx) => (
                      <div key={idx}>
                        {item.nombre} (x{item.cantidad}) — $
                        {(item.precio * item.cantidad).toLocaleString("es-CL")}
                      </div>
                    ))}
                  </td>
                  <td>${v.total.toLocaleString("es-CL")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="text-center mt-3">
        <button className="btn btn-success" onClick={exportarVentas}>
          💾 Exportar a Excel
        </button>
      </div>
    </div>
  );
}
