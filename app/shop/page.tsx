"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, ArrowUpDown, X, ChevronRight } from "lucide-react";
import { mockProducts, Product } from "@/lib/mock-data";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import SectionHeading from "@/components/SectionHeading";
import Button from "@/components/ui/Button";
import PageTransition from "@/components/PageTransition";

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(20);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState<boolean>(false);

  // Sync state with URL query parameters
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const dietaryParam = searchParams.get("dietary");

    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    if (dietaryParam) {
      setSelectedDietary(dietaryParam.split(","));
    }
  }, [searchParams]);

  const categories = ["All", "Cakes", "Tarts", "Pastries", "Macarons"];
  const dietaryOptions = ["Gluten-Free", "Vegan", "Nut-Free"];

  // Handle URL updates
  const updateURL = (category: string, dietary: string[], price: number) => {
    const params = new URLSearchParams();
    if (category !== "All") params.set("category", category);
    if (dietary.length > 0) params.set("dietary", dietary.join(","));
    // We only set price if it is different from default maximum
    if (price < 20) params.set("maxPrice", price.toString());
    
    router.replace(`/shop?${params.toString()}`, { scroll: false });
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    updateURL(category, selectedDietary, maxPrice);
  };

  const handleDietaryToggle = (item: string) => {
    const updated = selectedDietary.includes(item)
      ? selectedDietary.filter((d) => d !== item)
      : [...selectedDietary, item];
    
    setSelectedDietary(updated);
    updateURL(selectedCategory, updated, maxPrice);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setMaxPrice(val);
    updateURL(selectedCategory, selectedDietary, val);
  };

  const clearAllFilters = () => {
    setSelectedCategory("All");
    setSelectedDietary([]);
    setMaxPrice(20);
    router.replace("/shop", { scroll: false });
  };

  // Filter and Sort Products logic
  const filteredProducts = mockProducts.filter((product) => {
    // Category check
    if (selectedCategory !== "All" && product.category !== selectedCategory) {
      return false;
    }
    // Dietary check
    if (selectedDietary.length > 0) {
      const matchesAllSelectedDietary = selectedDietary.every((d) =>
        product.dietary.includes(d as any)
      );
      if (!matchesAllSelectedDietary) return false;
    }
    // Price check
    if (product.price > maxPrice) {
      return false;
    }
    return true;
  });

  // Sort
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return a.id.localeCompare(b.id); // Default featured/id sorting
  });

  return (
    <div className="flex-grow">
      {/* Page Header / Breadcrumb */}
      <section className="bg-bg-charcoal text-white pt-32 pb-16 border-b border-gold/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-gold-light/60 mb-4 font-sans">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-white">Shop</span>
          </nav>
          <SectionHeading
            label="Our Collection"
            title="Handcrafted Masterpieces"
            subtitle="Browse our full catalogue of Michelin-grade individual desserts, delicate macarons, and flaky laminated pastries."
            align="left"
            light={true}
          />
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          
          {/* 1. Left Sidebar Filters (Desktop Only) */}
          <aside className="hidden lg:block w-64 flex-shrink-0 space-y-8 bg-white border border-gold-light/25 p-6 rounded-[8px] sticky top-24">
            <div className="flex justify-between items-center pb-4 border-b border-gold/10">
              <h3 className="text-serif font-bold text-lg text-text-dark flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-gold" /> Filters
              </h3>
              <button
                onClick={clearAllFilters}
                className="text-[10px] uppercase tracking-wider text-text-muted hover:text-gold font-semibold transition-colors cursor-pointer"
              >
                Clear All
              </button>
            </div>

            {/* Category Filter */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-text-dark">Category</h4>
              <div className="flex flex-col gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className={`text-sm text-left px-3 py-2 rounded transition-colors cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-gold-light/20 text-gold font-semibold border-l-2 border-gold"
                        : "text-text-muted hover:text-text-dark hover:bg-gold-light/10"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Dietary Filter */}
            <div className="space-y-3 pt-4 border-t border-gold/10">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-text-dark">Dietary Profile</h4>
              <div className="flex flex-col gap-2.5">
                {dietaryOptions.map((item) => {
                  const isChecked = selectedDietary.includes(item);
                  return (
                    <label key={item} className="flex items-center gap-3 text-sm text-text-muted hover:text-text-dark cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleDietaryToggle(item)}
                        className="rounded border-gold-light text-gold focus:ring-gold accent-gold h-4 w-4 cursor-pointer"
                      />
                      <span>{item}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-3 pt-4 border-t border-gold/10">
              <div className="flex justify-between items-center text-xs uppercase tracking-wider font-semibold text-text-dark">
                <span>Max Price</span>
                <span className="font-sans font-bold text-gold">${maxPrice.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="5"
                max="20"
                step="0.5"
                value={maxPrice}
                onChange={handlePriceChange}
                className="w-full accent-gold bg-gold-light/20 h-1 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-text-muted font-sans font-medium">
                <span>$5.00</span>
                <span>$20.00</span>
              </div>
            </div>
          </aside>

          {/* 2. Right Catalog Area */}
          <div className="flex-1 w-full space-y-6">
            {/* Controls Bar */}
            <div className="flex flex-row justify-between items-center bg-white border border-gold-light/25 p-4 rounded-[8px] shadow-sm">
              <span className="text-xs md:text-sm text-text-muted font-light">
                Showing <strong className="text-text-dark font-medium">{sortedProducts.length}</strong> bakery items
              </span>

              <div className="flex items-center gap-4">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setIsMobileFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-2 border border-gold-light/40 px-3 py-2 rounded text-xs uppercase tracking-wider font-medium text-text-muted hover:text-text-dark hover:border-gold transition-colors cursor-pointer"
                >
                  <SlidersHorizontal size={14} className="text-gold" /> Filter
                </button>

                {/* Sort selector */}
                <div className="flex items-center gap-2">
                  <ArrowUpDown size={14} className="text-gold hidden md:block" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gold-light/40 bg-white px-3 py-2 rounded text-xs uppercase tracking-wider font-medium text-text-muted focus:outline-none focus:border-gold cursor-pointer"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Rating</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {sortedProducts.length === 0 ? (
              <div className="bg-white border border-gold-light/25 rounded-[8px] py-20 px-4 text-center space-y-4">
                <p className="text-serif text-lg font-semibold text-text-dark">
                  No creations match your filter selection
                </p>
                <p className="text-sm text-text-muted max-w-sm mx-auto font-light">
                  Try adjusting your category, increasing your budget slider, or selecting fewer dietary profiles.
                </p>
                <Button variant="outline" size="sm" onClick={clearAllFilters}>
                  Reset All Filters
                </Button>
              </div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {sortedProducts.map((product) => (
                    <motion.div
                      layout
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* 3. Mobile Filter Drawer */}
      <AnimatePresence>
        {isMobileFiltersOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFiltersOpen(false)}
              className="fixed inset-0 bg-bg-charcoal/50 backdrop-blur-sm z-50 cursor-pointer lg:hidden"
            />
            {/* Drawer */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed bottom-0 inset-x-0 bg-bg-cream rounded-t-[16px] max-h-[85vh] overflow-y-auto z-50 border-t border-gold/25 p-6 space-y-6 lg:hidden"
            >
              <div className="flex justify-between items-center pb-4 border-b border-gold/10">
                <h3 className="text-serif font-bold text-lg text-text-dark flex items-center gap-2">
                  <SlidersHorizontal size={18} className="text-gold" /> Filter Creations
                </h3>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="p-1 hover:bg-gold-light/20 text-text-muted hover:text-text-dark rounded transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-text-dark">Category</h4>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategorySelect(cat)}
                      className={`text-xs px-3.5 py-2 rounded-[4px] border transition-colors cursor-pointer ${
                        selectedCategory === cat
                          ? "bg-gold text-white border-gold font-semibold"
                          : "bg-white text-text-muted border-gold-light/40 hover:text-text-dark"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dietary */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-text-dark">Dietary Profile</h4>
                <div className="grid grid-cols-2 gap-3">
                  {dietaryOptions.map((item) => {
                    const isChecked = selectedDietary.includes(item);
                    return (
                      <button
                        key={item}
                        onClick={() => handleDietaryToggle(item)}
                        className={`text-xs p-3 rounded-[4px] border text-center transition-colors cursor-pointer ${
                          isChecked
                            ? "bg-gold-light/35 border-gold text-[#A1792B] font-semibold"
                            : "bg-white border-gold-light/40 text-text-muted hover:text-text-dark"
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center text-xs uppercase tracking-wider font-semibold text-text-dark">
                  <span>Max Price</span>
                  <span className="font-sans font-bold text-gold">${maxPrice.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="20"
                  step="0.5"
                  value={maxPrice}
                  onChange={handlePriceChange}
                  className="w-full accent-gold bg-gold-light/20 h-1.5 rounded-lg cursor-pointer"
                />
              </div>

              {/* Footer Buttons */}
              <div className="pt-4 border-t border-gold/15 grid grid-cols-2 gap-4">
                <Button variant="outline" size="sm" onClick={clearAllFilters} className="w-full">
                  Clear All
                </Button>
                <Button variant="primary" size="sm" onClick={() => setIsMobileFiltersOpen(false)} className="w-full">
                  Apply Filters
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ShopPage() {
  return (
    <PageTransition>
      <Navbar />
      <Suspense fallback={
        <div className="h-screen w-full flex items-center justify-center bg-bg-cream">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-serif italic text-text-muted">Loading collection...</p>
          </div>
        </div>
      }>
        <ShopContent />
      </Suspense>
      <Footer />
    </PageTransition>
  );
}
