import { ShoppingBag, MapPin, Smile } from "lucide-react";

const STEPS = [
  {
    icon: MapPin,
    step: "01",
    title: "Set your location",
    description:
      "Enter your delivery address and discover hundreds of restaurants delivering to your area right now.",
    color: "bg-orange-100 text-orange-500",
  },
  {
    icon: ShoppingBag,
    step: "02",
    title: "Choose & order",
    description:
      "Browse menus, customize your items, add to cart, and checkout securely in just a few taps.",
    color: "bg-blue-100 text-blue-500",
  },
  {
    icon: Smile,
    step: "03",
    title: "Enjoy your food",
    description:
      "Track your order in real time and get fresh, hot food delivered right to your doorstep.",
    color: "bg-green-100 text-green-600",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-orange-500 text-sm font-semibold uppercase tracking-widest">
            Simple & Fast
          </span>
          <h2 className="text-3xl font-bold text-gray-900 mt-2">How it works</h2>
          <p className="text-gray-500 mt-3 max-w-md mx-auto">
            From craving to doorstep in three easy steps. No fuss, just food.
          </p>
        </div>

        {/* Steps */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Connector line (desktop only) */}
          <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-px bg-dashed border-t-2 border-dashed border-gray-200 -z-0" />

          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={i}
                className="relative flex flex-col items-center text-center z-10"
              >
                {/* Icon circle */}
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center mb-5 ${step.color} shadow-sm`}
                >
                  <Icon className="h-8 w-8" />
                </div>

                {/* Step badge */}
                <span className="absolute -top-1 right-[calc(50%-2.5rem)] translate-x-8 bg-orange-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow">
                  {i + 1}
                </span>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
        </div>
    </section>
  );
}