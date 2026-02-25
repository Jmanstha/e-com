import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { authService } from "./services/authService";

const GlobalLogoutButton = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  // Don't show the button if the user isn't logged in
  if (!token) return null;

  const handleLogout = () => {
    authService.logout();
    navigate("/");
  };

  return (
    <button
      onClick={handleLogout}
      className="fixed top-6 left-6 z-50 text-gray-500 hover:text-red-600 text-sm font-medium transition-colors"
    >
      ← Logout
    </button>
  );
};

function App() {
  return (
    <BrowserRouter>
      <GlobalLogoutButton />
      <Routes>
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
