import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useState } from "react";
import ProductImage from "@/components/product/ProductImage";
import ProductPrice from "@/components/product/ProductPrice";
import ProductRating from "@/components/product/ProductRating";
import { useAppSelector } from "@/store/hooks";
import { addToWishlist, removeFromWishlist } from "@/features/wishlist/WishlistAPI";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }: any) {
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setLoading(true);
    try {
      await addToWishlist(product.id);
      toast.success("Added to wishlist");
    } catch {
      toast.error("Failed to add to wishlist");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col">
      <Link to={`/products/${product.id}`} className="relative">
        <div className="aspect-square overflow-hidden bg-gray-50">
          <ProductImage image={product.image_url} name={product.name} />
        </div>
        <button
          onClick={toggleWishlist}
          disabled={loading}
          className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow hover:bg-white transition opacity-0 group-hover:opacity-100 disabled:opacity-50"
        >
          <Heart
            size={18}
            className="text-gray-600"
          />
        </button>
        {product.discount > 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            -{product.discount}%
          </span>
        )}
      </Link>

      <div className="p-5 flex flex-col flex-1">
        <p className="text-xs font-medium text-blue-600 uppercase tracking-wider">
          {product.brand}
        </p>
        <Link to={`/products/${product.id}`}>
          <h3 className="mt-1 font-semibold text-gray-900 leading-snug line-clamp-2 hover:text-blue-600 transition">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2">
          <ProductRating rating={product.average_rating} />
        </div>

        <div className="mt-3">
          <ProductPrice price={product.price} discount={product.discount} />
        </div>

        <Link
          to={`/products/${product.id}`}
          className="mt-auto pt-4 block w-full bg-gray-900 hover:bg-blue-600 text-white text-center py-2.5 rounded-xl font-medium text-sm transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
