import { BrowserRouter as Router, Routes, Route, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

// Componentes
import { Navbar } from "./components/Navbar"; 
import { WorldCupCarousel } from "./components/WorldCupCarousel";
import { Tienda } from "./pages/Tienda";
import { Comentarios } from "./pages/Comentarios";
import { ListaPartidos } from "./components/ListaPartidos";

// --- COMPONENTES TEMPORALES ---
const Quiniela = () => <div style={{ padding: "40px", color: "white", maxWidth: "1175px", margin: "0 auto" }}><h2>Página de Quiniela</h2></div>;
const Categoria = () => <div style={{ padding: "40px", color: "white", maxWidth: "1175px", margin: "0 auto" }}><h2>Página de Categorías</h2></div>;
const Noticias = () => <div style={{ padding: "40px", color: "white", maxWidth: "1175px", margin: "0 auto" }}><h2>Página de Noticias</h2></div>;

// --- CABECERA CENTRADA ---
const HeaderLiga = ({ ligaNombre }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "40px 0 30px 0", color: "white" }}>
    <h1 style={{ margin: "0", fontSize: "2.5rem", textTransform: "uppercase", fontWeight: "900", letterSpacing: "2px" }}>
      {ligaNombre.replace("-", " ")}
    </h1>
    <div style={{ marginTop: "10px", background: "#1e293b", padding: "5px 15px", borderRadius: "20px", fontSize: "0.85rem", color: "#94a3b8" }}>
      Temporada 2025/26 | Jornada 12
    </div>
  </div>
);

// --- VISOR DE LIGA CON EFECTO FADE Y SLIDE ---
const LigaViewer = () => {
  const { id } = useParams();
  const ligaNombre = id ? id : "serie-a";
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    setIsFading(true);
    const timer = setTimeout(() => setIsFading(false), 300); // 300ms es el tiempo ideal
    return () => clearTimeout(timer);
  }, [id]);

  return (
    <div style={{ 
      maxWidth: "1175px", margin: "0 auto", padding: "20px",
      transition: "opacity 300ms ease-out, transform 300ms ease-out",
      opacity: isFading ? 0 : 1,
      transform: isFading ? "translateY(10px)" : "translateY(0)"
    }}>
      <HeaderLiga ligaNombre={ligaNombre} />
      <ListaPartidos ligaId={ligaNombre} />
    </div>
  );
};

// --- HOME ---
const Home = () => {
  const navigate = useNavigate();
  return (
    <>
      <WorldCupCarousel />
      <div style={{ maxWidth: "1175px", margin: "0 auto", padding: "20px" }}>
        <HeaderLiga ligaNombre="Partidos Destacados" />
        <ListaPartidos ligaId="serie-a" />
      </div>
    </>
  );
};

// --- APP PRINCIPAL ---
export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);

  return (
    <Router>
      <div style={{ background: "#0f172a", minHeight: "100vh", width: "100%", overflowX: "hidden" }}>
        <Navbar openModal={openModal} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tienda" element={<Tienda />} />
          <Route path="/comentarios" element={<Comentarios openModal={openModal} />} />
          <Route path="/quiniela" element={<Quiniela />} />
          <Route path="/categoria" element={<Categoria />} />
          <Route path="/noticias" element={<Noticias />} />
          <Route path="/liga/:id" element={<LigaViewer />} />
        </Routes>
        
        {/* Modal de Registro */}
        {modalOpen && (
          <div className="modal-overlay" onClick={() => setModalOpen(false)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <h2 style={{ color: "white", margin: "0 0 15px 0" }}>¡Únete a GoalHub!</h2>
              <p style={{ color: "#bfc3ca", fontSize: "14px", marginBottom: "20px" }}>Regístrate para participar en las quinielas y foros en vivo.</p>
              <div className="actions">
                <button className="cancel" onClick={() => setModalOpen(false)}>Cancelar</button>
                <button className="continue" onClick={() => { alert("¡Cuenta creada!"); setModalOpen(false); }}>Crear Cuenta</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}