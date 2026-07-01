"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface ImageGalleryProps {
  images: string[];
  productName: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, productName }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 1. Large Main Viewport */}
      <div
        className="relative overflow-hidden aspect-[4/5] bg-white border border-gold-light/20 rounded-[8px] cursor-zoom-in"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <img
          src={images[activeIdx]}
          alt={productName}
          className="w-full h-full object-cover transition-transform duration-200"
          style={
            isZoomed
              ? {
                  transform: "scale(2)",
                  transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                }
              : { transform: "scale(1)" }
          }
        />
        
        {/* Edges Shadow scrim */}
        <div className="absolute inset-0 pointer-events-none shadow-inner rounded-[8px]" />
      </div>

      {/* 2. Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`relative aspect-square w-20 flex-shrink-0 bg-white border rounded-[6px] overflow-hidden transition-all cursor-pointer ${
                idx === activeIdx
                  ? "border-gold ring-2 ring-gold-light/40"
                  : "border-gold-light/30 hover:border-gold"
              }`}
              title={`View image ${idx + 1}`}
            >
              <img
                src={img}
                alt={`${productName} thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
