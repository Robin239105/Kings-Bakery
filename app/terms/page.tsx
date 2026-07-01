"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, FileText } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

export default function TermsPage() {
  return (
    <PageTransition>
      <Navbar />

      <main className="flex-grow pt-28 pb-24 bg-[#FAF6F0]">
        {/* Breadcrumb */}
        <nav className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-2 text-xs uppercase tracking-widest text-[#5C4A3C]/70 font-sans border-b border-[#A77146]/10">
          <Link href="/" className="hover:text-[#A77146] transition-colors">Home</Link>
          <ChevronRight size={12} />
          <span className="text-[#3C281B] font-medium">Terms of Service</span>
        </nav>

        {/* Content Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          <div className="bg-white border border-[#A77146]/10 p-8 sm:p-12 rounded-2xl shadow-sm space-y-8 text-[#3C281B]">
            
            {/* Header */}
            <div className="border-b border-[#A77146]/10 pb-6">
              <div className="flex items-center gap-3 text-[#A77146] mb-3">
                <FileText size={28} />
                <span className="text-[11px] font-bold tracking-[0.25em] uppercase">User Agreement</span>
              </div>
              <h1 className="text-4xl font-sans font-extrabold tracking-tight">Terms of Service</h1>
              <p className="text-xs text-[#5C4A3C]/60 font-sans mt-2">Last updated: June 29, 2026</p>
            </div>

            {/* Intro */}
            <div className="text-[15px] leading-relaxed text-[#5C4A3C]">
              Welcome to KingsBakery. By accessing our website, purchasing our handcrafted tasting boxes, or booking custom orders, you agree to comply with and be bound by the following Terms of Service.
            </div>

            {/* Section 1 */}
            <div className="space-y-3">
              <h3 className="text-lg font-sans font-bold text-[#3C281B]">1. Ordering and Delivery Slots</h3>
              <p className="text-sm leading-relaxed text-[#5C4A3C] font-normal">
                Because our pastries and tarts are made fresh daily to order, all delivery orders must be scheduled using our interactive calendar system.
              </p>
              <ul className="list-disc pl-5 text-sm text-[#5C4A3C] space-y-1.5 font-normal">
                <li>We deliver strictly within designated areas of Manhattan, New York (including Upper East Side, Soho, and Tribeca).</li>
                <li>Ensure accurate contact details are provided. If our delivery courier cannot reach you within 15 minutes of arriving, your order may be returned to our kitchen to ensure freshness, and redelivery fees will apply.</li>
              </ul>
            </div>

            {/* Section 2 */}
            <div className="space-y-3">
              <h3 className="text-lg font-sans font-bold text-[#3C281B]">2. Customization and Ingredients</h3>
              <p className="text-sm leading-relaxed text-[#5C4A3C] font-normal">
                Our curated tasting boxes allow customization of select flight items. While we follow strict food hygiene practices, we process wheat, gluten, eggs, dairy, and nuts in our kitchen. It is your responsibility to review allergen details on our item pages before placing an order.
              </p>
            </div>

            {/* Section 3 */}
            <div className="space-y-3">
              <h3 className="text-lg font-sans font-bold text-[#3C281B]">3. Cancellations and Refunds</h3>
              <p className="text-sm leading-relaxed text-[#5C4A3C] font-normal">
                As our products are perishable foods handcrafted specifically for you:
              </p>
              <ul className="list-disc pl-5 text-sm text-[#5C4A3C] space-y-1.5 font-normal">
                <li>Cancellations made 24 hours or more before the scheduled delivery time will receive a full refund or store credit.</li>
                <li>No refunds will be issued for cancellations made less than 24 hours before the scheduled time slot.</li>
              </ul>
            </div>

            {/* Contact */}
            <div className="bg-[#FAF6F0] p-6 rounded-xl border border-[#A77146]/10 space-y-2.5">
              <h4 className="text-sm font-sans font-bold text-[#3C281B]">Need Assistance?</h4>
              <p className="text-xs leading-relaxed text-[#5C4A3C]">
                For questions regarding your order conditions, custom quotes, or wholesale accounts, please contact us directly via the{" "}
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
