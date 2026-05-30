import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // IMPORTANTE
import Navbar from "./components/Navbar";
import AuthModal from "./components/AuthModal";
import { Home } from "./pages/Home"; // <- AÑADIDA: Tu página principal con las tarjetas
import { Liga } from "./pages/Liga"; // Asegúrate de tener este archivo
import { DetallePartido } from "./pages/DetallePartido"; // Tu nueva página

function App() {
  const [open, setOpen] = useState(false);

  return (
    <BrowserRouter>
      {/* El Navbar está fuera de <Routes>, lo que significa que siempre será visible */}
      <Navbar openModal={() => setOpen(true)} />

      {/* El modal centralizado */}
      <AuthModal isOpen={open} onClose={() => setOpen(false)} />

      <Routes>
        {/* NUEVO: Ruta principal que mostrará las tarjetas al entrar a la web */}
        <Route path="/" element={<Home />} />

        {/* Aquí tus rutas existentes */}
        <Route path="/partidos" element={<Liga />} />
        <Route path="/partido/:id" element={<DetallePartido />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;