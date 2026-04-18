import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ordersApi } from "@/lib/api";
import { Order } from "@/types";

interface OrdersState {
    orders: Order[];
    current: Order | null;
    loading: boolean;
    error: string | null;
}

const initialState: OrdersState = { orders: [], current: null, loading: false, error: null };

export const fetchMyOrders = createAsyncThunk("orders/fetchMine", async () => {
    return ordersApi.getMyOrders() as Promise<Order[]>;
});

export const fetchOrderById = createAsyncThunk("orders/fetchOne", async (id: string) => {
    return ordersApi.getById(id) as Promise<Order>;
});

export const createOrder = createAsyncThunk(
    "orders/create",
    async (data: { providerId: string; deliveryAddress: string; phone: string; items: { mealId: string; quantity: number }[] }) => {
        return ordersApi.create(data) as Promise<Order>;
    }
);

const ordersSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMyOrders.pending, (s) => { s.loading = true; })
            .addCase(fetchMyOrders.fulfilled, (s, a) => { s.loading = false; s.orders = a.payload; })
            .addCase(fetchMyOrders.rejected, (s, a) => { s.loading = false; s.error = a.error.message || null; })
            .addCase(fetchOrderById.fulfilled, (s, a) => { s.current = a.payload; })
            .addCase(createOrder.fulfilled, (s, a) => { s.orders.unshift(a.payload); s.current = a.payload; });
    },
});

export default ordersSlice.reducer;