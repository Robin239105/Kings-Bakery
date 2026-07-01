import React, { ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "charcoal";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-sans font-medium transition-all duration-300 rounded-[8px] focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";
  
  const variants = {
    primary: "bg-gold hover:bg-gold-light text-white hover:text-bg-charcoal active:scale-98 font-semibold shadow-sm hover:shadow-md",
    outline: "border border-gold text-gold hover:bg-gold hover:text-white active:scale-98 font-semibold",
    charcoal: "bg-bg-charcoal hover:bg-bg-charcoal/90 text-bg-cream active:scale-98 font-semibold border border-transparent shadow-sm",
    ghost: "text-text-muted hover:text-text-dark hover:bg-gold-light/10",
  };

  const sizes = {
    sm: "px-4 py-2 text-xs uppercase tracking-wider",
    md: "px-6 py-3 text-sm uppercase tracking-wider",
    lg: "px-8 py-4 text-base uppercase tracking-wider",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
