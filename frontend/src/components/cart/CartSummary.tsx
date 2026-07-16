import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearCartThunk } from "@/features/cart/CartSlice";
import toast from "react-hot-toast";
import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";

export default function CartSummary() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items, totalPrice, loading } = useAppSelector((state) => state.cart);
  const [clearing, setClearing] = useState(false);

  const subtotal = Number(totalPrice);
  const tax = subtotal * 0.1;
  const orderTotal = subtotal + tax;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleClearCart = async () => {
    if (!window.confirm("Clear your entire cart?")) return;
    setClearing(true);
    try {
      await dispatch(clearCartThunk()).unwrap();
      toast.success("Cart cleared");
    } catch {
      toast.error("Failed to clear cart");
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit sticky top-28">
      <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>

      <div className="mt-6 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Items ({itemCount})</span>
          <span className="text-gray-900">₹{subtotal.toFixed(0)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Estimated Tax</span>
          <span className="text-gray-900">₹{tax.toFixed(0)}</span>
        </div>
        <hr className="border-gray-100" />
        <div className="flex justify-between font-bold text-lg">
          <span className="text-gray-900">Order Total</span>
          <span className="text-blue-600">₹{orderTotal.toFixed(0)}</span>
        </div>
      </div>

      <button
        onClick={() => navigate("/checkout")}
        disabled={items.length === 0 || loading}
        className="w-full mt-6 bg-gray-900 hover:bg-blue-600 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : null}
        {loading ? "Updating..." : "Proceed to Checkout"}
      </button>

      {items.length > 0 && (
        <button
          onClick={handleClearCart}
          disabled={clearing || loading}
          className="w-full mt-3 text-sm text-red-400 hover:text-red-600 py-2 flex items-center justify-center gap-1 transition disabled:opacity-40"
        >
          {clearing ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Trash2 size={14} />
          )}
          {clearing ? "Clearing..." : "Clear Cart"}
        </button>
      )}
    </div>
  );
}
