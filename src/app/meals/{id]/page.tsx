"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { mealsApi } from "@/lib/api";
import { Meal } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star, ArrowLeft, MapPin } from "lucide-react";
import { useAppDispatch } from "@/store";
import { addToCart } from "@/store/slices/cartSlice";
import Link from "next/link";

export default function MealDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    mealsApi.getById(id).then((data) => { setMeal(data as Meal); setLoading(false); });
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!meal) return <div className="text-center py-20 text-gray-400">Meal not found</div>;

  const avgRating = meal.reviews?.length
    ? (meal.reviews.reduce((s, r) => s + r.rating, 0) / meal.reviews.length).toFixed(1)
    : null;

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) dispatch(addToCart(meal));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/meals" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-orange-500 mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to meals
        </Link>

        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
          {/* Image */}
          <div className="h-64 sm:h-80 bg-gray-100 relative">
            {meal.image ? (
              <img src={meal.image} alt={meal.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl">🍽️</div>
            )}
            {meal.category && (
              <Badge className="absolute top-4 left-4 bg-white text-gray-700 border-none shadow-sm">
                {meal.category.name}
              </Badge>
            )}
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{meal.name}</h1>
                {meal.provider && (
                  <Link href={`/providers/${meal.provider.id}`} className="flex items-center gap-1 text-sm text-orange-500 hover:underline mb-3">
                    <MapPin className="h-3.5 w-3.5" />
                    {meal.provider.businessName}
                  </Link>
                )}
                {meal.description && (
                  <p className="text-gray-500 text-sm leading-relaxed max-w-lg">{meal.description}</p>
                )}
              </div>
              <div className="text-right shrink-0">
                <p className="text-3xl font-bold text-orange-500">${meal.price.toFixed(2)}</p>
                {avgRating && (
                  <span className="flex items-center justify-end gap-1 text-sm text-gray-500 mt-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {avgRating} ({meal.reviews?.length} reviews)
                  </span>
                )}
              </div>
            </div>

            {/* Qty + Add to cart */}
            {meal.isAvailable ? (
              <div className="flex items-center gap-4 mt-8">
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-2 text-lg text-gray-500 hover:bg-gray-50">−</button>
                  <span className="px-4 py-2 font-semibold text-gray-900 min-w-[40px] text-center">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="px-4 py-2 text-lg text-gray-500 hover:bg-gray-50">+</button>
                </div>
                <Button onClick={handleAddToCart} className="flex-1 h-11 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart — ${(meal.price * qty).toFixed(2)}
                </Button>
              </div>
            ) : (
              <div className="mt-8 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium text-center">
                This item is currently unavailable
              </div>
            )}

            {/* Reviews */}
            {meal.reviews && meal.reviews.length > 0 && (
              <div className="mt-10 border-t border-gray-100 pt-8">
                <h2 className="font-semibold text-gray-900 mb-4">Reviews ({meal.reviews.length})</h2>
                <div className="space-y-4">
                  {meal.reviews.map((r) => (
                    <div key={r.id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-xs font-semibold text-orange-600 shrink-0">
                        {r.user?.name?.[0] ?? "U"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-gray-900">{r.user?.name ?? "User"}</span>
                          <span className="flex items-center gap-0.5 text-xs text-yellow-500">
                            {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                          </span>
                        </div>
                        {r.comment && <p className="text-gray-500 text-sm">{r.comment}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}