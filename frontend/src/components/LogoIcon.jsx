import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

export default function LogoIcon() {
  return (
    <Link
      to="/"
      className="group flex items-center gap-2.5 transition-opacity hover:opacity-80"
      style={{
        backgroundColor: "rgba(250,246,241,0.92)",
        borderColor: "#e8ddd4",
      }}
    >
      {/* Refined Icon Container */}
      <div
        className="w-9 h-9 rounded-2xl flex items-center justify-center shadow-sm"
        style={{ backgroundColor: "#c0694e" }}
      >
        <ShoppingBag size={18} className="text-white" strokeWidth={2.5} />
      </div>

      {/* Sophisticated Typography */}
      <span
        className="text-2xl font-serif tracking-tight"
        style={{ color: "#3d2b1f" }}
      >
        Yarnly
      </span>
    </Link>
  );
}
