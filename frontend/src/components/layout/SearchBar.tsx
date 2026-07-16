import { useState, useEffect, useRef } from "react";
import { Search, Loader2 } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import api from "@/api/axios";

interface Suggestion {
  id: number;
  name: string;
  brand: string;
  price: number;
  image_url: string | null;
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShow(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);

    if (query.trim().length < 2) {
      setSuggestions([]);
      setShow(false);
      return;
    }

    timer.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products/suggestions?keyword=${encodeURIComponent(query.trim())}`);
        setSuggestions(res.data);
        setShow(res.data.length > 0);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setShow(false);
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div ref={ref} className="relative w-full">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (suggestions.length > 0) setShow(true); }}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-100 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm transition"
        />
        {loading ? (
          <Loader2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 animate-spin" />
        ) : (
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        )}
      </form>

      {show && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl border border-gray-100 shadow-xl z-50 overflow-hidden">
          <div className="p-2">
            {suggestions.map((s) => (
              <Link
                key={s.id}
                to={`/products/${s.id}`}
                onClick={() => setShow(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition"
              >
                <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                  <img
                    src={s.image_url ? `http://127.0.0.1:8000/${s.image_url}` : "https://placehold.co/100x100"}
                    alt={s.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{s.name}</p>
                  <p className="text-xs text-gray-400">{s.brand}</p>
                </div>
                <p className="text-sm font-semibold text-gray-900 shrink-0">₹{s.price.toFixed(0)}</p>
              </Link>
            ))}
          </div>
          <Link
            to={`/products?search=${encodeURIComponent(query)}`}
            onClick={() => setShow(false)}
            className="block text-center text-sm text-blue-600 font-medium py-3 border-t border-gray-100 hover:bg-blue-50 transition"
          >
            View all results for "{query}"
          </Link>
        </div>
      )}
    </div>
  );
}
