"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChevronRight, ArrowLeft, ArrowRight, BookOpen, Clock, Calendar } from "lucide-react";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/api";
import { BlogPost } from "@/lib/mock-data";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeading from "@/components/SectionHeading";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import PageTransition from "@/components/PageTransition";

export default function BlogPostDetailPage() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPostData() {
      setLoading(true);
      const fetchedPost = await getBlogPostBySlug(slug);
      if (fetchedPost) {
        setPost(fetchedPost);
        const allPosts = await getBlogPosts();
        const related = allPosts.filter((p) => p.id !== fetchedPost.id).slice(0, 3);
        setRelatedPosts(related);
      } else {
        setPost(null);
      }
      setLoading(false);
    }
    if (slug) {
      loadPostData();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-bg-cream">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-serif italic text-text-muted">Opening article file...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <PageTransition>
        <Navbar />
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-6">
          <h2 className="text-serif text-3xl font-bold">Article Not Found</h2>
          <p className="text-text-muted max-w-sm font-light">
            The scientific pastry study or recipe log you are searching for is not in our archives.
          </p>
          <Link href="/blog">
            <Button variant="primary">Return to Journal</Button>
          </Link>
        </div>
        <Footer />
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <Navbar />

      <main className="flex-grow pt-28 pb-24">
        {/* Breadcrumb Navigation */}
        <nav className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-2 text-xs uppercase tracking-widest text-text-muted font-sans border-b border-gold/10">
          <Link href="/" className="hover:text-gold transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href="/blog" className="hover:text-gold transition-colors">Journal</Link>
          <ChevronRight size={12} />
          <span className="text-text-dark font-medium line-clamp-1">{post.title}</span>
        </nav>

        {/* Article Header */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <div className="space-y-6 text-center lg:text-left">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <Badge variant="gold">{post.category}</Badge>
              <div className="flex items-center gap-1.5 text-xs text-text-muted font-sans">
                <Calendar size={13} />
                <span>{post.date}</span>
                <span className="mx-1.5">•</span>
                <Clock size={13} />
                <span>{post.readTime}</span>
              </div>
            </div>
            
            <h1 className="text-serif text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-text-dark leading-tight">
              {post.title}
            </h1>

            {/* Author Byline */}
            <div className="flex items-center justify-center lg:justify-start gap-4 py-4 border-y border-gold/10">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-12 h-12 rounded-full object-cover border border-gold"
              />
              <div className="text-left">
                <span className="block text-sm font-semibold text-text-dark">
                  {post.author.name}
                </span>
                <span className="block text-xs text-text-muted font-sans">
                  {post.author.role}
                </span>
              </div>
            </div>
          </div>

          {/* Article Banner Image */}
          <div className="relative aspect-[16/9] w-full rounded-[8px] overflow-hidden my-10 border border-gold-light/20 shadow-md">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          </div>

          {/* Article Body Content (Markdown-style classes) */}
          <div
            className="prose prose-cream max-w-none text-text-dark font-light leading-relaxed space-y-6 
              prose-headings:text-serif prose-headings:font-bold prose-headings:text-text-dark prose-headings:tracking-tight
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-gold/10
              prose-p:text-sm prose-p:md:text-base prose-p:leading-relaxed prose-p:text-text-muted
              prose-blockquote:border-l-4 prose-blockquote:border-gold prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-text-dark prose-blockquote:my-6
              prose-ol:list-decimal prose-ol:pl-6 prose-ol:space-y-3 prose-ol:text-sm prose-ol:text-text-muted
              prose-li:pl-1"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Return Arrow Link */}
          <div className="pt-12 border-t border-gold/10 mt-16 flex items-center justify-between">
            <Link href="/blog">
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-gold hover:text-gold-light transition-colors cursor-pointer">
                <ArrowLeft size={16} />
                Back to Journal
              </span>
            </Link>
          </div>
        </article>

        {/* Related Posts Section */}
        {relatedPosts.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 border-t border-gold/10 pt-16">
            <div className="text-center mb-12">
              <span className="text-xs font-semibold tracking-[0.2em] text-gold uppercase block mb-2">
                Further Reading
              </span>
              <h2 className="font-sans text-2xl md:text-3xl font-bold tracking-tight text-text-dark">
                Scientific Pastry Studies
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((rPost) => (
                <div
                  key={rPost.id}
                  className="group bg-white border border-gold-light/25 rounded-[8px] overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between cursor-pointer"
                >
                  <Link href={`/blog/${rPost.slug}`}>
                    <div className="relative aspect-[16/10] overflow-hidden bg-bg-cream">
                      <img
                        src={rPost.image}
                        alt={rPost.title}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge variant="cream" className="shadow-sm">{rPost.category}</Badge>
                      </div>
                    </div>
                  </Link>

                  <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <span className="text-[10px] text-text-muted font-sans block">
                        {rPost.date} • {rPost.readTime}
                      </span>
                      <Link href={`/blog/${rPost.slug}`}>
                        <h3 className="text-serif font-bold text-base text-text-dark group-hover:text-gold transition-colors line-clamp-2 leading-snug">
                          {rPost.title}
                        </h3>
                      </Link>
                    </div>

                    <div className="pt-4 border-t border-gold/10 flex items-center justify-between">
                      <span className="text-[10px] text-text-muted font-sans">{rPost.author.name}</span>
                      <Link href={`/blog/${rPost.slug}`}>
                        <span className="text-xs font-semibold uppercase tracking-wider text-gold hover:text-gold-light transition-colors inline-flex items-center gap-1 group/btn3">
                          Read Study <ArrowRight size={12} className="transition-transform group-hover/btn3:translate-x-0.5" />
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </PageTransition>
  );
}
