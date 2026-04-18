export type Role = "CUSTOMER" | "PROVIDER" | "ADMIN";
export type OrderStatus =
    | "PENDING"
    | "CONFIRMED"
    | "PREPARING"
    | "OUT_FOR_DELIVERY"
    | "DELIVERED"
    | "CANCELLED";
export type ActiveStatus = "ACTIVE" | "INACTIVE" | "BANNED";

export interface User {
    id: string;
    name: string | null;
    email: string;
    emailVerified: boolean;
    image: string | null;
    role: Role;
    isActive: boolean;
    phone: string | null;
    status: ActiveStatus | null;
    createdAt: string;
    updatedAt: string;
    providerProfile?: ProviderProfile;
}

export interface ProviderProfile {
    id: string;
    userId: string;
    businessName: string;
    description: string | null;
    address: string;
    phone: string | null;
    logo: string | null;
    createdAt: string;
    updatedAt: string;
    meals?: Meal[];
}

export interface Category {
    id: string;
    name: string;
    createdAt: string;
}

export interface Meal {
    id: string;
    name: string;
    description: string | null;
    price: number;
    image: string | null;
    isAvailable: boolean;
    providerId: string;
    categoryId: string;
    createdAt: string;
    updatedAt: string;
    provider?: ProviderProfile;
    category?: Category;
    reviews?: Review[];
}

export interface Order {
    id: string;
    userId: string;
    totalAmount: number;
    status: OrderStatus;
    providerId: string;
    deliveryAddress: string;
    phone: string;
    createdAt: string;
    updatedAt: string;
    items: OrderItem[];
    provider?: ProviderProfile;
    user?: User;
}

export interface OrderItem {
    id: string;
    orderId: string;
    mealId: string;
    quantity: number;
    price: number;
    meal?: Meal;
}

export interface Review {
    id: string;
    rating: number;
    comment: string | null;
    userId: string;
    mealId: string;
    createdAt: string;
    user?: User;
}

// Cart (client-side only, not in DB)
export interface CartItem {
    meal: Meal;
    quantity: number;
}