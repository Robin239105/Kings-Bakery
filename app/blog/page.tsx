"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, ArrowRight, BookOpen } from "lucide-react";
import { getBlogPosts } from "@/lib/api";
import { BlogPost } from "@/lib/mock-data";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeading from "@/components/SectionHeading";
import Badge from "@/components/ui/Badge";
import PageTransition from "@/components/PageTransition";

export default function BlogIndexPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    async function loadPosts() {
      setLoading(true);
      const data = await getBlogPosts();
      setPosts(data);
      setLoading(false);
    }
    loadPosts();
  }, []);

  const categories = ["All", "Technique", "Ingredients", "Behind the Scenes", "Seasonal"];

  const filteredPosts = selectedCategory === "All"
    ? posts
    : posts.filter((p) => p.category === selectedCategory);

  // Take the first post as the Featured Post
  const featuredPost = posts[0];
  const remainingPosts = filteredPosts.filter((p) => p.id !== (selectedCategory === "All" ? featuredPost?.id : null));

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-bg-cream">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-serif italic text-text-muted">Opening baking archives...</p>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <Navbar />

      <main className="flex-grow pt-28">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-2 text-xs uppercase tracking-widest text-text-muted font-sans">
          <Link href="/" className="hover:text-gold transition-colors">Home</Link>
          <ChevronRight size={12} />
          <span className="text-text-dark font-medium">Journal</span>
        </div>

        {/* Header Title */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <SectionHeading
            label="The KingsBakery Journal"
            title="The Chemistry of Pastry"
            subtitle="Explore research studies, step-by-step molecular techniques, and culinary chemistry logs written by our chefs and food scientists."
            align="left"
          />
        </section>

        {/* Category Selector Tabs */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 border-b border-gold/10">
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-4 py-2.5 rounded-[4px] uppercase tracking-wider font-semibold border transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-gold text-white border-gold"
                    : "bg-white border-gold-light/35 text-text-muted hover:text-text-dark hover:border-gold/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Blog Contents Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Featured Post Card (Visible when 'All' is selected) */}
          {selectedCategory === "All" && featuredPost && (
            <div className="group bg-white border border-gold-light/25 rounded-[12px] overflow-hidden shadow-sm hover:shadow-lg transition-shadow mb-16">
              <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* Left: Image (Col 7) */}
                <div className="lg:col-span-7 aspect-[16/10] lg:aspect-auto relative overflow-hidden bg-bg-cream">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-101 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge variant="charcoal">{featuredPost.category}</Badge>
                  </div>
                </div>

                {/* Right: Info (Col 5) */}
                <div className="lg:col-span-5 p-8 lg:p-12 flex flex-col justify-between space-y-6 text-center lg:text-left">
                  <div className="space-y-4">
                    <div className="flex items-center justify-center lg:justify-start gap-3 text-xs text-text-muted font-sans">
                      <span>{featuredPost.date}</span>
                      <span>•</span>
                      <span>{featuredPost.readTime}</span>
                    </div>
                    <Link href={`/blog/${featuredPost.slug}`}>
                      <h2 className="text-serif font-bold text-2xl lg:text-3xl text-text-dark group-hover:text-gold transition-colors leading-tight">
                        {featuredPost.title}
                      </h2>
                    </Link>
                    <p className="text-sm font-light text-text-muted leading-relaxed">
                      {featuredPost.excerpt}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-gold/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Author */}
                    <div className="flex items-center gap-3">
                      <img
                        src={featuredPost.author.avatar}
                        alt={featuredPost.author.name}
                        className="w-10 h-10 rounded-full object-cover border border-gold"
                      />
                      <div className="text-left">
                        <span className="block text-xs font-semibold text-text-dark">
                          {featuredPost.author.name}
                        </span>
                        <span className="block text-[10px] text-text-muted font-sans">
                          {featuredPost.author.role}
                        </span>
                      </div>
                    </div>

                    <Link href={`/blog/${featuredPost.slug}`}>
                      <span className="text-xs font-semibold uppercase tracking-widest text-gold hover:text-gold-light transition-colors inline-flex items-center gap-1 group/btn">
                        Read Article
                        <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-1" />
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Remaining Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(selectedCategory === "All" ? remainingPosts : filteredPosts).map((post) => (
              <div
                key={post.id}
                className="group bg-white border border-gold-light/25 rounded-[8px] overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <Link href={`/blog/${post.slug}`}>
                  <div className="relative aspect-[16/10] overflow-hidden bg-bg-cream">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge variant="cream" className="shadow-sm">{post.category}</Badge>
                    </div>
                  </div>
                </Link>

                <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-[10px] text-text-muted font-sans block">
                      {post.date} • {post.readTime}
                    </span>
                    <Link href={`/blog/${post.slug}`}>
                      <h3 className="text-serif font-bold text-base md:text-lg text-text-dark group-hover:text-gold transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h3>
                    </Link>
                    <p className="text-xs text-text-muted font-light leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gold/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen size={14} className="text-gold" />
                      <span className="text-[10px] text-text-muted">{post.author.name}</span>
                    </div>
                    <Link href={`/blog/${post.slug}`}>
                      <span className="text-xs font-semibold uppercase tracking-wider text-gold hover:text-gold-light transition-colors flex items-center gap-1 group/btn2">
                        Read Study
                        <ArrowRight size={12} className="transition-transform group-hover/btn2:translate-x-0.5" />
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </PageTransition>
  );
}
