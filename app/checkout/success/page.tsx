"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle, Truck, ShoppingBag, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/ui/Button";
import PageTransition from "@/components/PageTransition";
import { motion } from "framer-motion";

export default function CheckoutSuccessPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Generate a random order number
    const randNum = Math.floor(100000 + Math.random() * 900000);
    setOrderNumber(`KB-${randNum}`);
  }, []);

  if (!mounted) return null;

  return (
    <PageTransition>
      <Navbar />

      <main className="flex-grow flex items-center justify-center pt-28 pb-20">
        <section className="max-w-xl mx-auto px-4 py-16 text-center space-y-8 bg-white border border-gold-light/25 p-8 rounded-[12px] shadow-sm">
          
          {/* Celebratory Icon */}
          <div className="relative flex justify-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-20 h-20 bg-gold-light/20 rounded-full flex items-center justify-center text-gold border border-gold/30"
            >
              <CheckCircle size={44} className="stroke-[1.5]" />
            </motion.div>
            
            {/* Soft decorative bursts */}
            <div className="absolute top-0 w-2 h-2 bg-gold rounded-full animate-ping delay-75" />
            <div className="absolute bottom-0 w-2.5 h-2.5 bg-gold-light rounded-full animate-ping delay-300" />
          </div>

          <div className="space-y-3">
            <span className="text-xs uppercase tracking-[0.2em] text-gold font-semibold">
              Order Confirmed
            </span>
            <h1 className="font-sans text-3xl font-bold tracking-tight text-text-dark">
              Your Order is Worthy of a Crown
            </h1>
            <p className="text-sm font-light text-text-muted leading-relaxed max-w-sm mx-auto">
              Thank you for choosing KingsBakery. Our chefs have received your baking order card and are initiating the preparation timeline.
            </p>
          </div>

          {/* Order Details box */}
          <div className="bg-bg-cream/45 p-6 rounded-[8px] border border-gold-light/20 text-xs text-text-muted font-sans space-y-3 max-w-sm mx-auto text-left">
            <div className="flex justify-between pb-2 border-b border-gold/5">
              <span className="font-semibold text-text-dark">Order Code</span>
              <span className="font-bold text-gold font-sans">{orderNumber}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-gold/5">
              <span className="font-semibold text-text-dark">Status</span>
              <span className="text-gold font-semibold uppercase tracking-wider">Preparing</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-text-dark">Delivery Schedule</span>
              <span className="font-medium text-text-dark">Fresh Daily Shifted</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-sm mx-auto pt-4">
            <Link href="/shop" className="w-full">
              <Button variant="primary" className="w-full flex items-center justify-center gap-2">
                <ShoppingBag size={15} />
                Continue Shopping
              </Button>
            </Link>
            
            <button
              onClick={() => alert("Order tracking maps are simulated. Your desserts will arrive fresh!")}
              className="w-full border border-gold-light/40 hover:border-gold hover:bg-gold-light/10 text-gold text-xs font-semibold uppercase tracking-wider py-4 px-6 rounded-[4px] flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Truck size={15} />
              Track Delivery
            </button>
          </div>

        </section>
      </main>

      <Footer />
    </PageTransition>
  );
}
