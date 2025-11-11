export default function Contacto() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Formulario enviado correctamente ✅");
  };

  return (
    <div className="container my-5 text-center">
      <div className="mb-3">
        <img src="/img/logo.png" alt="Logo Empresa" width="120" />
      </div>

      <h2 className="fw-bold mb-5">CONTACTO</h2>

      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="bg-body-secondary p-4 rounded shadow-sm">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-bold">Nombre</label>
                <input type="text" className="form-control" required maxLength={100} />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Correo</label>
                <input type="email" className="form-control" required maxLength={100} />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Comentario</label>
                <textarea className="form-control" rows="4" required maxLength={500}></textarea>
              </div>
              <button type="submit" className="btn btn-outline-dark w-100 fw-bold">
                ENVIAR
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
