<div align="center">
  <br/>
  <img src="frontend/public/favicon.svg" alt="NextCart AI Logo" width="80"/>
  <h1 align="center">🛒 NextCart AI</h1>
  <p align="center">
    <strong>AI-Powered E-Commerce Platform</strong>
    <br/>
    <em>Smart Shopping, Powered by Machine Learning</em>
  </p>

  <p align="center">
    <a href="#-features">Features</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-screenshots">Screenshots</a> •
    <a href="#-getting-started">Setup</a> •
    <a href="#-architecture">Architecture</a> •
    <a href="#-api-routes">API Routes</a>
  </p>

  <br/>

  ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
  ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
  ![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
  ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)
  ![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white)
  ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

  <br/>
</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Screenshots](#-screenshots)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Routes](#-api-routes)
- [Database Schema](#-database-schema)
- [Authentication & Authorization](#-authentication--authorization)
- [ML Recommendations](#-ml-recommendations)
- [UI/UX Highlights](#-uiux-highlights)
- [Environment Variables](#-environment-variables)
- [NPM Scripts](#-npm-scripts)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**NextCart AI** is a full-stack, production-grade e-commerce platform engineered with a **React 19 + TypeScript** frontend and a **FastAPI + PostgreSQL** backend. It leverages **machine learning (scikit-learn)** to deliver personalized product recommendations, features a comprehensive admin analytics dashboard with **Chart.js** visualizations, and implements **JWT-based role-based access control** across customer and admin interfaces.

The platform is designed with scalability and developer experience in mind — featuring feature-based code organization, Redux Toolkit for state management, Axios interceptors for seamless API communication, and a beautifully crafted UI with Tailwind CSS v4 and Framer Motion animations.

---

## ✨ Features

### 🛍️ Customer Experience

| Feature | Details |
|---------|---------|
| **🔐 Auth System** | JWT-based login/register with role-based guards (`AdminRoute`, `ProtectedRoute`) |
| **📦 Product Catalog** | Paginated grid view with search, category/featured/stock filters, multi-column sorting |
| **🔍 Live Search** | 250ms debounced autocomplete with product images, brand, and price display |
| **🤖 AI Recommendations** | ML-powered "You May Also Like" suggestions via scikit-learn |
| **🛒 Shopping Cart** | Async Redux thunks for full CRUD, discount calculations, 10% tax estimation |
| **❤️ Wishlist** | Persistent wishlist with add/remove and empty state handling |
| **💳 Checkout Flow** | Address input → order summary → tax breakdown → order placement |
| **📋 Order Tracking** | Real-time status updates (Placed → Confirmed → Shipped → Delivered) |
| **⭐ Product Details** | Gallery, rating stars, quantity selector, "Buy Now" quick-action |
| **📱 Responsive Design** | Mobile-first with collapsible nav, hamburger menu, adaptive grids |

### 👑 Admin Panel

| Feature | Details |
|---------|---------|
| **📊 Analytics Dashboard** | 30-day revenue line chart, order status doughnut, category distribution bars |
| **📦 Product Management** | CRUD with image upload, stock tracking, featured flags, advanced filtering |
| **📋 Order Management** | Status workflow, search by order/customer, payment status tracking |
| **👥 User Management** | Role assignment, verification status, activate/deactivate toggles |
| **🏷️ Category Management** | CRUD with emoji icons, product count aggregation, active/inactive states |
| **📈 Data Visualizations** | Chart.js integration with interactive line charts and doughnut charts |
| **🔄 Collapsible Sidebar** | Icon-only mode for space efficiency, smooth transitions |

---

## 🚀 Tech Stack

### Frontend

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Core** | React 19 + TypeScript | UI framework with static typing |
| **Bundler** | Vite 8 | Fast HMR and optimized production builds |
| **Styling** | Tailwind CSS v4 | Utility-first CSS with JIT compilation |
| **State** | Redux Toolkit + TanStack Query | Global state + server state management |
| **Routing** | React Router v7 | Client-side routing with loaders/actions |
| **HTTP** | Axios (with interceptors) | API client with JWT interceptor and 401 handling |
| **Forms** | React Hook Form + Zod | Performant forms with schema validation |
| **Charts** | Chart.js + react-chartjs-2 | Interactive dashboard visualizations |
| **Animations** | Framer Motion | Page transitions and micro-interactions |
| **Icons** | Lucide React | Consistent, featherweight icon set |
| **Notifications** | react-hot-toast | Non-blocking toast alerts |
| **Utilities** | clsx + tailwind-merge | Conditional class name composition |

### Backend

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Framework** | FastAPI (via Starlette + Uvicorn) | High-performance async API server |
| **ORM** | SQLAlchemy 2.0 | Database abstraction and model management |
| **Database** | PostgreSQL (via psycopg2) | Production-grade relational database |
| **Auth** | python-jose (JWT) + passlib | Token generation, password hashing |
| **ML** | scikit-learn + pandas + scipy | Product recommendation engine |
| **Config** | python-decouple + python-dotenv | Environment variable management |
| **Validation** | Pydantic | Request/response data validation |
| **Files** | python-multipart + Pillow | Image upload processing |
| **Utilities** | python-slugify | URL-friendly slug generation |

---

## 🖼️ Screenshots

### Landing & Home

<p align="center">
  <img src="screenshots/landing%20page.png" alt="Landing Page" width="49%"/>
  <img src="screenshots/home_page.png" alt="Home Page" width="49%"/>
  <br/>
  <em>Hero section with gradient design & featured products grid</em>
</p>

### Authentication

<p align="center">
  <img src="screenshots/login_page.png" alt="Login Page" width="49%"/>
  <img src="screenshots/customer_cart.png" alt="Shopping Cart" width="49%"/>
  <br/>
  <em>Glassmorphism login form & interactive shopping cart with quantity controls</em>
</p>

### Customer Experience

<p align="center">
  <img src="screenshots/customer_wishlist.png" alt="Wishlist" width="49%"/>
  <img src="screenshots/admin_dashboard.png" alt="Admin Dashboard" width="49%"/>
  <br/>
  <em>Wishlist management & admin dashboard with real-time analytics charts</em>
</p>

### Admin Management

<p align="center">
  <img src="screenshots/admin_product_list.png" alt="Admin Products" width="32%"/>
  <img src="screenshots/admin_orders_history.png" alt="Admin Orders" width="32%"/>
  <img src="screenshots/admin_users_list.png" alt="Admin Users" width="32%"/>
  <br/>
  <em>Product CRUD, order status management & user administration panels</em>
</p>

<p align="center">
  <img src="screenshots/admin_category_distribution.png" alt="Category Distribution" width="70%"/>
  <br/>
  <em>Category breakdown visualization with product counts and distribution bars</em>
</p>

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT (React 19)                           │
│  ┌──────────┐  ┌──────────────┐  ┌──────────┐  ┌───────────────┐   │
│  │   Auth   │  │  Products    │  │   Cart   │  │   Admin       │   │
│  │  (JWT)   │  │  (CRUD)      │  │ (Thunks) │  │   Dashboard   │   │
│  └────┬─────┘  └──────┬───────┘  └────┬─────┘  └───────┬───────┘   │
│       └───────────────┴───────────────┴────────────────┘           │
│                              │                                      │
│                     ┌────────┴────────┐                             │
│                     │   Axios Client   │                            │
│                     │  (JWT Intercept) │                            │
│                     └────────┬────────┘                             │
├──────────────────────────────┼──────────────────────────────────────┤
│                         HTTP │ REST API                             │
├──────────────────────────────┼──────────────────────────────────────┤
│                     ┌────────┴────────┐                             │
│                     │   FastAPI App    │                            │
│    S E R V E R      └────────┬────────┘                             │
│                     ┌────────┴────────┐                             │
│                     │  SQLAlchemy ORM  │                            │
│                     └────────┬────────┘                             │
│                     ┌────────┴────────┐                             │
│                     │   PostgreSQL     │                            │
│                     │   Database       │                            │
│                     └─────────────────┘                             │
└─────────────────────────────────────────────────────────────────────┘
```

### State Management Flow

```
User Action → React Component → Redux Thunk (async) → Axios API Call
                                                              │
                    Redux Store ←─── Reducer ←─── Response ←──┘
                         │
                    React Re-render (connected components)
```

---

## 📁 Project Structure

```
NextCart AI/
│
├── frontend/                         # React + TypeScript SPA
│   ├── public/                       # Static assets (favicon)
│   ├── src/
│   │   ├── api/                      # Axios instance with JWT interceptors
│   │   │   └── axios.ts              # Base URL, Bearer token, 401 handler
│   │   ├── app/
│   │   │   └── App.tsx               # Root component
│   │   ├── components/               # Reusable UI primitives
│   │   │   ├── cart/                 # CartItem, CartSummary
│   │   │   ├── layout/               # Navbar, Footer, SearchBar, Sidebar
│   │   │   ├── loading/              # Skeleton loaders
│   │   │   └── product/              # Gallery, Info, Price, Rating, Quantity
│   │   ├── constants/
│   │   │   └── api.ts                # API_BASE_URL = http://127.0.0.1:8000
│   │   ├── contexts/                 # React contexts (AuthContext)
│   │   ├── features/                 # Feature-based modules (ducks pattern)
│   │   │   ├── auth/                 # Login, Register, AuthSlice, Routes
│   │   │   ├── cart/                 # CartSlice (thunks), CartAPI, CartPage
│   │   │   ├── dashboard/            # AdminDashboard, AdminProducts, AdminOrders...
│   │   │   ├── orders/               # OrderPage, OrderAPI
│   │   │   ├── products/             # ProductCard, ProductList, ProductAPI
│   │   │   └── wishlist/             # WishlistPage, WishlistAPI
│   │   ├── hooks/                    # Custom React hooks
│   │   ├── layouts/                  # MainLayout, AdminLayout
│   │   ├── lib/                      # Utility helpers
│   │   ├── pages/                    # Route-level page components
│   │   ├── routes/
│   │   │   └── AppRoutes.tsx         # All route definitions
│   │   ├── store/
│   │   │   ├── store.ts              # configureStore (auth + cart reducers)
│   │   │   └── hooks.ts              # useAppDispatch, useAppSelector
│   │   ├── styles/                   # Global CSS
│   │   └── types/                    # TypeScript interfaces (Product, Cart, etc.)
│   ├── package.json
│   ├── vite.config.ts                # React + Tailwind + Path alias
│   ├── tsconfig.json
│   └── tailwind.config.ts
│
├── backend/                          # FastAPI + Python backend
│   └── venv/                         # Python virtual environment
│       └── Lib/site-packages/
│           ├── fastapi/              # Async web framework
│           ├── sqlalchemy/           # ORM (v2.0.51)
│           ├── psycopg2/             # PostgreSQL adapter
│           ├── pydantic/             # Data validation
│           ├── python-jose/          # JWT token handling
│           ├── passlib/              # Password hashing
│           ├── scikit-learn/         # ML recommendation engine
│           ├── pandas/               # Data analysis
│           └── uvicorn/              # ASGI server
│
├── screenshots/                      # Application screenshots for README
└── docs/                             # Documentation
```

---

## 🛠️ Getting Started

### Prerequisites

- **Node.js** 18+ (recommended: 20+)
- **Python** 3.10+
- **PostgreSQL** 14+ (or your preferred SQL database)
- **npm** / **yarn** / **pnpm**

### 1️⃣ Database Setup

```bash
# Create PostgreSQL database
createdb nextcart_ai

# Or via psql
psql -U postgres -c "CREATE DATABASE nextcart_ai;"
```

### 2️⃣ Backend Setup

```bash
# Navigate to backend
cd backend

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
# Create .env file in backend root:
echo "DATABASE_URL=postgresql://postgres:password@localhost:5432/nextcart_ai" > .env
echo "SECRET_KEY=your-secret-key-here" >> .env
echo "ALGORITHM=HS256" >> .env
echo "ACCESS_TOKEN_EXPIRE_MINUTES=30" >> .env

# Run database migrations
alembic upgrade head

# Start the server
uvicorn main:app --reload --port 8000
```

### 3️⃣ Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server (default: http://localhost:5173)
npm run dev
```

### 4️⃣ Verify Setup

- **Frontend**: Open [http://localhost:5173](http://localhost:5173)
- **Backend API**: Open [http://localhost:8000/docs](http://localhost:8000/docs) (FastAPI Swagger UI)
- **API Health**: `GET http://localhost:8000/health`

---

## 🌐 API Routes

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/auth/register` | Create new account | ❌ |
| `POST` | `/auth/login` | Get JWT access token | ❌ |
| `GET` | `/auth/me` | Get current user profile | ✅ |

### Products

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/products` | List products (paginated) | ❌ |
| `GET` | `/products/:id` | Get single product | ❌ |
| `GET` | `/products/search` | Search by keyword | ❌ |
| `GET` | `/products/suggestions` | Autocomplete suggestions | ❌ |
| `GET` | `/products/:id/recommend` | AI recommendations | ❌ |
| `POST` | `/products/` | Create product | ✅ Admin |
| `POST` | `/products/:id/upload-image` | Upload product image | ✅ Admin |

### Cart

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/cart/` | Get user's cart | ✅ |
| `POST` | `/cart/add` | Add item to cart | ✅ |
| `PUT` | `/cart/:productId` | Update quantity | ✅ |
| `DELETE` | `/cart/:productId` | Remove item | ✅ |
| `DELETE` | `/cart/` | Clear entire cart | ✅ |

### Orders

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/orders/` | Get user's orders | ✅ |
| `POST` | `/orders/checkout` | Place new order | ✅ |

### Wishlist

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/wishlist/` | Get wishlist | ✅ |
| `POST` | `/wishlist/` | Add to wishlist | ✅ |
| `DELETE` | `/wishlist/:productId` | Remove from wishlist | ✅ |

### Categories

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/categories/` | List categories | ❌ |
| `POST` | `/categories/` | Create category | ✅ Admin |
| `PUT` | `/categories/:id` | Update category | ✅ Admin |
| `DELETE` | `/categories/:id` | Delete category | ✅ Admin |

### Admin

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/dashboard/summary` | Dashboard analytics data | ✅ Admin |
| `GET` | `/admin/users` | List users (filters) | ✅ Admin |
| `PUT` | `/admin/users/:id` | Update user profile | ✅ Admin |
| `GET` | `/admin/products` | List products (filters) | ✅ Admin |
| `GET` | `/admin/orders` | List orders (filters) | ✅ Admin |
| `PUT` | `/admin/orders/:id/status` | Update order status | ✅ Admin |

---

## 🗄️ Database Schema

The platform uses **PostgreSQL** as its primary database, managed through **SQLAlchemy 2.0 ORM** with the following entity relationships:

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│    Users     │     │   Orders     │     │   Products   │
├─────────────┤     ├──────────────┤     ├──────────────┤
│ id (PK)     │◄────│ user_id (FK) │     │ id (PK)      │
│ full_name   │     │ total_amount │     │ name         │
│ email       │     │ order_status │     │ brand        │
│ phone       │     │ payment_stat │     │ price        │
│ password    │     │ shipping_add │     │ discount     │
│ role        │     │ created_at   │     │ sku          │
│ is_active   │     └──────┬───────┘     │ quantity     │
│ is_verified │            │            │ category_id  │
│ created_at  │            │            │ featured     │
└─────────────┘            │            │ image_url    │
        │                  │            │ avg_rating   │
        │                  │            │ description  │
        │     ┌────────────┴───────┐    └──────┬───────┘
        │     │   Order Items      │           │
        │     ├────────────────────┤           │
        └─────│ order_id (FK)      │           │
              │ product_id (FK)    │◄──────────┘
              │ quantity           │
              │ price              │
              └────────────────────┘

┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│   Cart       │     │  Cart Items  │     │  Categories  │
├─────────────┤     ├──────────────┤     ├──────────────┤
│ id (PK)     │     │ id (PK)      │     │ id (PK)      │
│ user_id (FK)│◄────│ cart_id (FK) │     │ name         │
│ total_price │     │ product (FK) │     │ description  │
│ created_at  │     │ quantity     │     │ slug         │
│ updated_at  │     │ price        │     │ is_active    │
└─────────────┘     └──────────────┘     └──────┬───────┘
                                                │
┌─────────────────┐    ┌─────────────────┐      │
│   Wishlist      │    │  Product Images │      │
├─────────────────┤    ├─────────────────┤      │
│ id (PK)         │    │ id (PK)         │      │
│ user_id (FK)    │    │ product_id (FK) │      │
│ product_id (FK) │    │ image_url       │      │
│ created_at      │    │ product_id (FK) │      │
└─────────────────┘    └─────────────────┘      │
                                │                │
                                └────────────────┘
```

---

## 🔐 Authentication & Authorization

### JWT Token Flow

```
User Login → POST /auth/login → Server validates credentials
                                    │
                    Generate JWT ←──┘
                         │
                    Response: { access_token }
                         │
            Client stores token in localStorage
                         │
              Every API request → Axios Interceptor
                         │
            Adds header: Authorization: Bearer <token>
                         │
              Server verifies token → Process request
```

### Role-Based Access Control

| Role | Access |
|------|--------|
| **Admin** | Full access to `/admin/*` routes + all customer routes |
| **Customer** | Products, Cart, Checkout, Orders, Wishlist |
| **Guest** (unauthenticated) | Products (view-only), Login/Register |

### Implementation

- **Frontend Guards**: `ProtectedRoute` redirects to `/login` if unauthenticated; `AdminRoute` redirects non-admin users to `/`
- **Backend Validation**: JWT token is verified on every protected endpoint; role is checked for admin-only routes
- **Token Persistence**: Tokens stored in `localStorage`; auto-removed on 401 responses via Axios interceptor

---

## 🤖 ML Recommendations

The recommendation engine uses **scikit-learn** to analyze product data and user behavior:

- **Content-based filtering**: Analyzes product features (category, brand, price range) to find similar items
- **Collaborative signals**: Uses purchase patterns and ratings data
- **Real-time inference**: Recommendations are computed on-the-fly via `GET /products/:id/recommend`
- **Tech stack**: scikit-learn for ML models, pandas for data processing, scipy for numerical computations

---


## 🔧 Environment Variables

### Frontend (`frontend/src/constants/api.ts`)

| Variable | Default | Description |
|----------|---------|-------------|
| `API_BASE_URL` | `http://127.0.0.1:8000` | Backend API endpoint |

### Backend (`.env` file)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (e.g., `postgresql://user:pass@localhost:5432/nextcart_ai`) |
| `SECRET_KEY` | JWT signing secret key |
| `ALGORITHM` | JWT algorithm (default: `HS256`) |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiry duration (default: `30`) |

---

## 📦 NPM Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `vite` | Start development server with HMR |
| `build` | `tsc -b && vite build` | TypeScript check + production build |
| `preview` | `vite preview` | Preview production build locally |
| `lint` | `eslint .` | Run ESLint across the codebase |

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'feat: add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` — New feature
- `fix:` — Bug fix
- `style:` — Styling changes
- `refactor:` — Code restructuring
- `docs:` — Documentation
- `chore:` — Maintenance

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 📬 Contact

<div align="center">

| | |
|---|---|
| 📧 **Email** | [support@nextcart.ai](mailto:support@nextcart.ai) |
| 📞 **Phone** | +91 1800-123-4567 |
| 📍 **Location** | Bangalore, Karnataka, India |

</div>

---

<div align="center">
  <br/>
  <sub>
    Built with ❤️ &nbsp;|&nbsp;
    ⚡ Powered by React + FastAPI + PostgreSQL &nbsp;|&nbsp;
    🤖 Enhanced by Machine Learning
  </sub>
  <br/><br/>
</div>
