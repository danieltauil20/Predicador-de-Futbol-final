import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../assets/goalhub_transparent-1.png";

export const Navbar = ({ openModal }) => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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
    { name: "Ranking", path: "/ranking" },
    { name: "Noticias", path: "/noticias" },
    { name: "Tienda", path: "/tienda" },
    { name: "Comentarios", path: "/comentarios" },
  ];

  return (
    <>
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        
        <Link to="/" className="logo">
          <img src={logo} alt="GolHub Logo" />
        </Link>

        <ul className="nav-links">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={location.pathname === item.path ? "active" : ""}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="navbar-right">
          <button className="btn-primary" onClick={openModal}>
            {isLogged ? "Mi perfil" : "Unirme"}
          </button>

          <div
            className="hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "✖" : "☰"}
          </div>
        </div>

      </nav>

      
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
