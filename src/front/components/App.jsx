import { useState } from "react";

import Navbar from "./components/Navbar";
import AuthModal from "./components/AuthModal";

function App() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Navbar openModal={() => setOpen(true)} />
      <AuthModal isOpen={open} onClose={() => setOpen(false)} />
      <Route path="/partidos" element={<Liga />} />
    </>
  );
}

export default App;