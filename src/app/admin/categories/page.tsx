"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import { Category } from "@/types";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch("/api/admin/categories", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => { setCategories(data); setLoading(false); });
  }, []);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setAdding(true);
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName.trim() }),
    });
    const created = await res.json() as Category;
    setCategories((prev) => [...prev, created]);
    setNewName("");
    setAdding(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    await fetch(`/api/admin/categories/${id}`, { method: "DELETE", credentials: "include" });
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Categories</h1>

          {/* Add new */}
          <div className="flex gap-3 mb-6">
            <Input
              className="rounded-xl border-gray-200 flex-1"
              placeholder="New category name..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
            <Button onClick={handleAdd} disabled={adding || !newName.trim()}
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl">
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {loading ? (
              <div className="p-4 space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-10 bg-gray-50 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : categories.length === 0 ? (
              <p className="text-center py-12 text-gray-400">No categories yet</p>
            ) : (
              categories.map((cat, i) => (
                <div key={cat.id} className={`flex items-center justify-between px-5 py-3.5 ${i < categories.length - 1 ? "border-b border-gray-50" : ""}`}>
                  <span className="font-medium text-gray-800">{cat.name}</span>
                  <button onClick={() => handleDelete(cat.id)}
                    className="text-gray-300 hover:text-red-400 p-1.5 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}