import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import AuthModal from "./components/AuthModal";
import { Home } from "./pages/Home";
import { Liga } from "./pages/Liga";
import { DetallePartido } from "./pages/DetallePartido";
import { WorldCupCarousel } from "./components/WorldCupCarousel";

function App() {
  const [open, setOpen] = useState(false);

  return (
    <BrowserRouter>
      {/* El Navbar siempre visible */}
      <Navbar openModal={() => setOpen(true)} />

      {/* --- AÑADE ESTO AQUÍ --- */}
      <WorldCupCarousel />
      {/* ------------------------ */}

      {/* El modal centralizado */}
      <AuthModal isOpen={open} onClose={() => setOpen(false)} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/partidos" element={<Liga />} />
        <Route path="/partido/:id" element={<DetallePartido />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;