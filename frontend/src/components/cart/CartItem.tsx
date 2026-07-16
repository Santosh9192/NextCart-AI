import { useAppDispatch } from "@/store/hooks";
import {
  updateCartItemThunk,
  removeCartItemThunk,
} from "@/features/cart/CartSlice";
import type { CartItem as CartItemType } from "@/types/cart";
import { Trash2, Minus, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";

interface Props {
  item: CartItemType;
}

export default function CartItem({ item }: Props) {
  const dispatch = useAppDispatch();
  const [updating, setUpdating] = useState(false);

  const product = item.product;
  const imageUrl = product.images?.[0]?.image_url;
  const unitPrice = Number(product.price);
  const discount = product.discount || 0;
  const finalUnitPrice = unitPrice - (unitPrice * discount) / 100;
  const lineTotal = finalUnitPrice * item.quantity;

  const handleQuantityChange = async (newQty: number) => {
    if (newQty < 1 || newQty > 99) return;
    setUpdating(true);
    try {
      await dispatch(
        updateCartItemThunk({ productId: product.id, quantity: newQty })
      ).unwrap();
    } catch {
      toast.error("Failed to update quantity");
    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = async () => {
    setUpdating(true);
    try {
      await dispatch(removeCartItemThunk(product.id)).unwrap();
      toast.success("Item removed");
    } catch {
      toast.error("Failed to remove item");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div
      className={`flex items-start gap-4 sm:gap-5 border-b border-gray-100 py-5 transition ${
        updating ? "opacity-60 pointer-events-none" : ""
      }`}
    >
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
        <img
          src={
            imageUrl
              ? `http://127.0.0.1:8000/${imageUrl}`
              : "https://placehold.co/400x400?text=Item"
          }
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-gray-900 truncate">
              {product.name}
            </h3>
            <p className="text-sm text-gray-500">{product.brand}</p>
          </div>
          <div className="text-right shrink-0">
            {discount > 0 && (
              <p className="text-xs text-gray-400 line-through">
                ₹{unitPrice.toFixed(0)}
              </p>
            )}
            <p className="font-bold text-gray-900">₹{lineTotal.toFixed(0)}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={item.quantity <= 1 || updating}
              className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <Minus size={14} />
            </button>
            <span className="font-semibold text-gray-900 w-8 text-center">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={item.quantity >= 99 || updating}
              className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <Plus size={14} />
            </button>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            disabled={updating}
            className="text-sm text-red-400 hover:text-red-600 flex items-center gap-1 transition disabled:opacity-40"
          >
            <Trash2 size={14} />
            <span className="hidden sm:inline">Remove</span>
          </button>
        </div>
      </div>
    </div>
  );
}
