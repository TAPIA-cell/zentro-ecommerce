import React from "react";

export default function Nosotros() {
  return (
    <div className="container my-5">
      {/* Título */}
      <h2 className="text-center mb-4">Sobre nosotros</h2>
      <p className="text-center">
        Somos un equipo de desarrolladores que creó esta tienda online como
        parte de un proyecto.
      </p>

      {/* Lista de integrantes */}
      <ul className="list-group w-50 mx-auto mt-3">
        <li className="list-group-item">
          Demis Zuñiga - <a href="mailto:dem.zuniga@duocuc.cl">dem.zuniga@duocuc.cl</a>
        </li>
        <li className="list-group-item">
          Gabriel Colmenares - <a href="mailto:ga.colmenares@duocuc.cl">ga.colmenares@duocuc.cl</a>
        </li>
        <li className="list-group-item">
          José Tapia - <a href="mailto:jn.tapia@duocuc.cl">jn.tapia@duocuc.cl</a>
        </li>
      </ul>
    </div>
  );
}
