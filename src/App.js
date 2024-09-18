import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginAdmin from "./components/LoginAdmin";
import Item from "./components/item";
import Navigation from "./navbar";
import History from "./components/history";
import Home from "./components/home";
import Keranjang from "./components/keranjang";
import ProtectedRoutes from "./components/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route element={<ProtectedRoutes />}>
          <Route path="/item" element={<Item />} />
          <Route path="/history" element={<History />} />
        </Route>
        <Route path="/admin-login" element={<LoginAdmin />} />
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Keranjang />} />
      </Routes>
    </Router>
  );
};

export default App;
