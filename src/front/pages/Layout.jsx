import { useState } from "react";
import ScrollToTop from "../components/ScrollToTop";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import AuthModal from "../components/AuthModal";
import ProfileModal from "../components/ProfileModal";
import { Outlet } from "react-router-dom";
import { TablaPosiciones } from "../components/TablaPosiciones";
import { WorldCupCarousel } from "../components/WorldCupCarousel";


export const Layout = () => {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <ScrollToTop>
      <div style={{ background: "#26753c", minHeight: "100vh" }}>
        <Navbar openModal={() => {
          if (localStorage.getItem("token")) {
            setProfileOpen(true);
          } else {
            setOpen(true);
          }
        }} />


        <AuthModal
          isOpen={open}
          onClose={() => setOpen(false)}
          onLoginSuccess={() => {
            setOpen(false);
            setProfileOpen(true);
          }}
        />


        <ProfileModal
          isOpen={profileOpen}
          onClose={() => setProfileOpen(false)}
        />

        {/* COLOCA EL CARRUSEL AQUÍ */}
        <WorldCupCarousel />

        <div className="comentarios-container">
          {/* 🔑 SOLUCIÓN: Pasamos la función a través del context del Outlet */}
          <Outlet context={() => setOpen(true)} />
        </div>


        <Footer />
      </div>
    </ScrollToTop>
  );
};