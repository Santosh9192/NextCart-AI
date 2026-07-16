import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { CartItem } from "@/types/cart";
import {
  getCart,
  addToCart,
  updateCart,
  removeCartItem,
  clearCart,
} from "./CartAPI";

interface CartState {
  items: CartItem[];
  totalPrice: number;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  totalPrice: 0,
  loading: false,
  error: null,
};

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getCart();
      return {
        items: data.items || [],
        totalPrice: Number(data.total_price) || 0,
      };
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.detail || "Failed to fetch cart"
      );
    }
  }
);

export const addToCartThunk = createAsyncThunk(
  "cart/addToCart",
  async (
    { productId, quantity }: { productId: number; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      const data = await addToCart(productId, quantity);
      return {
        items: data.items || [],
        totalPrice: Number(data.total_price) || 0,
      };
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.detail || "Failed to add to cart"
      );
    }
  }
);

export const updateCartItemThunk = createAsyncThunk(
  "cart/updateCartItem",
  async (
    { productId, quantity }: { productId: number; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      const data = await updateCart(productId, quantity);
      return {
        items: data.items || [],
        totalPrice: Number(data.total_price) || 0,
      };
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.detail || "Failed to update cart"
      );
    }
  }
);

export const removeCartItemThunk = createAsyncThunk(
  "cart/removeCartItem",
  async (productId: number, { rejectWithValue }) => {
    try {
      const data = await removeCartItem(productId);
      return {
        items: data.items || [],
        totalPrice: Number(data.total_price) || 0,
      };
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.detail || "Failed to remove item"
      );
    }
  }
);

export const clearCartThunk = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      const data = await clearCart();
      return {
        items: data.items || [],
        totalPrice: Number(data.total_price) || 0,
      };
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.detail || "Failed to clear cart"
      );
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    resetCart() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state: CartState) => {
      state.loading = true;
      state.error = null;
    };
    const handleFulfilled = (
      state: CartState,
      action: { payload: { items: CartItem[]; totalPrice: number } }
    ) => {
      state.loading = false;
      state.items = action.payload.items;
      state.totalPrice = action.payload.totalPrice;
    };
    const handleRejected = (
      state: CartState,
      action: { payload?: string }
    ) => {
      state.loading = false;
      state.error = action.payload || "Something went wrong";
    };

    builder
      .addCase(fetchCart.pending, handlePending)
      .addCase(fetchCart.fulfilled, handleFulfilled)
      .addCase(fetchCart.rejected, handleRejected)
      .addCase(addToCartThunk.pending, handlePending)
      .addCase(addToCartThunk.fulfilled, handleFulfilled)
      .addCase(addToCartThunk.rejected, handleRejected)
      .addCase(updateCartItemThunk.pending, handlePending)
      .addCase(updateCartItemThunk.fulfilled, handleFulfilled)
      .addCase(updateCartItemThunk.rejected, handleRejected)
      .addCase(removeCartItemThunk.pending, handlePending)
      .addCase(removeCartItemThunk.fulfilled, handleFulfilled)
      .addCase(removeCartItemThunk.rejected, handleRejected)
      .addCase(clearCartThunk.pending, handlePending)
      .addCase(clearCartThunk.fulfilled, handleFulfilled)
      .addCase(clearCartThunk.rejected, handleRejected);
  },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;
