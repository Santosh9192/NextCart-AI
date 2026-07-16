export interface CartImage {
  id: number;
  image_url: string;
  product_id: number;
}

export interface CartProduct {
  id: number;
  name: string;
  brand: string;
  price: number;
  discount: number;
  description: string;
  average_rating: number;
  total_reviews: number;
  images: CartImage[];
  sku: string;
}

export interface CartItem {
  id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  price: number;
  product: CartProduct;
}

export interface Cart {
  id: number;
  user_id: number;
  total_price: number;
  items: CartItem[];
  created_at: string;
  updated_at: string;
}
