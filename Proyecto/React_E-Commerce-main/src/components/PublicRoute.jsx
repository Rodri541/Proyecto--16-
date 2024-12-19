import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
    const email = localStorage.getItem("email"); 
  // Si el usuario está logueado, redirige a /dashboard
  if (email != null) {
    return <Navigate to="/" replace />;
  }

  // Si no está logueado, permite el acceso a la ruta pública
  return children;
};

export default PublicRoute;
