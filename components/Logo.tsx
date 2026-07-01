import React from "react";

interface LogoProps {
  variant?: "full" | "mark";
  light?: boolean;
  className?: string;
  size?: number;
}

export const LogoMark: React.FC<{ light?: boolean; size?: number; className?: string }> = ({
  light = false,
  size = 40,
  className = "",
}) => {
  const strokeColor = light ? "#FAF6F0" : "#2B1D14";
  const goldColor = "#A77146";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Crown Shape */}
      <path
        d="M20 45L35 60L50 30L65 60L80 45L75 75H25L20 45Z"
        stroke={goldColor}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Wheat Stalk Line Art */}
      <line
        x1="50"
        y1="30"
        x2="50"
        y2="88"
        stroke={strokeColor}
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Wheat grains */}
      <path
        d="M44 68C40 68 38 65 42 62C46 59 48 62 48 62"
        stroke={goldColor}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M56 68C60 68 62 65 58 62C54 59 52 62 52 62"
        stroke={goldColor}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M44 76C40 76 38 73 42 70C46 67 48 70 48 70"
        stroke={goldColor}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M56 76C60 76 62 73 58 70C54 67 52 70 52 70"
        stroke={goldColor}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      
      {/* Base Platform */}
      <path
        d="M15 80H85"
        stroke={strokeColor}
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
};

export const Logo: React.FC<LogoProps> = ({
  variant = "full",
  light = false,
  className = "",
  size = 40,
}) => {
  if (variant === "mark") {
    return <LogoMark light={light} size={size} className={className} />;
  }

  const textColor = light ? "text-bg-cream" : "text-bg-charcoal";

  return (
    <div className={`flex items-center gap-3 cursor-pointer select-none ${className}`}>
      <LogoMark light={light} size={size} />
      <span className={`text-sans text-xl md:text-2xl font-bold tracking-tight ${textColor}`}>
        <span className="text-gold font-bold">Kings</span>Bakery
      </span>
    </div>
  );
};

export default Logo;
