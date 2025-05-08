import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !allowedRoles.includes(user.UserType)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
