import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { Toaster } from "sonner";
import OrderHistory from "./pages/OrderHistory";
import ProfilePage from "./pages/ProfilePage";
import { Layout1, Layout2 } from "./components/Layout";
import Checkout from "./pages/Checkout";

// const GlobalLogoIcon = () => {
//   return <LogoIcon />;
// };
function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" richColors closeButton />
      {/* <GlobalLogoIcon /> */}
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route element={<Layout1 />}>
          <Route path="/" element={<Dashboard />} />
        </Route>
        <Route element={<Layout2 />}>
          <Route path="/orders" element={<OrderHistory />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/checkout" element={<Checkout />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
