import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";

// AQUÍ ESTÁ EL ERROR: TODAS DEBEN TENER LLAVES {}
import { Liga } from "./pages/Liga";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import { Quiniela } from "./pages/quiniela";
import { Ranking } from "./pages/Ranking";
import { Tienda } from "./pages/Tienda";
import { Comentarios } from "./pages/Comentarios";

// Fíjate bien en la palabra 'export' aquí abajo:
export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >

      <Route index element={<Home />} />
      <Route path="/liga/:nombre" element={<Liga />} />
      <Route path="/quiniela" element={<Quiniela />} />
      <Route path="/tienda" element={<Tienda />} />
      <Route path="/ranking" element={<Ranking />} />
      <Route path="/comentarios" element={<Comentarios />} />
    </Route >
  )
);