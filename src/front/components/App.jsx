import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";
import { useState } from "react";

// 1. IMPORTACIÓN DE TUS COMPONENTES REALES
import { Navbar } from "./components/Navbar"; 
import { WorldCupCarousel } from "./components/WorldCupCarousel";
import { Tienda } from "./pages/Tienda";
import { Comentarios } from "./pages/Comentarios";
import { ListaPartidos } from "./components/ListaPartidos";

// Componentes de soporte temporales
const Quiniela = () => <div style={{ padding: "40px", color: "white", maxWidth: "1175px", margin: "0 auto" }}><h2>Página de Quiniela</h2></div>;
const Categoria = () => <div style={{ padding: "40px", color: "white", maxWidth: "1175px", margin: "0 auto" }}><h2>Página de Categorías</h2></div>;
const Noticias = () => <div style={{ padding: "40px", color: "white", maxWidth: "1175px", margin: "0 auto" }}><h2>Página de Noticias</h2></div>;

// Visor de partidos por Liga
const LigaViewer = () => {
  const { id } = useParams();
  const ligaNombre = id ? id.replace("-", " ") : "serie-a";
  return (
    <div style={{ maxWidth: "1175px", margin: "0 auto", padding: "20px" }}>
      <ListaPartidos ligaId={ligaNombre} />
    </div>
  );
};

// 🏠 COMPONENTE DE LA PÁGINA DE INICIO (HOME)
// ¡EL CARRUSEL SOLO SE QUEDA AQUÍ ADENTRO!
const Home = () => {
  return (
    <>
      <WorldCupCarousel />
      <div style={{ maxWidth: "1175px", margin: "0 auto", padding: "20px" }}>
        <ListaPartidos ligaId="serie-a" />
      </div>
    </>
  );
};

// 🏁 ENRUTADOR GLOBAL
export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);

  return (
    <Router>
      <div style={{ background: "#0f172a", minHeight: "100vh", width: "100%", overflowX: "hidden" }}>
        
        {/* La Navbar se queda arriba */}
        <Navbar openModal={openModal} />

        {/* Las rutas controlan qué se monta en el centro de la pantalla */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/partidos" element={<LigaViewer />} />
          <Route path="/quiniela" element={<Quiniela />} />
          <Route path="/categoria" element={<Categoria />} />
          <Route path="/noticias" element={<Noticias />} />
          <Route path="/tienda" element={<Tienda />} />
          <Route path="/comentarios" element={<Comentarios />} />
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
