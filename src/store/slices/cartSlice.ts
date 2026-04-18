import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem, Meal } from "@/types";

interface CartState {
    items: CartItem[];
    providerId: string | null;
}

const initialState: CartState = { items: [], providerId: null };

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart(state, action: PayloadAction<Meal>) {
            const meal = action.payload;
            // Enforce single-provider cart
            if (state.providerId && state.providerId !== meal.providerId) {
                state.items = [];
            }
            state.providerId = meal.providerId;
            const existing = state.items.find((i) => i.meal.id === meal.id);
            if (existing) {
                existing.quantity += 1;
            } else {
                state.items.push({ meal, quantity: 1 });
            }
        },
        removeFromCart(state, action: PayloadAction<string>) {
            state.items = state.items.filter((i) => i.meal.id !== action.payload);
            if (state.items.length === 0) state.providerId = null;
        },
        updateQuantity(state, action: PayloadAction<{ mealId: string; quantity: number }>) {
            const item = state.items.find((i) => i.meal.id === action.payload.mealId);
            if (item) item.quantity = action.payload.quantity;
        },
        clearCart(state) {
            state.items = [];
            state.providerId = null;
        },
    },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;