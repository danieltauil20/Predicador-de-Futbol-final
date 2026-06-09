import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../assets/goalhub_transparent-1.png";

export const Navbar = ({ openModal }) => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [ligasModalOpen, setLigasModalOpen] = useState(false);
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    const checkSession = () => {
      const session = localStorage.getItem("session");
      setIsLogged(!!session);
    };

    checkSession();

    window.addEventListener("click", checkSession);
    window.addEventListener("storage", checkSession);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("click", checkSession);
      window.removeEventListener("storage", checkSession);
    };
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
      {/* 🟢 MODAL DE LIGAS RESPONSIVO TOTALMENTE CORREGIDO Y COMPATIBLE */}
      {ligasModalOpen && (
        <div className="modal-overlay" onClick={() => setLigasModalOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ width: "90%", maxWidth: "420px" }}>
            
            {/* Cabecera */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ margin: 0, color: "#ffffff", fontSize: "22px", fontWeight: "600" }}>Competiciones</h2>
              <button 
                onClick={() => setLigasModalOpen(false)} 
                style={{ background: "transparent", border: "none", color: "#94a3b8", fontSize: "1.4rem", cursor: "pointer" }}
              >
                ✖
              </button>
            </div>

            {/* Opciones de ligas transformadas en botones estilizados individuales */}
            <div className="form" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {leagueLinks.map((l) => (
                <Link 
                  key={l.path} 
                  to={l.path} 
                  onClick={() => setLigasModalOpen(false)} 
                  className="btn-auth" 
                  style={{ textDecoration: "none" }}
                >
                  {l.name}
                </Link>
              ))}
            </div>

            {/* Acciones de abajo independientes: Cancelar (Gris neutro) y Continuar (Verde) */}
            <div className="modal-actions-grid" style={{ marginTop: "20px" }}>
              <button 
                type="button" 
                className="btn-auth" 
                onClick={() => setLigasModalOpen(false)}
                style={{ background: "#1e293b", color: "#94a3b8" }}
              >
                Cancelar
              </button>
              <button 
                type="button" 
                className="btn-auth" 
                onClick={() => setLigasModalOpen(false)}
                style={{ background: "linear-gradient(135deg, #22c55e, #10b981)", color: "#020617", fontWeight: "800" }}
              >
                Continuar
              </button>
            </div>

          </div>
        </div>
      )}

      {/* NAVBAR PRINCIPAL */}
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <Link to="/" className="logo">
          <img src={logo} alt="GolHub Logo" />
        </Link>

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

        <div className="navbar-right">
          {/* Sincronizado para mostrar "Mi perfil" o "Unirme" en PC */}
          <button className="btn-primary" onClick={openModal}>
            {isLogged ? "Mi perfil" : "Unirme"}
          </button>
          <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? "✖" : "☰"}
          </div>
        </div>

        {/* MENÚ MÓVIL (DENTRO DEL NAV) */}
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

      {/* MENÚ MÓVIL EXTERNO */}
      {menuOpen && (
        <div className="mobile-menu">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMenuOpen(false)}
              className={location.pathname === item.path ? "active" : ""}
            >
              {item.name}
            </Link>
          ))}

          <button
            className="btn-primary"
            onClick={() => {
              setMenuOpen(false);
              openModal();
            }}
          >
            {isLogged ? "Mi perfil" : "Unirme"}
          </button>
        </div>
      )}
    </>
  );
};