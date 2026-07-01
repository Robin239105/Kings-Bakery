"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminLoginSchema } from "@/lib/zod-schemas";
import { Cake, Loader2, AlertCircle } from "lucide-react";
import Button from "@/components/ui/Button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: any) => {
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setErrorMsg(json.error?.message || "Invalid credentials.");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-[#A77146]/10 text-[#A77146] rounded-full">
          <Cake size={32} />
        </div>
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Admin Portal Login
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            KingsBakery Operations Console
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-800 py-8 px-4 shadow sm:rounded-xl sm:px-10 border border-slate-700/50">
          
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            
            {/* Global Error Banner */}
            {errorMsg && (
              <div className="bg-red-950/40 border border-red-500/35 text-red-200 p-3 rounded-lg flex gap-2.5 items-start text-xs">
                <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Email Address */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Email Address
              </label>
              <div className="mt-1.5">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  disabled={loading}
                  {...register("email")}
                  className={`w-full bg-slate-950 border text-slate-100 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A77146] transition-colors
                    ${errors.email ? "border-red-500" : "border-slate-700 focus:border-[#A77146]"}
                  `}
                  placeholder="admin@kingsbakery.com"
                />
                {errors.email && (
                  <p className="mt-1.5 text-xs text-red-400 font-medium">{errors.email.message}</p>
                )}
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Access Password
              </label>
              <div className="mt-1.5">
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  disabled={loading}
                  {...register("password")}
                  className={`w-full bg-slate-950 border text-slate-100 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A77146] transition-colors
                    ${errors.password ? "border-red-500" : "border-slate-700 focus:border-[#A77146]"}
                  `}
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="mt-1.5 text-xs text-red-400 font-medium">{errors.password.message}</p>
                )}
              </div>
            </div>

            {/* Action Submit */}
            <div>
              <Button
                type="submit"
                disabled={loading}
                variant="primary"
                className="w-full !py-3.5 !rounded-lg active:scale-[0.99] text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading && <Loader2 size={16} className="animate-spin text-white" />}
                Sign In to Console
              </Button>
            </div>

          </form>

        </div>
      </div>

    </div>
  );
}
