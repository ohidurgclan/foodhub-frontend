"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import { Order } from "@/types";
import OrderStatusBadge from "@/components/shared/OrderStatusBadge";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/orders", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => { setOrders(data); setLoading(false); });
  }, []);

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">All Orders</h1>

          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-5 py-3.5 font-medium text-gray-500">Order ID</th>
                    <th className="text-left px-5 py-3.5 font-medium text-gray-500">Customer</th>
                    <th className="text-left px-5 py-3.5 font-medium text-gray-500">Provider</th>
                    <th className="text-left px-5 py-3.5 font-medium text-gray-500">Total</th>
                    <th className="text-left px-5 py-3.5 font-medium text-gray-500">Status</th>
                    <th className="text-left px-5 py-3.5 font-medium text-gray-500">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? Array.from({ length: 6 }).map((_, i) => (
                        <tr key={i}><td colSpan={6} className="px-5 py-3"><div className="h-8 bg-gray-50 rounded animate-pulse" /></td></tr>
                      ))
                    : orders.map((order) => (
                        <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="px-5 py-3.5 font-mono text-xs text-gray-500">
                            #{order.id.slice(-8).toUpperCase()}
                          </td>
                          <td className="px-5 py-3.5 text-gray-700">{order.user?.name ?? "—"}</td>
                          <td className="px-5 py-3.5 text-gray-700">{order.provider?.businessName ?? "—"}</td>
                          <td className="px-5 py-3.5 font-bold text-orange-500">${order.totalAmount.toFixed(2)}</td>
                          <td className="px-5 py-3.5"><OrderStatusBadge status={order.status} /></td>
                          <td className="px-5 py-3.5 text-gray-400 text-xs">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}