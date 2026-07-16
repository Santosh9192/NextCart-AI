import { useSearchParams } from "react-router-dom";
import ProductList from "@/features/products/ProductList";
import { Sparkles, Search as SearchIcon } from "lucide-react";

export default function Products() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("search") || "";

  return (
    <div className="max-w-7xl mx-auto py-10 px-6">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            {query ? `Results for "${query}"` : "All Products"}
          </h1>
          <p className="text-gray-500 mt-1">
            {query
              ? "Showing matching products"
              : "Browse our collection of premium products"}
          </p>
        </div>
        {!query && (
          <div className="hidden sm:flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
            <Sparkles size={16} />
            AI Powered
          </div>
        )}
      </div>
      <ProductList searchQuery={query} />
    </div>
  );
}
