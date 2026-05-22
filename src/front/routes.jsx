import { Liga } from "./pages/Liga";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import { Tienda } from "./pages/Tienda";
import Comentarios from "./pages/Comentarios";


import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >

      
      <Route index element={<Home />} />

      <Route path="liga/:nombre" element={<Liga />} />
      <Route path="single/:theId" element={<Single />} />
      <Route path="demo" element={<Demo />} />
      <Route path="tienda" element={<Tienda />} />
      <Route path="comentarios" element={<Comentarios />} />

    </Route>
  )
);