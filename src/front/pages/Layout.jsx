import { useState } from "react";
import ScrollToTop from "../components/ScrollToTop";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import AuthModal from "../components/AuthModal";
import { Outlet } from "react-router-dom";
import { TablaPosiciones } from "../components/TablaPosiciones"
import { WorldCupCarousel } from "../components/WorldCupCarousel";


export const Layout = () => {
  const [open, setOpen] = useState(false);

  return (
    <ScrollToTop>
      <div style={{ background: "#26753c", minHeight: "100vh" }}>
        <Navbar openModal={() => setOpen(true)} />
        <AuthModal isOpen={open} onClose={() => setOpen(false)} />


        {/* COLOCA EL CARRUSEL AQUÍ */}
        <WorldCupCarousel />

        <div className="comentarios-container">
          <Outlet /> {/* Aquí debería aparecer tu página de Liga */}
        </div>

        {/* COMENTAMOS ESTA LÍNEA PARA PROBAR */}
        {/* <TablaPosiciones ligaId="140" nombreLiga="La Liga" /> */}

        <Footer />
      </div>
    </ScrollToTop>
  );
};