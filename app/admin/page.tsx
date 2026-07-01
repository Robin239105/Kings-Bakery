"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  TrendingUp, 
  ShoppingBag, 
  Clock, 
  AlertTriangle, 
  Loader2, 
  ArrowRight,
  RefreshCw
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

interface Stats {
  todayOrders: number;
  weekOrders: number;
  pendingOrders: number;
  monthlyRevenue: number;
}

interface LowStockItem {
  id: string;
  name: string;
  stockStatus: string;
  price: string;
}

interface TopProduct {
  name: string;
  sales: number;
}

interface OrderTrend {
  date: string;
  orders: number;
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  total: string;
  status: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [lowStock, setLowStock] = useState<LowStockItem[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [ordersOverTime, setOrdersOverTime] = useState<OrderTrend[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch main stats
      const statsRes = await fetch("/api/admin/dashboard-stats");
      const statsJson = await statsRes.json();

      if (!statsRes.ok || !statsJson.success) {
        throw new Error(statsJson.error?.message || "Failed to load dashboard statistics.");
      }

      const data = statsJson.data;
      setStats(data.stats);
      setLowStock(data.lowStock);
      setTopProducts(data.topProducts);
      setOrdersOverTime(data.ordersOverTime);

      // 2. Fetch recent orders
      const ordersRes = await fetch("/api/admin/orders?limit=5");
      const ordersJson = await ordersRes.json();
      if (ordersRes.ok && ordersJson.success) {
        setRecentOrders(ordersJson.data.orders);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while fetching dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 size={36} className="animate-spin text-[#A77146]" />
        <p className="text-sm text-slate-500 font-medium">Assembling dashboard statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl space-y-4 max-w-xl mx-auto">
        <h2 className="text-lg font-bold">Failed to Load Dashboard</h2>
        <p className="text-sm">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 cursor-pointer transition-colors"
        >
          <RefreshCw size={14} />
          Retry Connection
        </button>
      </div>
    );
  }

  const statCards = [
    {
      title: "Today's Orders",
      value: stats?.todayOrders ?? 0,
      subtext: `Total this week: ${stats?.weekOrders ?? 0}`,
      icon: ShoppingBag,
      color: "text-blue-600 bg-blue-50 border-blue-100",
    },
    {
      title: "Revenue This Month",
      value: `$${(stats?.monthlyRevenue ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtext: "Gross total (excl. cancelled)",
      icon: TrendingUp,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
    {
      title: "Pending Orders Queue",
      value: stats?.pendingOrders ?? 0,
      subtext: "Needs preparation",
      icon: Clock,
      color: "text-amber-600 bg-amber-50 border-amber-100",
    },
    {
      title: "Alert Actions Required",
      value: lowStock.length,
      subtext: "Low stock / Out of stock",
      icon: AlertTriangle,
      color: lowStock.length > 0 ? "text-rose-600 bg-rose-50 border-rose-100" : "text-slate-600 bg-slate-50 border-slate-100",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "PENDING":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "PREPARING":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "OUT_FOR_DELIVERY":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "CONFIRMED":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-rose-50 text-rose-700 border-rose-200";
    }
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h2>
          <p className="text-sm text-slate-500">Real-time store metrics and checkout performance logs.</p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="self-start sm:self-auto bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 cursor-pointer transition-colors"
        >
          <RefreshCw size={14} />
          Refresh Stats
        </button>
      </div>

      {/* ── STATS CARDS GRID ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{card.title}</p>
                <h3 className="text-2xl font-bold text-slate-900">{card.value}</h3>
                <p className="text-[11px] text-slate-500 font-medium">{card.subtext}</p>
              </div>
              <div className={`p-3 rounded-lg border ${card.color}`}>
                <Icon size={20} />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── CHARTS & SALES GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Orders Over Time Chart */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm lg:col-span-2 space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Weekly Booking Load</h3>
            <p className="text-xs text-slate-500">Total orders received per day over the last 7 days.</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ordersOverTime} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#A77146"
                  strokeWidth={2.5}
                  activeDot={{ r: 6 }}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Top Selling Items</h3>
            <p className="text-xs text-slate-500">Products with the highest unit volume sold.</p>
          </div>
          <div className="space-y-4">
            {topProducts.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No sales records available yet.</p>
            ) : (
              topProducts.map((prod, index) => (
                <div key={prod.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                      {index + 1}
                    </span>
                    <span className="text-xs font-semibold text-slate-800 leading-tight line-clamp-1">{prod.name}</span>
                  </div>
                  <span className="text-xs text-slate-500 font-bold bg-slate-50 px-2 py-0.5 rounded border border-slate-100 shrink-0">
                    {prod.sales} sold
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* ── RECENT ORDERS & WARNINGS GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Orders Table */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Recent Orders</h3>
              <p className="text-xs text-slate-500">The 5 most recent checkout records in the queue.</p>
            </div>
            <Link href="/admin/orders" className="text-xs text-[#A77146] hover:text-[#8B5D39] font-bold flex items-center gap-1 group">
              Manage Queue
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-2.5">Order</th>
                  <th className="py-2.5">Customer</th>
                  <th className="py-2.5">Total</th>
                  <th className="py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-medium">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-400">No checkout history found.</td>
                  </tr>
                ) : (
                  recentOrders.map((ord) => (
                    <tr key={ord.id} className="text-slate-700">
                      <td className="py-3 font-semibold text-slate-900">{ord.orderNumber}</td>
                      <td className="py-3">{ord.customerName}</td>
                      <td className="py-3">${Number(ord.total).toFixed(2)}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(ord.status)}`}>
                          {ord.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Stock Level Alerts</h3>
            <p className="text-xs text-slate-500">Items requiring immediate ingredient replenishment.</p>
          </div>
          <div className="space-y-3">
            {lowStock.length === 0 ? (
              <div className="bg-slate-50 border border-slate-150 p-4 rounded-lg text-center">
                <p className="text-xs text-slate-500 font-semibold">✅ All items fully in stock</p>
              </div>
            ) : (
              lowStock.map((item) => (
                <div key={item.id} className="p-3 bg-rose-50/40 border border-rose-100 rounded-lg flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-800 line-clamp-1">{item.name}</h4>
                    <p className="text-[10px] text-slate-400 font-medium">Price: ${Number(item.price).toFixed(2)}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border shrink-0
                    ${item.stockStatus === "OUT_OF_STOCK" 
                      ? "bg-red-50 text-red-700 border-red-200" 
                      : "bg-amber-50 text-amber-700 border-amber-200"
                    }
                  `}>
                    {item.stockStatus.replace("_", " ")}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
