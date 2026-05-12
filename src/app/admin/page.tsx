"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import { adminApi } from "@/lib/api";
import { User } from "@/types";
import { Users, ShoppingBag, DollarSign, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getUsers().then((data) => {
      setUsers(data as User[]);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const stats = {
    totalUsers: users.length,
    customers: users.filter((u) => u.role === "CUSTOMER").length,
    providers: users.filter((u) => u.role === "PROVIDER").length,
    banned: users.filter((u) => u.status === "BANNED").length,
  };

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Users", value: stats.totalUsers, icon: Users, color: "bg-blue-50 text-blue-500" },
              { label: "Customers", value: stats.customers, icon: ShoppingBag, color: "bg-green-50 text-green-500" },
              { label: "Providers", value: stats.providers, icon: TrendingUp, color: "bg-orange-50 text-orange-500" },
              { label: "Banned", value: stats.banned, icon: DollarSign, color: "bg-red-50 text-red-500" },
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

          {/* Quick links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { href: "/admin/users", label: "Manage Users", desc: "View and manage all users", emoji: "👥" },
              { href: "/admin/orders", label: "All Orders", desc: "View every order placed", emoji: "📦" },
              { href: "/admin/categories", label: "Categories", desc: "Add or remove categories", emoji: "🗂️" },
            ].map((link) => (
              <Link key={link.href} href={link.href}>
                <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all">
                  <span className="text-3xl mb-3 block">{link.emoji}</span>
                  <p className="font-semibold text-gray-900">{link.label}</p>
                  <p className="text-sm text-gray-400 mt-0.5">{link.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}