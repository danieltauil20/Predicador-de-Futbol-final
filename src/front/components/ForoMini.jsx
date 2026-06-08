import { useState, useEffect } from "react";
import "../body.css";

export default function ForoMini() {
  const [temas, setTemas] = useState([]);
  const [nuevo, setNuevo] = useState("");

  const [usuario, setUsuario] = useState("");

  
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoUsuario, setNuevoUsuario] = useState("");

  
  useEffect(() => {
    if (!usuario) {
      setMostrarModal(true);
    }
  }, [usuario]);

  const guardarUsuario = () => {
    if (!nuevoUsuario.trim()) return;

    setUsuario(nuevoUsuario);
    setMostrarModal(false); 
  };

  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem("foro")) || [
      { texto: "¿Quién ganará la Champions?", usuario: "Rigo" }
    ];
    setTemas(guardados);
  }, []);

  const guardar = (lista) => {
    localStorage.setItem("foro", JSON.stringify(lista));
  };

  const agregar = () => {
    if (!nuevo.trim()) return;

    const nuevosTemas = [
      {
        texto: nuevo,
        usuario: usuario
      },
      ...temas
    ];

    setTemas(nuevosTemas);
    guardar(nuevosTemas);
    setNuevo("");
  };

  return (
    <div className="foro-container">

      <h2>💬 Foro</h2>

      
      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Nuevo usuario</h3>

            <input
              value={nuevoUsuario}
              onChange={(e) => setNuevoUsuario(e.target.value)}
              placeholder="Tu nombre..."
              onKeyDown={(e) => {
                if (e.key === "Enter") guardarUsuario();
              }}
            />

            <button onClick={guardarUsuario}>
              Entrar
            </button>
          </div>
        </div>
      )}

      <div className="input-box">
        <input
          value={nuevo}
          onChange={(e) => setNuevo(e.target.value)}
          placeholder="Crear tema..."
        />

        <button onClick={agregar}>
          Enviar
        </button>
      </div>

      <div className="lista-temas">
        {temas.length === 0 ? (
          <p style={{ color: "#aaa" }}>No hay temas todavía</p>
        ) : (
          temas.map((tema, i) => (
            <div key={i} className="tema-card">

              <span>
                <strong>{tema.usuario || "Rigo"}</strong>: {tema.texto}
              </span>

            </div>
          ))
        )}
      </div>

    </div>
  );
}                                                                                                                  