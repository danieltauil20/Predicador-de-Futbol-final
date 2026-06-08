import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../assets/goalhub_transparent-1.png";

export const Navbar = ({ openModal }) => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [ligasModalOpen, setLigasModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Inicio", path: "/" },
    { name: "Partidos", path: "/partidos" },
    { name: "Quiniela", path: "/quiniela" },
    { name: "Categoría", path: "/categoria" },
    { name: "Noticias", path: "/noticias" },
    { name: "Tienda", path: "/tienda" },
    { name: "Comentarios", path: "/comentarios" },
  ];

  const leagueLinks = [
    { name: "La Liga", path: "/liga/la-liga" },
    { name: "Premier League", path: "/liga/premier-league" },
    { name: "Serie A", path: "/liga/serie-a" },
    { name: "Bundesliga", path: "/liga/bundesliga" },
  ];

  return (
    <>
      {/* MODAL DE LIGAS RESPONSIVO */}
      {ligasModalOpen && (
        <div className="modal-overlay" onClick={() => setLigasModalOpen(false)}>
          {/* Ajuste de width a 90% para móviles */}
          <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ width: "90%", maxWidth: "420px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ margin: 0, color: "#ffffff", fontSize: "1.3rem", fontWeight: "700" }}>Competiciones</h3>
              <button onClick={() => setLigasModalOpen(false)} style={{ background: "transparent", border: "none", color: "#bfc3ca", fontSize: "1.2rem", cursor: "pointer" }}>✖</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {leagueLinks.map((l) => (
                <Link key={l.path} to={l.path} onClick={() => setLigasModalOpen(false)} className="continue" style={{ textDecoration: "none", display: "flex", justifyContent: "center", padding: "14px" }}>
                  {l.name}
                </Link>
              ))}
            </div>

            <div className="actions" style={{ marginTop: "20px" }}>
              <button className="cancel" onClick={() => setLigasModalOpen(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* NAVBAR PRINCIPAL */}
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <Link to="/" className="logo">
          <img src={logo} alt="GolHub Logo" />
        </Link>

        {/* Links de escritorio */}
        <ul className="nav-links">
          {navItems.map((item) => (
            <li key={item.path}>
              {item.name === "Partidos" ? (
                <span onClick={() => setLigasModalOpen(true)} className={location.pathname.includes("/liga/") ? "active" : ""} style={{ cursor: "pointer" }}>
                  Partidos ▼
                </span>
              ) : (
                <Link to={item.path} className={location.pathname === item.path ? "active" : ""}>
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Botón unirme + Hamburguesa */}
        <div className="navbar-right">
          <button className="btn-primary" onClick={openModal}>Unirme</button>
          <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? "✖" : "☰"}
          </div>
        </div>

        {/* Menú móvil */}
        {menuOpen && (
          <div className="mobile-menu">
            {navItems.map((item) => (
              <div key={item.path}>
                <Link to={item.path} onClick={() => setMenuOpen(false)}>{item.name}</Link>
              </div>
            ))}
          </div>
        )}
      </nav>
    </>
  );
};