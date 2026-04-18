"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { providersApi } from "@/lib/api";
import { ProviderProfile } from "@/types";
import MealCard from "@/components/shared/MealCard";
import { MapPin, Phone, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ProviderPage() {
  const { id } = useParams<{ id: string }>();
  const [provider, setProvider] = useState<ProviderProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    providersApi.getById(id).then((data) => { setProvider(data as ProviderProfile); setLoading(false); });
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!provider) return <div className="text-center py-20">Provider not found</div>;

  const categories = Array.from(new Set(provider.meals?.map((m) => m.category?.name).filter(Boolean)));
  const filteredMeals = activeCategory === "all"
    ? provider.meals ?? []
    : provider.meals?.filter((m) => m.category?.name === activeCategory) ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/meals" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-orange-500 mb-6">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-orange-100 overflow-hidden flex items-center justify-center shrink-0">
              {provider.logo ? (
                <Image src={provider.logo} alt={provider.businessName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl">🏪</span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{provider.businessName}</h1>
              {provider.description && (
                <p className="text-gray-500 text-sm mt-1 max-w-lg">{provider.description}</p>
              )}
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                {provider.address && (
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{provider.address}</span>
                )}
                {provider.phone && (
                  <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{provider.phone}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category filter */}
        {categories.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-6">
            {["all", ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat as string)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  activeCategory === cat
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-gray-600 border-gray-200 hover:border-orange-300"
                }`}
              >
                {cat === "all" ? "All" : cat}
              </button>
            ))}
          </div>
        )}

        <h2 className="text-xl font-bold text-gray-900 mb-5">
          Menu <span className="text-gray-400 font-normal text-base">({filteredMeals.length} items)</span>
        </h2>

        {filteredMeals.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No meals in this category</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredMeals.map((meal) => (
              <MealCard key={meal.id} meal={meal} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}