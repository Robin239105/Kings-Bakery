import React from "react";
import { Minus, Plus } from "lucide-react";

export interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export const QuantityStepper: React.FC<QuantityStepperProps> = ({
  value,
  onChange,
  min = 1,
  max = 99,
  className = "",
}) => {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div className={`flex items-center border border-gold/30 rounded-[4px] overflow-hidden bg-white/70 backdrop-blur-sm ${className}`}>
      <button
        type="button"
        onClick={handleDecrement}
        disabled={value <= min}
        className="p-2.5 text-text-muted hover:text-gold hover:bg-gold-light/10 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-text-muted transition-colors cursor-pointer"
      >
        <Minus size={14} />
      </button>
      <span className="w-8 text-center font-sans font-medium text-sm text-text-dark select-none">
        {value}
      </span>
      <button
        type="button"
        onClick={handleIncrement}
        disabled={value >= max}
        className="p-2.5 text-text-muted hover:text-gold hover:bg-gold-light/10 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-text-muted transition-colors cursor-pointer"
      >
        <Plus size={14} />
      </button>
    </div>
  );
};

export default QuantityStepper;
