import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyOrders } from "./OrderAPI";
import { Package, ChevronRight, Loader2 } from "lucide-react";

export default function OrderPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders()
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-6 text-center">
        <Loader2 size={28} className="animate-spin text-blue-600 mx-auto" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-6 text-center">
        <Package size={48} className="text-gray-300 mx-auto" />
        <h2 className="text-2xl font-bold text-gray-900 mt-4">No orders yet</h2>
        <p className="text-gray-500 mt-2">Place your first order to see it here.</p>
        <Link
          to="/products"
          className="inline-block mt-6 bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  const statusColor = (s: string) => {
    switch (s) {
      case "Delivered": return "bg-green-50 text-green-600";
      case "Shipped": return "bg-blue-50 text-blue-600";
      case "Confirmed": return "bg-purple-50 text-purple-600";
      case "Cancelled": return "bg-red-50 text-red-600";
      default: return "bg-yellow-50 text-yellow-600";
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
      <div className="space-y-4">
        {orders.map((order: any) => (
          <div
            key={order.id}
            className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500">Order #{order.id}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {order.created_at?.split("T")[0] || "N/A"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-medium px-3 py-1.5 rounded-full ${statusColor(order.order_status)}`}
                >
                  {order.order_status}
                </span>
                <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-gray-50 text-gray-600">
                  {order.payment_status}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {order.items?.map((item: any) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-gray-700">
                    Product #{item.product_id} × {item.quantity}
                  </span>
                  <span className="font-medium text-gray-900">
                    ₹{(Number(item.price) * item.quantity).toFixed(0)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
              <span className="text-xs text-gray-400">
                {order.shipping_address?.slice(0, 60)}...
              </span>
              <span className="font-bold text-gray-900">
                ₹{Number(order.total_amount).toFixed(0)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
