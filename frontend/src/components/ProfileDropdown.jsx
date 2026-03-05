import { User, Package, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";

export function ProfileDropdown() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");

    navigate("/login");
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-stone-200/50 text-stone-600">
          <User size={20} strokeWidth={1.5} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-48 p-1 bg-white border-stone-200 shadow-xl rounded-lg mt-2"
      >
        <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 text-sm text-stone-700 cursor-pointer hover:bg-stone-50 rounded-md">
          <User size={14} />
          <span>Profile</span>
        </DropdownMenuItem>
        <Link to="/orders">
          <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 text-sm text-stone-700 cursor-pointer hover:bg-stone-50 rounded-md">
            <Package size={14} />
            <span>My Orders</span>
          </DropdownMenuItem>
        </Link>

        <DropdownMenuSeparator className="h-px bg-stone-100 my-1" />

        <DropdownMenuItem
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 cursor-pointer hover:bg-red-50 rounded-md"
        >
          <LogOut size={14} />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
