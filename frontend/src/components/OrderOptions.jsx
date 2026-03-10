import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { X, ChevronRight } from "lucide-react";
import { useStore } from "@/store/useStore";

export default function OrderOptions({ orderItemId }) {
  const handleCancelOrder = useStore((state) => state.handleCancelOrder);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-stone-200/50 text-stone-600">
          <ChevronRight size={20} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-48 p-1 bg-white border-stone-200 shadow-xl rounded-lg mt-2"
      >
        <DropdownMenuItem
          onClick={() => handleCancelOrder(orderItemId)}
          className="flex items-center gap-2 px-3 py-2 text-sm text-stone-700 cursor-pointer hover:bg-stone-50 rounded-md"
        >
          <X size={18} />
          <span>Cancel Order</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
