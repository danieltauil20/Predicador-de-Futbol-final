import { useState } from "react";
import ScrollToTop from "../components/ScrollToTop";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import AuthModal from "../components/AuthModal";
import ProfileModal from "../components/ProfileModal"; // 🔥 AÑADIR
import { Outlet } from "react-router-dom";

export const Layout = () => {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false); // 🔥 NUEVO

  return (
    <ScrollToTop>
      <div style={{ background: "#26753c", minHeight: "100vh" }}>

                <Navbar openModal={() => {
          if (localStorage.getItem("token")) {
            setProfileOpen(true); // Abre el Perfil si ya inició sesión
          } else {
            setOpen(true); // Abre Registro/Login si es visitante
          }
        }} />

        {/* 🔥 AUTH MODAL */}
        <AuthModal
          isOpen={open}
          onClose={() => setOpen(false)}
          onLoginSuccess={() => {
            setOpen(false);
            setProfileOpen(true); // 🔥 ABRE PERFIL
          }}
        />

        {/* 🔥 PROFILE MODAL */}
        <ProfileModal
          isOpen={profileOpen}
          onClose={() => setProfileOpen(false)}
        />


        <div className="comentarios-container">
          <Outlet />
        </div>
        <Footer />
      </div>
    </ScrollToTop>
  );
};
