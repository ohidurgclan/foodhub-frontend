"use client";

import ProtectedRoute from "@/components/shared/ProtectedRoute";
import { useAppDispatch, useAppSelector } from "@/store";
import { removeFromCart, updateQuantity, clearCart } from "@/store/slices/cartSlice";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CartPage() {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((s) => s.cart);
  const total = items.reduce((s, i) => s + i.meal.price * i.quantity, 0);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Your Cart</h1>

          {items.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
              <ShoppingBag className="h-12 w-12 mx-auto text-gray-200 mb-4" />
              <p className="font-medium text-gray-500">Your cart is empty</p>
              <Link href="/meals">
                <Button className="mt-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl">
                  Browse Meals
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-3 mb-6">
                {items.map(({ meal, quantity }) => (
                  <div key={meal.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4 items-center">
                    <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                      {meal.image ? (
                        <Image src={meal.image} alt={meal.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">🍽️</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">{meal.name}</p>
                      <p className="text-orange-500 font-bold text-sm mt-0.5">${(meal.price * quantity).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => quantity > 1 ? dispatch(updateQuantity({ mealId: meal.id, quantity: quantity - 1 })) : dispatch(removeFromCart(meal.id))}
                        className="w-7 h-7 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 flex items-center justify-center text-lg">−</button>
                      <span className="w-6 text-center text-sm font-semibold">{quantity}</span>
                      <button onClick={() => dispatch(updateQuantity({ mealId: meal.id, quantity: quantity + 1 }))}
                        className="w-7 h-7 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 flex items-center justify-center text-lg">+</button>
                      <button onClick={() => dispatch(removeFromCart(meal.id))} className="ml-1 text-red-400 hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 text-lg border-t border-gray-100 pt-3 mt-3">
                  <span>Total</span>
                  <span className="text-orange-500">${total.toFixed(2)}</span>
                </div>
                <Link href="/checkout">
                  <Button className="w-full mt-4 h-12 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold">
                    Proceed to Checkout
                  </Button>
                </Link>
                <button onClick={() => dispatch(clearCart())} className="w-full mt-2 text-sm text-gray-400 hover:text-red-400 transition-colors">
                  Clear cart
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}