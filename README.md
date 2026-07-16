# 🛒 NextCart AI - AI-Powered E-Commerce Platform

> **Smart Shopping, Powered by AI** — Discover products tailored to your taste with machine learning recommendations.

NextCart AI is a modern, full-stack e-commerce platform that combines a sleek React frontend with a Python backend. It features AI-powered product recommendations, an intuitive shopping experience, a comprehensive admin dashboard with rich analytics, and full cart-to-checkout flow — all wrapped in a beautifully designed UI.

---

## ✨ Features

### 🛍️ Customer Features

| Feature | Description |
|---------|-------------|
| **🔐 Authentication** | JWT-based login/registration with role-based access control |
| **📦 Product Catalog** | Browse with advanced search, filtering, pagination, and sorting |
| **🔍 Live Search** | Debounced search with autocomplete suggestions as you type |
| **🤖 AI Recommendations** | Smart ML-powered "You May Also Like" product suggestions |
| **🛒 Shopping Cart** | Full CRUD with quantity controls, discount calculations, tax estimation |
| **❤️ Wishlist** | Save and manage favorite products |
| **💳 Checkout** | Streamlined address input, order summary, and order placement |
| **📋 Order History** | Track orders with real-time status updates |
| **⭐ Product Ratings** | Visual star ratings and review summaries |

### 👑 Admin Features

| Feature | Description |
|---------|-------------|
| **📊 Dashboard Analytics** | Revenue charts, order status distribution, top products, category breakdown |
| **📦 Product Management** | CRUD with image upload, stock tracking, featured flags |
| **📋 Order Management** | Status workflow (Placed → Confirmed → Shipped → Delivered), search/filter |
| **👥 User Management** | Role management, verification status, activate/deactivate |
| **🏷️ Category Management** | CRUD with visual icons, product count tracking |
| **📈 Charts & Visualizations** | 30-day revenue line chart, order status doughnut chart |

---

## 🖼️ Screenshots

### Landing & Home Page

![Landing Page](screenshots/landing%20page.png)
![Home Page](screenshots/home_page.png)

### Authentication

![Login Page](screenshots/login_page.png)

### Customer Experience

![Customer Cart](screenshots/customer_cart.png)
![Customer Wishlist](screenshots/customer_wishlist.png)

### Admin Dashboard

![Admin Dashboard](screenshots/admin_dashboard.png)
![Admin Product List](screenshots/admin_product_list.png)
![Admin Orders History](screenshots/admin_orders_history.png)
![Admin Users List](screenshots/admin_users_list.png)
![Admin Category Distribution](screenshots/admin_category_distribution.png)

---

## 🚀 Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| **React 19** | UI framework |
| **TypeScript** | Type safety |
| **Vite 8** | Build tool & dev server |
| **Tailwind CSS v4** | Utility-first styling |
| **Redux Toolkit** | State management |
| **TanStack Query** | Server state & caching |
| **React Router v7** | Routing & navigation |
| **Axios** | HTTP client with JWT interceptors |
| **Framer Motion** | Animations & transitions |
| **Chart.js + react-chartjs-2** | Analytics visualizations |
| **Lucide React** | Icon library |
| **React Hook Form + Zod** | Form handling & validation |
| **react-hot-toast** | Toast notifications |
| **clsx + tailwind-merge** | Conditional class utilities |

### Backend

| Technology | Purpose |
|------------|---------|
| **Python** | Backend language |
| **FastAPI** (likely) | REST API framework |
| **JWT** | Authentication tokens |
| **RESTful API** | API architecture |

---

## 🏗️ Project Structure

