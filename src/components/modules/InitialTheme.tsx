"use client";

import useTheme from "@/stores/ThemeStore";
import { useEffect } from "react";

export default function InitialTheme() {
  const initialTheme = useTheme((state) => state.initialTheme);
  useEffect(() => {
    initialTheme();
  }, []);
  return null;
}
