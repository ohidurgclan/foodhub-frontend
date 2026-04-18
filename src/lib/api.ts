const BASE_URL = process.env.BASE_URL || "http://localhost:3001";

async function request<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        headers: { "Content-Type": "application/json", ...options.headers },
        credentials: "include",
        ...options,
    });
    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Request failed");
    }
    return res.json();
}

// Auth
export const authApi = {
    register: (data: { name: string; email: string; password: string }) =>
        request("/api/auth/register", { method: "POST", body: JSON.stringify(data) }),
    login: (data: { email: string; password: string }) =>
        request("/api/auth/login", { method: "POST", body: JSON.stringify(data) }),
    me: () => request("/api/auth/me"),
};

// Meals
export const mealsApi = {
    getAll: (params?: Record<string, string>) => {
        const qs = params ? "?" + new URLSearchParams(params).toString() : "";
        return request(`/api/meals${qs}`);
    },
    getById: (id: string) => request(`/api/meals/${id}`),
};

// Providers
export const providersApi = {
    getAll: () => request("/api/providers"),
    getById: (id: string) => request(`/api/providers/${id}`), // returns provider + meals
};

// Orders
export const ordersApi = {
    create: (data: { providerId: string; deliveryAddress: string; phone: string; items: { mealId: string; quantity: number }[] }) =>
        request("/api/orders", { method: "POST", body: JSON.stringify(data) }),
    getMyOrders: () => request("/api/orders"),
    getById: (id: string) => request(`/api/orders/${id}`),
};

// Provider management
export const providerApi = {
    addMeal: (data: FormData) =>
        request("/api/provider/meals", { method: "POST", body: data, headers: {} }),
    updateMeal: (id: string, data: Partial<{ name: string; description: string; price: number; isAvailable: boolean }>) =>
        request(`/api/provider/meals/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    deleteMeal: (id: string) =>
        request(`/api/provider/meals/${id}`, { method: "DELETE" }),
    updateOrderStatus: (id: string, status: string) =>
        request(`/api/provider/orders/${id}`, { method: "PATCH", body: JSON.stringify({ status }) }),
};

// Admin
export const adminApi = {
    getUsers: () => request("/api/admin/users"),
    updateUserStatus: (id: string, status: string) =>
        request(`/api/admin/users/${id}`, { method: "PATCH", body: JSON.stringify({ status }) }),
};