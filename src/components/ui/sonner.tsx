'use client';

import { useTheme } from "@/components/theme-provider";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme, resolvedTheme } = useTheme();
  const appliedTheme =
    theme === "system" ? resolvedTheme : (theme as ToasterProps["theme"]);

  return (
    <Sonner
      theme={appliedTheme}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
