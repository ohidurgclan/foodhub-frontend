"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { id: 1, label: "All", emoji: "🍽️" },
  { id: 2, label: "Burgers", emoji: "🍔" },
  { id: 3, label: "Pizza", emoji: "🍕" },
  { id: 4, label: "Sushi", emoji: "🍣" },
  { id: 5, label: "Chinese", emoji: "🥡" },
  { id: 6, label: "Indian", emoji: "🍛" },
  { id: 7, label: "Desserts", emoji: "🍰" },
  { id: 8, label: "Healthy", emoji: "🥗" },
  { id: 9, label: "Chicken", emoji: "🍗" },
  { id: 10, label: "Tacos", emoji: "🌮" },
  { id: 11, label: "Noodles", emoji: "🍜" },
  { id: 12, label: "Drinks", emoji: "🧃" },
];

interface CategoriesSectionProps {
  activeCategory?: number;
  onSelect?: (id: number) => void;
}

export default function CategoriesSection({
  activeCategory = 1,
  onSelect,
}: CategoriesSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === "left" ? -200 : 200, behavior: "smooth" });
    }
  };

  return (
    <section className="bg-white py-10 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">What are you craving?</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-8 w-8"
              onClick={() => scroll("left")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-8 w-8"
              onClick={() => scroll("right")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelect?.(cat.id)}
              className={cn(
                "flex flex-col items-center gap-2 min-w-[80px] px-4 py-3 rounded-2xl border transition-all duration-200 cursor-pointer select-none",
                activeCategory === cat.id
                  ? "bg-orange-500 border-orange-500 text-white shadow-md scale-105"
                  : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-orange-50 hover:border-orange-300"
              )}
            >
              <span className="text-2xl">{cat.emoji}</span>
              <span className="text-xs font-medium whitespace-nowrap">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}