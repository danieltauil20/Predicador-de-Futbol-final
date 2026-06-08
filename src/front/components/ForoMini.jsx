import { useState, useEffect } from "react";

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
    <div style={{
      background: "#1e293b",
      padding: "20px",
      borderRadius: "16px",
      color: "white",
      display: "flex",
      flexDirection: "column",
      gap: "15px",
      boxShadow: "none",
      height: "500px" // 🔑 BLOQUEAMOS LA ALTURA
    }}>
      {/* Estilo para una barra de scroll moderna y oscura */}
      <style>{`
        .scroll-limpio::-webkit-scrollbar {
          width: 6px;
        }
        .scroll-limpio::-webkit-scrollbar-track {
          background: transparent;
        }
        .scroll-limpio::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 10px;
        }
      `}</style>

      <h3 style={{ margin: 0, fontSize: "1.3rem", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
        💬 Foro
      </h3>


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
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: "8px",
            border: "1px solid #334155",
            background: "#0f172a",
            color: "white",
            outline: "none"
          }}
          onKeyDown={(e) => { if (e.key === "Enter") agregarTema(); }}
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
