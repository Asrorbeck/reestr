import type React from "react";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { ConditionalLayout } from "@/components/layout/conditional-layout";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Markaziy Bank - Integratsiyalar Reestri",
  description:
    "Markaziy Bank va vazirliklar o'rtasidagi integratsiyalar reestri",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ConditionalLayout>{children}</ConditionalLayout>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
