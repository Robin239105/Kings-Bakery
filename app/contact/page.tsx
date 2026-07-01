"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { ChevronRight, Phone, Mail, Clock, MapPin, Check, Send } from "lucide-react";
import { images } from "@/lib/images";
import { submitContactForm } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeading from "@/components/SectionHeading";
import Button from "@/components/ui/Button";
import PageTransition from "@/components/PageTransition";

const contactSchema = zod.object({
  name: zod.string().min(2, "Name must be at least 2 characters"),
  email: zod.string().email("Please enter a valid email address"),
  subject: zod.string().min(1, "Please choose a subject"),
  message: zod.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = zod.infer<typeof contactSchema>;

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsLoading(true);
    try {
      const res = await submitContactForm(data);
      if (res.success) {
        setIsSubmitted(true);
        reset();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const subjectOptions = [
    "General Inquiry",
    "Custom Cake Inquiry",
    "Catering / Corporate Order",
    "Feedback / Review",
  ];

  return (
    <PageTransition>
      <Navbar />

      <main className="flex-grow pt-28 pb-24">
        {/* Breadcrumb */}
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-2 text-xs uppercase tracking-widest text-text-muted font-sans border-b border-gold/10">
          <Link href="/" className="hover:text-gold transition-colors">Home</Link>
          <ChevronRight size={12} />
          <span className="text-text-dark font-medium">Contact</span>
        </nav>

        {/* Content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Column: Form (Col 7) */}
            <div className="lg:col-span-7 space-y-6 bg-white border border-gold-light/25 p-8 rounded-[8px] shadow-sm">
              <div>
                <SectionHeading
                  label="Inquiries"
                  title="Send us a Message"
                  align="left"
                  className="mb-0"
                />
                <p className="text-sm font-light text-text-muted mt-2">
                  Have questions about our baking process or custom orders? Reach out below.
                </p>
              </div>

              {isSubmitted ? (
                <div className="bg-gold-light/10 border border-gold/45 p-6 rounded-[4px] text-center space-y-3 text-gold">
                  <Check size={32} className="mx-auto" />
                  <h3 className="text-serif font-bold text-lg text-text-dark">Message Sent Successfully</h3>
                  <p className="text-xs text-text-muted font-light max-w-sm mx-auto leading-relaxed">
                    Thank you. Your message has been forwarded to our head chef. We will contact you shortly to coordinate details.
                  </p>
                  <Button variant="outline" size="sm" onClick={() => setIsSubmitted(false)} className="mt-4">
                    Send another message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                        Full Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        className="w-full bg-white border border-gold-light/45 rounded-[4px] px-4 py-3 text-sm focus:outline-none focus:border-gold"
                        {...register("name")}
                        disabled={isLoading}
                      />
                      {errors.name && (
                        <p className="text-xs text-berry-accent">{errors.name.message}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        placeholder="johndoe@example.com"
                        className="w-full bg-white border border-gold-light/45 rounded-[4px] px-4 py-3 text-sm focus:outline-none focus:border-gold"
                        {...register("email")}
                        disabled={isLoading}
                      />
                      {errors.email && (
                        <p className="text-xs text-berry-accent">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="subject" className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                      Subject Inquiry
                    </label>
                    <select
                      id="subject"
                      className="w-full bg-white border border-gold-light/45 rounded-[4px] px-4 py-3 text-sm focus:outline-none focus:border-gold"
                      {...register("subject")}
                      disabled={isLoading}
                    >
                      <option value="">Select subject topic...</option>
                      {subjectOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    {errors.subject && (
                      <p className="text-xs text-berry-accent">{errors.subject.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="message" className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      placeholder="Please details any custom requirements, guest counts, dates, or general questions..."
                      className="w-full bg-white border border-gold-light/45 rounded-[4px] px-4 py-3 text-sm focus:outline-none focus:border-gold resize-none"
                      {...register("message")}
                      disabled={isLoading}
                    />
                    {errors.message && (
                      <p className="text-xs text-berry-accent">{errors.message.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isLoading}
                    className="w-full py-4 flex items-center justify-center gap-2"
                  >
                    <Send size={15} />
                    {isLoading ? "Sending..." : "Submit Inquiry"}
                  </Button>
                </form>
              )}
            </div>

            {/* Right Column: Info Card & Map (Col 5) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Bakery Info */}
              <div className="bg-bg-charcoal border border-gold/25 p-8 rounded-[8px] text-white space-y-6">
                <h3 className="text-serif font-bold text-xl text-gold pb-3 border-b border-white/10">
                  KingsBakery HQ
                </h3>
                
                <ul className="space-y-4 text-xs md:text-sm font-light text-gold-light/75 font-sans">
                  <li className="flex items-start gap-3">
                    <MapPin size={18} className="text-gold flex-shrink-0 mt-0.5" />
                    <span>750 Fifth Avenue, New York, NY 10019, USA</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Phone size={18} className="text-gold flex-shrink-0" />
                    <span>+1 (212) 555-0199</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Mail size={18} className="text-gold flex-shrink-0" />
                    <span>concierge@kingsbakery.com</span>
                  </li>
                  <li className="flex items-start gap-3 border-t border-white/10 pt-4 mt-4">
                    <Clock size={18} className="text-gold flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block text-white uppercase text-[9px] tracking-wider mb-1">
                        Operating Hours
                      </span>
                      <p>Tuesday — Sunday: 9:00 AM — 9:00 PM</p>
                      <p className="text-gold-light/40 mt-0.5">Closed Mondays for kitchen sanitize cycles</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Illustrated Map Placeholder */}
              <div className="relative aspect-[16/10] rounded-[8px] overflow-hidden border border-gold-light/20 shadow-md">
                <img
                  src={images.illustratedMapPlaceholder}
                  alt="Illustrated Manhattan map coordinates"
                  className="w-full h-full object-cover brightness-75 contrast-125"
                />
                
                {/* Visual marker overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-bg-charcoal/20">
                  <div className="relative flex items-center justify-center">
                    <div className="absolute w-8 h-8 bg-gold rounded-full animate-ping opacity-60" />
                    <div className="relative w-4 h-4 bg-gold rounded-full border border-white flex items-center justify-center shadow-lg" />
                  </div>
                  <span className="absolute mt-10 bg-bg-charcoal text-white text-[10px] font-semibold tracking-wider px-2 py-1 uppercase rounded border border-gold/30">
                    KingsBakery HQ
                  </span>
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
