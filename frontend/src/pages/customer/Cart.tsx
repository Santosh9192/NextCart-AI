import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCart } from "@/features/cart/CartSlice";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

export default function Cart() {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  if (loading && items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto py-10 px-6">
        <div className="animate-pulse space-y-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-5">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 rounded-xl" />
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-20 px-6 text-center">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto py-20 px-6 text-center">
        <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag className="text-gray-300" size={36} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mt-6">
          Your cart is empty
        </h2>
        <p className="text-gray-500 mt-2">
          Looks like you haven't added anything yet.
        </p>
        <Link
          to="/products"
          className="inline-block mt-6 bg-gray-900 hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold transition"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-6">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Shopping Cart
        </h1>
        <span className="text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full">
          {items.length} {items.length === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-1">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        <div>
          <CartSummary />
        </div>
      </div>
    </div>
  );
}
