"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { Facebook, Instagram, Youtube, Check, ArrowRight, ShieldCheck, Mail, Sparkles } from "lucide-react";
import { submitNewsletterForm } from "@/lib/api";
import Logo from "./Logo";

const newsletterSchema = zod.object({
  email: zod.string().email("Please enter a valid email address"),
});

type NewsletterFormData = zod.infer<typeof newsletterSchema>;

export const Footer: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit = async (data: NewsletterFormData) => {
    setIsLoading(true);
    try {
      const res = await submitNewsletterForm(data.email);
      if (res.success) {
        setIsSubmitted(true);
        reset();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="relative bg-[#1A1510] text-white pt-24 pb-12 border-t border-[#A77146]/20 overflow-hidden">
      {/* Subtle Background Radial Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#A77146]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top section: Brand statement and newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-[#A77146]/10">
          {/* Brand Col */}
          <div className="lg:col-span-5 space-y-6">
            <Link href="/" className="inline-block">
              <Logo variant="full" light={true} size={38} />
            </Link>
            <p className="text-[14px] leading-relaxed text-white/70 max-w-md font-sans font-normal">
              Artisan luxury desserts crafted with Michelin-star precision and organic heritage ingredients. Experience gourmet indulgence delivered daily to your door.
            </p>
            <div className="flex items-center gap-3">
              <a 
                href="https://instagram.com/kingsbakery" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 rounded-full border border-white/10 hover:border-[#A77146] flex items-center justify-center text-white/55 hover:text-[#E9D3BD] hover:bg-[#A77146]/10 transition-all duration-300 cursor-pointer"
                aria-label="Instagram Profile"
              >
                <Instagram size={15} />
              </a>
              <a 
                href="https://facebook.com/kingsbakery" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 rounded-full border border-white/10 hover:border-[#A77146] flex items-center justify-center text-white/55 hover:text-[#E9D3BD] hover:bg-[#A77146]/10 transition-all duration-300 cursor-pointer"
                aria-label="Facebook Page"
              >
                <Facebook size={15} />
              </a>
              <a 
                href="https://youtube.com/kingsbakery" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 rounded-full border border-white/10 hover:border-[#A77146] flex items-center justify-center text-white/55 hover:text-[#E9D3BD] hover:bg-[#A77146]/10 transition-all duration-300 cursor-pointer"
                aria-label="YouTube Channel"
              >
                <Youtube size={15} />
              </a>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#E9D3BD] font-sans font-medium bg-[#A77146]/10 border border-[#A77146]/20 px-3 py-2 rounded-md w-fit">
              <Sparkles size={13} className="text-[#A77146]" />
              <span>Upper East Side, New York — Open Daily 8AM - 10PM</span>
            </div>
          </div>

          {/* Spacer */}
          <div className="hidden lg:block lg:col-span-1" />

          {/* Newsletter Col */}
          <div className="lg:col-span-6 space-y-5">
            <div className="space-y-2">
              <span className="text-[10px] font-semibold tracking-[0.25em] text-[#A77146] uppercase block">
                Exclusive Updates
              </span>
              <h4 className="text-xl font-sans font-bold text-white tracking-tight">
                Join The Taste Guild
              </h4>
              <p className="text-xs sm:text-sm text-white/60 font-sans font-normal max-w-lg">
                Subscribe to receive culinary insights, seasonal recipe alerts, and private tasting box launches.
              </p>
            </div>

            {isSubmitted ? (
              <div className="bg-[#A77146]/15 border border-[#A77146]/30 p-4 rounded-lg flex items-center gap-3 text-[#E9D3BD] max-w-md animate-fade-in">
                <Check size={18} className="text-[#A77146]" />
                <span className="text-xs font-sans font-semibold tracking-wider uppercase">
                  Guild Subscription Active
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-2.5 max-w-md">
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-white/30">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-lg pl-11 pr-14 py-3.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#A77146] focus:bg-white/[0.05] transition-all font-sans"
                    {...register("email")}
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    className="absolute right-2 p-2 bg-[#A77146] hover:bg-[#8B5D39] text-white rounded-md transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center"
                    disabled={isLoading}
                    aria-label="Subscribe"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <ArrowRight size={16} />
                    )}
                  </button>
                </div>
                {errors.email && (
                  <p className="text-xs text-red-400 font-sans pl-1">{errors.email.message}</p>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Middle section: Navigation Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-16">
          {/* Col 1: Shop */}
          <div className="space-y-4">
            <h5 className="text-[11px] font-bold tracking-[0.2em] text-[#A77146] uppercase">Shop</h5>
            <ul className="space-y-2.5 text-sm font-sans font-normal text-white/60">
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">All Pastries</Link>
              </li>
              <li>
                <Link href="/tasting-boxes" className="hover:text-white transition-colors">Tasting Flights</Link>
              </li>
              <li>
                <Link href="/shop?category=Pastries" className="hover:text-white transition-colors">Croissant & Danish</Link>
              </li>
              <li>
                <Link href="/shop?category=Cakes" className="hover:text-white transition-colors">Celebration Cakes</Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Custom Orders */}
          <div className="space-y-4">
            <h5 className="text-[11px] font-bold tracking-[0.2em] text-[#A77146] uppercase">Bespoke</h5>
            <ul className="space-y-2.5 text-sm font-sans font-normal text-white/60">
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">Custom Cake Design</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">Corporate Catering</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">Kitchen Gallery</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">Bulk Ordering</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Company */}
          <div className="space-y-4">
            <h5 className="text-[11px] font-bold tracking-[0.2em] text-[#A77146] uppercase">Our Story</h5>
            <ul className="space-y-2.5 text-sm font-sans font-normal text-white/60">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">The Founders</Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">The Journal</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">Sourcing Standards</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">Careers</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Connect & Support */}
          <div className="space-y-4">
            <h5 className="text-[11px] font-bold tracking-[0.2em] text-[#A77146] uppercase">Support</h5>
            <ul className="space-y-2.5 text-sm font-sans font-normal text-white/60">
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">FAQs & Delivery Info</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">Contact Support</Link>
              </li>
              <li>
                <span className="flex items-center gap-1.5 text-xs text-[#E9D3BD]">
                  <ShieldCheck size={13} className="text-[#A77146]" /> Secured SSL Checkout
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-8 border-t border-[#A77146]/10 flex flex-col sm:flex-row justify-between items-center gap-6 text-xs text-white/40 font-sans">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-center sm:text-left">
            <span>© {new Date().getFullYear()} KingsBakery. All rights reserved.</span>
            <span className="hidden sm:inline text-white/10">|</span>
            <span>
              Developed by{" "}
              <a
                href="https://alaminrobin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#E9D3BD] hover:text-white transition-colors underline font-medium"
              >
                Al Amin Robin
              </a>
            </span>
          </div>
          
          {/* Socials & Policies */}
          <div className="flex items-center gap-6">
            <div className="flex gap-3">
              <a
                href="#"
                className="w-7 h-7 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-[#A77146] hover:bg-[#A77146]/15 transition-all duration-300 cursor-pointer"
                title="Instagram"
              >
                <Instagram size={13} />
              </a>
              <a
                href="#"
                className="w-7 h-7 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-[#A77146] hover:bg-[#A77146]/15 transition-all duration-300 cursor-pointer"
                title="Facebook"
              >
                <Facebook size={13} />
              </a>
              <a
                href="#"
                className="w-7 h-7 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-[#A77146] hover:bg-[#A77146]/15 transition-all duration-300 cursor-pointer"
                title="YouTube"
              >
                <Youtube size={13} />
              </a>
            </div>
            <span className="text-white/10">|</span>
            <div className="flex gap-4">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
