import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { getProducts, searchProducts } from "./ProductAPI";
import { Product } from "@/types/product";
import { SearchX, ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  searchQuery?: string;
}

const PAGE_SIZE = 12;

export default function ProductList({ searchQuery = "" }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        if (searchQuery) {
          const data = await searchProducts(searchQuery);
          setProducts(data);
          setTotal(data.length);
        } else {
          const data = await getProducts(page, PAGE_SIZE);
          setProducts(data.products ?? data);
          setTotal(data.total ?? (Array.isArray(data) ? data.length : 0));
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [searchQuery, page]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  if (loading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="bg-gray-200 rounded-2xl h-80" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <SearchX size={48} className="mx-auto text-gray-300" />
        <h3 className="text-xl font-semibold text-gray-900 mt-4">No products found</h3>
        <p className="text-gray-500 mt-1">
          {searchQuery ? `Nothing matches "${searchQuery}". Try a different keyword.` : "Products coming soon."}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-12">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="flex items-center gap-1 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} /> Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-10 h-10 rounded-xl text-sm font-medium transition ${
                p === page ? "bg-blue-600 text-white" : "border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="flex items-center gap-1 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
