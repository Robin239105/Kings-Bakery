"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { ChevronRight, CreditCard, Lock, Calendar, MapPin, Tag, Check, AlertCircle } from "lucide-react";
import { useStore } from "@/lib/store";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeading from "@/components/SectionHeading";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import PageTransition from "@/components/PageTransition";

const paymentSchema = zod.object({
  cardholderName: zod.string().min(4, "Please enter the full name on card"),
  cardNumber: zod.string().min(19, "Card number must be 16 digits"),
  expiryDate: zod.string().min(5, "Expiry date must be MM/YY"),
  cvc: zod.string().min(3, "CVC must be 3 digits").max(4),
});

type PaymentFormData = zod.infer<typeof paymentSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, discountCode, discountPercent, deliveryDetails, applyDiscountCode, removeDiscount, clearCart, isHydrated } = useStore();

  const [mounted, setMounted] = useState(false);
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isHydrated) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-bg-cream">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-serif italic text-text-muted">Loading checkout profile...</p>
        </div>
      </div>
    );
  }

  // Fallback if someone hits checkout directly without delivery details
  if (cart.length === 0 || !deliveryDetails) {
    return (
      <PageTransition>
        <Navbar />
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-6">
          <h2 className="text-serif text-3xl font-bold">No Checkout Session Active</h2>
          <p className="text-text-muted max-w-sm font-light">
            You must fill in your delivery details in the calendar form before accessing checkout.
          </p>
          <Link href="/order">
            <Button variant="primary">Return to Delivery Schedule</Button>
          </Link>
        </div>
        <Footer />
      </PageTransition>
    );
  }

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = subtotal * (discountPercent / 100);
  const deliveryFee = subtotal >= 75 ? 0 : 8.00;
  const total = subtotal - discountAmount + deliveryFee;

  // Credit Card Input Masking
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // remove non-digits
    value = value.substring(0, 16); // max 16 digits
    e.target.value = value.replace(/(\d{4})(?=\d)/g, "$1 "); // insert spaces every 4 digits
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // remove non-digits
    value = value.substring(0, 4); // max 4 digits
    if (value.length > 2) {
      value = value.substring(0, 2) + "/" + value.substring(2); // insert slash
    }
    e.target.value = value;
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // remove non-digits
    e.target.value = value.substring(0, 3); // max 3 digits
  };

  // Promo Code
  const handleApplyPromo = () => {
    setPromoError("");
    if (!promoInput) return;

    const success = applyDiscountCode(promoInput);
    if (success) {
      setPromoInput("");
    } else {
      setPromoError("Invalid promotional code. Try KINGS10.");
    }
  };

  // Submit Order Mock
  const onSubmit = async (data: PaymentFormData) => {
    setIsProcessing(true);
    // Simulate transaction delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);

    // Save order or mock success
    clearCart();
    router.push("/checkout/success");
  };

  return (
    <PageTransition>
      <Navbar />

      <main className="flex-grow pt-28 pb-24">
        {/* Breadcrumb */}
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-2 text-xs uppercase tracking-widest text-text-muted font-sans border-b border-gold/10">
          <Link href="/" className="hover:text-gold transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href="/order" className="hover:text-gold transition-colors">Delivery</Link>
          <ChevronRight size={12} />
          <span className="text-text-dark font-medium">Checkout</span>
        </nav>

        {/* Content Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Column: Payment fields & Delivery Recap (Col 7) */}
            <div className="lg:col-span-7 space-y-8">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-gold">Step 2 of 2</span>
                <h1 className="text-serif text-3xl font-bold tracking-tight text-text-dark">
                  Secure Checkout
                </h1>
              </div>

              {/* Delivery Recap Panel */}
              <div className="bg-white border border-gold-light/25 p-5 rounded-[8px] shadow-sm space-y-4">
                <h3 className="text-serif font-bold text-base text-text-dark pb-2 border-b border-gold/10">
                  Delivery Details Recap
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-text-muted font-sans font-light">
                  <div className="space-y-1">
                    <span className="font-semibold text-text-dark uppercase tracking-wider block text-[9px]">Recipient</span>
                    <p>{deliveryDetails.name} • {deliveryDetails.phone}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-semibold text-text-dark uppercase tracking-wider block text-[9px]">Delivery Window</span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Calendar size={12} className="text-gold" />
                      <span>{deliveryDetails.date}</span>
                      <span className="mx-1.5">•</span>
                      <span>{deliveryDetails.timeSlot.split(" ")[0]} {deliveryDetails.timeSlot.split(" ")[1]} {deliveryDetails.timeSlot.split(" ")[2]}</span>
                    </div>
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <span className="font-semibold text-text-dark uppercase tracking-wider block text-[9px]">Address</span>
                    <p className="flex items-start gap-1">
                      <MapPin size={12} className="text-gold flex-shrink-0 mt-0.5" />
                      <span>{deliveryDetails.address}</span>
                    </p>
                  </div>
                  {deliveryDetails.isGift && (
                    <div className="space-y-1 md:col-span-2 bg-gold-light/10 p-3 rounded border border-gold/15">
                      <span className="font-semibold text-text-dark uppercase tracking-wider block text-[9px] flex items-center gap-1">
                        <Check size={10} className="text-gold" /> Gift message attached
                      </span>
                      <p className="italic">"{deliveryDetails.giftMessage}"</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Forms */}
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-2 border-b border-gold/10">
                  <h3 className="text-serif font-bold text-lg text-text-dark flex items-center gap-2">
                    <CreditCard size={18} className="text-gold" /> Credit Card Details
                  </h3>
                  <span className="text-[10px] text-text-muted flex items-center gap-1 font-light">
                    <Lock size={10} /> SSL Encrypted
                  </span>
                </div>

                {/* Portfolio Disclaimer */}
                <div className="bg-bg-cream border border-gold/25 p-4 rounded-[6px] text-xs font-light text-text-muted leading-relaxed">
                  <strong className="text-gold font-medium uppercase block mb-1">Portfolio Demo Mode</strong>
                  This is a front-end portfolio demonstration. Absolutely no real payments will be made. You can type any mock card credentials to proceed (e.g. 4242 4242 4242 4242, 12/28, 123).
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label htmlFor="cardholderName" className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                      Cardholder Name
                    </label>
                    <input
                      id="cardholderName"
                      type="text"
                      placeholder="John Doe"
                      className="w-full bg-white border border-gold-light/45 rounded-[4px] px-4 py-3 text-sm focus:outline-none focus:border-gold"
                      {...register("cardholderName")}
                    />
                    {errors.cardholderName && (
                      <p className="text-xs text-berry-accent">{errors.cardholderName.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="cardNumber" className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                      Card Number
                    </label>
                    <input
                      id="cardNumber"
                      type="text"
                      placeholder="4242 4242 4242 4242"
                      className="w-full bg-white border border-gold-light/45 rounded-[4px] px-4 py-3 text-sm focus:outline-none focus:border-gold"
                      {...register("cardNumber", { onChange: handleCardNumberChange })}
                    />
                    {errors.cardNumber && (
                      <p className="text-xs text-berry-accent">{errors.cardNumber.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="expiryDate" className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                        Expiration Date
                      </label>
                      <input
                        id="expiryDate"
                        type="text"
                        placeholder="MM/YY"
                        className="w-full bg-white border border-gold-light/45 rounded-[4px] px-4 py-3 text-sm focus:outline-none focus:border-gold"
                        {...register("expiryDate", { onChange: handleExpiryChange })}
                      />
                      {errors.expiryDate && (
                        <p className="text-xs text-berry-accent">{errors.expiryDate.message}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="cvc" className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                        CVC / CVV
                      </label>
                      <input
                        id="cvc"
                        type="text"
                        placeholder="123"
                        className="w-full bg-white border border-gold-light/45 rounded-[4px] px-4 py-3 text-sm focus:outline-none focus:border-gold"
                        {...register("cvc", { onChange: handleCvcChange })}
                      />
                      {errors.cvc && (
                        <p className="text-xs text-berry-accent">{errors.cvc.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary Sidebar (Col 5) */}
            <div className="lg:col-span-5 bg-white border border-gold-light/25 p-6 rounded-[8px] shadow-sm sticky top-24 space-y-6">
              <h3 className="text-serif font-bold text-lg text-text-dark pb-3 border-b border-gold/15">
                Review & Confirm
              </h3>

              {/* Promo Code Input Panel */}
              <div className="space-y-2 pb-4 border-b border-gold/10">
                <label className="text-xs font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1">
                  <Tag size={12} className="text-gold" /> Promo Code
                </label>
                {discountCode ? (
                  <div className="flex justify-between items-center bg-gold/10 border border-gold/30 p-2.5 rounded-[4px] text-xs">
                    <span className="text-gold font-bold flex items-center gap-1.5">
                      <Check size={14} /> {discountCode} Applied (10% Off)
                    </span>
                    <button
                      type="button"
                      onClick={removeDiscount}
                      className="text-berry-accent hover:text-[#5E1E26] underline font-semibold transition-colors cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. KINGS10"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="flex-1 bg-bg-cream/40 border border-gold-light/45 rounded-[4px] px-3 py-2 text-xs focus:outline-none focus:border-gold uppercase"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="bg-gold text-white hover:text-bg-charcoal px-4 py-2 text-xs font-semibold uppercase rounded-[4px] hover:bg-gold-light transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                )}
                {promoError && (
                  <p className="text-[11px] text-berry-accent font-sans flex items-center gap-1 pt-1">
                    <AlertCircle size={12} />
                    {promoError}
                  </p>
                )}
              </div>

              {/* Subtotal reads */}
              <div className="space-y-2 text-xs text-text-muted font-sans border-b border-gold/10 pb-4">
                <div className="flex justify-between font-light">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discountPercent > 0 && (
                  <div className="flex justify-between text-berry-accent font-semibold">
                    <span>Discount (10% Coupon)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-light">
                  <span>Climate Delivery Fee</span>
                  <span>
                    {deliveryFee === 0 ? (
                      <span className="text-gold uppercase tracking-wider font-semibold">Free</span>
                    ) : (
                      `$${deliveryFee.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="border-t border-gold/5 pt-3 flex justify-between text-base font-serif font-bold text-text-dark">
                  <span>Order Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Submit Payment button */}
              <Button
                type="submit"
                variant="primary"
                disabled={isProcessing}
                className="w-full py-4 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-bg-charcoal border-t-transparent rounded-full animate-spin" />
                    <span>Processing Transaction...</span>
                  </>
                ) : (
                  <>
                    <Lock size={14} />
                    <span>Pay & Complete Order</span>
                  </>
                )}
              </Button>

              <p className="text-[9px] text-text-muted leading-relaxed text-center font-light">
                By completing, you authorize simulation card deduction under sandbox protocols.
              </p>
            </div>
          </form>
        </section>
      </main>

      <Footer />
    </PageTransition>
  );
}
