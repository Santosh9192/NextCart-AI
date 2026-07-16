import { Routes, Route } from "react-router-dom";

import MainLayout from "@/layouts/MainLayout";
import AdminLayout from "@/layouts/AdminLayout";

import Home from "@/pages/customer/Home";
import Products from "@/pages/customer/Products";
import Login from "@/features/auth/Login";
import Register from "@/features/auth/Register";
import NotFound from "@/pages/NotFound/NotFound";
import ProductDetails from "@/pages/customer/ProductDetails";
import Cart from "@/pages/customer/Cart";
import Checkout from "@/pages/customer/Checkout";
import OrderPage from "@/features/orders/OrderPage";
import WishlistPage from "@/features/wishlist/WishlistPage";
import ProtectedRoute from "@/features/auth/ProtectedRoute";
import AdminRoute from "@/features/auth/AdminRoute";

import AdminDashboard from "@/features/dashboard/AdminDashboard";
import AdminProducts from "@/features/dashboard/AdminProducts";
import AdminOrders from "@/features/dashboard/AdminOrders";
import AdminUsers from "@/features/dashboard/AdminUsers";
import AdminCategories from "@/features/dashboard/AdminCategories";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public customer routes */}
      <Route
        path="/"
        element={
          <MainLayout>
            <Home />
          </MainLayout>
        }
      />
      <Route
        path="/products"
        element={
          <MainLayout>
            <Products />
          </MainLayout>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/products/:id"
        element={
          <MainLayout>
            <ProductDetails />
          </MainLayout>
        }
      />
      <Route
        path="/cart"
        element={
          <MainLayout>
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          </MainLayout>
        }
      />
      <Route
        path="/checkout"
        element={
          <MainLayout>
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          </MainLayout>
        }
      />
      <Route
        path="/orders"
        element={
          <MainLayout>
            <ProtectedRoute>
              <OrderPage />
            </ProtectedRoute>
          </MainLayout>
        }
      />
      <Route
        path="/wishlist"
        element={
          <MainLayout>
            <ProtectedRoute>
              <WishlistPage />
            </ProtectedRoute>
          </MainLayout>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/products"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminProducts />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminOrders />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminUsers />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/categories"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminCategories />
            </AdminLayout>
          </AdminRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
