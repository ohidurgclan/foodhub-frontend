"use client";

import { Meal } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star } from "lucide-react";
import { useAppDispatch } from "@/store";
import { addToCart } from "@/store/slices/cartSlice";
import Link from "next/link";
import Image from "next/image";

export default function MealCard({ meal }: { meal: Meal }) {
  const dispatch = useAppDispatch();
  const avgRating =
    meal.reviews && meal.reviews.length > 0
      ? (meal.reviews.reduce((s, r) => s + r.rating, 0) / meal.reviews.length).toFixed(1)
      : null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col">
      <Link href={`/meals/${meal.id}`}>
        <div className="relative h-44 bg-gray-100 overflow-hidden">
          {meal.image ? (
            <Image src={meal.image} alt={meal.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">🍽️</div>
          )}
          {!meal.isAvailable && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-semibold text-sm">Unavailable</span>
            </div>
          )}
          {meal.category && (
            <Badge className="absolute top-2 left-2 bg-white/90 text-gray-700 text-xs border-none">
              {meal.category.name}
            </Badge>
          )}
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <Link href={`/meals/${meal.id}`}>
          <h3 className="font-semibold text-gray-900 text-sm mb-1 hover:text-orange-500 transition-colors line-clamp-1">
            {meal.name}
          </h3>
        </Link>
        {meal.description && (
          <p className="text-gray-400 text-xs mb-3 line-clamp-2">{meal.description}</p>
        )}
        {meal.provider && (
          <Link href={`/providers/${meal.provider.id}`} className="text-xs text-orange-500 hover:underline mb-2">
            {meal.provider.businessName}
          </Link>
        )}

        <div className="mt-auto flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-gray-900">${meal.price.toFixed(2)}</span>
            {avgRating && (
              <span className="flex items-center gap-0.5 text-xs text-gray-500 mt-0.5">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                {avgRating}
              </span>
            )}
          </div>
          <Button
            size="sm"
            disabled={!meal.isAvailable}
            onClick={() => dispatch(addToCart(meal))}
            className="rounded-xl bg-orange-500 hover:bg-orange-600 text-white h-9 px-3"
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}