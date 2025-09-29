"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";

export function Header() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className=" flex h-16 items-center justify-between pe-6">
        <div className="flex items-center gap-4">
          <div className="flex flex-col ms-6">
            <h1 className="text-lg font-semibold leading-none">
              Markaziy Bank
            </h1>
            <p className="text-xs text-muted-foreground">
              Integratsiyalar reestri
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
            >
              3
            </Badge>
            <span className="sr-only">Bildirishnomalar</span>
          </Button>

          <ThemeToggle />

          {/* User Menu */}
          <div className="relative" ref={menuRef}>
            <Button
              variant="ghost"
              className="relative h-8 w-8 rounded-full"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatars/01.png" alt="@username" />
                <AvatarFallback>
                  {user ? getUserInitials(user.name) : "U"}
                </AvatarFallback>
              </Avatar>
            </Button>

            {/* Custom Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 top-10 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.name || "Foydalanuvchi"}
                    </p>
                    <p className="text-xs leading-none text-gray-500 dark:text-gray-400">
                      {user?.email || "email@example.com"}
                    </p>
                    <p className="text-xs leading-none text-gray-500 dark:text-gray-400">
                      {user?.role || "Rol"}
                    </p>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profil sozlamalari
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Yordam
                  </button>
                  <hr className="my-1 border-gray-200 dark:border-gray-700" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Chiqish
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
