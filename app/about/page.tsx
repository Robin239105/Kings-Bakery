"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Award, Compass, Heart, Shield } from "lucide-react";
import { images } from "@/lib/images";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeading from "@/components/SectionHeading";
import Button from "@/components/ui/Button";
import PageTransition from "@/components/PageTransition";

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Chef Marcus King",
      role: "Founder & Head Pastry Chef",
      bio: "Former Michelin-star pastry sous chef who obsessed over bringing exact thermodynamic calculations to laminated doughs.",
      image: images.aboutTeam1,
    },
    {
      name: "Dr. Clara Dupont",
      role: "Food Scientist & Ingredient Sourcing",
      bio: "Holds a Ph.D. in Food Chemistry. Oversees the crystallization parameters of cocoa butter and flour starch hydration.",
      image: images.aboutTeam2,
    },
    {
      name: "Genevieve Roche",
      role: "Chocolatier & Artistic Director",
      bio: "Masters the aesthetics of glaze surface tension and delicate 24k gold leaf burnishing.",
      image: images.aboutTeam3,
    },
  ];

  const pressFeatures = [
    { outlet: "Vogue Gourmet", quote: "A dramatic fusion of science and luxury dessert craftsmanship." },
    { outlet: "Chef's Journal", quote: "The Almond Croissant lamination sets a new global benchmark." },
    { outlet: "Elite Traveler", quote: "Desserts so visually flawless, they deserve to be encased in glass." },
  ];

  return (
    <PageTransition>
      <Navbar />

      <main className="flex-grow pt-28">
        {/* Breadcrumb & Intro */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-2 text-xs uppercase tracking-widest text-text-muted font-sans">
          <Link href="/" className="hover:text-gold transition-colors">Home</Link>
          <ChevronRight size={12} />
          <span className="text-text-dark font-medium">Our Story</span>
        </div>

        {/* Hero Section */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <SectionHeading
                label="Our Story"
                title="Baking Elevated to a Royal Art Form"
                align="left"
                className="mb-0"
              />
              <p className="text-sm md:text-base font-light text-text-muted leading-relaxed">
                KingsBakery was born out of a simple, uncompromising desire: to remove shortcuts from the baking craft. What began as a tiny, highly insulated experimental kitchen has evolved into New York's premier pastry house.
              </p>
              <p className="text-sm md:text-base font-light text-text-muted leading-relaxed">
                We do not bake to fill shelves. We bake to construct experiences of intense taste balance, combining French pastry traditions with modern food science.
              </p>
            </div>
            
            <div className="lg:col-span-6">
              <div className="relative aspect-[16/10] w-full rounded-[8px] overflow-hidden border border-gold-light/20 shadow-md">
                <img
                  src={images.storyKitchen}
                  alt="KingsBakery kitchen interior"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Narrative Sections Alternating */}
        <section className="bg-white border-y border-gold/15 py-24 space-y-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Row 1: The Kitchen (Image Left) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="relative order-2 lg:order-1">
                <div className="absolute inset-4 border border-gold/30 -translate-x-4 translate-y-4 rounded-[8px] z-0" />
                <div className="relative z-10 aspect-[4/3] w-full rounded-[8px] overflow-hidden shadow-lg border border-gold-light/20">
                  <img
                    src={images.storyKitchen}
                    alt="Artisan bakery table"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="space-y-6 order-1 lg:order-2 text-center lg:text-left">
                <SectionHeading
                  label="The Laboratory"
                  title="Where Precision Dictates Texture"
                  align="left"
                />
                <div className="space-y-4 text-sm font-light text-text-muted leading-relaxed">
                  <p>
                    Every pastry in our shop is governed by a set of technical parameters. Our dough hydration is measured down to the milliliter, and fermentation temperatures are monitored via custom sensors to ensure exactly 48 hours of slow carbon dioxide release.
                  </p>
                  <p>
                    We check the humidity of our lamination room hourly. Too dry, and the flour dust creates cracks in the butter layers; too humid, and the dough absorbs moisture, losing its crisp honeycomb spring. This rigorous dedication guarantees that every croissant shatters perfectly on the first bite.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Ingredients (Image Right) */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6 text-center lg:text-left">
                <SectionHeading
                  label="Our Ingredients"
                  title="Sourced Without Compromise"
                  align="left"
                />
                <div className="space-y-4 text-sm font-light text-text-muted leading-relaxed">
                  <p>
                    We import AOP butter from Normandy, possessing an 82% fat content and optimal melting points for lamination. Our cocoa is single-origin, sourced ethically from Madagascar and Ecuador to offer robust dark fruit notes.
                  </p>
                  <p>
                    Our vanilla beans are selected from micro-farms in Tahiti, cured slowly to develop rich, woody volatiles. These premium materials are combined with heritage stone-ground wheat flour to craft desserts that celebrate the natural complexity of their components.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-4 border border-gold/30 translate-x-4 translate-y-4 rounded-[8px] z-0" />
                <div className="relative z-10 aspect-[4/3] w-full rounded-[8px] overflow-hidden shadow-lg border border-gold-light/20">
                  <img
                    src={images.flatlayIngredients}
                    alt="Baking flour and grains flatlay"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Grid */}
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <SectionHeading
              label="The Visionaries"
              title="Our Pastry Kitchen Leaders"
              subtitle="Meet the culinary scientists, master bakers, and artists who dedicate their days to dessert perfection."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, idx) => (
              <div
                key={idx}
                className="group bg-white border border-gold-light/25 rounded-[8px] overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="aspect-[4/5] overflow-hidden bg-bg-cream relative">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-charcoal/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-6 space-y-2">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-gold">
                    {member.role}
                  </span>
                  <h4 className="text-serif font-bold text-lg text-text-dark">{member.name}</h4>
                  <p className="text-xs font-light text-text-muted leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Press Features Strip */}
        <section className="bg-bg-charcoal text-white py-20 border-t border-gold/25">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gold/15">
              {pressFeatures.map((item, idx) => (
                <div key={idx} className="p-6 space-y-3 first:pt-0 md:first:pt-6 last:pb-0 md:last:pb-6">
                  <span className="block text-xs font-bold uppercase tracking-widest text-gold font-sans">
                    {item.outlet}
                  </span>
                  <p className="text-sm font-light text-gold-light/70 italic leading-relaxed max-w-xs mx-auto">
                    "{item.quote}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call To Action */}
        <section className="py-24 text-center space-y-6">
          <SectionHeading
            label="Experience the Art"
            title="Taste the Difference"
            subtitle="Secure a box for your next gathering or explore our individual creations."
          />
          <div className="flex gap-4 justify-center items-center pt-4">
            <Link href="/shop">
              <Button variant="primary">Shop Collection</Button>
            </Link>
            <Link href="/tasting-boxes">
              <Button variant="outline">Browse Boxes</Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </PageTransition>
  );
}