```
NextCart AI/
├── frontend/                  # React frontend application
│   ├── src/
│   │   ├── api/               # Axios instance with JWT interceptors
│   │   ├── app/               # App root component
│   │   ├── components/        # Reusable UI components
│   │   │   ├── cart/          # CartItem, CartSummary
│   │   │   ├── layout/        # Navbar, Footer, SearchBar, Sidebar
│   │   │   ├── loading/       # Loader component
│   │   │   └── product/       # ProductGallery, ProductInfo, ProductPrice, etc.
│   │   ├── constants/         # API base URL configuration
│   │   ├── contexts/          # Auth context
│   │   ├── features/          # Feature-based modules
│   │   │   ├── auth/          # Login, Register, AuthSlice, ProtectedRoute, AdminRoute
│   │   │   ├── cart/          # CartSlice, CartAPI, CartPage
│   │   │   ├── dashboard/     # AdminDashboard, AdminProducts, AdminOrders, AdminUsers, AdminCategories
│   │   │   ├── orders/        # OrderPage, OrderAPI
│   │   │   ├── products/      # ProductCard, ProductGrid, ProductList, ProductAPI
│   │   │   └── wishlist/      # WishlistPage, WishlistAPI
│   │   ├── hooks/             # Custom React hooks
│   │   ├── layouts/           # MainLayout, AdminLayout
│   │   ├── lib/               # Utility functions
│   │   ├── pages/             # Page-level components
│   │   │   ├── admin/         # AdminHome
│   │   │   ├── auth/          # LoginPage, RegisterPage
│   │   │   ├── customer/      # Home, Products, ProductDetails, Cart, Checkout, Profile
│   │   │   └── NotFound/      # 404 page
│   │   ├── routes/            # Route definitions
│   │   ├── store/             # Redux store configuration
│   │   ├── styles/            # Global styles
│   │   └── types/             # TypeScript type definitions
│   ├── package.json
│   └── vite.config.ts
├── backend/                   # Python backend
│   └── venv/                  # Python virtual environment
├── screenshots/               # Application screenshots
└── docs/                      # Documentation
```

---

## 🛠️ Installation & Setup

### Prerequisites

- **Node.js** 18+ (for frontend)
- **Python** 3.10+ (for backend)
- **npm** or **yarn** or **pnpm**

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
# or
yarn install
# or
pnpm install

# Start development server
npm run dev
```

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Start the backend server
uvicorn main:app --reload
```

### Environment Configuration

The frontend API configuration is located at:
```
frontend/src/constants/api.ts
```

By default, the API base URL is set to `http://127.0.0.1:8000`.

---

## 🔑 Usage

### Accessing the Application

| Page | URL | Access |
|------|-----|--------|
| Home | `/` | Public |
| Products | `/products` | Public |
| Product Details | `/products/:id` | Public |
| Login | `/login` | Public |
| Register | `/register` | Public |
| Cart | `/cart` | Authenticated |
| Checkout | `/checkout` | Authenticated |
| Orders | `/orders` | Authenticated |
| Wishlist | `/wishlist` | Authenticated |
| Admin Dashboard | `/admin` | Admin |
| Admin Products | `/admin/products` | Admin |
| Admin Orders | `/admin/orders` | Admin |
| Admin Users | `/admin/users` | Admin |
| Admin Categories | `/admin/categories` | Admin |

### Admin Access

Admin users have access to the comprehensive admin panel with analytics, product/order/user/category management. Regular users are restricted to customer-facing features only.

---

## 🧩 Key Features Deep Dive

### 🔐 Authentication & Authorization
- **JWT-based** token authentication with automatic token attachment via Axios interceptors
- **Role-based routing** — `AdminRoute` component guards admin pages; `ProtectedRoute` guards customer pages
- **Persistent sessions** via localStorage with auto-logout on 401 responses

### 🔍 Smart Search
- **Debounced** live search suggestions (250ms delay)
- **Autocomplete dropdown** with product images, brand, and pricing
- **Full search results page** with keyword-based product filtering

### 📊 Admin Dashboard
- **30-Day Revenue Chart** — Interactive line chart showing daily revenue trends
- **Order Status Distribution** — Doughnut chart visualizing order status breakdown
- **Top Products by Revenue** — Ranked list of best-selling products
- **Category Breakdown** — Visual bar chart showing product distribution across categories
- **Latest Orders** — Recent order table with status badges
- **Recent Users** — Quick overview of newest registrations

### 🛒 Shopping Cart
- **Async thunk-based** state management via Redux Toolkit
- **Real-time quantity updates** with optimistic UI
- **Discount calculations** applied automatically
- **10% tax estimation** on order totals
- **Cart persistence** across sessions

---

## 📦 NPM Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | TypeScript check + Vite production build |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

---

## 🎨 UI/UX Highlights

- **Glassmorphism login/register** cards with backdrop blur
- **Gradient hero section** with animated patterns
- **Responsive design** — Mobile-first with collapsible navigation
- **Hover animations** on product cards (scale, shadow, wishlist button reveal)
- **Skeleton loading** states for products and dashboard
- **Toast notifications** for all user actions (add to cart, login, order placement, etc.)
- **Collapsible admin sidebar** with icon-only mode
- **Status badges** with color-coded indicators (green for delivered, red for cancelled, etc.)

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 📬 Contact

- **Email**: support@nextcart.ai
- **Phone**: +91 1800-123-4567
- **Location**: Bangalore, Karnataka, India

---

<p align="center">Made with ❤️</p>
