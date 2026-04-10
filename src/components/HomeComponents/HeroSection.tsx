"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";

export default function HeroSection() {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    // wire to your API / Redux action
    console.log("Searching:", query);
  };

  return (
    <section className="relative bg-orange-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col-reverse lg:flex-row items-center gap-12">
        {/* Left — copy + search */}
        <div className="flex-1 text-center lg:text-left">
          <span className="inline-block bg-orange-100 text-orange-600 text-sm font-medium px-3 py-1 rounded-full mb-4">
            🚀 Fast delivery in your city
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-4">
            Hungry? <br />
            <span className="text-orange-500">We have got you covered.</span>
          </h1>
          <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto lg:mx-0">
            Order from the best local restaurants and get it delivered fresh to
            your door in minutes.
          </p>

          {/* Search bar */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto lg:mx-0">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                className="pl-9 h-12 rounded-xl border-gray-200 bg-white shadow-sm"
                placeholder="Enter your delivery address"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button
              onClick={handleSearch}
              className="h-12 px-6 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold"
            >
              <Search className="h-4 w-4 mr-2" />
              Find Food
            </Button>
          </div>

          {/* Trust badges */}
          <div className="flex items-center justify-center lg:justify-start gap-6 mt-8 text-sm text-gray-500">
            <span>⭐ 4.8 App Rating</span>
            <span>🏪 500+ Restaurants</span>
            <span>⚡ 30 min avg delivery</span>
          </div>
        </div>

        {/* Right — illustration placeholder */}
        <div className="flex-1 flex justify-center">
          <div className="relative w-72 h-72 sm:w-96 sm:h-96">
            <img
              src="/hero-food.png"
              alt="Delicious food delivered"
              className="w-full h-full object-contain drop-shadow-xl"
            />
          </div>
        </div>
      </div>

      {/* Decorative blobs */}
      <div className="absolute -top-10 -right-10 w-64 h-64 bg-orange-200 rounded-full opacity-20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-yellow-200 rounded-full opacity-20 blur-3xl pointer-events-none" />
    </section>
  );
}