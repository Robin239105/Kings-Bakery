"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { ChevronRight, Calendar as CalendarIcon, Clock, MapPin, Gift, AlertCircle, ShoppingBag } from "lucide-react";
import { useStore } from "@/lib/store";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DeliveryCalendar from "@/components/DeliveryCalendar";
import SectionHeading from "@/components/SectionHeading";
import Button from "@/components/ui/Button";
import PageTransition from "@/components/PageTransition";
import { motion } from "framer-motion";

const deliverySchema = zod.object({
  name: zod.string().min(2, "Name must be at least 2 characters"),
  phone: zod.string().min(10, "Phone number must be at least 10 digits"),
  address: zod.string().min(10, "Please enter your full delivery address in New York"),
  notes: zod.string().optional(),
  isGift: zod.boolean(),
  giftMessage: zod.string().optional(),
});

type DeliveryFormData = zod.infer<typeof deliverySchema>;

export default function OrderPage() {
  const router = useRouter();
  const { cart, discountPercent, setDeliveryDetails, isHydrated } = useStore();

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [dateError, setDateError] = useState("");
  const [mounted, setMounted] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<DeliveryFormData>({
    resolver: zodResolver(deliverySchema),
    defaultValues: {
      isGift: false,
    },
  });

  const isGiftChecked = watch("isGift");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isHydrated) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-bg-cream">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-serif italic text-text-muted">Loading order details...</p>
        </div>
      </div>
    );
  }

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = subtotal * (discountPercent / 100);
  const deliveryFee = subtotal >= 75 || subtotal === 0 ? 0 : 8.00;
  const total = subtotal - discountAmount + deliveryFee;

  const onSubmit = (data: DeliveryFormData) => {
    setDateError("");

    if (!selectedDate) {
      setDateError("Please select a delivery date from the calendar.");
      return;
    }
    if (!selectedTimeSlot) {
      setDateError("Please select a delivery time window.");
      return;
    }

    // Save details to store
    setDeliveryDetails({
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      name: data.name,
      phone: data.phone,
      address: data.address,
      notes: data.notes,
      isGift: data.isGift,
      giftMessage: data.isGift ? data.giftMessage : undefined,
    });

    // Navigate to checkout
    router.push("/checkout");
  };

  return (
    <PageTransition>
      <Navbar />

      <main className="flex-grow pt-28 pb-24">
        {/* Breadcrumb */}
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-2 text-xs uppercase tracking-widest text-text-muted font-sans border-b border-gold/10">
          <Link href="/" className="hover:text-gold transition-colors">Home</Link>
          <ChevronRight size={12} />
          <span className="text-text-dark font-medium">Delivery Details</span>
        </nav>

        {cart.length === 0 ? (
          <section className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-gold-light/20 flex items-center justify-center text-gold mx-auto">
              <ShoppingBag size={28} />
            </div>
            <h2 className="text-serif text-2xl font-bold">Your cart is currently empty</h2>
            <p className="text-sm text-text-muted font-light max-w-sm mx-auto">
              You must add pastries or tasting boxes to your collection before proceeding to the checkout calendar.
            </p>
            <Link href="/shop">
              <Button variant="primary">Shop Collection</Button>
            </Link>
          </section>
        ) : (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              
              {/* Left Column: Form & Calendar (Col 7) */}
              <div className="lg:col-span-7 space-y-8">
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-gold">Step 1 of 2</span>
                  <h1 className="text-serif text-3xl font-bold tracking-tight text-text-dark">
                    Delivery Schedule & Address
                  </h1>
                </div>

                {/* 1. Interactive Calendar widget */}
                <div className="space-y-4">
                  <h2 className="text-serif text-lg font-bold text-text-dark pb-2 border-b border-gold/10">
                    1. Choose Delivery Time
                  </h2>
                  <DeliveryCalendar
                    selectedDate={selectedDate}
                    selectedTimeSlot={selectedTimeSlot}
                    onSelectDate={(date) => {
                      setSelectedDate(date);
                      setDateError("");
                    }}
                    onSelectTimeSlot={(slot) => {
                      setSelectedTimeSlot(slot);
                      setDateError("");
                    }}
                  />
                  {dateError && (
                    <div className="bg-berry-accent/5 border border-berry-accent/20 p-4 rounded-[4px] flex items-center gap-3 text-berry-accent text-xs">
                      <AlertCircle size={16} />
                      <span>{dateError}</span>
                    </div>
                  )}
                </div>

                {/* 2. Address & Notes */}
                <div className="space-y-6">
                  <h2 className="text-serif text-lg font-bold text-text-dark pb-2 border-b border-gold/10">
                    2. Recipient Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                        Recipient Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        className="w-full bg-white border border-gold-light/45 rounded-[4px] px-4 py-3 text-sm focus:outline-none focus:border-gold"
                        {...register("name")}
                      />
                      {errors.name && (
                        <p className="text-xs text-berry-accent">{errors.name.message}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                        Contact Phone
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        placeholder="+1 (212) 555-0199"
                        className="w-full bg-white border border-gold-light/45 rounded-[4px] px-4 py-3 text-sm focus:outline-none focus:border-gold"
                        {...register("phone")}
                      />
                      {errors.phone && (
                        <p className="text-xs text-berry-accent">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="address" className="text-xs font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1">
                      <MapPin size={12} className="text-gold" /> Delivery Address
                    </label>
                    <textarea
                      id="address"
                      rows={3}
                      placeholder="Street address, apartment/floor, Manhattan area (e.g. Upper East Side, Soho, Chelsea)"
                      className="w-full bg-white border border-gold-light/45 rounded-[4px] px-4 py-3 text-sm focus:outline-none focus:border-gold resize-none"
                      {...register("address")}
                    />
                    {errors.address && (
                      <p className="text-xs text-berry-accent">{errors.address.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="notes" className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                      Delivery Instructions (Optional)
                    </label>
                    <input
                      id="notes"
                      type="text"
                      placeholder="e.g. Leave with gate keeper, call upon arrival"
                      className="w-full bg-white border border-gold-light/45 rounded-[4px] px-4 py-3 text-sm focus:outline-none focus:border-gold"
                      {...register("notes")}
                    />
                  </div>
                </div>

                {/* 3. Gift Selection */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-3 p-4 bg-white border border-gold-light/25 rounded-[8px] shadow-sm">
                    <input
                      id="isGift"
                      type="checkbox"
                      className="rounded border-gold-light text-gold focus:ring-gold accent-gold h-4 w-4 cursor-pointer"
                      {...register("isGift")}
                    />
                    <label htmlFor="isGift" className="text-sm text-text-dark font-medium flex items-center gap-2 cursor-pointer select-none">
                      <Gift size={16} className="text-gold" />
                      This is a gift order
                    </label>
                  </div>

                  {isGiftChecked && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-1.5 p-4 bg-white border border-gold-light/25 rounded-[8px] shadow-sm"
                    >
                      <label htmlFor="giftMessage" className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                        Gift Card Inscription Message
                      </label>
                      <textarea
                        id="giftMessage"
                        rows={3}
                        placeholder="Write a message to be hand-written on our gold-foiled card..."
                        className="w-full bg-white border border-gold-light/45 rounded-[4px] px-4 py-3 text-sm focus:outline-none focus:border-gold resize-none"
                        {...register("giftMessage")}
                      />
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Right Column: Order Summary Sidebar (Col 5) */}
              <div className="lg:col-span-5 bg-white border border-gold-light/25 p-6 rounded-[8px] shadow-sm sticky top-24 space-y-6">
                <h3 className="text-serif font-bold text-lg text-text-dark pb-3 border-b border-gold/15">
                  Order Summary
                </h3>

                {/* Cart Items list */}
                <div className="max-h-[220px] overflow-y-auto divide-y divide-gold/5 pr-1">
                  {cart.map((item) => (
                    <div key={item.id} className="py-3 flex justify-between gap-4 text-xs">
                      <div>
                        <span className="font-semibold text-text-dark block leading-tight">
                          {item.name}
                        </span>
                        {item.customizedOptions && (
                          <span className="text-[10px] text-text-muted block mt-0.5">
                            Custom Selection
                          </span>
                        )}
                        <span className="text-text-muted block mt-0.5">
                          ${item.price.toFixed(2)} x {item.quantity}
                        </span>
                      </div>
                      <span className="font-semibold text-text-dark font-sans">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Subtotals & totals */}
                <div className="border-t border-gold/15 pt-4 space-y-2">
                  <div className="flex justify-between text-xs text-text-muted">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {discountPercent > 0 && (
                    <div className="flex justify-between text-xs text-berry-accent font-semibold">
                      <span>Promo Discount ({discountPercent}%)</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs text-text-muted">
                    <span>Delivery Fee</span>
                    <span>
                      {deliveryFee === 0 ? (
                        <span className="text-gold uppercase tracking-wider font-semibold">Free</span>
                      ) : (
                        `$${deliveryFee.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  
                  {/* Delivery summary tags */}
                  {selectedDate && (
                    <div className="bg-bg-cream/45 p-3 rounded-[4px] border border-gold-light/20 text-[11px] text-text-muted space-y-1">
                      <div className="flex items-center gap-1.5">
                        <CalendarIcon size={12} className="text-gold" />
                        <span>Date: {selectedDate}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} className="text-gold" />
                        <span className="line-clamp-1">{selectedTimeSlot}</span>
                      </div>
                    </div>
                  )}

                  <div className="border-t border-gold/15 pt-3 flex justify-between text-base">
                    <span className="text-serif font-bold text-text-dark">Total</span>
                    <span className="font-sans font-bold text-text-dark">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Proceed Button */}
                <Button type="submit" variant="primary" className="w-full py-4 flex items-center justify-center gap-2">
                  Continue to Checkout
                </Button>
                
                <p className="text-[10px] text-text-muted leading-relaxed text-center font-light">
                  Orders are packaged in premium climate boxes to preserve cold integrity during shipping.
                </p>
              </div>

            </form>
          </section>
        )}
      </main>

      <Footer />
    </PageTransition>
  );
}
