import Navbar from "./Navbar";
import Footer from "./Footer";
import NavbarWOSearch from "./NavbarWOSearch";
import { Outlet } from "react-router-dom";
export function Layout1() {
  return (
    <div className="bg-[#faf6f1] min-h-screen">
      <Navbar /> {/* Global component - only written once! */}
      <main>
        <Outlet /> {/* This slot dynamically swaps Dashboard, Profile, etc. */}
      </main>
      <Footer /> {/* Global component - easy to add later */}
    </div>
  );
}
export function Layout2() {
  return (
    <div className="bg-[#faf6f1] min-h-screen">
      <NavbarWOSearch />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
