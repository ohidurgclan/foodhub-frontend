"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import { adminApi } from "@/lib/api";
import { User, ActiveStatus } from "@/types";
import { Badge } from "@/components/ui/badge";

const STATUS_STYLES: Record<ActiveStatus, string> = {
  ACTIVE:   "bg-green-50 text-green-700 border-green-200",
  INACTIVE: "bg-gray-50 text-gray-500 border-gray-200",
  BANNED:   "bg-red-50 text-red-600 border-red-200",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    adminApi.getUsers().then((data) => { setUsers(data as User[]); setLoading(false); });
  }, []);

  const handleStatusChange = async (userId: string, status: ActiveStatus) => {
    await adminApi.updateUserStatus(userId, status);
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, status } : u));
  };

  const filtered = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Users</h1>

          <input
            className="w-full max-w-sm border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white mb-6 focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-5 py-3.5 font-medium text-gray-500">User</th>
                    <th className="text-left px-5 py-3.5 font-medium text-gray-500">Role</th>
                    <th className="text-left px-5 py-3.5 font-medium text-gray-500">Status</th>
                    <th className="text-left px-5 py-3.5 font-medium text-gray-500">Joined</th>
                    <th className="text-left px-5 py-3.5 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}><td colSpan={5} className="px-5 py-3"><div className="h-8 bg-gray-50 rounded animate-pulse" /></td></tr>
                    ))
                  ) : filtered.map((user) => (
                    <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-xs font-semibold text-orange-600">
                            {user.name?.[0]?.toUpperCase() ?? "U"}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.name ?? "—"}</p>
                            <p className="text-xs text-gray-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge variant="outline" className="text-xs">{user.role}</Badge>
                      </td>
                      <td className="px-5 py-3.5">
                        {user.status && (
                          <Badge variant="outline" className={`text-xs ${STATUS_STYLES[user.status]}`}>
                            {user.status}
                          </Badge>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-gray-400 text-xs">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3.5">
                        <select
                          value={user.status ?? "ACTIVE"}
                          onChange={(e) => handleStatusChange(user.id, e.target.value as ActiveStatus)}
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                        >
                          <option value="ACTIVE">Set Active</option>
                          <option value="INACTIVE">Set Inactive</option>
                          <option value="BANNED">Ban User</option>
                        </select>
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