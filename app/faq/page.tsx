"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight, ChevronDown, Plus, Minus, HelpCircle } from "lucide-react";
import { mockFAQs } from "@/lib/mock-data";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeading from "@/components/SectionHeading";
import Button from "@/components/ui/Button";
import PageTransition from "@/components/PageTransition";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggleAccordion = (catIdx: number, qIdx: number) => {
    const key = `${catIdx}-${qIdx}`;
    if (openIndex === key) {
      setOpenIndex(null);
    } else {
      setOpenIndex(key);
    }
  };

  return (
    <PageTransition>
      <Navbar />

      <main className="flex-grow pt-28 pb-24">
        {/* Breadcrumb */}
        <nav className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-2 text-xs uppercase tracking-widest text-text-muted font-sans border-b border-gold/10">
          <Link href="/" className="hover:text-gold transition-colors">Home</Link>
          <ChevronRight size={12} />
          <span className="text-text-dark font-medium">FAQs</span>
        </nav>

        {/* Header */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center lg:text-left">
          <SectionHeading
            label="Help & Information"
            title="Frequently Asked Questions"
            subtitle="Find answers to common inquiries regarding scheduling, ingredients, allergen handling, and custom pastry creations."
            align="left"
          />
        </section>

        {/* FAQs List */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {mockFAQs.map((categoryGroup, catIdx) => (
            <div key={catIdx} className="space-y-4">
              <h3 className="text-serif font-bold text-lg text-text-dark border-b border-gold/10 pb-2">
                {categoryGroup.category}
              </h3>

              <div className="space-y-3">
                {categoryGroup.questions.map((faq, qIdx) => {
                  const key = `${catIdx}-${qIdx}`;
                  const isOpen = openIndex === key;

                  return (
                    <div
                      key={qIdx}
                      className="bg-white border border-gold-light/25 rounded-[8px] overflow-hidden shadow-sm transition-all duration-300"
                    >
                      {/* Accordion Trigger */}
                      <button
                        type="button"
                        onClick={() => toggleAccordion(catIdx, qIdx)}
                        className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-sans font-medium text-sm md:text-base text-text-dark hover:text-gold transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-2.5">
                          <HelpCircle size={16} className="text-gold flex-shrink-0" />
                          {faq.q}
                        </span>
                        <span className="text-text-muted flex-shrink-0">
                          {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                        </span>
                      </button>

                      {/* Accordion Content */}
                      {isOpen && (
                        <div className="px-5 pb-5 pt-1 text-xs md:text-sm text-text-muted font-light leading-relaxed border-t border-gold/5 bg-bg-cream/10 animate-fade-in">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </section>

        {/* CTA */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 text-center space-y-6">
          <div className="bg-white border border-gold/25 p-8 rounded-[8px] shadow-sm max-w-2xl mx-auto space-y-4">
            <h4 className="text-serif font-bold text-lg text-text-dark">Have a custom or unanswered question?</h4>
            <p className="text-sm text-text-muted font-light max-w-md mx-auto">
              Our culinary support team is here to assist you with large events, ingredient clarifications, or wedding cake planning.
            </p>
            <Link href="/contact">
              <Button variant="primary" size="sm">
                Get in Touch
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </PageTransition>
  );
}
