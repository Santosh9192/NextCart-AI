import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-blue-600 text-white p-1.5 rounded-lg">
                <ShoppingBag size={20} />
              </div>
              <span className="text-xl font-bold text-white">NextCart AI</span>
            </Link>
            <p className="mt-4 text-sm text-gray-400 leading-relaxed">
              AI-powered e-commerce platform delivering personalized shopping
              experiences with smart recommendations.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                ["Products", "/products"],
                ["Cart", "/cart"],
                ["Wishlist", "/wishlist"],
                ["Track Order", "/orders"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link
                    to={href}
                    className="flex items-center gap-1 hover:text-blue-400 transition group"
                  >
                    <ChevronRight
                      size={14}
                      className="group-hover:translate-x-0.5 transition"
                    />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                ["Contact Us", "#"],
                ["FAQs", "#"],
                ["Shipping Info", "#"],
                ["Returns", "#"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link to={href} className="hover:text-blue-400 transition">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-blue-400" />
                support@nextcart.ai
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-blue-400" />
                +91 1800-123-4567
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-blue-400 mt-0.5" />
                <span>Bangalore, Karnataka, India</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© 2026 NextCart AI. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="#" className="hover:text-gray-300 transition">
              Privacy
            </Link>
            <Link to="#" className="hover:text-gray-300 transition">
              Terms
            </Link>
            <Link to="#" className="hover:text-gray-300 transition">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
