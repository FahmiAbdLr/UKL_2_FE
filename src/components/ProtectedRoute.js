import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoutes = () => {
  let token = localStorage.getItem("adminToken");
  return token ? <Outlet /> : <Navigate to="/admin-login" />;
};

export default ProtectedRoutes;