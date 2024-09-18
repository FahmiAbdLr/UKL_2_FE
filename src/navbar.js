import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navigation = () => {
  const isAdminLoggedIn = !!localStorage.getItem("adminToken");
  const location = useLocation();
  const navigate = useNavigate();

  const handleAdminLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin-login");
  };

  if (location.pathname === "/admin-login") {
    return null;
  }

  if (isAdminLoggedIn) {
    return (
      <nav className="bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center border-r-2 pr-4 text-white font-semibold">
                Admin Mode
              </div>
              <div className="hidden sm:ml-6 sm:flex items-center">
                <Link
                  to="/item"
                  className="text-white rounded-md text-sm hover:text-blue-500"
                >
                  Menu Item
                </Link>
                <Link
                  to="/history"
                  className="text-white px-3 rounded-md text-sm hover:text-blue-500"
                >
                  History Transaksi
                </Link>
              </div>
            </div>
            <div className="hidden sm:flex sm:items-center">
              <button
                onClick={handleAdminLogout}
                className="text-white px-3 py-2 rounded-md text-sm font-medium hover:text-blue-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
    );
  } else {
    return (
      <nav className="bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center border-r-2 pr-4 text-white font-semibold">
                Food Shop
              </div>
              <div className="hidden sm:ml-6 sm:flex items-center">
                <Link
                  to="/"
                  className="text-white rounded-md text-sm hover:text-blue-500"
                >
                  Home
                </Link>
                <Link
                  to="/cart"
                  className="text-white px-3 rounded-md text-sm hover:text-blue-500"
                >
                  Cart
                </Link>
              </div>
            </div>
            <div className="hidden sm:flex sm:items-center sm:ml-6">
              <Link
                to="/admin-login"
                className="text-white px-3 py-2 rounded-md text-sm font-medium hover:text-blue-500"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }
};

export default Navigation;
