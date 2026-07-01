"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChevronRight, Sparkles, RefreshCw, ShoppingBag, Info, Award } from "lucide-react";
import { getTastingBoxBySlug } from "@/lib/api";
import { TastingBox } from "@/lib/mock-data";
import { useStore } from "@/lib/store";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuantityStepper from "@/components/ui/QuantityStepper";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import PageTransition from "@/components/PageTransition";

export default function TastingBoxDetailPage() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();

  const [box, setBox] = useState<TastingBox | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [customizedSelections, setCustomizedSelections] = useState<Record<string, string>>({});

  const { addToCart } = useStore();

  useEffect(() => {
    async function loadBox() {
      setLoading(true);
      const fetchedBox = await getTastingBoxBySlug(slug);
      if (fetchedBox) {
        setBox(fetchedBox);
        // Initialize customizations mapping originalName to originalName
        const initialSelections: Record<string, string> = {};
        fetchedBox.customizableItems.forEach((item) => {
          initialSelections[item.originalName] = item.originalName;
        });
        setCustomizedSelections(initialSelections);
      } else {
        setBox(null);
      }
      setLoading(false);
    }
    if (slug) {
      loadBox();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-bg-cream">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-serif italic text-text-muted">Opening tasting box profile...</p>
        </div>
      </div>
    );
  }

  if (!box) {
    return (
      <PageTransition>
        <Navbar />
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-6">
          <h2 className="text-serif text-3xl font-bold">Box Selection Vacant</h2>
          <p className="text-text-muted max-w-sm font-light">
            This tasting box selection seems to have been retired or is currently unavailable.
          </p>
          <Link href="/tasting-boxes">
            <Button variant="primary">Return to Tasting Boxes</Button>
          </Link>
        </div>
        <Footer />
      </PageTransition>
    );
  }

  // Handle changing a customizable selection
  const handleSelectionChange = (originalName: string, optionName: string) => {
    setCustomizedSelections((prev) => ({
      ...prev,
      [originalName]: optionName,
    }));
  };

  // Compile final box contents listing dynamically
  const getDynamicContents = () => {
    const counts: Record<string, number> = {};
    
    // Standard contents
    box.contents.forEach((item) => {
      counts[item.name] = item.qty;
    });

    // Apply swaps
    box.customizableItems.forEach((item) => {
      const originalQty = counts[item.originalName] || 0;
      const selectedSwap = customizedSelections[item.originalName];
      
      if (selectedSwap && selectedSwap !== item.originalName) {
        // Decrement original item
        if (counts[item.originalName] !== undefined) {
          counts[item.originalName] = 0; // standard box replaces all qty of this item
        }
        // Increment swap item
        counts[selectedSwap] = (counts[selectedSwap] || 0) + originalQty;
      }
    });

    return Object.entries(counts)
      .filter(([_, qty]) => qty > 0)
      .map(([name, qty]) => ({ name, qty }));
  };

  const dynamicContents = getDynamicContents();

  const handleAddToCart = () => {
    // We only pass customizedOptions if there are actual deviations from original
    const activeCustomizations: Record<string, string> = {};
    let hasCustomization = false;
    
    Object.entries(customizedSelections).forEach(([original, selected]) => {
      if (selected !== original) {
        activeCustomizations[original] = selected;
        hasCustomization = true;
      }
    });

    addToCart({
      productId: box.id,
      name: box.name,
      price: box.price,
      image: box.image,
      quantity,
      isTastingBox: true,
      customizedOptions: hasCustomization ? activeCustomizations : undefined,
    });
  };

  return (
    <PageTransition>
      <Navbar />

      <main className="flex-grow pt-28 pb-24">
        {/* Breadcrumb */}
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-2 text-xs uppercase tracking-widest text-text-muted font-sans border-b border-gold/10">
          <Link href="/" className="hover:text-gold transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href="/tasting-boxes" className="hover:text-gold transition-colors">Tasting Boxes</Link>
          <ChevronRight size={12} />
          <span className="text-text-dark font-medium line-clamp-1">{box.name}</span>
        </nav>

        {/* Tasting Box Profile */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left: Box Image & Contents Readout (Col 5) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="relative aspect-[4/3] rounded-[8px] overflow-hidden border border-gold-light/20 shadow-md">
                <img src={box.image} alt={box.name} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4">
                  <Badge variant="charcoal">{box.itemCount} Pieces</Badge>
                </div>
              </div>

              {/* Dynamic Contents Summary */}
              <div className="bg-white p-6 border border-gold-light/25 rounded-[8px] shadow-sm space-y-4">
                <h3 className="text-serif font-bold text-base text-text-dark flex items-center gap-2">
                  <Info size={16} className="text-gold" /> Final Box Contents
                </h3>
                <ul className="text-xs text-text-muted space-y-3 font-sans">
                  {dynamicContents.map((item, idx) => (
                    <li key={idx} className="flex justify-between items-center pb-2 border-b border-gold/5 last:border-b-0 last:pb-0">
                      <span>{item.name}</span>
                      <span className="font-semibold text-gold bg-gold-light/10 px-2 py-0.5 rounded-[2px] font-sans">
                        x{item.qty}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right: Customization controls & Details (Col 7) */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs md:text-sm font-semibold tracking-[0.2em] text-gold uppercase block mb-2">
                  Exclusive Curated Flight
                </span>
                <h1 className="font-sans text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-text-dark leading-tight">
                  {box.name}
                </h1>
                
                {/* Price */}
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gold/10">
                  <span className="font-sans font-bold text-2xl text-text-dark">
                    ${box.price.toFixed(2)}
                  </span>
                  <Badge variant="gold">Chef Curated</Badge>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm md:text-base font-light text-text-muted leading-relaxed">
                {box.longDescription}
              </p>

              {/* ----------------- INTERACTIVE CUSTOMIZATION PANEL ----------------- */}
              {box.customizableItems.length > 0 && (
                <div className="pt-6 border-t border-gold/10 space-y-6">
                  <div className="flex items-center gap-2">
                    <RefreshCw size={16} className="text-gold animate-spin-slow" />
                    <h3 className="text-serif font-bold text-lg text-text-dark">
                      Customize Your Box
                    </h3>
                  </div>

                  <div className="space-y-6">
                    {box.customizableItems.map((item) => (
                      <div
                        key={item.originalName}
                        className="bg-white p-5 border border-gold-light/25 rounded-[8px] space-y-3 shadow-sm"
                      >
                        <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                          Swap out: <strong className="text-text-dark font-semibold">{item.originalName}</strong>
                        </h4>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {/* Original Option */}
                          <label
                            onClick={() => handleSelectionChange(item.originalName, item.originalName)}
                            className={`flex flex-col p-3 border rounded-[4px] text-center cursor-pointer transition-colors ${
                              customizedSelections[item.originalName] === item.originalName
                                ? "bg-gold-light/20 border-gold text-gold font-medium"
                                : "bg-bg-cream/40 border-gold-light/20 hover:border-gold/40 text-text-muted"
                            }`}
                          >
                            <input
                              type="radio"
                              name={item.originalName}
                              checked={customizedSelections[item.originalName] === item.originalName}
                              onChange={() => {}}
                              className="sr-only"
                            />
                            <span className="text-xs leading-relaxed">{item.originalName}</span>
                            <span className="text-[10px] text-text-muted mt-1">(Original)</span>
                          </label>

                          {/* Swappable Options */}
                          {item.options.map((option) => (
                            <label
                              key={option}
                              onClick={() => handleSelectionChange(item.originalName, option)}
                              className={`flex flex-col p-3 border rounded-[4px] text-center cursor-pointer transition-colors ${
                                customizedSelections[item.originalName] === option
                                  ? "bg-gold-light/20 border-gold text-gold font-medium"
                                  : "bg-bg-cream/40 border-gold-light/20 hover:border-gold/40 text-text-muted"
                              }`}
                            >
                              <input
                                type="radio"
                                name={item.originalName}
                                checked={customizedSelections[item.originalName] === option}
                                onChange={() => {}}
                                className="sr-only"
                              />
                              <span className="text-xs leading-relaxed">{option}</span>
                              <span className="text-[10px] text-gold font-medium mt-1">Free Swap</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Box packaging highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-white border border-gold-light/25 rounded-[8px] text-xs font-light text-text-muted">
                <div className="flex items-center gap-2">
                  <Award size={16} className="text-gold" />
                  <span>Premium Gold-Embossed Gift Box</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-gold" />
                  <span>Includes Scientific Tasting Brochure</span>
                </div>
              </div>

              {/* Quantity Stepper & Add to Cart button */}
              <div className="pt-6 border-t border-gold/10 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-text-muted">
                    Quantity
                  </span>
                  <QuantityStepper value={quantity} onChange={setQuantity} />
                </div>
                
                <div className="flex-1 pt-6 sm:pt-0">
                  <Button
                    onClick={handleAddToCart}
                    variant="primary"
                    className="w-full py-4 flex items-center justify-center gap-2"
                  >
                    <ShoppingBag size={18} />
                    Add Customized Box to Cart
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </PageTransition>
  );
}
