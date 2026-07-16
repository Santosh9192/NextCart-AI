import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "@/features/products/ProductAPI";
import type { Product } from "@/types/product";
import ProductCard from "@/features/products/ProductCard";
import { ArrowRight, Sparkles, Shield, Truck, RefreshCw } from "lucide-react";

export default function Home() {
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    getProducts(1, 8).then((data) => {
      const list = Array.isArray(data) ? data : data.products ?? [];
      setFeatured(list);
    }).catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
        <div className="max-w-7xl mx-auto px-6 py-24 md:py-32 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm mb-6 border border-white/20">
              <Sparkles size={14} />
              <span>AI-Powered Shopping Experience</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Smart Shopping,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-200">
                Powered by AI
              </span>
            </h1>
            <p className="mt-6 text-xl text-blue-100 max-w-xl leading-relaxed">
              Discover products tailored to your taste with machine learning recommendations. Shop smarter with NextCart AI.
            </p>
            <div className="flex flex-wrap gap-4 mt-10">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-white text-blue-700 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition shadow-2xl"
              >
                Explore Products
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 -mt-16 relative z-20">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Sparkles, title: "AI Recommendations", desc: "Personalized product suggestions powered by machine learning" },
            { icon: Shield, title: "Secure Shopping", desc: "End-to-end encrypted checkout with multiple payment options" },
            { icon: Truck, title: "Fast Delivery", desc: "Free shipping on orders above ₹499 with 2-day delivery" },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-xl shrink-0">
                <Icon className="text-blue-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-500 mt-1">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
              <p className="text-gray-500 mt-1">Handpicked just for you</p>
            </div>
            <Link
              to="/products"
              className="hidden sm:inline-flex items-center gap-1 text-blue-600 font-medium hover:underline"
            >
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center text-white">
          <h2 className="text-4xl font-bold">Ready to start shopping?</h2>
          <p className="mt-3 text-blue-100 text-lg max-w-lg mx-auto">
            Join thousands of smart shoppers using AI-powered recommendations.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 mt-8 bg-white text-blue-700 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition shadow-xl"
          >
            Create Free Account <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
