"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Clock, ChevronRight } from "lucide-react";
import Link from "next/link";

interface Restaurant {
  id: number;
  name: string;
  cuisine: string;
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  deliveryFee: string;
  minOrder: string;
  image: string;
  tags: string[];
  promoted?: boolean;
}

// Replace with real data from your Redux store / API
const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: 1,
    name: "The Burger Lab",
    cuisine: "American • Burgers",
    rating: 4.8,
    reviewCount: 320,
    deliveryTime: "20-30 min",
    deliveryFee: "$1.99",
    minOrder: "$10",
    image: "/restaurants/burger-lab.jpg",
    tags: ["Best Seller", "Popular"],
    promoted: true,
  },
  {
    id: 2,
    name: "Sakura Sushi",
    cuisine: "Japanese • Sushi",
    rating: 4.7,
    reviewCount: 215,
    deliveryTime: "25-40 min",
    deliveryFee: "Free",
    minOrder: "$15",
    image: "/restaurants/sakura.jpg",
    tags: ["New"],
  },
  {
    id: 3,
    name: "Spice Garden",
    cuisine: "Indian • Curry",
    rating: 4.6,
    reviewCount: 178,
    deliveryTime: "30-45 min",
    deliveryFee: "$0.99",
    minOrder: "$12",
    image: "/restaurants/spice-garden.jpg",
    tags: ["Trending"],
  },
  {
    id: 4,
    name: "Pizza Napoli",
    cuisine: "Italian • Pizza",
    rating: 4.9,
    reviewCount: 512,
    deliveryTime: "15-25 min",
    deliveryFee: "Free",
    minOrder: "$10",
    image: "/restaurants/pizza-napoli.jpg",
    tags: ["Top Rated"],
  },
];

export default function FeaturedRestaurants() {
  return (
    <section className="bg-gray-50 py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Featured Restaurants</h2>
            <p className="text-gray-500 text-sm mt-1">Handpicked top-rated spots near you</p>
          </div>
          <Link href="/restaurants">
            <Button variant="ghost" className="text-orange-500 hover:text-orange-600 font-medium">
              View all <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {MOCK_RESTAURANTS.map((r) => (
            <Link key={r.id} href={`/restaurants/${r.id}`}>
              <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer group">
                {/* Image */}
                <div className="relative h-44 overflow-hidden bg-gray-100">
                  <img
                    src={r.image}
                    alt={r.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {r.promoted && (
                    <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                      Promoted
                    </span>
                  )}
                  <span
                    className={`absolute top-3 right-3 text-xs font-semibold px-2 py-0.5 rounded-full ${
                      r.deliveryFee === "Free"
                        ? "bg-green-100 text-green-700"
                        : "bg-white text-gray-700"
                    }`}
                  >
                    {r.deliveryFee === "Free" ? "Free delivery" : r.deliveryFee + " delivery"}
                  </span>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-base mb-0.5 truncate">
                    {r.name}
                  </h3>
                  <p className="text-gray-400 text-xs mb-3 truncate">{r.cuisine}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {r.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-xs bg-orange-50 text-orange-600 border-none"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Meta row */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="flex items-center gap-1 font-medium text-gray-700">
                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      {r.rating}
                      <span className="text-gray-400 font-normal text-xs">({r.reviewCount})</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {r.deliveryTime}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}