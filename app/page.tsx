"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Truck, Sparkles, Award, Gift, Calendar, ArrowRight, Heart, ShoppingBag } from "lucide-react";
import { images } from "@/lib/images";
import { mockProducts, mockTastingBoxes, mockBlogPosts } from "@/lib/mock-data";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import SectionHeading from "@/components/SectionHeading";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import PageTransition from "@/components/PageTransition";
import HeroSlider from "@/components/HeroSlider";

export default function HomePage() {
  // Take first 4 products for featured section
  const featuredProducts = mockProducts.slice(0, 4);
  // Take first 3 tasting boxes
  const featuredBoxes = mockTastingBoxes.slice(0, 3);
  // Take first 3 blog posts
  const featuredPosts = mockBlogPosts.slice(0, 3);

  // Fade-up animation configurations
  const fadeUpVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] as const } },
  };

  const staggerContainer = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  return (
    <PageTransition>
      <Navbar />

      <main className="flex-grow">
        {/* 1. HERO SECTION — Cinematic Full-Screen Slider */}
        <HeroSlider />

        {/* 2. TRUST STRIP */}
        <section className="bg-bg-charcoal text-gold-light/80 py-6 border-b border-gold/15">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="flex flex-col md:flex-row items-center justify-center gap-3">
                <Truck size={18} className="text-gold" />
                <span className="text-xs uppercase tracking-wider font-medium">Same-Day Manhattan Delivery</span>
              </div>
              <div className="flex flex-col md:flex-row items-center justify-center gap-3">
                <Sparkles size={18} className="text-gold" />
                <span className="text-xs uppercase tracking-wider font-medium">Made Fresh Daily</span>
              </div>
              <div className="flex flex-col md:flex-row items-center justify-center gap-3">
                <Award size={18} className="text-gold" />
                <span className="text-xs uppercase tracking-wider font-medium">Michelin Pastry Chefs</span>
              </div>
              <div className="flex flex-col md:flex-row items-center justify-center gap-3">
                <Gift size={18} className="text-gold" />
                <span className="text-xs uppercase tracking-wider font-medium">Gift-Ready Packaging</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. FEATURED COLLECTION */}
        <section className="py-24 md:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <SectionHeading
              label="Our Signature Creations"
              title="Desserts of Rare Distinction"
              subtitle="Every dessert is an expression of precision, balance, and pure culinary passion. Explore our signature collection below."
            />
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {featuredProducts.map((product) => (
              <motion.div key={product.id} variants={fadeUpVariant}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-16">
            <Link href="/shop">
              <Button variant="outline">View Full Collection</Button>
            </Link>
          </div>
        </section>

        {/* 4. THE STORY STRIP */}
        <section className="py-24 bg-white border-y border-gold/15 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left Column: Image with soft gold frame */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="absolute inset-4 border border-gold/30 translate-x-4 translate-y-4 rounded-[8px] z-0" />
                <div className="relative z-10 aspect-[4/3] w-full rounded-[8px] overflow-hidden shadow-lg border border-gold-light/20">
                  <img
                    src={images.storyChef}
                    alt="Pastry chef assembling a cake"
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>

              {/* Right Column: Text */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                <SectionHeading
                  label="Our Philosophy"
                  title="An Obsession Over the Perfect Ingredient"
                  align="left"
                />
                <div className="space-y-4 text-sm md:text-base font-light text-text-muted leading-relaxed text-center lg:text-left">
                  <p>
                    At KingsBakery, we believe a dessert is not merely food—it is a fleeting moment of artistic luxury. Every recipe begins with a months-long search for single-origin cacao, hand-harvested vanilla beans from micro-farms, and butter possessing the perfect melting parameters.
                  </p>
                  <p>
                    Our kitchen operates with the rigor of a scientific laboratory and the heart of an artisan workshop. By combining slow cold fermentation, precise thermal curves, and hand-laminated structures, we create desserts that are visually stunning and deep in flavor complexity.
                  </p>
                </div>
                <div className="pt-4 text-center lg:text-left">
                  <Link href="/about">
                    <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-gold hover:text-gold-light transition-colors cursor-pointer group">
                      Discover Our Story
                      <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 5. TASTING BOXES SPOTLIGHT */}
        <section className="bg-bg-charcoal text-white py-24 md:py-32 border-b border-gold/25">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <SectionHeading
                label="Exclusive Tasting Collections"
                title="Curated Flights of Fancy"
                subtitle="Designed for gifting, events, or ultimate indulgence. Our tasting boxes pack complementary textures and flavors into jewel-like boxes."
                light={true}
              />
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {featuredBoxes.map((box) => (
                <motion.div
                  key={box.id}
                  variants={fadeUpVariant}
                  className="group bg-white/5 border border-gold/15 rounded-[8px] overflow-hidden hover:border-gold transition-all duration-300 flex flex-col justify-between"
                >
                  <Link href={`/tasting-boxes/${box.slug}`}>
                    <div className="relative aspect-[4/3] overflow-hidden bg-bg-charcoal/20">
                      <img
                        src={box.image}
                        alt={box.name}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute top-3 right-3 bg-gold text-white text-[10px] font-semibold tracking-wider px-2 py-1 uppercase rounded-[2px]">
                        {box.itemCount} Pieces
                      </div>
                    </div>
                  </Link>

                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div className="space-y-2">
                      <Link href={`/tasting-boxes/${box.slug}`}>
                        <h3 className="text-serif font-bold text-lg text-white group-hover:text-gold transition-colors">
                          {box.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-gold-light/60 font-light leading-relaxed line-clamp-2">
                        {box.description}
                      </p>
                    </div>
                    
                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/10">
                      <span className="font-sans font-semibold text-sm text-gold">
                        ${box.price.toFixed(2)}
                      </span>
                      <Link href={`/tasting-boxes/${box.slug}`}>
                        <span className="text-[10px] uppercase tracking-wider text-white group-hover:text-gold transition-colors flex items-center gap-1">
                          Configure <ArrowRight size={12} />
                        </span>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <div className="text-center mt-16">
              <Link href="/tasting-boxes">
                <Button variant="primary">Browse Tasting Boxes</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* 6. TEXTURE/QUOTE BREAK */}
        <section className="relative py-32 md:py-48 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src={images.textureChocolate}
              alt="Macro chocolate close up"
              className="w-full h-full object-cover opacity-35"
            />
            <div className="absolute inset-0 bg-bg-charcoal/80" />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto text-center px-4 space-y-6">
            <span className="text-gold font-sans text-5xl leading-none">“</span>
            <p className="font-sans text-xl md:text-2xl italic font-light text-bg-cream leading-relaxed">
              "We do not cut corners. We do not use shortcuts. Lamination takes three days, chocolate takes precision crystal control, and the client deserves nothing less than royal perfection."
            </p>
            <span className="block text-xs uppercase tracking-[0.2em] text-gold font-semibold pt-4">
              — Chef Marcus King, Founder
            </span>
          </div>
        </section>

        {/* 7. HOW DELIVERY WORKS */}
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-gold/15">
          <div className="text-center mb-16">
            <SectionHeading
              label="The Delivery Experience"
              title="Fresh From Our Oven to Your Table"
              subtitle="We maintain an unbroken cold-chain and climate-controlled delivery fleet to guarantee texture and temperature."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border border-gold/30 flex items-center justify-center text-gold bg-white shadow-sm">
                <ShoppingBag size={24} />
              </div>
              <h3 className="text-serif font-bold text-lg text-text-dark">1. Select Your Patisserie</h3>
              <p className="text-sm font-light text-text-muted max-w-xs leading-relaxed">
                Choose from our individual desserts, artisan pastries, or select a customizable curated tasting box.
              </p>
            </div>

            <div className="space-y-4 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border border-gold/30 flex items-center justify-center text-gold bg-white shadow-sm">
                <Calendar size={24} />
              </div>
              <h3 className="text-serif font-bold text-lg text-text-dark">2. Secure a Delivery Slot</h3>
              <p className="text-sm font-light text-text-muted max-w-xs leading-relaxed">
                Pick a delivery date and a dedicated 3-hour window in our interactive checkout calendar.
              </p>
            </div>

            <div className="space-y-4 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border border-gold/30 flex items-center justify-center text-gold bg-white shadow-sm">
                <Truck size={24} />
              </div>
              <h3 className="text-serif font-bold text-lg text-text-dark">3. Fresh Temperature Delivery</h3>
              <p className="text-sm font-light text-text-muted max-w-xs leading-relaxed">
                Our vehicles deliver directly to your New York address, beautifully box-wrapped and gift-ready.
              </p>
            </div>
          </div>
        </section>

        {/* 8. TESTIMONIALS CAROUSEL */}
        <section className="py-24 bg-bg-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <SectionHeading
                label="Connoisseur Feedback"
                title="Reviews from the Royal Court"
              />
            </div>
            <TestimonialCarousel />
          </div>
        </section>

        {/* 9. JOURNAL PREVIEW */}
        <section className="py-24 bg-white border-t border-gold/15">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
              <SectionHeading
                label="From the Journal"
                title="Baking Science & Technical Insights"
                align="left"
                className="mb-0"
              />
              <Link href="/blog">
                <Button variant="outline" size="sm">Read all articles</Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredPosts.map((post) => (
                <div
                  key={post.id}
                  className="group bg-bg-cream border border-gold-light/20 rounded-[8px] overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                >
                  <Link href={`/blog/${post.slug}`}>
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge variant="charcoal">{post.category}</Badge>
                      </div>
                    </div>
                  </Link>

                  <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <span className="text-[10px] text-text-muted tracking-wider block font-sans">
                        {post.date} • {post.readTime}
                      </span>
                      <Link href={`/blog/${post.slug}`}>
                        <h3 className="text-serif font-bold text-base text-text-dark group-hover:text-gold transition-colors line-clamp-2 leading-snug">
                          {post.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-text-muted font-light leading-relaxed line-clamp-2">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-gold/10">
                      <Link href={`/blog/${post.slug}`}>
                        <span className="text-xs font-semibold text-gold hover:text-gold-light tracking-wide uppercase transition-colors inline-flex items-center gap-1">
                          Read Study <ArrowRight size={12} />
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 10. INSTAGRAM STRIP */}
        <section className="bg-bg-charcoal border-t border-gold/25 py-12 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="text-center">
              <span className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">
                Follow @KingsBakery
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              <div className="aspect-square bg-white/5 rounded-[4px] overflow-hidden border border-white/10 group cursor-pointer">
                <img src={images.productChocolateTart} alt="Instagram 1" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="aspect-square bg-white/5 rounded-[4px] overflow-hidden border border-white/10 group cursor-pointer">
                <img src={images.productMacarons} alt="Instagram 2" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="aspect-square bg-white/5 rounded-[4px] overflow-hidden border border-white/10 group cursor-pointer">
                <img src={images.productCroissant} alt="Instagram 3" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="aspect-square bg-white/5 rounded-[4px] overflow-hidden border border-white/10 group cursor-pointer">
                <img src={images.productCheesecake} alt="Instagram 4" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="aspect-square bg-white/5 rounded-[4px] overflow-hidden border border-white/10 group cursor-pointer">
                <img src={images.productEclair} alt="Instagram 5" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="aspect-square bg-white/5 rounded-[4px] overflow-hidden border border-white/10 group cursor-pointer">
                <img src={images.productTastingBox} alt="Instagram 6" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </PageTransition>
  );
}
