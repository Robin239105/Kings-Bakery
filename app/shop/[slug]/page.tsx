"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, ChevronRight, Award, ShieldAlert, Sparkles, Star } from "lucide-react";
import { getProductBySlug, getRelatedProducts } from "@/lib/api";
import { Product } from "@/lib/mock-data";
import { useStore } from "@/lib/store";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ImageGallery from "@/components/ImageGallery";
import ProductCard from "@/components/ProductCard";
import QuantityStepper from "@/components/ui/QuantityStepper";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import PageTransition from "@/components/PageTransition";

export default function ProductDetailPage() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "ingredients" | "storage" | "reviews">("description");

  const { addToCart, toggleWishlist, wishlist } = useStore();

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const fetchedProduct = await getProductBySlug(slug);
      if (fetchedProduct) {
        setProduct(fetchedProduct);
        const fetchedRelated = await getRelatedProducts(fetchedProduct.category, fetchedProduct.id, 4);
        setRelated(fetchedRelated);
      } else {
        setProduct(null);
      }
      setLoading(false);
    }
    if (slug) {
      loadData();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-bg-cream">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-serif italic text-text-muted">Preparing dessert details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <PageTransition>
        <Navbar />
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-6">
          <h2 className="text-serif text-3xl font-bold">Creations Not Found</h2>
          <p className="text-text-muted max-w-sm font-light">
            We apologize, but this specific dessert slot appears to be vacant or seasonal.
          </p>
          <Link href="/shop">
            <Button variant="primary">Return to Shop</Button>
          </Link>
        </div>
        <Footer />
      </PageTransition>
    );
  }

  const isWishlisted = wishlist.includes(product.id);

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity,
      isTastingBox: false,
    });
  };

  const tabs = [
    { id: "description", label: "Description" },
    { id: "ingredients", label: "Ingredients" },
    { id: "storage", label: "Storage & Shelf Life" },
    { id: "reviews", label: `Reviews (${product.reviews.length})` },
  ];

  return (
    <PageTransition>
      <Navbar />

      <main className="flex-grow pt-28 pb-24">
        {/* Breadcrumb Navigation */}
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-2 text-xs uppercase tracking-widest text-text-muted font-sans border-b border-gold/10">
          <Link href="/" className="hover:text-gold transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href="/shop" className="hover:text-gold transition-colors">Shop</Link>
          <ChevronRight size={12} />
          <span className="text-text-dark font-medium line-clamp-1">{product.name}</span>
        </nav>

        {/* Bakery Item Details Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left: Image Gallery (Grid Col 5) */}
            <div className="lg:col-span-5 w-full">
              <ImageGallery images={product.images} productName={product.name} />
            </div>

            {/* Right: Info & Actions (Grid Col 7) */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs md:text-sm font-semibold tracking-[0.2em] text-gold uppercase block mb-2">
                  Our {product.category} Collection
                </span>
                <h1 className="font-sans text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-text-dark leading-tight">
                  {product.name}
                </h1>
                
                {/* Price and Rating */}
                <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gold/10">
                  <span className="font-sans font-bold text-2xl text-text-dark">
                    ${product.price.toFixed(2)}
                  </span>
                  <div className="h-5 w-[1px] bg-gold/20" />
                  <div className="flex items-center gap-1.5 text-sm text-text-muted">
                    <span className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={15}
                          className={
                            i < Math.floor(product.rating)
                              ? "fill-gold text-gold"
                              : "text-gold-light/40"
                          }
                        />
                      ))}
                    </span>
                    <span className="font-semibold text-text-dark">{product.rating}</span>
                    <span>({product.reviews.length} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Short Description */}
              <p className="text-sm md:text-base font-light text-text-muted leading-relaxed">
                {product.longDescription}
              </p>

              {/* Dietary / Allergen Badges */}
              <div className="flex flex-wrap gap-2.5 pt-2">
                {product.dietary.map((diet) => (
                  <Badge key={diet} variant="gold">
                    {diet}
                  </Badge>
                ))}
                {product.allergens.map((alg) => (
                  <span
                    key={alg}
                    className="inline-flex items-center px-3 py-1 rounded-[4px] text-[10px] md:text-xs font-light tracking-wide text-text-muted bg-white border border-gold-light/30"
                  >
                    Contains: {alg}
                  </span>
                ))}
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-white border border-gold-light/25 rounded-[8px] text-xs font-light text-text-muted">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-gold" />
                  <span>Made fresh by award-winning chefs</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award size={16} className="text-gold" />
                  <span>Normandy AOP Butter</span>
                </div>
              </div>

              {/* Quantity Stepper & Buttons */}
              <div className="pt-6 border-t border-gold/10 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-text-muted">
                    Quantity
                  </span>
                  <QuantityStepper value={quantity} onChange={setQuantity} />
                </div>
                
                <div className="flex-1 flex gap-3 pt-6 sm:pt-0">
                  <Button
                    onClick={handleAddToCart}
                    variant="primary"
                    className="flex-1 py-4"
                  >
                    Add to Cart
                  </Button>
                  <Button
                    onClick={() => toggleWishlist(product.id)}
                    variant="outline"
                    className="px-4"
                    title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                  >
                    <Heart
                      size={20}
                      className={isWishlisted ? "fill-berry-accent text-berry-accent" : "text-gold"}
                    />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tabs Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
          <div className="border-b border-gold/15">
            <div className="flex gap-6 md:gap-8 overflow-x-auto pb-px">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-4 text-xs md:text-sm uppercase tracking-wider font-medium transition-all relative cursor-pointer ${
                    activeTab === tab.id
                      ? "text-gold font-semibold"
                      : "text-text-muted hover:text-text-dark"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTabUnderline"
                      className="absolute bottom-0 inset-x-0 h-0.5 bg-gold"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="py-8 min-h-[160px]">
            {/* Tab: Description */}
            {activeTab === "description" && (
              <div className="prose prose-sm max-w-none text-text-muted font-light leading-relaxed space-y-4">
                <p>{product.longDescription}</p>
                <p>
                  Each piece is handcrafted under strict climate controls to ensure standard aeration, crust hydration, and moisture parameters. Ranging from stone-ground flours to imported cream, every component holds technical prestige.
                </p>
              </div>
            )}

            {/* Tab: Ingredients */}
            {activeTab === "ingredients" && (
              <div className="space-y-4">
                <h4 className="text-serif font-bold text-base text-text-dark">Component Ingredients</h4>
                <div className="flex flex-wrap gap-2">
                  {product.ingredients.map((ing) => (
                    <span
                      key={ing}
                      className="px-3.5 py-1.5 bg-white border border-gold-light/20 text-xs text-text-dark rounded-[4px] shadow-sm font-light"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
                <div className="flex items-start gap-2.5 p-4 bg-berry-accent/5 border border-berry-accent/15 rounded-[6px] text-xs text-text-muted mt-4">
                  <ShieldAlert size={16} className="text-berry-accent flex-shrink-0" />
                  <p>
                    <strong>Allergy Warning:</strong> This item contains {product.allergens.join(", ")}, and is baked in a kitchen that handles nuts, soy, gluten, and dairy.
                  </p>
                </div>
              </div>
            )}

            {/* Tab: Storage */}
            {activeTab === "storage" && (
              <div className="space-y-4 font-light text-sm text-text-muted leading-relaxed">
                <h4 className="text-serif font-bold text-base text-text-dark">Chef's Storage Instructions</h4>
                <p>{product.storage}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-white border border-gold-light/25 rounded-[8px]">
                    <h5 className="font-semibold text-xs text-text-dark uppercase mb-1">Optimum Temp</h5>
                    <p className="text-xs">Refrigerated at 2°C - 4°C is recommended for all tarts and cakes.</p>
                  </div>
                  <div className="p-4 bg-white border border-gold-light/25 rounded-[8px]">
                    <h5 className="font-semibold text-xs text-text-dark uppercase mb-1">Serving Guide</h5>
                    <p className="text-xs">Remove croissants 10 mins before eating or heat at 160°C for 4 mins.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Reviews */}
            {activeTab === "reviews" && (
              <div className="space-y-8">
                {product.reviews.length === 0 ? (
                  <div className="text-center py-8 text-text-muted font-light text-sm">
                    No reviews yet. Be the first to leave a review for this masterpiece.
                  </div>
                ) : (
                  <div className="space-y-6">
                    {product.reviews.map((rev) => (
                      <div key={rev.id} className="p-6 bg-white border border-gold-light/25 rounded-[8px] space-y-4 shadow-sm">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <img
                              src={rev.avatar}
                              alt={rev.name}
                              className="w-10 h-10 rounded-full object-cover border border-gold"
                            />
                            <div>
                              <h5 className="text-sm font-semibold text-text-dark flex items-center gap-2">
                                {rev.name}
                                {rev.verified && (
                                  <span className="bg-gold-light/20 text-[#A1792B] border border-gold/30 text-[9px] uppercase px-1.5 py-0.5 rounded-[2px] font-semibold">
                                    Verified
                                  </span>
                                )}
                              </h5>
                              <span className="text-[10px] text-text-muted font-sans">{rev.date}</span>
                            </div>
                          </div>

                          <div className="flex gap-0.5 text-gold">
                            {Array.from({ length: rev.rating }).map((_, i) => (
                              <Star key={i} size={13} className="fill-gold" />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs md:text-sm font-light text-text-muted leading-relaxed italic">
                          "{rev.comment}"
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* You May Also Love Section */}
        {related.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-28 border-t border-gold/10 pt-16">
            <div className="text-center mb-12">
              <span className="text-xs font-semibold tracking-[0.2em] text-gold uppercase block mb-2">
                Gastronomic Duets
              </span>
              <h2 className="font-sans text-2xl md:text-3xl font-bold tracking-tight text-text-dark">
                Pairs Well With
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </PageTransition>
  );
}
