import { Minus, Plus } from "lucide-react";

interface Props {
  quantity: number;
  setQuantity: (q: number) => void;
  min?: number;
  max?: number;
}

export default function QuantitySelector({
  quantity,
  setQuantity,
  min = 1,
  max = 99,
}: Props) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => setQuantity(Math.max(min, quantity - 1))}
        disabled={quantity <= min}
        className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        <Minus size={16} />
      </button>

      <span className="text-lg font-semibold w-8 text-center">
        {quantity}
      </span>

      <button
        type="button"
        onClick={() => setQuantity(Math.min(max, quantity + 1))}
        disabled={quantity >= max}
        className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
