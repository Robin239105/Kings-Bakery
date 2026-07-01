"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Eye, Heart } from "lucide-react";
import { Product } from "@/lib/mock-data";
import { useStore } from "@/lib/store";
import Badge from "./ui/Badge";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const [isHovered, setIsHovered] = useState(false);

  const isWishlisted = wishlist.includes(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: 1,
      isTastingBox: false,
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-transparent flex flex-col justify-between cursor-pointer"
    >
      {/* Product Image Wrapper */}
      <Link href={`/shop/${product.slug}`}>
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-bg-cream rounded-[4px] border border-gold-light/10 shadow-sm">
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* Scrim Overlay */}
          <div className="absolute inset-0 bg-bg-charcoal/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Quick Actions Overlay (Desktop Only) */}
          <div className="absolute inset-x-0 bottom-4 flex justify-center gap-3 px-4 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <button
              onClick={handleQuickAdd}
              className="flex items-center justify-center gap-2 bg-gold hover:bg-gold-light text-white hover:text-bg-charcoal text-xs font-semibold uppercase tracking-wider py-3 px-4 rounded-[4px] shadow-lg transition-colors cursor-pointer w-full"
            >
              <ShoppingBag size={14} />
              Quick Add
            </button>
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full text-text-muted hover:text-berry-accent shadow-sm transition-colors cursor-pointer z-10"
            title="Wishlist"
          >
            <Heart
              size={16}
              className={isWishlisted ? "fill-berry-accent text-berry-accent" : ""}
            />
          </button>

          {/* Dietary Badges */}
          {product.dietary.length > 0 && (
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
              {product.dietary.map((label) => (
                <Badge key={label} variant="cream" className="shadow-sm">
                  {label === "Gluten-Free" ? "GF" : label === "Vegan" ? "V" : "NF"}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </Link>

      {/* Info Content */}
      <div className="pt-4 flex flex-col justify-between min-h-[110px]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.15em] text-gold font-semibold block mb-1">
            {product.category}
          </span>
          <Link href={`/shop/${product.slug}`}>
            <h3 className="font-sans font-bold text-base text-text-dark group-hover:text-gold transition-colors leading-tight line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-text-muted mt-1.5 font-light line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>
        <div className="flex justify-between items-center mt-4 pt-3 border-t border-gold/10">
          <span className="font-sans font-semibold text-sm text-text-dark">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-xs font-light text-text-muted flex items-center gap-1">
            ★ {product.rating.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
