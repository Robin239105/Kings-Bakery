"use client";

import React from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
      className="flex-grow flex flex-col"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
