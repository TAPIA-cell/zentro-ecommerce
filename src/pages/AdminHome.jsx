import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function StatCard({ title, value, subtitle, colorClass }) {
  return (
    <div className="col-md-4 mb-4">
      <div className={`p-3 rounded shadow-sm text-white ${colorClass}`}>
        <small className="text-uppercase fw-semibold">{title}</small>
        <h3 className="mt-2">{value}</h3>
        <p className="mb-0">{subtitle}</p>
      </div>
    </div>
  );
}

export default function AdminHome() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [productos, setProductos] = useState([]);
  const [ventas, setVentas] = useState([]);

  // 🔁 Cargar datos en tiempo real
  useEffect(() => {
    const cargarDatos = () => {
      setUsuarios(JSON.parse(localStorage.getItem("usuarios")) || []);
      setProductos(JSON.parse(localStorage.getItem("productos")) || []);
      setVentas(JSON.parse(localStorage.getItem("ventas")) || []);
    };

    cargarDatos();
    window.addEventListener("storage", cargarDatos);
    const interval = setInterval(cargarDatos, 2000);

    return () => {
      window.removeEventListener("storage", cargarDatos);
      clearInterval(interval);
    };
  }, []);

  const totalVentas = ventas.reduce((acc, v) => acc + (v.total || 0), 0);

  const goTo = (path) => navigate(path);

  return (
    <div className="container-fluid p-4">
      <h2 className="mb-3 fw-bold">Panel de Control</h2>
      <p className="text-muted mb-4">
        Visualiza y gestiona los módulos principales del sistema
      </p>

      {/* === Tarjetas de resumen === */}
      <div className="row mb-4">
        <StatCard
          title="Usuarios registrados"
          value={usuarios.length}
          subtitle="Clientes y administradores"
          colorClass="bg-primary"
        />
        <StatCard
          title="Productos disponibles"
          value={productos.length}
          subtitle="En inventario"
          colorClass="bg-success"
        />
        <StatCard
          title="Ventas totales"
          value={`$${totalVentas.toLocaleString("es-CL")}`}
          subtitle={`${ventas.length} transacciones`}
          colorClass="bg-warning text-dark"
        />
      </div>

      {/* === Tarjetas de navegación === */}
      <div className="row g-3">
        {/* Usuarios */}
        <div className="col-md-3">
          <div
            className="card h-100 shadow-sm border-0 card-link"
            role="button"
            onClick={() => goTo("/admin/usuarios")}
          >
            <div className="card-body text-center">
              <h6 className="fw-bold">👥 Usuarios</h6>
              <p className="small text-muted">Gestión de clientes y roles</p>
              <button className="btn btn-outline-primary btn-sm mt-2">
                Ir a gestión
              </button>
            </div>
          </div>
        </div>

        {/* Productos */}
        <div className="col-md-3">
          <div
            className="card h-100 shadow-sm border-0 card-link"
            role="button"
            onClick={() => goTo("/admin/productos")}
          >
            <div className="card-body text-center">
              <h6 className="fw-bold">🛍️ Productos</h6>
              <p className="small text-muted">Control de inventario</p>
              <button className="btn btn-outline-success btn-sm mt-2">
                Ir a gestión
              </button>
            </div>
          </div>
        </div>

        {/* Ventas */}
        <div className="col-md-3">
          <div
            className="card h-100 shadow-sm border-0 card-link"
            role="button"
            onClick={() => goTo("/admin/ventas")}
          >
            <div className="card-body text-center">
              <h6 className="fw-bold">💰 Ventas</h6>
              <p className="small text-muted">Gestión y reportes</p>
              <button className="btn btn-outline-warning btn-sm mt-2">
                Ver ventas
              </button>
            </div>
          </div>
        </div>

        {/* Blogs */}
        <div className="col-md-3">
          <div
            className="card h-100 shadow-sm border-0 card-link"
            role="button"
            onClick={() => goTo("/admin/blogs")}
          >
            <div className="card-body text-center">
              <h6 className="fw-bold">📰 Blogs</h6>
              <p className="small text-muted">Administrar publicaciones</p>
              <button className="btn btn-outline-dark btn-sm mt-2">
                Ir a gestión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
