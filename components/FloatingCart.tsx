"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import QuantityStepper from "./ui/QuantityStepper";
import Button from "./ui/Button";

export const FloatingCart: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, isHydrated, isCartOpen, setCartOpen } = useStore();
  const [mounted, setMounted] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);

  const totalItems = isHydrated ? cart.reduce((acc, item) => acc + item.quantity, 0) : 0;
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close when clicking outside the card
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        // We only close if they didn't click the floating toggle button
        const button = document.getElementById("floating-cart-toggle");
        if (button && !button.contains(event.target as Node)) {
          setCartOpen(false);
        }
      }
    };
    if (isCartOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCartOpen, setCartOpen]);

  if (!mounted || !isHydrated || totalItems === 0) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-4">
      
      {/* ── CART POPUP CARD ── */}
      <AnimatePresence>
      {isCartOpen && (
          <motion.div
            ref={cartRef}
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="w-[340px] sm:w-[380px] bg-white border border-[#A77146]/15 rounded-2xl shadow-[0_10px_35px_rgba(43,29,20,0.12)] overflow-hidden flex flex-col"
          >
            {/* Card Header */}
            <div className="px-5 py-4 border-b border-[#A77146]/10 bg-[#FAF6F0] flex items-center justify-between">
              <span className="font-great-vibes text-2xl text-[#A77146] font-medium leading-none">
                Boutique Selection
              </span>
              <span className="text-[10px] font-sans font-bold text-white/50 bg-[#1A1510] px-2 py-0.5 rounded uppercase tracking-wider">
                {totalItems} {totalItems === 1 ? "Item" : "Items"}
              </span>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 max-h-[220px] overflow-y-auto px-5 py-3 divide-y divide-[#A77146]/10 scrollbar-none">
              {cart.map((item) => (
                <div key={item.id} className="py-3 flex gap-3 first:pt-0 last:pb-0 items-center justify-between">
                  
                  {/* Left: Thumbnail & Details */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="relative w-12 h-12 bg-[#FAF6F0] border border-[#A77146]/10 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-sans font-semibold text-[#1A1510] leading-tight truncate">
                        {item.name}
                      </h4>
                      <p className="text-[11px] font-sans text-white/40 mt-0.5">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Right: Quantity Stepper & Remove */}
                  <div className="flex items-center gap-3">
                    <QuantityStepper
                      value={item.quantity}
                      onChange={(val) => updateQuantity(item.id, val)}
                      className="!border-[#A77146]/20 !bg-transparent h-7"
                    />
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-white/40 hover:text-red-500 transition-colors p-1"
                      title="Remove item"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                </div>
              ))}
            </div>

            {/* Summary & Checkout */}
            <div className="p-5 border-t border-[#A77146]/10 bg-[#FAF6F0] space-y-4">
              <div className="flex justify-between items-baseline text-xs uppercase tracking-widest text-[#1A1510]/60">
                <span>Subtotal</span>
                <span className="font-sans font-bold text-sm text-[#1A1510]">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              <Link href="/order" onClick={() => setCartOpen(false)} className="block">
                <button className="w-full bg-[#1A1510] hover:bg-[#2A1F16] text-[#E9D3BD] hover:text-white font-sans text-xs font-bold uppercase tracking-[0.15em] py-3.5 px-4 rounded-xl shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 group cursor-pointer">
                  Checkout Now
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </button>
              </Link>
              
              <p className="text-center text-[9px] uppercase tracking-widest text-white/30 font-sans">
                Secure Mastery Checkout
              </p>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FLOATING TOGGLE BUTTON ── */}
      <button
        id="floating-cart-toggle"
        onClick={() => setCartOpen(!isCartOpen)}
        className="relative w-14 h-14 bg-[#A77146] hover:bg-[#8B5D39] text-white rounded-full flex items-center justify-center shadow-xl active:scale-95 transition-all duration-300 group cursor-pointer"
        aria-label="Toggle floating cart"
      >
        <AnimatePresence mode="wait">
          {isCartOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 95, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X size={20} />
            </motion.span>
          ) : (
            <motion.span
              key="cart"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <ShoppingBag size={20} />
            </motion.span>
          )}
        </AnimatePresence>

        {/* Counter Badge */}
        {totalItems > 0 && !isCartOpen && (
          <span className="absolute -top-1 -right-1 bg-[#1A1510] border border-[#A77146] text-[#E9D3BD] text-[10px] font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-md animate-fade-in">
            {totalItems}
          </span>
        )}
      </button>

    </div>
  );
};

export default FloatingCart;
