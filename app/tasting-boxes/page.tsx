"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, ArrowRight, Package } from "lucide-react";
import { getTastingBoxes } from "@/lib/api";
import { images } from "@/lib/images";
import { motion } from "framer-motion";
import { TastingBox } from "@/lib/mock-data";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeading from "@/components/SectionHeading";
import Button from "@/components/ui/Button";
import PageTransition from "@/components/PageTransition";

export default function TastingBoxesPage() {
  const [boxes, setBoxes] = useState<TastingBox[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBoxes() {
      setLoading(true);
      const data = await getTastingBoxes();
      setBoxes(data);
      setLoading(false);
    }
    loadBoxes();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-bg-cream">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-serif italic text-text-muted">Loading tasting configurations...</p>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <Navbar />

      <main className="flex-grow">
        {/* Banner Section */}
        <section className="bg-bg-charcoal text-white pt-32 pb-16 border-b border-gold/15 relative overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-20">
            <img
              src={images.storyChef}
              alt="Baking texture"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-gold-light/60 mb-4 font-sans">
              <Link href="/" className="hover:text-gold transition-colors">Home</Link>
              <ChevronRight size={12} />
              <span className="text-white">Tasting Boxes</span>
            </nav>
            <SectionHeading
              label="Curated Tastings"
              title="Exclusive Assortments"
              subtitle="Perfect flights of flavor selected by our chefs. Each tasting box comes beautifully bound in gold leaf packaging and includes scientific tasting notes."
              align="left"
              light={true}
            />
          </div>
        </section>

        {/* Tasting Boxes List */}
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-24 lg:space-y-32">
            {boxes.map((box, index) => {
              const isEven = index % 2 === 1;
              return (
                <motion.div
                  key={box.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`flex flex-col lg:flex-row gap-10 lg:gap-16 items-center justify-between bg-transparent ${
                    isEven ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  {/* 1. Image Showcase */}
                  <div className="w-full lg:w-1/2 relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden bg-bg-cream rounded-[4px] border border-gold-light/10 shadow-md flex-shrink-0 group">
                    <img
                      src={box.image}
                      alt={box.name}
                      className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-103"
                    />
                    {/* Subtle glass reflection overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent opacity-45 pointer-events-none" />
                    
                    {/* Item count tag */}
                    <div className="absolute top-4 right-4 bg-bg-charcoal/90 text-white text-[9px] font-bold tracking-[0.2em] px-3.5 py-2 uppercase rounded-[2px] border border-gold-light/20">
                      {box.itemCount} Desserts
                    </div>
                  </div>

                  {/* 2. Editorial Details */}
                  <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left">
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-baseline gap-2 border-b border-gold-light/15 pb-4">
                        <h3 className="font-sans font-extrabold text-xl md:text-2xl uppercase tracking-wider text-text-dark group-hover:text-gold transition-colors leading-tight">
                          {box.name}
                        </h3>
                        <span className="font-sans font-light text-lg md:text-xl text-gold whitespace-nowrap">
                          ${box.price.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-xs md:text-sm font-light text-text-muted leading-relaxed max-w-xl mx-auto lg:mx-0">
                        {box.description}
                      </p>
                    </div>

                    {/* Michelin-style Menu Contents */}
                    <div className="space-y-3 pt-2">
                      <span className="block text-[9px] uppercase tracking-[0.2em] font-semibold text-gold">
                        Tasting Flight Assortment
                      </span>
                      <ul className="text-xs text-text-dark/85 space-y-3 font-sans font-light">
                        {box.contents.map((item, idx) => (
                          <li key={idx} className="flex flex-col sm:flex-row justify-between items-center gap-1 sm:gap-4 text-center sm:text-left">
                            <span>{item.name}</span>
                            <span className="hidden sm:block h-[1px] flex-grow mx-4 border-t border-dashed border-gold-light/20" />
                            <span className="font-semibold text-text-dark font-sans text-xs">x{item.qty}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action controls */}
                    <div className="pt-4 space-y-4">
                      <div className="flex items-center justify-center lg:justify-start gap-2 text-[9px] uppercase tracking-widest text-text-muted">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                        <span>
                          {box.customizableItems.length > 0
                            ? "Interactive Customization Available"
                            : "Fixed Selection"}
                        </span>
                      </div>

                      <Link href={`/tasting-boxes/${box.slug}`} className="block w-full">
                        <Button
                          variant="outline"
                          className="w-full py-4 tracking-widest text-xs uppercase font-bold shadow-none"
                        >
                          Customize & Add Flight
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </PageTransition>
  );
}
