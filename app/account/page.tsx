"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ChevronRight, 
  Lock, 
  Mail, 
  User, 
  ShieldCheck, 
  LogOut, 
  ShoppingBag, 
  Compass, 
  MapPin, 
  Award,
  Sparkles,
  ArrowRight,
  Loader2
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/ui/Button";
import PageTransition from "@/components/PageTransition";

export default function AccountPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Load session from localStorage on mount
  useEffect(() => {
    const loggedIn = localStorage.getItem("customer_logged_in") === "true";
    if (loggedIn) {
      setIsLoggedIn(true);
      setName(localStorage.getItem("customer_name") || "Al Amin Robin");
      setEmail(localStorage.getItem("customer_email") || "robin@kingsbakery.com");
    }
  }, []);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsLoggedIn(true);

      const customerName = activeTab === "login" ? "Al Amin Robin" : name || "Al Amin Robin";
      const customerEmail = email || "robin@kingsbakery.com";

      localStorage.setItem("customer_logged_in", "true");
      localStorage.setItem("customer_name", customerName);
      localStorage.setItem("customer_email", customerEmail);
      setName(customerName);
    }, 1000);
  };

  const handleLogout = () => {
    localStorage.removeItem("customer_logged_in");
    localStorage.removeItem("customer_name");
    localStorage.removeItem("customer_email");
    setIsLoggedIn(false);
    setEmail("");
    setPassword("");
    setName("");
  };

  const mockPastOrders = [
    { number: "KB-847291", date: "June 24, 2026", total: "$57.00", items: "Chocolate Gold Leaf Tart x1, French Macarons x1", status: "DELIVERED" },
    { number: "KB-725381", date: "May 12, 2026", total: "$79.50", items: "Royal Vanilla Cheesecake x1, Flaky Croissant x2", status: "DELIVERED" },
    { number: "KB-612984", date: "April 02, 2026", total: "$45.00", items: "The Signature Tasting Box x1", status: "DELIVERED" }
  ];

  return (
    <PageTransition>
      <Navbar />

      <main className="flex-grow pt-28 pb-24 bg-slate-50 font-sans">
        
        {/* Breadcrumb */}
        <nav className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-2 text-xs uppercase tracking-widest text-text-muted border-b border-gold/10">
          <Link href="/" className="hover:text-gold transition-colors">Home</Link>
          <ChevronRight size={12} />
          <span className="text-text-dark font-medium">My Account</span>
        </nav>

        {isLoggedIn ? (
          /* ── AUTHENTICATED STATE: CUSTOMER DASHBOARD PANEL ── */
          <section className="max-w-5xl mx-auto px-4 pt-10 space-y-8">
            
            {/* Header Member Profile Banner */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-md relative overflow-hidden">
              <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-gold/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-16 h-16 rounded-full bg-[#A77146]/20 border border-[#A77146] flex items-center justify-center text-white shrink-0">
                  <User size={30} className="text-[#E9D3BD]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-serif text-2xl font-bold tracking-wide uppercase text-white">{name}</h1>
                    <span className="bg-gold/10 border border-gold/30 text-[#E9D3BD] text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Award size={10} /> Connoisseur Gold
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 font-normal">{email}</p>
                </div>
              </div>

              <div className="flex gap-3 relative z-10 w-full md:w-auto">
                <div className="bg-slate-800 border border-slate-700/50 p-4 rounded-xl text-center flex-1 md:flex-none">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Royalty Balance</span>
                  <span className="text-xl font-bold text-[#E9D3BD] mt-0.5 block flex items-center justify-center gap-1">
                    <Sparkles size={16} className="text-gold" /> 1,250 pts
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700/50 hover:border-slate-600 rounded-xl px-4 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  title="Sign Out Session"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </div>

            {/* Main Content Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Side: Orders History */}
              <div className="lg:col-span-2 bg-white border border-gold-light/20 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
                <div>
                  <h3 className="font-bold text-text-dark uppercase tracking-wider text-sm border-b border-slate-100 pb-3">
                    Order History
                  </h3>
                </div>

                <div className="space-y-4">
                  {mockPastOrders.map((ord) => (
                    <div key={ord.number} className="border border-slate-100 hover:border-gold-light/35 p-4 rounded-xl space-y-3 transition-colors">
                      <div className="flex justify-between items-center text-xs">
                        <div>
                          <span className="font-bold text-slate-900">{ord.number}</span>
                          <span className="text-slate-400 font-normal ml-2">({ord.date})</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold border bg-emerald-50 text-emerald-700 border-emerald-100">
                          {ord.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-normal leading-normal">{ord.items}</p>
                      <div className="flex justify-between items-center border-t border-slate-50 pt-2.5 text-xs">
                        <span className="font-semibold text-slate-800">Total: <span className="font-bold">{ord.total}</span></span>
                        <Link 
                          href={`/track?orderNumber=${ord.number}`}
                          className="text-[#A77146] hover:text-[#8B5D39] font-bold flex items-center gap-0.5 text-[11px] group"
                        >
                          Track Order 
                          <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side: Account Settings / Member details */}
              <div className="space-y-8">
                
                {/* Default Address Card */}
                <div className="bg-white border border-gold-light/20 rounded-2xl p-6 shadow-sm space-y-4">
                  <h3 className="font-bold text-text-dark uppercase tracking-wider text-sm border-b border-slate-100 pb-2">
                    Shipping Details
                  </h3>
                  <div className="space-y-3.5 text-xs">
                    <div className="flex gap-2.5 items-start text-slate-600">
                      <MapPin size={15} className="text-[#A77146] shrink-0 mt-0.5" />
                      <div className="leading-relaxed">
                        <p className="font-bold text-[9px] uppercase tracking-wide text-slate-400">Default Address</p>
                        <p className="font-semibold text-slate-800 mt-0.5">Al Amin Robin</p>
                        <p className="text-slate-600">725 5th Ave</p>
                        <p className="text-slate-600">New York, NY 10022</p>
                        <p className="text-slate-500 mt-1 font-normal">Phone: +1 (212) 555-0199</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Member Perks Card */}
                <div className="bg-white border border-gold-light/20 rounded-2xl p-6 shadow-sm space-y-4">
                  <h3 className="font-bold text-text-dark uppercase tracking-wider text-sm border-b border-slate-100 pb-2">
                    Club Benefits
                  </h3>
                  <ul className="space-y-3 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                      <Compass size={14} className="text-gold shrink-0 mt-0.5" />
                      <span>Early priority booking for seasonal tasting flights.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Compass size={14} className="text-gold shrink-0 mt-0.5" />
                      <span>Free climate-controlled delivery on orders over $50.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Compass size={14} className="text-gold shrink-0 mt-0.5" />
                      <span>Complementary boxes on your membership anniversary.</span>
                    </li>
                  </ul>
                </div>

              </div>

            </div>

          </section>
        ) : (
          /* ── GUEST STATE: SIGN IN / SIGN UP Toggle Forms ── */
          <section className="max-w-xl mx-auto px-4 pt-10">
            <div className="bg-white border border-gold-light/25 rounded-[12px] p-8 shadow-sm space-y-6">
              
              {/* Header tab toggle */}
              <div className="flex border-b border-gold/15 pb-px justify-center gap-8">
                <button
                  type="button"
                  onClick={() => setActiveTab("login")}
                  className={`pb-4 text-xs md:text-sm uppercase tracking-wider font-semibold relative cursor-pointer ${
                    activeTab === "login" ? "text-gold" : "text-text-muted hover:text-text-dark"
                  }`}
                >
                  Sign In
                  {activeTab === "login" && (
                    <div className="absolute bottom-0 inset-x-0 h-0.5 bg-gold" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("register")}
                  className={`pb-4 text-xs md:text-sm uppercase tracking-wider font-semibold relative cursor-pointer ${
                    activeTab === "register" ? "text-gold" : "text-text-muted hover:text-text-dark"
                  }`}
                >
                  Create Account
                  {activeTab === "register" && (
                    <div className="absolute bottom-0 inset-x-0 h-0.5 bg-gold" />
                  )}
                </button>
              </div>

              {/* Intro Header */}
              <div className="text-center">
                <h1 className="text-serif text-2xl font-bold text-text-dark">
                  {activeTab === "login" ? "Connoisseur Club Sign In" : "Register a Royal Account"}
                </h1>
                <p className="text-xs text-text-muted mt-1.5 font-light">
                  {activeTab === "login"
                    ? "Sign in to access saved addresses, order histories, and bespoke configurations."
                    : "Register to earn royalty points on collections and unlock early seasonal tasting reservations."}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleAuthSubmit} className="space-y-4 pt-2">
                {activeTab === "register" && (
                  <div className="space-y-1.5">
                    <label htmlFor="reg-name" className="text-xs font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1">
                      <User size={12} className="text-gold" /> Full Name
                    </label>
                    <input
                      id="reg-name"
                      type="text"
                      required
                      placeholder="Al Amin Robin"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white border border-gold-light/45 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <label htmlFor="acc-email" className="text-xs font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1">
                    <Mail size={12} className="text-gold" /> Email Address
                  </label>
                  <input
                    id="acc-email"
                    type="email"
                    required
                    placeholder="robin@kingsbakery.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-gold-light/45 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="acc-pass" className="text-xs font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1">
                    <Lock size={12} className="text-gold" /> Password
                  </label>
                  <input
                    id="acc-pass"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border border-gold-light/45 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                </div>

                {activeTab === "login" && (
                  <div className="text-right">
                    <a href="#" className="text-[10px] uppercase tracking-wider text-text-muted hover:text-gold transition-colors font-semibold">
                      Forgot Password?
                    </a>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  disabled={isLoading}
                  className="w-full py-4 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? (
                    <Loader2 size={16} className="animate-spin text-white" />
                  ) : (
                    activeTab === "login" ? "Sign In" : "Register Account"
                  )}
                </Button>
              </form>

              {/* Bottom features highlight */}
              <div className="border-t border-gold/15 pt-4 text-center">
                <span className="text-[10px] text-text-muted flex items-center justify-center gap-1.5 font-light">
                  <ShieldCheck size={14} className="text-gold" /> Verified secure data vaults
                </span>
              </div>

            </div>
          </section>
        )}
      </main>

      <Footer />
    </PageTransition>
  );
}
