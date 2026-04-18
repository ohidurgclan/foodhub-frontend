"use client";

import { useEffect } from "react";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchMyOrders } from "@/store/slices/ordersSlice";
import OrderStatusBadge from "@/components/shared/OrderStatusBadge";
import { Package } from "lucide-react";
import Link from "next/link";

export default function MyOrdersPage() {
  const dispatch = useAppDispatch();
  const { orders, loading } = useAppSelector((s) => s.orders);

  useEffect(() => { dispatch(fetchMyOrders()); }, [dispatch]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">My Orders</h1>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-24 animate-pulse border border-gray-100" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
              <Package className="h-12 w-12 mx-auto text-gray-200 mb-4" />
              <p className="font-medium text-gray-500">No orders yet</p>
              <Link href="/meals" className="text-sm text-orange-500 hover:underline mt-2 inline-block">Browse meals</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <Link key={order.id} href={`/orders/${order.id}`}>
                  <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{order.provider?.businessName ?? "Order"}</p>
                      <p className="text-gray-400 text-xs mt-0.5">
                        {order.items.length} item{order.items.length !== 1 ? "s" : ""} · {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-orange-500">${order.totalAmount.toFixed(2)}</p>
                      <div className="mt-1"><OrderStatusBadge status={order.status} /></div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}