"use client";

import { motion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ y: 25, opacity: 0, rotateX: 60 }}
      animate={{ y: 0, opacity: 1, rotateX: 0 }}
      transition={{ ease: "backInOut", duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}
