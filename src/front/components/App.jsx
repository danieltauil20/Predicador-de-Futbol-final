import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // IMPORTANTE
import Navbar from "./components/Navbar";
import AuthModal from "./components/AuthModal";
import { Liga } from "./pages/Liga";       // Asegúrate de tener este archivo
import { DetallePartido } from "./pages/DetallePartido"; // Tu nueva página

function App() {
  const [open, setOpen] = useState(false);

  return (
    <BrowserRouter>
      <Navbar openModal={() => setOpen(true)} />
      <AuthModal isOpen={open} onClose={() => setOpen(false)} />

      <Routes>
        {/* Aquí tus rutas */}
        <Route path="/partidos" element={<Liga />} />
        <Route path="/partido/:id" element={<DetallePartido />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;