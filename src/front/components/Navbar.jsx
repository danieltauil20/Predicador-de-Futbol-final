import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../assets/goalhub_transparent-1.png";

export const Navbar = ({ openModal }) => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lista exacta que pediste
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
    { name: "La Liga", path: "/partidos?liga=PD" },
    { name: "Premier League", path: "/partidos?liga=PL" },
    { name: "Serie A", path: "/partidos?liga=SA" },
    { name: "Bundesliga", path: "/partidos?liga=BL" },
    { name: "Mundial 2026", path: "/partidos?liga=WC" },
  ];

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <style>{`
  .navbar { position: relative; z-index: 999; } /* Asegura que la nav sea superior */
  .nav-item-container { position: relative; display: flex; align-items: center; }
  
  /* Menú flotante moderno */
  .leagues-dropdown-menu { 
    position: absolute; 
    top: 100%; 
    left: 0; 
    background: #151824; 
    border: 1px solid #293047; 
    padding: 10px 0; 
    border-radius: 12px; 
    min-width: 180px; 
    z-index: 9999; /* PRIORIDAD MÁXIMA */
    box-shadow: 0 15px 30px rgba(0,0,0,0.4); 
    
    /* Animación */
    opacity: 0;
    visibility: hidden;
    transform: translateY(10px);
    transition: all 0.25s ease-in-out;
  }
  
  /* Mostrar al pasar el ratón */
  .nav-item-container:hover .leagues-dropdown-menu { 
    display: block; 
    opacity: 1; 
    visibility: visible; 
    transform: translateY(0); 
  }
  
  .leagues-dropdown-menu a { 
    display: block; 
    padding: 12px 20px; 
    color: #b2bdcd; 
    text-decoration: none; 
    font-size: 0.95rem; 
    transition: 0.2s; 
  }
  
  .leagues-dropdown-menu a:hover { 
    color: #0ee7ac; 
    background: #1a1e2d; 
    padding-left: 25px; /* Efecto movimiento moderno */
  }
`}</style>

      <Link to="/" className="logo">
        <img src={logo} alt="GolHub Logo" />
      </Link>

      <ul className="nav-links">
        {navItems.map((item) =>
          item.name === "Partidos" ? (
            <li key={item.path} className="nav-item-container">
              <Link
                to={item.path}
                className={location.pathname === item.path ? "active" : ""}
              >
                {item.name}
              </Link>
              {/* Desplegable de Ligas */}
              <div className="leagues-dropdown-menu">
                {leagueLinks.map((l) => (
                  <Link key={l.path} to={l.path}>
                    {l.name}
                  </Link>
                ))}
              </div>
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
  );
};