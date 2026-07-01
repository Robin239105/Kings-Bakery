"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Box, 
  BookOpen, 
  Calendar, 
  LogOut, 
  Menu, 
  X, 
  Cake 
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // If we are on the login page, do not render the admin layout wrapper/sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { name: "Bakery Items", href: "/admin/products", icon: Cake },
    { name: "Tasting Boxes", href: "/admin/tasting-boxes", icon: Box },
    { name: "Journal Posts", href: "/admin/blog", icon: BookOpen },
    { name: "Delivery Calendar", href: "/admin/delivery-calendar", icon: Calendar },
  ];

  const handleLogout = () => {
    // Clear the admin_token cookie
    document.cookie = "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      
      {/* ── MOBILE HEADER ── */}
      <div className="md:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800">
        <Link href="/admin" className="flex items-center gap-2 font-semibold tracking-wider text-sm text-gold-light uppercase">
          <Cake className="text-[#A77146]" size={20} />
          KingsBakery Admin
        </Link>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-1.5 rounded hover:bg-slate-800 transition-colors"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* ── SIDEBAR NAV ── */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col justify-between border-r border-slate-800 transition-transform duration-300 md:translate-x-0 md:static md:h-screen
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        
        <div className="flex flex-col flex-1">
          {/* Logo Brand Header */}
          <div className="px-6 py-6 border-b border-slate-800 flex items-center gap-3">
            <Cake className="text-[#A77146]" size={24} />
            <div>
              <h1 className="font-bold text-white tracking-wide text-md">KingsBakery</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Management Console</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-6 space-y-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                    ${isActive 
                      ? "bg-[#A77146] text-white shadow-md shadow-[#A77146]/10" 
                      : "hover:bg-slate-800 hover:text-white"
                    }
                  `}
                >
                  <Icon size={18} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Admin User Footer Action */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-slate-800/50 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut size={18} />
            Logout Session
          </button>
        </div>

      </aside>

      {/* ── BACKDROP FOR MOBILE NAV ── */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
        />
      )}

      {/* ── MAIN WORKSPACE CONTENT ── */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <div className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </div>
      </main>

    </div>
  );
}
