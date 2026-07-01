"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { mockReviews } from "@/lib/mock-data";

export const TestimonialCarousel: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  const handleNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % mockReviews.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + mockReviews.length) % mockReviews.length);
  };

  // Auto slide every 8 seconds
  useEffect(() => {
    const timer = setInterval(handleNext, 8000);
    return () => clearInterval(timer);
  }, []);

  const current = mockReviews[activeIndex];

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto px-12 py-16 bg-white border border-gold-light/25 rounded-[12px] shadow-sm">
      {/* Decorative quotes background */}
      <span className="absolute top-4 left-6 text-serif text-[120px] font-bold text-gold-light/10 select-none pointer-events-none leading-none">
        “
      </span>

      <div className="relative overflow-hidden min-h-[220px] flex flex-col justify-between">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={activeIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="flex flex-col items-center text-center space-y-6"
          >
            {/* Stars */}
            <div className="flex gap-1">
              {Array.from({ length: current.rating }).map((_, i) => (
                <Star key={i} size={16} className="fill-gold text-gold" />
              ))}
            </div>

            {/* Quote */}
            <p className="text-serif text-lg md:text-xl italic text-text-dark font-medium max-w-2xl leading-relaxed">
              "{current.comment}"
            </p>

            {/* Avatar & Author Info */}
            <div className="flex items-center gap-3">
              <img
                src={current.avatar}
                alt={current.name}
                className="w-12 h-12 rounded-full object-cover border border-gold"
              />
              <div className="text-left">
                <h4 className="text-sm font-semibold text-text-dark">{current.name}</h4>
                {current.verified && (
                  <span className="text-[10px] uppercase tracking-wider text-gold font-semibold">
                    Verified Connoisseur
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Nav Buttons */}
      <button
        onClick={handlePrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 hover:bg-gold-light/20 text-text-muted hover:text-text-dark rounded-full transition-colors cursor-pointer"
        title="Previous Testimonial"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-gold-light/20 text-text-muted hover:text-text-dark rounded-full transition-colors cursor-pointer"
        title="Next Testimonial"
      >
        <ChevronRight size={24} />
      </button>

      {/* Slide Indicators */}
      <div className="flex justify-center gap-2 mt-8">
        {mockReviews.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > activeIndex ? 1 : -1);
              setActiveIndex(i);
            }}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === activeIndex ? "bg-gold w-6" : "bg-gold-light/40 w-1.5"
            }`}
            title={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialCarousel;
