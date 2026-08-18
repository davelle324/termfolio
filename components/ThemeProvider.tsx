"use client";

import { useEffect } from "react";
import { applyTheme, loadSavedTheme } from "@/lib/themes";

export default function ThemeProvider() {
  useEffect(() => {
    applyTheme(loadSavedTheme());
  }, []);

  return null;
}
