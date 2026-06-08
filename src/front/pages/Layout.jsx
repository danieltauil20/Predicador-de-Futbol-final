import { useState } from "react";
import ScrollToTop from "../components/ScrollToTop";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import AuthModal from "../components/AuthModal";
import ProfileModal from "../components/ProfileModal"; 
import { Outlet } from "react-router-dom";
import { TablaPosiciones } from "../components/TablaPosiciones"


export const Layout = () => {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false); 

  return (
    <ScrollToTop>
      <div style={{ background: "#26753c", minHeight: "100vh" }}>

        <Navbar openModal={() => setOpen(true)} />

        
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


        <div className="comentarios-container">
          <Outlet />
        </div>
        

        <Footer />
      </div>
    </ScrollToTop>
  );
};
