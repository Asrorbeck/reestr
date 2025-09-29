"use client";

import { Building2 } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function LoginHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-20 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Building2 className="h-8 w-8 text-primary" />
          <div className="flex flex-col">
            <h1 className="text-xl font-bold leading-none">Markaziy Bank</h1>
            <p className="text-sm text-muted-foreground">
              Integratsiyalar reestri
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
