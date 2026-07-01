"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X, User, Search, Phone, MapPin, Clock, ChevronDown } from "lucide-react";
import { useStore } from "@/lib/store";
import Logo from "./Logo";

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { cart, isHydrated, isCartOpen, setCartOpen } = useStore();
  const pathname = usePathname();
  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: "Shop", href: "/shop", description: "Browse our full collection" },
    {
      name: "Tasting Boxes",
      href: "/tasting-boxes",
      description: "Curated gift selections",
    },
    { name: "Our Story", href: "/about", description: "The KingsBakery journey" },
    { name: "Journal", href: "/blog", description: "Recipes, tips & stories" },
    { name: "Contact", href: "/contact", description: "Get in touch with us" },
  ];

  const isHomePage = pathname === "/";
  const totalItems = isHydrated ? cart.reduce((acc, item) => acc + item.quantity, 0) : 0;

  // Dropdown handlers with delay for smooth UX
  const openDropdown = (name: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(name);
  };
  const closeDropdown = () => {
    dropdownTimeoutRef.current = setTimeout(() => setActiveDropdown(null), 200);
  };

  return (
    <>
      {/* ═══════════════════════════════════════════════════
          TOP BAR — Contact info & utility links
          ═══════════════════════════════════════════════════ */}
      <div className={`hidden lg:block fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "h-0 opacity-0 overflow-hidden" : "h-9 opacity-100"
      }`}>
        <div className="bg-[#1A1510] text-white/60 text-[11px] h-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5">
                <Phone size={11} className="text-[#A77146]" />
                <span>+1 (212) 555-0199</span>
              </span>
              <span className="w-[1px] h-3 bg-white/15" />
              <span className="flex items-center gap-1.5">
                <MapPin size={11} className="text-[#A77146]" />
                <span>Manhattan, NY</span>
              </span>
              <span className="w-[1px] h-3 bg-white/15" />
              <span className="flex items-center gap-1.5">
                <Clock size={11} className="text-[#A77146]" />
                <span>Open Daily: 8AM – 10PM</span>
              </span>
            </div>
            <div className="flex items-center gap-5">
              <Link href="/faq" className="hover:text-white transition-colors">FAQ</Link>
              <span className="w-[1px] h-3 bg-white/15" />
              <Link href="/track" className="hover:text-white transition-colors">Track Order</Link>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          MAIN HEADER — Logo, Navigation, Actions
          ═══════════════════════════════════════════════════ */}
      <header
        className={`fixed left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? "top-0 bg-[#1A1510]/98 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.3)] border-b border-[#A77146]/10"
            : isHomePage
              ? "top-0 lg:top-9 bg-transparent"
              : "top-0 lg:top-9 bg-[#1A1510] border-b border-[#A77146]/10"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between transition-all duration-300 ${
            isScrolled ? "h-16" : "h-20"
          }`}>
            
            {/* ── Logo ── */}
            <Link href="/" className="flex-shrink-0 relative z-10">
              <Logo variant="full" light size={isScrolled ? 34 : 38} />
            </Link>

            {/* ── Desktop Navigation ── */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                return (
                  <div
                    key={link.name}
                    className="relative"
                    onMouseEnter={() => openDropdown(link.name)}
                    onMouseLeave={closeDropdown}
                  >
                    <Link
                      href={link.href}
                      className={`relative px-4 py-2 text-[13px] font-sans font-medium tracking-wide transition-all duration-200 rounded-md inline-flex items-center gap-1 ${
                        isActive
                          ? "text-white bg-white/[0.08]"
                          : "text-white/75 hover:text-white hover:bg-white/[0.04]"
                      }`}
                    >
                      {link.name}
                      {/* Active indicator dot */}
                      {isActive && (
                        <motion.span
                          layoutId="navIndicator"
                          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-[2px] bg-[#A77146] rounded-full"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </Link>

                    {/* Hover tooltip with page description */}
                    <AnimatePresence>
                      {activeDropdown === link.name && !isActive && (
                        <motion.div
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 4 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-2 bg-[#2A1F16] border border-[#A77146]/15 rounded-lg shadow-xl whitespace-nowrap z-50"
                        >
                          <span className="text-[11px] text-white/60 font-sans">{link.description}</span>
                          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#2A1F16] border-l border-t border-[#A77146]/15 rotate-45" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </nav>

            {/* ── Right Actions ── */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Search — Desktop labeled button */}
              <Link
                href="/shop"
                className="hidden md:inline-flex items-center gap-2 px-3 py-2 text-white/60 hover:text-white hover:bg-white/[0.04] transition-all duration-200 rounded-md"
                title="Search bakery items"
              >
                <Search size={16} />
                <span className="text-[12px] font-sans font-medium">Search</span>
              </Link>
              {/* Search — Mobile icon only */}
              <Link
                href="/shop"
                className="md:hidden p-2.5 text-white/60 hover:text-white hover:bg-white/[0.06] transition-all rounded-lg"
                title="Search"
              >
                <Search size={18} />
              </Link>

              {/* Divider */}
              <span className="hidden md:block w-[1px] h-5 bg-white/10 mx-1" />

              {/* Account */}
              <Link
                href="/account"
                className="hidden md:inline-flex items-center gap-2 px-3 py-2 text-white/60 hover:text-white hover:bg-white/[0.04] transition-all duration-200 rounded-md"
                title="My Account"
              >
                <User size={16} />
                <span className="text-[12px] font-sans font-medium">Account</span>
              </Link>
              <Link
                href="/account"
                className="md:hidden p-2.5 text-white/60 hover:text-white hover:bg-white/[0.06] transition-all rounded-lg"
                title="Account"
              >
                <User size={18} />
              </Link>

              {/* Divider */}
              <span className="hidden md:block w-[1px] h-5 bg-white/10 mx-1" />

              {/* Cart Button — always labeled */}
              <button
                onClick={() => setCartOpen(!isCartOpen)}
                className="relative inline-flex items-center gap-2 px-3 py-2 bg-[#A77146]/15 hover:bg-[#A77146]/25 text-white transition-all duration-200 rounded-md cursor-pointer group"
                title="Shopping Cart"
              >
                <ShoppingBag size={16} className="text-[#A77146] group-hover:text-[#E9D3BD] transition-colors" />
                <span className="hidden sm:inline text-[12px] font-sans font-medium">
                  Cart
                </span>
                {totalItems > 0 && (
                  <span className="ml-0.5 bg-[#A77146] text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 shadow-sm animate-fade-in">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* ── Mobile Hamburger ── */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden ml-1 p-2.5 text-white/80 hover:text-white hover:bg-white/[0.06] transition-all rounded-lg cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <X size={22} />
                    </motion.span>
                  ) : (
                    <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <Menu size={22} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════
          MOBILE FULL-SCREEN MENU
          ═══════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-[380px] bg-[#1A1510] z-40 lg:hidden flex flex-col shadow-2xl"
            >
              {/* Mobile menu header */}
              <div className="flex items-center justify-between px-6 h-20 border-b border-white/[0.06]">
                <span className="text-sm font-sans font-semibold text-white tracking-wide">Menu</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-white/60 hover:text-white hover:bg-white/[0.06] rounded-lg transition-all cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 overflow-y-auto py-4 px-4">
                {navLinks.map((link, idx) => {
                  const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                  return (
                    <motion.div
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.06 }}
                      key={link.name}
                    >
                      <Link
                        href={link.href}
                        className={`flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-200 group ${
                          isActive
                            ? "bg-[#A77146]/15 text-white"
                            : "text-white/70 hover:text-white hover:bg-white/[0.04]"
                        }`}
                      >
                        <div className="flex-1">
                          <span className={`block text-base font-sans font-semibold tracking-wide ${isActive ? "text-white" : ""}`}>
                            {link.name}
                          </span>
                          <span className="block text-[11px] font-sans text-white/40 mt-0.5">
                            {link.description}
                          </span>
                        </div>
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#A77146] flex-shrink-0" />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}

                {/* Extra mobile links */}
                <div className="mt-4 pt-4 border-t border-white/[0.06] space-y-1 px-4">
                  <Link href="/account" className="flex items-center gap-3 py-3 text-white/60 hover:text-white transition-colors">
                    <User size={16} />
                    <span className="text-sm font-sans font-medium">My Account</span>
                  </Link>
                  <Link href="/faq" className="flex items-center gap-3 py-3 text-white/60 hover:text-white transition-colors">
                    <span className="w-4 h-4 rounded-full border border-white/30 flex items-center justify-center text-[9px] font-bold">?</span>
                    <span className="text-sm font-sans font-medium">FAQ</span>
                  </Link>
                  <Link href="/track" className="flex items-center gap-3 py-3 text-white/60 hover:text-white transition-colors">
                    <MapPin size={16} />
                    <span className="text-sm font-sans font-medium">Track Order</span>
                  </Link>
                </div>
              </nav>

              {/* Mobile menu footer */}
              <div className="border-t border-white/[0.06] p-6 space-y-4">
                <Link
                  href="/shop"
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#A77146] hover:bg-[#8B5D39] text-white text-sm font-sans font-bold tracking-wide rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ShoppingBag size={16} />
                  Shop Now
                </Link>
                <div className="flex items-center justify-center gap-2 text-[11px] text-white/30 font-sans">
                  <Phone size={10} />
                  <span>+1 (212) 555-0199</span>
                  <span className="mx-1">•</span>
                  <Clock size={10} />
                  <span>8AM – 10PM</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </>
  );
};

export default Navbar;
