import Navbar from "./Navbar";
import Footer from "./Footer";
export function Layout() {
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
