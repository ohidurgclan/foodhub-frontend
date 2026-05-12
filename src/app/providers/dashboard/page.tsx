"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import { authClient } from "@/lib/auth-client";
import OrderStatusBadge from "@/components/shared/OrderStatusBadge";
import { Order } from "@/types";
import { ShoppingBag, DollarSign, Clock, TrendingUp } from "lucide-react";

export default function ProviderDashboardPage() {
  const { data: session } = authClient.useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch provider orders — reuse ordersApi since provider sees their own orders
    fetch("/api/orders", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => { setOrders(data); setLoading(false); });
  }, []);

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "PENDING").length,
    delivered: orders.filter((o) => o.status === "DELIVERED").length,
    revenue: orders.filter((o) => o.status === "DELIVERED").reduce((s, o) => s + o.totalAmount, 0),
  };

  return (
    <ProtectedRoute allowedRoles={["PROVIDER"]}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Provider Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">
              Welcome back, {session?.user.name}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Orders", value: stats.total, icon: ShoppingBag, color: "bg-blue-50 text-blue-500" },
              { label: "Pending", value: stats.pending, icon: Clock, color: "bg-yellow-50 text-yellow-500" },
              { label: "Delivered", value: stats.delivered, icon: TrendingUp, color: "bg-green-50 text-green-500" },
              { label: "Revenue", value: `$${stats.revenue.toFixed(2)}`, icon: DollarSign, color: "bg-orange-50 text-orange-500" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                  <s.icon className="h-5 w-5" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Recent orders */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-5">Recent Orders</h2>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-14 bg-gray-50 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">No orders yet</p>
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 10).map((order) => (
                  <div key={order.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        #{order.id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-400">
                        {order.items.length} item{order.items.length !== 1 ? "s" : ""} · {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-orange-500 text-sm">${order.totalAmount.toFixed(2)}</span>
                      <OrderStatusBadge status={order.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}