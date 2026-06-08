export const initialStore = () => {
  return {
    message: null,

    // ==========================================
    // 1. ESTADO GLOBAL DE AUTENTICACIÓN
    // ==========================================
    // Al cargar la app, revisamos si hay una sesión guardada en el navegador
    token: localStorage.getItem("token") || null,
    user: JSON.parse(localStorage.getItem("user")) || null,
    isAuthenticated: localStorage.getItem("token") ? true : false,

    // Ejemplos por defecto del boilerplate (puedes borrarlos luego si no los usas)
    todos: [
      { id: 1, title: "Make the bed", background: null },
      { id: 2, title: "Do my homework", background: null },
    ],
    partidos: [],
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    // ==========================================
    // 2. ACCIONES DE LOGIN / LOGOUT
    // ==========================================
    case "login":
      // Guardamos la sesión en el disco duro del navegador (localStorage)
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));

      // Actualizamos la memoria RAM (estado global)
      return {
        ...store,
        token: action.payload.token,
        user: action.payload.user,
        isAuthenticated: true,
      };

    case "logout":
      // Destruimos la sesión del navegador
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Limpiamos la memoria RAM
      return {
        ...store,
        token: null,
        user: null,
        isAuthenticated: false,
      };

    // ==========================================
    // 3. ACCIONES ANTIGUAS (Ejemplos)
    // ==========================================
    case "set_hello":
      return {
        ...store,
        message: action.payload,
      };

    case "add_task":
      const { id, color } = action.payload;
      return {
        ...store,
        todos: store.todos.map((todo) =>
          todo.id === id ? { ...todo, background: color } : todo,
        ),
      };
    case "set_partidos":
      return {
        ...store,
        partidos: action.payload,
      };
    case "set_message":
      return {
        ...store,
        message: action.payload,
      };

    default:
      throw Error("Unknown action: " + action.type);
  }
}
