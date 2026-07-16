import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, getRecommendations } from "@/features/products/ProductAPI";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import QuantitySelector from "@/components/product/QuantitySelector";
import { addToCart } from "@/features/cart/CartAPI";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCart } from "@/features/cart/CartSlice";
import toast from "react-hot-toast";
import { ArrowLeft, ShoppingCart, Zap, Loader2, LogIn } from "lucide-react";
import ProductCard from "@/features/products/ProductCard";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [product, setProduct] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getProductById(Number(id));
        setProduct(data);
        getRecommendations(Number(id))
          .then(setRecommendations)
          .catch(() => {});
      } catch {
        toast.error("Product not found");
        navigate("/products");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setAdding(true);
    try {
      await addToCart(product.id, quantity);
      await dispatch(fetchCart());
      toast.success(`${product.name} added to cart`);
    } catch (err: any) {
      if (err?.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        navigate("/login");
      } else {
        toast.error("Failed to add product");
      }
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-20 px-6">
        <div className="animate-pulse grid lg:grid-cols-2 gap-10">
          <div className="aspect-square bg-gray-200 rounded-2xl" />
          <div className="space-y-6">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-5 bg-gray-200 rounded w-1/4" />
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            <div className="h-20 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="max-w-7xl mx-auto py-10 px-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 mb-6 transition"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <div className="grid lg:grid-cols-2 gap-10">
        <ProductGallery image={product.image_url} name={product.name} />

        <div>
          <ProductInfo product={product} />

          <div className="mt-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <button
              onClick={handleAddToCart}
              disabled={adding}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-semibold transition disabled:opacity-60"
            >
              {adding ? (
                <Loader2 size={20} className="animate-spin" />
              ) : !isAuthenticated ? (
                <LogIn size={20} />
              ) : (
                <ShoppingCart size={20} />
              )}
              {adding
                ? "Adding..."
                : !isAuthenticated
                ? "Login to Add to Cart"
                : "Add to Cart"}
            </button>
            <button
              onClick={async () => {
                if (!isAuthenticated) {
                  navigate("/login");
                  return;
                }
                setAdding(true);
                try {
                  await addToCart(product.id, quantity);
                  await dispatch(fetchCart());
                  navigate("/checkout");
                } catch {
                  toast.error("Failed to process");
                } finally {
                  setAdding(false);
                }
              }}
              disabled={adding}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3.5 rounded-xl font-semibold transition disabled:opacity-60"
            >
              {adding ? <Loader2 size={20} className="animate-spin" /> : <Zap size={20} />}
              {adding ? "Processing..." : isAuthenticated ? "Buy Now" : "Login to Buy"}
            </button>
          </div>
        </div>
      </div>

      {recommendations.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            You May Also Like
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.map((p: any) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
