"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import { providerApi } from "@/lib/api";
import { Meal } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import Image from "next/image";

export default function ProviderMenuPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", description: "", price: "", isAvailable: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/provider/meals", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => { setMeals(data); setLoading(false); });
  }, []);

  const resetForm = () => {
    setForm({ name: "", description: "", price: "", isAvailable: true });
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (meal: Meal) => {
    setForm({ name: meal.name, description: meal.description ?? "", price: String(meal.price), isAvailable: meal.isAvailable });
    setEditingId(meal.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price) return;
    setSaving(true);
    try {
      if (editingId) {
        const updated = await providerApi.updateMeal(editingId, {
          name: form.name,
          description: form.description,
          price: parseFloat(form.price),
          isAvailable: form.isAvailable,
        }) as Meal;
        setMeals((prev) => prev.map((m) => (m.id === editingId ? updated : m)));
      }
      resetForm();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this meal?")) return;
    await providerApi.deleteMeal(id);
    setMeals((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <ProtectedRoute allowedRoles={["PROVIDER"]}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Manage Menu</h1>
            <Button
              onClick={() => { resetForm(); setShowForm(true); }}
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Meal
            </Button>
          </div>

          {/* Add/Edit form */}
          {showForm && (
            <div className="bg-white rounded-2xl border border-orange-100 p-6 mb-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-gray-900">{editingId ? "Edit Meal" : "New Meal"}</h2>
                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600"><X className="h-4 w-4" /></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Label className="text-sm text-gray-600 mb-1.5 block">Meal Name</Label>
                  <Input className="rounded-xl border-gray-200" placeholder="e.g. Chicken Burger"
                    value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-sm text-gray-600 mb-1.5 block">Description</Label>
                  <Input className="rounded-xl border-gray-200" placeholder="Optional description"
                    value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                <div>
                  <Label className="text-sm text-gray-600 mb-1.5 block">Price ($)</Label>
                  <Input type="number" min="0" step="0.01" className="rounded-xl border-gray-200"
                    placeholder="0.00" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <input type="checkbox" id="available" checked={form.isAvailable}
                    onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
                    className="w-4 h-4 accent-orange-500" />
                  <Label htmlFor="available" className="text-sm text-gray-700">Available to order</Label>
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <Button onClick={handleSave} disabled={saving}
                  className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl">
                  <Check className="h-4 w-4 mr-1" /> {saving ? "Saving..." : "Save"}
                </Button>
                <Button variant="outline" onClick={resetForm} className="rounded-xl">Cancel</Button>
              </div>
            </div>
          )}

          {/* Meals list */}
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-20 animate-pulse border border-gray-100" />
              ))}
            </div>
          ) : meals.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
              <p className="text-gray-400">No meals yet. Add your first meal!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {meals.map((meal) => (
                <div key={meal.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                    {meal.image ? (
                      <Image src={meal.image} width={56} height={56} alt={meal.name} className="w-full h-full object-cover"  />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">🍽️</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{meal.name}</p>
                    <p className="text-orange-500 font-bold text-sm">${meal.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="outline"
                      className={meal.isAvailable ? "text-green-600 border-green-200 bg-green-50" : "text-gray-400 border-gray-200"}>
                      {meal.isAvailable ? "Available" : "Hidden"}
                    </Badge>
                    <button onClick={() => startEdit(meal)} className="text-gray-400 hover:text-orange-500 p-1.5 hover:bg-orange-50 rounded-lg transition-colors">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(meal.id)} className="text-gray-400 hover:text-red-500 p-1.5 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}