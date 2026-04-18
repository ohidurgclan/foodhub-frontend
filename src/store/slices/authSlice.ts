import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { authApi } from "@/lib/api";
import { User } from "@/types";

interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = { user: null, loading: false, error: null };

export const fetchMe = createAsyncThunk("auth/fetchMe", async () => {
    return authApi.me() as Promise<User>;
});

export const loginUser = createAsyncThunk(
    "auth/login",
    async (data: { email: string; password: string }) => {
        return authApi.login(data) as Promise<{ user: User }>;
    }
);

export const registerUser = createAsyncThunk(
    "auth/register",
    async (data: { name: string; email: string; password: string }) => {
        return authApi.register(data) as Promise<{ user: User }>;
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout(state) {
            state.user = null;
        },
        setUser(state, action: PayloadAction<User>) {
            state.user = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMe.pending, (s) => { s.loading = true; })
            .addCase(fetchMe.fulfilled, (s, a) => { s.loading = false; s.user = a.payload; })
            .addCase(fetchMe.rejected, (s) => { s.loading = false; s.user = null; })
            .addCase(loginUser.fulfilled, (s, a) => { s.user = a.payload.user; })
            .addCase(registerUser.fulfilled, (s, a) => { s.user = a.payload.user; });
    },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;