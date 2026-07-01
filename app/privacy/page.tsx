"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

export default function PrivacyPage() {
  return (
    <PageTransition>
      <Navbar />

      <main className="flex-grow pt-28 pb-24 bg-[#FAF6F0]">
        {/* Breadcrumb */}
        <nav className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-2 text-xs uppercase tracking-widest text-[#5C4A3C]/70 font-sans border-b border-[#A77146]/10">
          <Link href="/" className="hover:text-[#A77146] transition-colors">Home</Link>
          <ChevronRight size={12} />
          <span className="text-[#3C281B] font-medium">Privacy Policy</span>
        </nav>

        {/* Content Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          <div className="bg-white border border-[#A77146]/10 p-8 sm:p-12 rounded-2xl shadow-sm space-y-8 text-[#3C281B]">
            
            {/* Header */}
            <div className="border-b border-[#A77146]/10 pb-6">
              <div className="flex items-center gap-3 text-[#A77146] mb-3">
                <ShieldCheck size={28} />
                <span className="text-[11px] font-bold tracking-[0.25em] uppercase">Trust & Security</span>
              </div>
              <h1 className="text-4xl font-sans font-extrabold tracking-tight">Privacy Policy</h1>
              <p className="text-xs text-[#5C4A3C]/60 font-sans mt-2">Last updated: June 29, 2026</p>
            </div>

            {/* Intro */}
            <div className="text-[15px] leading-relaxed text-[#5C4A3C]">
              At KingsBakery, we treat your personal information with the same care and respect as our handcrafted baking creations. This Privacy Policy details how we collect, use, and safeguard your details when you purchase from our site or subscribe to our newsletter.
            </div>

            {/* Section 1 */}
            <div className="space-y-3">
              <h3 className="text-lg font-sans font-bold text-[#3C281B]">1. Information We Collect</h3>
              <p className="text-sm leading-relaxed text-[#5C4A3C] font-normal">
                To process your orders, schedule delivery slots on our interactive calendar, and ship gourmet items safely to Manhattan and other New York locations, we collect:
              </p>
              <ul className="list-disc pl-5 text-sm text-[#5C4A3C] space-y-1.5 font-normal">
                <li>Personal identifiers such as your full name, email address, and phone number.</li>
                <li>Delivery address details and preferred delivery time slots.</li>
                <li>Payment processing information (securely handled by our payment partners; we never store your raw credit card data).</li>
              </ul>
            </div>

            {/* Section 2 */}
            <div className="space-y-3">
              <h3 className="text-lg font-sans font-bold text-[#3C281B]">2. How We Use Your Information</h3>
              <p className="text-sm leading-relaxed text-[#5C4A3C] font-normal">
                We use the gathered data solely to provide a premium baking service:
              </p>
              <ul className="list-disc pl-5 text-sm text-[#5C4A3C] space-y-1.5 font-normal">
                <li>Managing orders, tasting flight selections, and delivery logistics.</li>
                <li>Sending updates about your order status or account alerts.</li>
                <li>Submitting custom pastry inquiries or newsletter recipes (if subscribed).</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div className="space-y-3">
              <h3 className="text-lg font-sans font-bold text-[#3C281B]">3. Data Protection</h3>
              <p className="text-sm leading-relaxed text-[#5C4A3C] font-normal">
                We implement strict industry-standard SSL encryption and firewall protocols to protect all personal transactions. Your information is never sold, traded, or shared with external marketing corporations.
              </p>
            </div>

            {/* Contact */}
            <div className="bg-[#FAF6F0] p-6 rounded-xl border border-[#A77146]/10 space-y-2.5">
              <h4 className="text-sm font-sans font-bold text-[#3C281B]">Questions or Concerns?</h4>
              <p className="text-xs leading-relaxed text-[#5C4A3C]">
                If you have questions regarding your data or wish to request deletion of your account records, please get in touch with our security administrator via our{" "}
                <Link href="/contact" className="text-[#A77146] hover:underline font-semibold">Contact Page</Link>.
              </p>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </PageTransition>
  );
}
