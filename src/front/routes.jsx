import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";

// AQUÍ ESTÁ EL ERROR: TODAS DEBEN TENER LLAVES {}
import { Liga } from "./pages/Liga";
import { Tienda } from "./pages/Tienda";
import { Comentarios } from "./pages/Comentarios";

// Fíjate bien en la palabra 'export' aquí abajo:
export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="liga/:nombre" element={<Liga />} />
      <Route path="tienda" element={<Tienda />} />
      <Route path="comentarios" element={<Comentarios />} />
      <Route path="prueba" element={<h1>¡ESTA ES LA RUTA DE PRUEBA!</h1>} />
    </Route>
  )
);