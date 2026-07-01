import React from "react";

export interface SectionHeadingProps {
  label: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  className?: string;
  light?: boolean;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  label,
  title,
  subtitle,
  align = "center",
  className = "",
  light = false,
}) => {
  const alignment = {
    left: "text-center items-center lg:text-left lg:items-start lg:mx-0 mx-auto",
    center: "text-center items-center mx-auto",
    right: "text-center items-center lg:text-right lg:items-end lg:mx-0 mx-auto",
  };

  return (
    <div className={`flex flex-col max-w-3xl ${alignment[align]} ${className}`}>
      <span className="block text-xs md:text-sm font-semibold tracking-[0.2em] text-gold uppercase mb-2">
        {label}
      </span>
      <h2 className={`font-sans text-3xl md:text-4xl lg:text-5xl font-extrabold uppercase tracking-wide mb-4 leading-tight ${
        light ? "text-bg-cream" : "text-text-dark"
      }`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`text-sm md:text-base font-light max-w-2xl leading-relaxed ${
          light ? "text-gold-light/70" : "text-text-muted"
        }`}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;
