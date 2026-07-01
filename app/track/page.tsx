"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ChevronRight, 
  Search, 
  Loader2, 
  Calendar, 
  Clock, 
  MapPin, 
  ShoppingBag, 
  Gift,
  CheckCircle,
  Truck,
  Flame,
  ThumbsUp,
  AlertTriangle
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
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

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;

    setLoading(true);
    setError(null);
    setHasSearched(true);
    setOrder(null);

    try {
      const res = await fetch(`/api/orders/${orderNumber.trim().toUpperCase()}`);
      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.error?.message || "Order number not found. Please verify and try again.");
      } else {
        setOrder(json.data);
      }
    } catch (err) {
      console.error(err);
      setError("A network error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status: string) => {
    switch (status) {
      case "PENDING": return 1;
      case "CONFIRMED": return 2;
      case "PREPARING": return 3;
      case "OUT_FOR_DELIVERY": return 4;
      case "DELIVERED": return 5;
      default: return 1;
    }
  };

  const timelineSteps = [
    { step: 1, label: "Order Placed", desc: "We have received your dessert booking.", icon: CheckCircle },
    { step: 2, label: "Confirmed", desc: "Your delivery date slot has been locked.", icon: ThumbsUp },
    { step: 3, label: "In the Kitchen", desc: "Baking fresh to order using premium ingredients.", icon: Flame },
    { step: 4, label: "Out for Delivery", desc: "In climate-controlled transit with our courier.", icon: Truck },
    { step: 5, label: "Delivered", desc: "Hand-delivered at your doorstep. Enjoy!", icon: CheckCircle },
  ];

  const currentStep = order ? getStatusStep(order.status) : 1;

  return (
    <PageTransition>
      <Navbar />

      <main className="flex-grow pt-28 pb-24 font-sans bg-slate-50">
        
        {/* Breadcrumb */}
        <nav className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-2 text-xs uppercase tracking-widest text-text-muted border-b border-gold/10">
          <Link href="/" className="hover:text-gold transition-colors">Home</Link>
          <ChevronRight size={12} />
          <span className="text-text-dark font-medium">Track Order</span>
        </nav>

        <section className="max-w-4xl mx-auto px-4 pt-10 space-y-8">
          
          {/* Tracking Search Input Card */}
          <div className="bg-white border border-gold-light/20 rounded-2xl p-6 md:p-8 shadow-sm space-y-6 text-center max-w-xl mx-auto">
            <div>
              <h1 className="text-serif text-2xl md:text-3xl font-bold text-text-dark uppercase tracking-wide">
                Track Your Desserts
              </h1>
              <p className="text-xs text-text-muted mt-2 max-w-md mx-auto leading-relaxed">
                Enter your order number (found on your checkout confirmation screen or email, e.g., <span className="font-bold text-[#A77146]">KB-123456</span>) to view delivery status.
              </p>
            </div>

            <form onSubmit={handleTrack} className="flex gap-2 max-w-md mx-auto">
              <div className="relative flex-grow">
                <input
                  type="text"
                  required
                  placeholder="KB-XXXXXX"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-gold-light/45 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-gold uppercase tracking-wider font-semibold text-text-dark placeholder-slate-400"
                />
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
              <Button
                type="submit"
                disabled={loading}
                variant="primary"
                className="!py-3 !rounded-lg active:scale-98 transition-transform font-bold text-xs uppercase tracking-wider px-5 cursor-pointer shrink-0"
              >
                {loading ? <Loader2 size={16} className="animate-spin text-white" /> : "Track"}
              </Button>
            </form>
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="py-12 text-center flex flex-col items-center justify-center gap-3">
              <Loader2 size={32} className="animate-spin text-[#A77146]" />
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest">Searching records...</p>
            </div>
          )}

          {/* Error Display */}
          {error && !loading && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-5 rounded-xl max-w-xl mx-auto flex items-start gap-3">
              <AlertTriangle size={18} className="text-rose-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-bold text-sm">Fulfillment Record Not Found</h4>
                <p className="text-xs text-rose-700 leading-normal">{error}</p>
              </div>
            </div>
          )}

          {/* Order Details and Tracking Status */}
          {order && !loading && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Timeline Progress */}
              <div className="lg:col-span-2 bg-white border border-gold-light/20 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
                <div>
                  <h3 className="font-bold text-text-dark uppercase tracking-wider text-sm border-b border-slate-100 pb-2.5">
                    Delivery Journey
                  </h3>
                </div>

                {order.status === "CANCELLED" ? (
                  <div className="bg-rose-50 border border-rose-100 text-rose-800 p-5 rounded-xl text-center space-y-2">
                    <p className="font-bold text-sm">🔴 Order Cancelled</p>
                    <p className="text-xs text-rose-700">This dessert reservation was cancelled. Please contact our support line for assistance.</p>
                  </div>
                ) : (
                  <div className="relative pl-8 space-y-8 before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                    {timelineSteps.map((step) => {
                      const isActive = step.step <= currentStep;
                      const isCurrent = step.step === currentStep;
                      const StepIcon = step.icon;

                      return (
                        <div key={step.step} className="relative flex gap-4">
                          
                          {/* Dot / Icon */}
                          <div className={`
                            absolute -left-8.5 top-0 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300
                            ${isCurrent 
                              ? "bg-[#A77146] border-[#A77146] text-white shadow-md shadow-[#A77146]/20 scale-110" 
                              : isActive 
                              ? "bg-slate-900 border-slate-900 text-white" 
                              : "bg-white border-slate-200 text-slate-300"
                            }
                          `}>
                            <StepIcon size={14} className={isCurrent ? "animate-pulse" : ""} />
                          </div>

                          {/* Content */}
                          <div className="space-y-1">
                            <h4 className={`text-xs font-bold uppercase tracking-wider
                              ${isCurrent ? "text-[#A77146]" : isActive ? "text-slate-900" : "text-slate-400"}
                            `}>
                              {step.label}
                            </h4>
                            <p className="text-[11px] text-slate-500 leading-normal">{step.desc}</p>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Right Column: Invoice Details summary */}
              <div className="bg-white border border-gold-light/20 rounded-2xl p-6 shadow-sm space-y-6 self-start">
                
                {/* Header Info */}
                <div className="border-b border-slate-100 pb-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dessert Booking</p>
                  <h4 className="font-bold text-text-dark text-lg mt-0.5">{order.orderNumber}</h4>
                  <span className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase border
                    ${order.status === "DELIVERED"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : order.status === "CANCELLED"
                      ? "bg-rose-50 text-rose-700 border-rose-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                    }
                  `}>
                    {order.status.replace(/_/g, " ")}
                  </span>
                </div>

                {/* Delivery details */}
                <div className="space-y-3.5 text-xs text-slate-600">
                  
                  <div className="flex gap-2.5 items-start">
                    <Calendar size={14} className="text-[#A77146] mt-0.5 shrink-0" />
                    <div>
                      <p className="font-bold text-[9px] uppercase tracking-wide text-slate-400">Delivery Date</p>
                      <p className="font-semibold text-slate-800">
                        {new Date(order.deliveryDate).toLocaleDateString(undefined, {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          timeZone: "UTC"
                        })}
                      </p>
                      <p className="text-[10px] text-slate-500 font-normal">Slot: {order.deliveryWindow}</p>
                    </div>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    <MapPin size={14} className="text-[#A77146] mt-0.5 shrink-0" />
                    <div>
                      <p className="font-bold text-[9px] uppercase tracking-wide text-slate-400">Delivery Address</p>
                      <p className="font-semibold text-slate-800 leading-normal">{order.deliveryAddress}</p>
                    </div>
                  </div>

                  {order.giftMessage && (
                    <div className="bg-pink-50/40 border border-pink-100/50 p-3 rounded-lg flex gap-2 items-start mt-2">
                      <Gift size={14} className="text-[#A77146] shrink-0 mt-0.5" />
                      <div className="leading-relaxed">
                        <p className="font-bold text-[9px] uppercase tracking-wide text-[#A77146] mb-0.5">Gift Message</p>
                        <p className="text-slate-600 text-[10px] italic">"{order.giftMessage}"</p>
                      </div>
                    </div>
                  )}

                </div>

                {/* Items Bought */}
                <div className="border-t border-slate-100 pt-4 space-y-3">
                  <h5 className="font-bold text-slate-800 uppercase tracking-wider text-[10px] text-slate-400">Items summary</h5>
                  <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-baseline text-xs">
                        <span className="font-semibold text-slate-800 line-clamp-1">{item.name} <span className="font-normal text-slate-400">× {item.quantity}</span></span>
                        <span className="font-bold text-slate-700 shrink-0">${(Number(item.unitPrice) * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="border-t border-slate-100 pt-4 text-[11px] space-y-2 text-slate-500 font-normal">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-700">${Number(order.subtotal).toFixed(2)}</span>
                  </div>
                  {order.promoCode && (
                    <div className="flex justify-between text-[#A77146]">
                      <span>Discount (Promo {order.promoCode})</span>
                      <span className="font-semibold">-10%</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className="font-semibold text-slate-700">${Number(order.deliveryFee).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-slate-900 border-t border-slate-100 pt-2">
                    <span>Total Amount</span>
                    <span>${Number(order.total).toFixed(2)}</span>
                  </div>
                </div>

              </div>

            </div>
          )}

        </section>
      </main>

      <Footer />
    </PageTransition>
  );
}
