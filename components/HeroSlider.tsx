"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

/* ─── Slide Data ─── */
const slides = [
  {
    image: "/images/hero_slide_1.png",
    tagline: "The Pastry Collection",
    headingTop: "Baked with",
    headingScript: "Passion & Perfection",
    description:
      "Golden croissants, decadent tarts, and delicate macarons — handcrafted daily by our award-winning pastry chefs using the finest ingredients.",
    ctaLabel: "Explore Our Shop",
    ctaLink: "/shop",
  },
  {
    image: "/images/hero_slide_2.png",
    tagline: "The Art of Craft",
    headingTop: "Every Layer",
    headingScript: "Tells a Story",
    description:
      "From seed-to-slab chocolate to slow-fermented dough, every creation is a testament to patience, precision, and decades of mastery.",
    ctaLabel: "Meet Our Bakers",
    ctaLink: "/our-story",
  },
  {
    image: "/images/hero_slide_3.png",
    tagline: "Gift Something Special",
    headingTop: "Curated",
    headingScript: "Tasting Boxes",
    description:
      "Unwrap a world of flavour with our luxury tasting boxes — a handpicked selection of our finest pastries, perfectly packaged for every occasion.",
    ctaLabel: "Discover Tasting Boxes",
    ctaLink: "/tasting-boxes",
  },
];

const SLIDE_DURATION = 6000; // 6 seconds per slide

/* ─── Component ─── */
export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = useCallback(
    (idx: number) => {
      setDirection(idx > current ? 1 : -1);
      setCurrent(idx);
      setProgress(0);
    },
    [current]
  );

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
    setProgress(0);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
  }, []);

  /* Auto-advance timer */
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          next();
          return 0;
        }
        return p + 100 / (SLIDE_DURATION / 50);
      });
    }, 50);
    return () => clearInterval(interval);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="relative w-full h-screen min-h-[600px] max-h-[1000px] overflow-hidden bg-[#1A1510]">
      {/* ─── Background Slides with Ken Burns ─── */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1.0 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
        >
          <motion.img
            src={slide.image}
            alt={slide.tagline}
            initial={{ scale: 1.0 }}
            animate={{ scale: 1.08 }}
            transition={{ duration: SLIDE_DURATION / 1000 + 1, ease: "linear" }}
            className="w-full h-full object-cover object-center"
          />
        </motion.div>
      </AnimatePresence>

      {/* ─── Cinematic Overlays ─── */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#1A1510]/95 via-[#1A1510]/60 to-transparent" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#1A1510] via-transparent to-[#1A1510]/40" />
      {/* Film grain texture */}
      <div className="absolute inset-0 z-[1] opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />

      {/* ─── Content ─── */}
      <div className="relative z-10 h-full flex items-center">
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="max-w-2xl">
            {/* Animated Tagline */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`tag-${current}`}
                initial={{ opacity: 0, x: 30 * direction }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 * direction }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="mb-6"
              >
                <span className="inline-flex items-center gap-3 text-[11px] sm:text-xs font-semibold tracking-[0.3em] uppercase text-[#E9D3BD]">
                  <span className="block w-8 h-[1.5px] bg-[#A77146]" />
                  {slide.tagline}
                </span>
              </motion.div>
            </AnimatePresence>

            {/* Animated Heading */}
            <AnimatePresence mode="wait">
              <motion.h1
                key={`h1-${current}`}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
                className="mb-6"
              >
                <span className="block font-sans text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white uppercase leading-[0.95]">
                  {slide.headingTop}
                </span>
                <span className="block text-script text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#E9D3BD] mt-1 leading-[1.1]">
                  {slide.headingScript}
                </span>
              </motion.h1>
            </AnimatePresence>

            {/* Animated Description */}
            <AnimatePresence mode="wait">
              <motion.p
                key={`desc-${current}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="text-sm sm:text-base md:text-lg text-white/80 max-w-lg leading-relaxed font-sans mb-10"
              >
                {slide.description}
              </motion.p>
            </AnimatePresence>

            {/* CTA Button */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`cta-${current}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, delay: 0.25 }}
                className="flex flex-wrap items-center gap-5"
              >
                <Link href={slide.ctaLink}>
                  <span className="group relative inline-flex items-center gap-3 px-8 py-4 bg-[#A77146] text-white text-xs sm:text-sm font-bold uppercase tracking-[0.2em] rounded-sm overflow-hidden transition-all duration-300 hover:bg-[#8B5D39] hover:shadow-[0_8px_30px_rgba(167,113,70,0.4)]">
                    <span className="relative z-10">{slide.ctaLabel}</span>
                    <ArrowRight size={16} className="relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
                    {/* Shimmer effect */}
                    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                  </span>
                </Link>

                <Link
                  href="/shop"
                  className="group flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-white/70 hover:text-white transition-colors duration-300"
                >
                  <span>View All</span>
                  <span className="block w-6 h-[1px] bg-white/30 group-hover:w-10 group-hover:bg-[#A77146] transition-all duration-300" />
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ─── Slide Navigation (Bottom) ─── */}
      <div className="absolute bottom-8 left-0 right-0 z-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-end justify-between">
          {/* Progress Dots + Bars */}
          <div className="flex items-center gap-3">
            {slides.map((s, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="group flex flex-col items-start gap-2 cursor-pointer"
                aria-label={`Go to slide ${i + 1}`}
              >
                {/* Slide number */}
                <span className={`text-[10px] font-mono tracking-wider transition-colors duration-300 ${i === current ? "text-white" : "text-white/30 group-hover:text-white/60"}`}>
                  0{i + 1}
                </span>
                {/* Progress bar */}
                <div className="relative w-16 sm:w-20 h-[2px] bg-white/15 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-[#A77146] rounded-full"
                    style={{ width: i === current ? `${progress}%` : i < current ? "100%" : "0%" }}
                    transition={{ duration: 0.05 }}
                  />
                </div>
              </button>
            ))}
          </div>

          {/* Arrow Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:border-white/60 hover:bg-white/5 transition-all duration-300 cursor-pointer"
              aria-label="Previous slide"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:border-white/60 hover:bg-white/5 transition-all duration-300 cursor-pointer"
              aria-label="Next slide"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* ─── Decorative Side Accent ─── */}
      <div className="absolute top-1/2 -translate-y-1/2 right-8 z-10 hidden xl:flex flex-col items-center gap-3">
        <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-[#A77146]/40 to-transparent" />
        <span className="text-[9px] tracking-[0.3em] uppercase text-white/25 font-sans" style={{ writingMode: "vertical-rl" }}>
          King&apos;s Bakery
        </span>
        <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-[#A77146]/40 to-transparent" />
      </div>

      {/* ─── Bottom Gradient Edge ─── */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#1A1510] to-transparent z-[2]" />
    </section>
  );
}
