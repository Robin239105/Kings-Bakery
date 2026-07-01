import React from "react";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "gold" | "charcoal" | "berry" | "cream";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "gold",
  className = "",
}) => {
  const baseStyles = "inline-flex items-center px-3 py-1 rounded-[4px] text-[10px] md:text-xs font-semibold tracking-widest uppercase select-none";
  const variants = {
    gold: "bg-gold-light/20 text-gold border border-gold/30",
    charcoal: "bg-bg-charcoal text-bg-cream border border-bg-charcoal",
    berry: "bg-berry-accent text-white border border-berry-accent",
    cream: "bg-white text-text-muted border border-gold-light",
  };

  return <span className={`${baseStyles} ${variants[variant]} ${className}`}>{children}</span>;
};

export default Badge;
