import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCart, clearCartThunk } from "@/features/cart/CartSlice";
import { Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/api/axios";

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items, totalPrice, loading } = useAppSelector((state) => state.cart);
  const [address, setAddress] = useState("");
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const subtotal = Number(totalPrice);
  const tax = subtotal * 0.1;
  const orderTotal = subtotal + tax;

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      toast.error("Please enter a shipping address");
      return;
    }
    setPlacing(true);
    try {
      await api.post("/orders/checkout", { shipping_address: address });
      await dispatch(clearCartThunk());
      setPlaced(true);
      toast.success("Order placed successfully!");
    } catch (err: any) {
      if (err?.response?.status === 401) {
        navigate("/login");
      } else {
        toast.error(err?.response?.data?.detail || "Failed to place order");
      }
    } finally {
      setPlacing(false);
    }
  };

  if (loading && items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-20 px-6 text-center">
        <Loader2 size={32} className="animate-spin text-blue-600 mx-auto" />
      </div>
    );
  }

  if (placed) {
    return (
      <div className="max-w-3xl mx-auto py-20 px-6 text-center">
        <CheckCircle size={64} className="text-green-500 mx-auto" />
        <h1 className="text-3xl font-bold text-gray-900 mt-6">Order Placed!</h1>
        <p className="text-gray-500 mt-2">Your order has been placed successfully.</p>
        <button
          onClick={() => navigate("/products")}
          className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-20 px-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
        <button
          onClick={() => navigate("/products")}
          className="mt-6 bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <button
        onClick={() => navigate("/cart")}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 mb-6 transition"
      >
        <ArrowLeft size={16} />
        Back to Cart
      </button>

      <h1 className="text-3xl font-bold text-gray-900 mb-10">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Shipping Address
            </h2>
            <textarea
              placeholder="Enter your full shipping address..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition resize-none"
            />
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Order Items
            </h2>
            <div className="space-y-3">
              {items.map((item: any) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={
                          item.product?.images?.[0]?.image_url
                            ? `http://127.0.0.1:8000/${item.product.images[0].image_url}`
                            : "https://placehold.co/100x100"
                        }
                        alt={item.product?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {item.product?.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-900">
                    ₹{(Number(item.price) * item.quantity).toFixed(0)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm h-fit sticky top-28">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Summary
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span className="text-gray-900">₹{subtotal.toFixed(0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Tax</span>
              <span className="text-gray-900">₹{tax.toFixed(0)}</span>
            </div>
            <hr className="border-gray-100" />
            <div className="flex justify-between font-bold text-lg">
              <span className="text-gray-900">Total</span>
              <span className="text-blue-600">₹{orderTotal.toFixed(0)}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={placing || !address.trim()}
            className="w-full mt-6 bg-gray-900 hover:bg-blue-600 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {placing ? (
              <Loader2 size={18} className="animate-spin" />
            ) : null}
            {placing ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
