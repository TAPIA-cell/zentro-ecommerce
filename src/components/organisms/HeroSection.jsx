function HeroSection() {
  return (
    <section className="bg-light py-5">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6">
            <h2 className="fw-bold">Zentro E-commerce</h2>
            <p>Nuestra tienda proporciona los mejores productos de calidad a precios insuperables.</p>
            <a href="/productos" className="btn btn-dark mt-3">📦 Ver productos</a>
          </div>
          <div className="col-md-6 text-center">
            <img src="/img/Comercio.jpg" alt="Imagen tienda online" className="img-fluid rounded shadow" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
