"use client";

import React, { useState, useEffect } from "react";
import { 
  ShoppingBag, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Loader2, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  Gift, 
  RefreshCw,
  Clock
} from "lucide-react";
import Button from "@/components/ui/Button";

interface OrderItem {
  id: string;
  name: string;
  unitPrice: string;
  quantity: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryNotes: string | null;
  isGift: boolean;
  giftMessage: string | null;
  deliveryDate: string;
  deliveryWindow: string;
  subtotal: string;
  deliveryFee: string;
  total: string;
  status: string;
  promoCode: string | null;
  createdAt: string;
  items: OrderItem[];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filtering & Pagination
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Row Expansion
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `/api/admin/orders?status=${statusFilter}&page=${page}&limit=15`;
      const res = await fetch(url);
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to load orders.");
      }

      setOrders(json.data.orders);
      setTotal(json.data.pagination.total);
      setTotalPages(json.data.pagination.totalPages);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while loading orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, page]);

  const toggleExpand = (id: string) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      
      if (!res.ok || !json.success) {
        alert(json.error?.message || "Failed to update order status.");
      } else {
        // Update local state
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      }
    } catch (err) {
      console.error(err);
      alert("Network error updating status.");
    } finally {
      setUpdatingId(null);
    }
  };

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

  const filteredOrders = orders.filter(ord => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      ord.orderNumber.toLowerCase().includes(query) ||
      ord.customerName.toLowerCase().includes(query) ||
      ord.customerEmail.toLowerCase().includes(query) ||
      ord.customerPhone.includes(query)
    );
  });

  return (
    <div className="space-y-6 font-sans">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Order Queue</h2>
          <p className="text-sm text-slate-500">Track and fulfill client dessert orders ({total} total).</p>
        </div>
        <button
          onClick={fetchOrders}
          className="self-start sm:self-auto bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 cursor-pointer transition-colors"
        >
          <RefreshCw size={14} />
          Refresh List
        </button>
      </div>

      {/* ── FILTERS BAR ── */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search by order #, customer name, email, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs pl-9 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A77146] focus:border-[#A77146] transition-colors"
          />
        </div>

        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {["ALL", "PENDING", "CONFIRMED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"].map((status) => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer border
                ${statusFilter === status 
                  ? "bg-slate-900 text-white border-slate-900" 
                  : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-700"
                }
              `}
            >
              {status.replace(/_/g, " ")}
            </button>
          ))}
        </div>

      </div>

      {/* ── ORDERS QUEUE TABLE ── */}
      {loading ? (
        <div className="bg-white border border-slate-200/80 rounded-xl p-12 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 size={28} className="animate-spin text-[#A77146]" />
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest">Loading order queue...</p>
        </div>
      ) : error ? (
        <div className="bg-rose-50 border border-rose-100 text-rose-700 p-5 rounded-xl text-center">
          <p className="text-sm font-semibold">{error}</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-xl p-12 text-center space-y-2">
          <p className="text-sm font-bold text-slate-700">No Orders Found</p>
          <p className="text-xs text-slate-400">No checkout history matches your criteria.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="px-5 py-3">Order Number</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Delivery Date</th>
                  <th className="px-5 py-3">Total Amount</th>
                  <th className="px-5 py-3">Fulfillment Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredOrders.map((ord) => {
                  const isExpanded = expandedOrderId === ord.id;
                  const isUpdating = updatingId === ord.id;

                  return (
                    <React.Fragment key={ord.id}>
                      {/* Base Row */}
                      <tr className={`hover:bg-slate-50/50 transition-colors ${isExpanded ? "bg-slate-50/30" : ""}`}>
                        <td className="px-5 py-4 font-bold text-slate-900">{ord.orderNumber}</td>
                        <td className="px-5 py-4">
                          <div>
                            <p className="font-semibold text-slate-800">{ord.customerName}</p>
                            <p className="text-[10px] text-slate-400 font-normal">{ord.customerEmail}</p>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                            <Calendar size={13} className="text-[#A77146]" />
                            <span>
                              {new Date(ord.deliveryDate).toLocaleDateString(undefined, { 
                                month: "short", 
                                day: "numeric", 
                                year: "numeric",
                                timeZone: "UTC"
                              })}
                            </span>
                            <span className="text-slate-400 font-normal">({ord.deliveryWindow})</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 font-semibold text-slate-800">${Number(ord.total).toFixed(2)}</td>
                        <td className="px-5 py-4">
                          {isUpdating ? (
                            <span className="flex items-center gap-1 text-[10px] text-slate-400">
                              <Loader2 size={12} className="animate-spin text-[#A77146]" />
                              Updating...
                            </span>
                          ) : (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(ord.status)}`}>
                              {ord.status}
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() => toggleExpand(ord.id)}
                            className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 font-semibold px-3 py-1.5 rounded-md inline-flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            Details
                            {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Details Row */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={6} className="bg-slate-50/40 px-6 py-5 border-t border-b border-slate-100">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                              
                              {/* Left: Client and Delivery Details */}
                              <div className="space-y-3 bg-white border border-slate-150 rounded-xl p-4 shadow-sm">
                                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[10px] text-slate-400 border-b border-slate-100 pb-1.5">Delivery Details</h4>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Phone size={13} className="text-[#A77146]" />
                                    <span className="font-semibold">{ord.customerPhone}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Mail size={13} className="text-[#A77146]" />
                                    <span className="text-slate-500">{ord.customerEmail}</span>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <MapPin size={13} className="text-[#A77146] mt-0.5 shrink-0" />
                                    <span className="text-slate-600 leading-normal">{ord.deliveryAddress}</span>
                                  </div>
                                  {ord.deliveryNotes && (
                                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 mt-2 text-[11px] leading-relaxed">
                                      <p className="font-bold text-[9px] uppercase tracking-wide text-slate-400 mb-0.5">Delivery Notes</p>
                                      <p className="text-slate-600">{ord.deliveryNotes}</p>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Center: Order Items list */}
                              <div className="space-y-3 bg-white border border-slate-150 rounded-xl p-4 shadow-sm">
                                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[10px] text-slate-400 border-b border-slate-100 pb-1.5">Items Ordered</h4>
                                <div className="space-y-2.5 max-h-[200px] overflow-y-auto pr-1">
                                  {ord.items.map((item) => (
                                    <div key={item.id} className="flex justify-between items-start border-b border-slate-50 pb-1.5 last:border-0 last:pb-0">
                                      <div>
                                        <p className="font-bold text-slate-800 leading-tight">{item.name}</p>
                                        <p className="text-[10px] text-slate-400 font-normal">Qty: {item.quantity} × ${Number(item.unitPrice).toFixed(2)}</p>
                                      </div>
                                      <span className="font-bold text-slate-700">${(Number(item.unitPrice) * item.quantity).toFixed(2)}</span>
                                    </div>
                                  ))}
                                </div>

                                {/* Cost Breakdown */}
                                <div className="border-t border-slate-100 pt-2 text-[11px] space-y-1.5 font-normal text-slate-500">
                                  <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="font-semibold text-slate-700">${Number(ord.subtotal).toFixed(2)}</span>
                                  </div>
                                  {ord.promoCode && (
                                    <div className="flex justify-between text-gold">
                                      <span>Promo Code ({ord.promoCode})</span>
                                      <span className="font-semibold">-10%</span>
                                    </div>
                                  )}
                                  <div className="flex justify-between">
                                    <span>Delivery Fee</span>
                                    <span className="font-semibold text-slate-700">${Number(ord.deliveryFee).toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between text-xs font-bold text-slate-900 border-t border-slate-50 pt-1.5">
                                    <span>Total</span>
                                    <span>${Number(ord.total).toFixed(2)}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Right: Actions & Gift Settings */}
                              <div className="space-y-4 bg-white border border-slate-150 rounded-xl p-4 shadow-sm flex flex-col justify-between">
                                <div className="space-y-3">
                                  <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[10px] text-slate-400 border-b border-slate-100 pb-1.5">Fulfillment Actions</h4>
                                  
                                  {/* Status Selector Dropdown */}
                                  <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Update Status</label>
                                    <div className="relative">
                                      <select
                                        value={ord.status}
                                        disabled={isUpdating}
                                        onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs px-3 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A77146] focus:border-[#A77146] appearance-none cursor-pointer"
                                      >
                                        <option value="PENDING">PENDING</option>
                                        <option value="CONFIRMED">CONFIRMED</option>
                                        <option value="PREPARING">PREPARING</option>
                                        <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                                        <option value="DELIVERED">DELIVERED</option>
                                        <option value="CANCELLED">CANCELLED</option>
                                      </select>
                                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                    </div>
                                  </div>
                                </div>

                                {/* Gift Options */}
                                {ord.isGift && (
                                  <div className="bg-pink-50/40 border border-pink-100 p-3 rounded-lg flex gap-2 items-start mt-2">
                                    <Gift size={15} className="text-[#A77146] shrink-0 mt-0.5" />
                                    <div className="leading-relaxed">
                                      <p className="font-bold text-[9px] uppercase tracking-wide text-[#A77146] mb-0.5">Gift Message</p>
                                      <p className="text-slate-600 text-[10px] italic">"{ord.giftMessage}"</p>
                                    </div>
                                  </div>
                                )}

                              </div>

                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="bg-slate-50 border-t border-slate-100 px-5 py-3 flex items-center justify-between">
              <span className="text-slate-500 font-semibold text-xs">
                Page {page} of {totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="!py-2 !px-4 text-[11px] font-semibold uppercase tracking-wider"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                  className="!py-2 !px-4 text-[11px] font-semibold uppercase tracking-wider"
                >
                  Next
                </Button>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
