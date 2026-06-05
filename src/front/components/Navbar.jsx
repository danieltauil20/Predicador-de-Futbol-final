import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../assets/goalhub_transparent-1.png";

export const Navbar = ({ openModal }) => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Estado para controlar la apertura del modal de ligas
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
      {/* ========================================================
          MODAL CENTRADO DE LIGAS (Reutiliza tus estilos globales)
          ======================================================== */}
      {ligasModalOpen && (
        <div className="modal-overlay" onClick={() => setLigasModalOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ width: "420px" }}>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ margin: 0, color: "#ffffff", fontSize: "1.3rem", fontWeight: "700" }}>
                Selecciona una Competición
              </h3>
              <button 
                onClick={() => setLigasModalOpen(false)} 
                style={{ background: "transparent", border: "none", color: "#bfc3ca", fontSize: "1.2rem", cursor: "pointer" }}
              >
                ✖
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {leagueLinks.map((l) => (
                <Link 
                  key={l.path} 
                  to={l.path} 
                  onClick={() => setLigasModalOpen(false)}
                  className="continue"
                  style={{ 
                    textDecoration: "none", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    gap: "10px",
                    padding: "14px",
                    height: "auto",
                    fontSize: "1rem"
                  }}
                >
                  <span>⚽</span> {l.name}
                </Link>
              ))}
            </div>

            <div className="actions" style={{ marginTop: "20px" }}>
              <button className="cancel" onClick={() => setLigasModalOpen(false)}>
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          NAVBAR PRINCIPAL
          ======================================================== */}
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <style>{`
          .navbar { 
            position: static !important; 
            z-index: 999; 
            overflow: visible !important;
          } 
        `}</style>

        <Link to="/" className="logo">
          <img src={logo} alt="GolHub Logo" />
        </Link>

        <ul className="nav-links">
          {navItems.map((item) =>
            item.name === "Partidos" ? (
              <li key={item.path}>
                <a
                  href="#ligas"
                  className={location.pathname === item.path ? "active" : ""}
                  onClick={(e) => { e.preventDefault(); setLigasModalOpen(true); }}
                  style={{ cursor: "pointer" }}
                >
                  {item.name} <span style={{ fontSize: "10px", marginLeft: "2px" }}>▼</span>
                </a>
              </li>
            ) : (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={location.pathname === item.path ? "active" : ""}
                >
                  {item.name}
                </Link>
              </li>
            )
          )}
        </ul>

        <div className="navbar-right">
          <button className="btn-primary" onClick={openModal}>Unirme</button>
          <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? "✖" : "☰"}</div>
        </div>

        {menuOpen && (
          <div className="mobile-menu">
            {navItems.map((item) => (
              <div key={item.path}>
                <Link to={item.path} onClick={() => setMenuOpen(false)}>{item.name}</Link>
                {item.name === "Partidos" && (
                  <div style={{ paddingLeft: '20px', borderLeft: '2px solid #0ee7ac', marginBottom: '10px' }}>
                    {leagueLinks.map(l => (
                      <Link key={l.path} to={l.path} onClick={() => setMenuOpen(false)} style={{ fontSize: '0.8rem', display: 'block', padding: '5px 0' }}>
                        {l.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <button className="btn-primary" onClick={() => { setMenuOpen(false); openModal(); }}>Unirme</button>
          </div>
        )}
      </nav>
    </>
  );
};
