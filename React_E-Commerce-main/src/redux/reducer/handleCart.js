// Retrieve initial state from localStorage if available
const getInitialCart = () => {
  const storedCart = localStorage.getItem("cart");
  return storedCart ? JSON.parse(storedCart) : [];
};

const handleCart = (state = getInitialCart(), action) => {
  switch (action.type) {
    case "ADDITEM": {
      const existingItemIndex = state.findIndex(
        (item) =>
          item.ProductId === action.payload.ProductId &&
          item.color === action.payload.color
      );

      if (existingItemIndex !== -1) {
        // Producto ya existe, incrementar cantidad
        return state.map((item, index) =>
          index === existingItemIndex
            ? { ...item, qty: item.qty + 1 } // Crear nuevo objeto para evitar mutación
            : item
        );
      } else {
        // Producto nuevo, agregarlo con qty = 1
        return [...state, { ...action.payload, qty: 1 }];
      }
    }

    case "DELITEM": {
      const existingItemIndex = state.findIndex(
        (item) =>
          item.ProductId === action.payload.ProductId &&
          item.color === action.payload.color
      );

      if (existingItemIndex !== -1) {
        const updatedState = state.map((item, index) => {
          if (index === existingItemIndex) {
            if (item.qty > 1) {
              // Reducir cantidad y devolver nuevo objeto
              return { ...item, qty: item.qty - 1 };
            }
            return null; // Marca para eliminar
          }
          return item;
        });

        // Filtra los elementos marcados como `null`
        return updatedState.filter((item) => item !== null);
      }

      return state; // Si no encuentra el producto, retorna el estado actual
    }

    default:
      return state;
  }
};
export default handleCart;
