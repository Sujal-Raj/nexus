// /app/(merchant)/orders/page.tsx
"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/services/api";
import Link from "next/link";

export default function Orders() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["merchant-orders"],
    queryFn: () => api.get("/api/orders").then((res) => res.data),
  });

  const { mutate: updateStatus, isPending: isUpdating } = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
      api.put("/api/orders/update", { orderId, status }),
    onSuccess: () => refetch(),
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-500/20 text-green-400";
      case "shipped":
        return "bg-blue-500/20 text-blue-400";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

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
              Nexus <span className="text-purple-400">Merchant</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-gray-300 hover:text-white">
                Dashboard
              </Link>
              <Link href="/inventory" className="text-gray-300 hover:text-white">
                Inventory
              </Link>
              <Link href="/orders" className="text-purple-400 font-medium">
                Orders
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Orders Management</h1>

        {/* Orders Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-4">
            <p className="text-gray-400 text-sm">Pending</p>
            <p className="text-2xl font-bold text-yellow-400">
              {data?.filter((o: any) => o.status === "pending").length || 0}
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-4">
            <p className="text-gray-400 text-sm">Shipped</p>
            <p className="text-2xl font-bold text-blue-400">
              {data?.filter((o: any) => o.status === "shipped").length || 0}
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-4">
            <p className="text-gray-400 text-sm">Delivered</p>
            <p className="text-2xl font-bold text-green-400">
              {data?.filter((o: any) => o.status === "delivered").length || 0}
            </p>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {data?.map((order: any) => (
                  <tr key={order._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-white font-mono text-sm">
                        #{order._id.slice(-8)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white">
                          {order.user?.email || "Unknown"}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {order.address?.city || "No address"}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex -space-x-2">
                        {order.items?.slice(0, 3).map((item: any, idx: number) => (
                          <div
                            key={idx}
                            className="w-8 h-8 bg-white/10 rounded-full border-2 border-slate-900 flex items-center justify-center"
                          >
                            <span className="text-xs text-gray-400">{item.quantity}x</span>
                          </div>
                        ))}
                        {order.items?.length > 3 && (
                          <div className="w-8 h-8 bg-white/10 rounded-full border-2 border-slate-900 flex items-center justify-center">
                            <span className="text-xs text-gray-400">+{order.items.length - 3}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white font-semibold">
                        ${order.totalAmount}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateStatus({
                            orderId: order._id,
                            status: e.target.value,
                          })
                        }
                        disabled={isUpdating}
                        className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                      >
                        <option value="pending" className="bg-slate-900">Pending</option>
                        <option value="shipped" className="bg-slate-900">Shipped</option>
                        <option value="delivered" className="bg-slate-900">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data?.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No orders yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}