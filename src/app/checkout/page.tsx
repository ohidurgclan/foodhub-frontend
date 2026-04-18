"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import { useAppDispatch, useAppSelector } from "@/store";
import { createOrder } from "@/store/slices/ordersSlice";
import { clearCart } from "@/store/slices/cartSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Phone } from "lucide-react";

export default function CheckoutPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { items, providerId } = useAppSelector((s) => s.cart);
  const { user } = useAppSelector((s) => s.auth);
  const total = items.reduce((s, i) => s + i.meal.price * i.quantity, 0);

  const [form, setForm] = useState({ deliveryAddress: "", phone: user?.phone ?? "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!form.deliveryAddress || !form.phone) { setError("Please fill all fields."); return; }
    if (!providerId) { setError("Cart is empty."); return; }
    setLoading(true);
    try {
      const result = await dispatch(createOrder({
        providerId,
        deliveryAddress: form.deliveryAddress,
        phone: form.phone,
        items: items.map((i) => ({ mealId: i.meal.id, quantity: i.quantity })),
      })).unwrap();
      dispatch(clearCart());
      router.push(`/orders/${result.id}`);
    } catch (e: unknown) {
      setError((e as { message: string }).message || "Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

          <div className="grid gap-5">
            {/* Delivery Info */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-900 mb-5">Delivery Details</h2>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-gray-600 mb-1.5 block">Delivery Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input className="pl-9 rounded-xl border-gray-200" placeholder="Enter full delivery address"
                      value={form.deliveryAddress} onChange={(e) => setForm({ ...form, deliveryAddress: e.target.value })} />
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-gray-600 mb-1.5 block">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input className="pl-9 rounded-xl border-gray-200" placeholder="+1 234 567 8900"
                      value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                {items.map(({ meal, quantity }) => (
                  <div key={meal.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">{meal.name} × {quantity}</span>
                    <span className="font-medium text-gray-900">${(meal.price * quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-4 flex justify-between font-bold text-gray-900">
                <span>Total</span>
                <span className="text-orange-500 text-xl">${total.toFixed(2)}</span>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <Button onClick={handleSubmit} disabled={loading || items.length === 0}
              className="w-full h-12 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold">
              {loading ? "Placing Order..." : `Place Order — $${total.toFixed(2)}`}
            </Button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}