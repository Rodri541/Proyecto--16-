import { Navigate } from "react-router-dom";

// Componente de ruta protegida
const ProtectedRoute = ({ children }) => {
  // Verifica si el usuario está logueado y si el email es "admin@gmail.com"
  if (localStorage.getItem("email") === "admin@hotmail.com") {
    return children;
  }
//   if (location.pathname === "/login" && localStorage.getItem("email")) {
//     return <Navigate to="/" replace />;
//   }

  // Redirige a login si no cumple las condiciones
  return <Navigate to="/" replace />;
};

export default ProtectedRoute;
