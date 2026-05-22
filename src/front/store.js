// Ahora initialStore es una función, tal como lo pide useGlobalReducer.jsx:13
export const initialStore = () => {
    return {
        message: null,
        partidos: [], // Tu espacio reservado para el fútbol
        demo: [
            {
                title: "FIRST",
                background: "white",
                initial: "white"
            }
        ]
    };
};

// El Reducer encargado de gestionar los cambios de estado de la academia
export default function storeReducer(store, action) {
    switch (action.type) {
        case 'set_partidos':
            return {
                ...store,
                partidos: action.payload
            };
        case 'set_message':
            return {
                ...store,
                message: action.payload
            };
        default:
            return store;
    }
}