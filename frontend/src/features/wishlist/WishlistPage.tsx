import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getWishlist, removeFromWishlist } from "./WishlistAPI";
import { Heart, Trash2, Loader2, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";

export default function WishlistPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getWishlist();
      setItems(data);
    } catch {
      toast.error("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleRemove = async (productId: number, name: string) => {
    try {
      await removeFromWishlist(productId);
      setItems((prev) => prev.filter((i) => i.product_id !== productId));
      toast.success(`${name} removed from wishlist`);
    } catch {
      toast.error("Failed to remove");
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-20 px-6 text-center">
        <Loader2 size={28} className="animate-spin text-blue-600 mx-auto" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto py-20 px-6 text-center">
        <Heart size={48} className="text-gray-300 mx-auto" />
        <h2 className="text-2xl font-bold text-gray-900 mt-4">Your wishlist is empty</h2>
        <p className="text-gray-500 mt-2">Save your favorite items here.</p>
        <Link
          to="/products"
          className="inline-block mt-6 bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
        <span className="text-sm text-gray-500">{items.length} items</span>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item) => {
          const p = item.product;
          const imgUrl = p?.image_url;
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition group"
            >
              <Link to={`/products/${p?.id}`} className="block aspect-square bg-gray-50 relative">
                <img
                  src={
                    imgUrl
                      ? `http://127.0.0.1:8000/${imgUrl}`
                      : "https://placehold.co/400x400?text=Product"
                  }
                  alt={p?.name}
                  className="w-full h-full object-cover"
                />
                {p?.discount > 0 && (
                  <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    -{p.discount}%
                  </span>
                )}
              </Link>

              <div className="p-4">
                <p className="text-xs font-medium text-blue-600 uppercase">{p?.brand}</p>
                <Link to={`/products/${p?.id}`}>
                  <h3 className="font-semibold text-gray-900 mt-1 hover:text-blue-600 transition line-clamp-1">
                    {p?.name}
                  </h3>
                </Link>
                <p className="text-lg font-bold text-gray-900 mt-2">
                  ₹{Number(p?.price || 0).toFixed(0)}
                </p>

                <button
                  onClick={() => handleRemove(p?.id, p?.name)}
                  className="mt-3 w-full flex items-center justify-center gap-2 text-sm text-red-400 hover:text-red-600 hover:bg-red-50 py-2 rounded-xl transition"
                >
                  <Trash2 size={14} />
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
