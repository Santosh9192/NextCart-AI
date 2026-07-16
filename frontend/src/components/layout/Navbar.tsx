import { Link } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  User,
  LogOut,
  Package,
  Menu,
  X,
  Shield,
} from "lucide-react";
import SearchBar from "./SearchBar";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/features/auth/AuthSlice";
import { resetCart } from "@/features/cart/CartSlice";
import { useState } from "react";

export default function Navbar() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const cartItemCount = useAppSelector(
    (state) => state.cart.items?.length ?? 0
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAdmin = user?.role === "Admin";

  const handleLogout = () => {
    dispatch(logout());
    dispatch(resetCart());
  };

  const navLinks = (
    <>
      <Link
        to="/products"
        className="text-gray-600 hover:text-blue-600 font-medium transition"
        onClick={() => setMobileOpen(false)}
      >
        Products
      </Link>

      {isAdmin && (
        <Link
          to="/admin"
          className="flex items-center gap-1 text-purple-600 hover:text-purple-800 font-medium transition"
          onClick={() => setMobileOpen(false)}
        >
          <Shield size={16} />
          Admin
        </Link>
      )}

      <Link
        to="/wishlist"
        className="relative text-gray-600 hover:text-red-500 transition"
        onClick={() => setMobileOpen(false)}
      >
        <Heart size={20} />
      </Link>

      <Link
        to="/cart"
        className="relative text-gray-600 hover:text-blue-600 transition"
        onClick={() => setMobileOpen(false)}
      >
        <ShoppingCart size={20} />
        {cartItemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {cartItemCount > 9 ? "9+" : cartItemCount}
          </span>
        )}
      </Link>

      {isAuthenticated ? (
        <>
          <Link
            to="/orders"
            className="text-gray-600 hover:text-blue-600 transition"
            onClick={() => setMobileOpen(false)}
          >
            <Package size={20} />
          </Link>
          <button
            onClick={() => {
              handleLogout();
              setMobileOpen(false);
            }}
            className="text-gray-600 hover:text-red-500 transition"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </>
      ) : (
        <Link
          to="/login"
          className="text-gray-600 hover:text-blue-600 transition"
          onClick={() => setMobileOpen(false)}
        >
          <User size={20} />
        </Link>
      )}
    </>
  );

  return (
    <header className="sticky top-0 bg-white/90 backdrop-blur-lg shadow-sm z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="bg-blue-600 text-white p-1.5 rounded-lg">
            <ShoppingCart size={20} />
          </div>
          <span className="text-xl font-bold text-gray-900">NextCart AI</span>
        </Link>

        <div className="hidden md:block flex-1 max-w-md">
          <SearchBar />
        </div>

        <nav className="hidden md:flex items-center gap-5">{navLinks}</nav>

        <button
          className="md:hidden text-gray-600"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-4">
          <SearchBar />
          <nav className="flex items-center gap-5">{navLinks}</nav>
        </div>
      )}
    </header>
  );
}
