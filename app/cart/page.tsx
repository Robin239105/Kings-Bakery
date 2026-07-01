"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuantityStepper from "@/components/ui/QuantityStepper";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/SectionHeading";
import PageTransition from "@/components/PageTransition";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, isHydrated } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isHydrated) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-bg-cream">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-serif italic text-text-muted">Loading cart details...</p>
        </div>
      </div>
    );
  }

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const FREE_DELIVERY_THRESHOLD = 75;
  const progressPercent = Math.min((subtotal / FREE_DELIVERY_THRESHOLD) * 100, 100);
  const neededForFree = Math.max(FREE_DELIVERY_THRESHOLD - subtotal, 0);
  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0 ? 0 : 8.00;
  const total = subtotal + deliveryFee;

  return (
    <PageTransition>
      <Navbar />

      <main className="flex-grow pt-28 pb-24">
        {/* Breadcrumb */}
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-2 text-xs uppercase tracking-widest text-text-muted font-sans border-b border-gold/10">
          <Link href="/" className="hover:text-gold transition-colors">Home</Link>
          <ChevronRight size={12} />
          <span className="text-text-dark font-medium">Cart</span>
        </nav>

        {/* Content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <div className="text-center md:text-left mb-10">
            <SectionHeading
              label="Your Collection"
              title="Review Selected Creations"
              align="left"
              className="mb-0 md:mx-0"
            />
          </div>

          {cart.length === 0 ? (
            <div className="bg-white border border-gold-light/25 rounded-[8px] py-20 text-center max-w-2xl mx-auto space-y-6">
              <div className="w-16 h-16 rounded-full bg-gold-light/20 flex items-center justify-center text-gold mx-auto">
                <ShoppingBag size={28} />
              </div>
              <h3 className="text-serif text-xl font-bold">Your cart is empty</h3>
              <p className="text-sm text-text-muted max-w-xs mx-auto font-light">
                Add our signature desserts or exclusive tasting boxes to begin your luxury tasting experience.
              </p>
              <Link href="/shop">
                <Button variant="primary">Browse Collection</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              
              {/* Left Panel: Table of items (Col 8) */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Free Delivery Banner */}
                <div className="bg-white p-5 border border-gold-light/25 rounded-[8px] shadow-sm space-y-3">
                  <div className="flex justify-between items-center text-xs tracking-wider">
                    <span className="font-light text-text-muted">
                      {neededForFree > 0
                        ? `Add $${neededForFree.toFixed(2)} more for free delivery`
                        : "You've unlocked free climate-controlled delivery!"}
                    </span>
                    <span className="font-bold text-gold font-sans">{progressPercent.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gold-light/10 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gold h-full transition-all duration-500 ease-out"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Items List */}
                <div className="bg-white border border-gold-light/25 rounded-[8px] overflow-hidden shadow-sm divide-y divide-gold/10">
                  {cart.map((item) => (
                    <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                      
                      {/* Image */}
                      <div className="relative w-24 h-24 bg-bg-cream rounded-[6px] overflow-hidden flex-shrink-0 border border-gold-light/20">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>

                      {/* Info & Customizations */}
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-start">
                          <Link href={`/shop/${item.productId}`}>
                            <h4 className="text-serif font-bold text-lg text-text-dark hover:text-gold transition-colors">
                              {item.name}
                            </h4>
                          </Link>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-text-muted hover:text-berry-accent p-1 transition-colors cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        {/* Customized tasting box items */}
                        {item.customizedOptions && (
                          <div className="bg-bg-cream/45 p-2 rounded border border-gold-light/15 text-[10px] text-text-muted space-y-0.5 max-w-md">
                            {Object.entries(item.customizedOptions).map(([orig, replacement]) => (
                              <div key={orig}>
                                <span className="italic">{orig}</span> →{" "}
                                <span className="text-gold font-medium">{replacement}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <p className="text-xs text-text-muted font-light">
                          {item.isTastingBox ? "Tasting Box Assortment" : "Individual Dessert"}
                        </p>
                      </div>

                      {/* Stepper & Price */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 pt-4 sm:pt-0 border-t sm:border-t-0 border-gold/10">
                        <QuantityStepper
                          value={item.quantity}
                          onChange={(val) => updateQuantity(item.id, val)}
                        />
                        <span className="font-sans font-bold text-base text-text-dark">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

              {/* Right Panel: Order Summary (Col 4) */}
              <div className="lg:col-span-4 bg-white border border-gold-light/25 p-6 rounded-[8px] shadow-sm space-y-6">
                <h3 className="text-serif font-bold text-lg text-text-dark pb-3 border-b border-gold/15">
                  Order Summary
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-text-muted font-light">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-text-muted font-light">
                    <span>Delivery Fee</span>
                    <span>
                      {deliveryFee === 0 ? (
                        <span className="text-gold uppercase tracking-wider font-semibold">Free</span>
                      ) : (
                        `$${deliveryFee.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="border-t border-gold/15 pt-3 flex justify-between text-base">
                    <span className="text-serif font-bold text-text-dark">Total</span>
                    <span className="font-sans font-bold text-text-dark">${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link href="/order">
                    <Button variant="primary" className="w-full py-4 flex items-center justify-center gap-2">
                      Proceed to Order Details
                      <ArrowRight size={16} />
                    </Button>
                  </Link>
                </div>

                <p className="text-[10px] text-text-muted leading-relaxed text-center font-light">
                  Orders are prepared freshly under temperature-controlled guidelines. All bakes are final.
                </p>
              </div>

            </div>
          )}
        </section>
      </main>

      <Footer />
    </PageTransition>
  );
}
