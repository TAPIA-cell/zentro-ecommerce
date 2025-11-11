import { useEffect, useState } from "react";

function AdminProductos() {
  
  // 1. AÑADIR 'stock' a la inicialización del estado del producto
  const [productos, setProductos] = useState(() => {
    const almacenados = JSON.parse(localStorage.getItem("productos"));
    // Aseguramos que los productos antiguos tengan stock 0 por defecto si no lo tienen
    const safeData = Array.isArray(almacenados) 
      ? almacenados.map(p => ({ ...p, stock: p.stock !== undefined ? p.stock : 0 }))
      : [];
    return safeData;
  });

  const [productoActual, setProductoActual] = useState({
    id: null,
    nombre: "",
    precio: "",
    descripcion: "",
    stock: 0, 
    imagenes: []
  });

  const [preview, setPreview] = useState([]);
  
  const isEditing = productoActual.id !== null;

  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedProductForImages, setSelectedProductForImages] = useState(null);

  // Sincronización con el evento 'storage' (Correcto)
  useEffect(() => {
    const sync = () => {
      const data = JSON.parse(localStorage.getItem("productos"));
      if (Array.isArray(data)) setProductos(data);
    };

    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  // Guardar siempre que cambien los productos (Correcto)
  useEffect(() => {
    localStorage.setItem("productos", JSON.stringify(productos));
  }, [productos]);

  // Manejadores
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Validamos que stock y precio sean > 0 (si son obligatorios)
    if (!productoActual.nombre || !productoActual.precio || productoActual.stock < 0) {
      alert("⚠️ Completa el nombre, precio y asegura que el stock sea ≥ 0.");
      return;
    }

    if (isEditing) {
      setProductos(productos.map((p) =>
        p.id === productoActual.id ? productoActual : p
      ));
    } else {
      const nuevo = {
        ...productoActual,
        id: productos.length > 0 ? Math.max(...productos.map((p) => p.id)) + 1 : 1
      };
      setProductos([...productos, nuevo]);
    }

    limpiar();
  };

  const handleEliminar = (id) => {
    if (window.confirm("¿Eliminar producto?")) {
      const nuevos = productos.filter((p) => p.id !== id);
      setProductos(nuevos);
    }
  };

  const handleEditar = (p) => {
    // Aseguramos que stock se cargue correctamente (o 0 si es undefined)
    setProductoActual({ ...p, stock: p.stock !== undefined ? p.stock : 0 });
    setPreview(p.imagenes || []);
  };

  const handleImages = (files) => {
    [...files].forEach((file) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const base64Image = e.target.result;

        setPreview((prev) => [...prev, base64Image]);
        
        setProductoActual((prev) => ({
          ...prev,
          imagenes: [...(prev.imagenes || []), base64Image]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const limpiar = () => {
    // Restablecemos el estado del producto actual
    setProductoActual({ id: null, nombre: "", precio: "", descripcion: "", stock: 0, imagenes: [] });
    setPreview([]);
    // Aseguramos que el input de archivo también se limpie
    const fileInput = document.getElementById("fileImg");
    if(fileInput) fileInput.value = '';
  };

  const openImageModal = (product) => {
    setSelectedProductForImages(product);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setSelectedProductForImages(null);
  };
  
  // --- Renderizado de la Componente ---
  return (
    <div className="container py-5">
      <h1 className="mb-4 text-dark border-bottom pb-2">Gestión de Productos</h1>

      {/* --- SECCIÓN DE FORMULARIO --- */}
      <div className={`p-4 mb-5 border rounded ${isEditing ? 'border-primary' : 'border-light-subtle'}`}>
        <h3 className="mb-4 fw-normal text-muted">
            {isEditing ? '✏️ Editar Producto' : '✨ Nuevo Producto'}
        </h3>
        <form onSubmit={handleSubmit} className="row g-4">
            
            {/* Campos de Texto/Número */}
            <div className="col-md-4">
              <label htmlFor="nombreProducto" className="form-label text-muted">Nombre</label>
              <input 
                id="nombreProducto" 
                className="form-control" 
                placeholder="Nombre del Producto" 
                name="nombre" 
                value={productoActual.nombre}
                onChange={(e) => setProductoActual({ ...productoActual, nombre: e.target.value })} 
                required
              />
            </div>
            
            <div className="col-md-3">
              <label htmlFor="precioProducto" className="form-label text-muted">Precio ($)</label>
              <input 
                id="precioProducto" 
                className="form-control" 
                type="number" 
                placeholder="0" 
                name="precio" 
                value={productoActual.precio}
                // ✅ ARREGLO 1: Usar parseInt(e.target.value) || '' si el campo debe ser vacío
                // Sin embargo, como el state inicial es '', si se borra el input, queremos que sea una cadena vacía temporalmente, no 0, para que el usuario pueda escribir.
                onChange={(e) => setProductoActual({ ...productoActual, precio: e.target.value === '' ? '' : parseInt(e.target.value) })} 
                required
                min="0"
              />
            </div>

            {/* Campo de Stock */}
            <div className="col-md-2">
              <label htmlFor="stockProducto" className="form-label text-muted">Stock</label>
              <input 
                id="stockProducto" 
                className="form-control" 
                type="number" 
                placeholder="0" 
                name="stock" 
                value={productoActual.stock}
                // ✅ ARREGLO 2: Usar parseInt(e.target.value) || 0 para que stock siempre sea numérico (o 0)
                onChange={(e) => setProductoActual({ ...productoActual, stock: parseInt(e.target.value) || 0 })} 
                required
                min="0"
              />
            </div>

            <div className="col-md-3">
              <label htmlFor="descripcionProducto" className="form-label text-muted">Descripción</label>
              <input 
                id="descripcionProducto" 
                className="form-control" 
                placeholder="Descripción corta (opcional)" 
                name="descripcion" 
                value={productoActual.descripcion}
                onChange={(e) => setProductoActual({ ...productoActual, descripcion: e.target.value })} 
              />
            </div>

            {/* Área de Carga de Imágenes */}
            <div className="col-12 mt-4">
                <label className="form-label text-muted">Imágenes</label>
                <div
                    className="border border-1 rounded p-3 text-center bg-white"
                    style={{ cursor: 'pointer', borderStyle: 'solid', borderColor: '#e9ecef' }}
                    onClick={() => document.getElementById("fileImg").click()}
                >
                    <p className="mb-1 text-secondary">Haga clic para subir o arrastre</p>
                    <small className="text-muted">{preview.length} {preview.length === 1 ? 'imagen' : 'imágenes'} cargadas</small>

                    <input type="file" id="fileImg" hidden multiple onChange={(e) => handleImages(e.target.files)} />
                    
                    <div className="d-flex flex-wrap gap-2 mt-3 justify-content-center">
                        {preview.map((img, i) => (
                            <img 
                                key={i} 
                                src={img} 
                                alt={`preview-${i}`} 
                                width="60" 
                                height="60"
                                className="rounded border object-fit-cover shadow-sm" 
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Botones de Acción */}
            <div className="col-12 pt-3 d-flex justify-content-end">
              <button type="button" className="btn btn-outline-secondary me-2" onClick={limpiar}>
                {isEditing ? 'Cancelar Edición' : 'Limpiar'}
              </button>
              <button 
                type="submit" 
                className={`btn ${isEditing ? 'btn-primary' : 'btn-dark'}`}
              >
                {isEditing ? 'Guardar Cambios' : 'Crear Producto'}
              </button>
            </div>
          </form>
      </div>
      
      {/* --- SECCIÓN DE TABLA --- */}
      <h3 className="mb-3 fw-normal text-muted border-bottom pb-2">Listado ({productos.length})</h3>

      <div className="table-responsive">
          <table className="table table-borderless table-hover align-middle">
              <thead className="border-bottom">
                  <tr>
                      <th className="text-muted">ID</th>
                      <th className="text-muted">Nombre</th>
                      <th className="text-muted">Precio</th>
                      <th className="text-muted">Stock</th> 
                      <th className="text-muted">Imágenes</th>
                      <th className="text-muted">Acciones</th>
                  </tr>
              </thead>
              <tbody>
                  {productos.length === 0 ? (
                      <tr><td colSpan="6" className="py-4 text-center text-secondary">No hay productos.</td></tr>
                  ) : productos.map((p) => (
                      <tr key={p.id}>
                          <td className="text-muted">{p.id}</td>
                          <td className="fw-medium">{p.nombre}</td>
                          <td className="fw-semibold">${Number(p.precio).toLocaleString("es-CL")}</td>
                          {/* MOSTRAR STOCK CON INDICADOR DE COLOR */}
                          <td>
                              <span className={`fw-bold ${p.stock <= 5 ? 'text-danger' : p.stock <= 20 ? 'text-warning' : 'text-success'}`}>
                                  {p.stock}
                              </span>
                          </td>
                          {/* FIN STOCK */}
                          <td>
                            <div className="d-flex gap-1 justify-content-start align-items-center">
                                {p.imagenes?.slice(0, 3).map((img, i) => 
                                    <img key={i} src={img} alt="mini" width="30" height="30" className="rounded object-fit-cover border" />
                                )}
                                {p.imagenes.length > 0 && (
                                    <button 
                                        className="btn btn-sm btn-outline-secondary border-0 p-0 ms-1"
                                        onClick={() => openImageModal(p)}
                                        title={`Ver todas las ${p.imagenes.length} imágenes`}
                                        style={{ width: '30px', height: '30px' }} 
                                    >
                                        <small className="fw-bold">{p.imagenes.length > 3 ? `+${p.imagenes.length - 3}` : '👀'}</small>
                                    </button>
                                )}
                                {p.imagenes.length === 0 && <span className="text-muted small">N/A</span>}
                            </div>
                          </td>
                          <td>
                              <button className="btn btn-outline-secondary btn-sm me-2 border-0" onClick={() => handleEditar(p)} title="Editar">
                                  ✏️
                              </button>
                              <button className="btn btn-outline-secondary btn-sm border-0" onClick={() => handleEliminar(p.id)} title="Eliminar">
                                  🗑️
                              </button>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>

      {/* --- MODAL DE IMÁGENES --- */}
      {showImageModal && selectedProductForImages && (
        <div 
            className="modal fade show d-block" 
            tabIndex="-1" 
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} 
            aria-labelledby="imageModalLabel" 
            aria-modal="true" 
            role="dialog"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="imageModalLabel">
                    Imágenes de: <span className="fw-bold">{selectedProductForImages.nombre}</span>
                </h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={closeImageModal}></button>
              </div>
              <div className="modal-body">
                {selectedProductForImages.imagenes.length === 0 ? (
                    <p className="text-center text-muted">Este producto no tiene imágenes.</p>
                ) : (
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                        {selectedProductForImages.imagenes.map((img, i) => (
                            <div className="col" key={i}>
                                <div className="card shadow-sm h-100">
                                    <img 
                                        src={img} 
                                        className="bd-placeholder-img card-img-top object-fit-cover" 
                                        width="100%" 
                                        height="225" 
                                        alt={`Imagen ${i + 1}`} 
                                    />
                                    <div className="card-body p-2">
                                        <p className="card-text text-muted small mb-0">Imagen {i + 1}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeImageModal}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProductos;