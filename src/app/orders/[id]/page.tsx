"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchOrderById } from "@/store/slices/ordersSlice";
import OrderStatusBadge from "@/components/shared/OrderStatusBadge";
import { MapPin, Phone, ArrowLeft } from "lucide-react";
import Link from "next/link";

const STATUS_STEPS = ["PENDING", "CONFIRMED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED"];

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { current: order, loading } = useAppSelector((s) => s.orders);

  useEffect(() => { dispatch(fetchOrderById(id)); }, [id, dispatch]);

  if (loading || !order) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const stepIdx = STATUS_STEPS.indexOf(order.status);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Link href="/orders" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-orange-500 mb-6">
            <ArrowLeft className="h-4 w-4" /> My Orders
          </Link>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="font-bold text-gray-900">Order #{order.id.slice(-8).toUpperCase()}</h1>
                <p className="text-gray-400 text-xs mt-0.5">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>

            {/* Progress tracker */}
            {order.status !== "CANCELLED" && (
              <div className="flex items-center gap-1 mt-4 mb-6">
                {STATUS_STEPS.map((s, i) => (
                  <div key={s} className="flex items-center flex-1">
                    <div className={`w-3 h-3 rounded-full shrink-0 ${i <= stepIdx ? "bg-orange-500" : "bg-gray-200"}`} />
                    {i < STATUS_STEPS.length - 1 && (
                      <div className={`flex-1 h-0.5 ${i < stepIdx ? "bg-orange-500" : "bg-gray-200"}`} />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Delivery info */}
            <div className="space-y-2 text-sm text-gray-500 border-t border-gray-100 pt-4">
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-orange-400" />{order.deliveryAddress}</div>
              <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-orange-400" />{order.phone}</div>
            </div>
          </div>

          {/* Items */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Items</h2>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.meal?.name ?? "Item"} × {item.quantity}</span>
                  <span className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between font-bold text-gray-900">
              <span>Total</span>
              <span className="text-orange-500 text-lg">${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}