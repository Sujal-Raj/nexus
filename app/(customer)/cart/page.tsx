// /app/(customer)/cart/page.tsx
"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/services/api";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Cart() {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const userIdFromStorage = localStorage.getItem("userId");
    setCurrentUserId(userIdFromStorage);
  }, []);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["cart", currentUserId],
    queryFn: async () => {
      if (!currentUserId) {
        return Promise.reject(new Error("User ID not available"));
      }
      const res = await api.get(`/api/cart?userId=${currentUserId}`);
      return res.data;
    },
    enabled: !!currentUserId,
  });

  const { mutate: updateQuantity, isPending: isUpdating } = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      api.put("/api/cart/update", { productId, quantity }),
    onSuccess: () => refetch(),
  });

  const { mutate: removeItem, isPending: isRemoving } = useMutation({
    mutationFn: (productId: string) => api.delete(`/api/cart/${productId}`),
    onSuccess: () => refetch(),
  });

  const { mutate: checkout, isPending: isCheckingOut } = useMutation({
    mutationFn: (address: any) => api.post("/api/orders/create", { address }),
    onSuccess: () => {
      alert("Order placed successfully!");
      refetch();
    },
  });

  const total =
    data?.items?.reduce(
      (sum: number, item: any) => sum + item.product.price * item.quantity,
      0
    ) || 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-black/20 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold text-white">
              Nexus
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/products" className="text-gray-300 hover:text-white">
                Products
              </Link>
              <Link href="/cart" className="text-purple-400 font-medium">
                Cart
              </Link>
              <Link href="/dashboard" className="text-gray-300 hover:text-white">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Shopping Cart</h1>

        {data?.items?.length === 0 ? (
          <div className="text-center py-20">
            <svg
              className="w-24 h-24 text-gray-600 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p className="text-gray-400 text-xl mb-4">Your cart is empty</p>
            <Link
              href="/products"
              className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {data?.items?.map((item: any) => (
                <div
                  key={item.product._id}
                  className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-4 flex items-center gap-4"
                >
                  <div className="w-24 h-24 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    {item.product.images?.[0] ? (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <svg
                        className="w-10 h-10 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">
                      {item.product.title}
                    </h3>
                    <p className="text-purple-400 font-bold mt-1">
                      ${item.product.price}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        updateQuantity({
                          productId: item.product._id,
                          quantity: Math.max(1, item.quantity - 1),
                        })
                      }
                      disabled={isUpdating || item.quantity <= 1}
                      className="w-8 h-8 bg-white/10 rounded-lg text-white hover:bg-white/20 disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="text-white w-8 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity({
                          productId: item.product._id,
                          quantity: item.quantity + 1,
                        })
                      }
                      disabled={isUpdating || item.quantity >= item.product.stock}
                      className="w-8 h-8 bg-white/10 rounded-lg text-white hover:bg-white/20 disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-white font-semibold">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeItem(item.product._id)}
                      disabled={isRemoving}
                      className="text-red-400 hover:text-red-300 text-sm mt-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-6 sticky top-8">
                <h2 className="text-xl font-bold text-white mb-4">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="border-t border-white/10 pt-3 flex justify-between text-white font-bold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => checkout({ address: "Default address" })}
                  disabled={isCheckingOut}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
                >
                  {isCheckingOut ? "Processing..." : "Checkout"}
                </button>

                <Link
                  href="/products"
                  className="block text-center mt-4 text-purple-400 hover:text-purple-300"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}