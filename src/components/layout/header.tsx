"use client";

import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Bell, LogOut, ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth";

const DRAFT_STORAGE_KEY = "integration_draft";

interface HeaderProps {
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
}

export function Header({ onToggleSidebar, sidebarCollapsed }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    setIsMenuOpen(false);
    await logout();
    navigate("/login", { replace: true });
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Check for draft integration
  useEffect(() => {
    const checkDraft = () => {
      try {
        const draftData = localStorage.getItem(DRAFT_STORAGE_KEY);
        const hasDraftData = !!draftData;
        setHasDraft(hasDraftData && location.pathname !== "/integrations/new");
      } catch (error) {
        console.error("Draft tekshirishda xatolik:", error);
        setHasDraft(false);
      }
    };

    checkDraft();

    // Listen for draft updates
    const handleDraftUpdate = (event: CustomEvent) => {
      setHasDraft(event.detail && location.pathname !== "/integrations/new");
    };

    window.addEventListener("draftIntegrationUpdated", handleDraftUpdate as EventListener);
    window.addEventListener("storage", checkDraft);

    return () => {
      window.removeEventListener("draftIntegrationUpdated", handleDraftUpdate as EventListener);
      window.removeEventListener("storage", checkDraft);
    };
  }, [location.pathname]);

  // Click outside to close menu and notification
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDraftClick = () => {
    setIsNotificationOpen(false);
    navigate("/integrations/new");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className=" flex h-16 items-center justify-between pe-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="h-8 w-8 ms-2 hover:!bg-[#f0b84d]"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <h1 className="text-lg font-semibold leading-none">
                Markaziy Bank
              </h1>
              <p className="text-xs text-muted-foreground">
                Integratsiyalar reestri
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:!bg-[#f0b84d]"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            >
              <Bell className="h-4 w-4" />
              {hasDraft && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
                >
                  1
                </Badge>
              )}
              <span className="sr-only">Bildirishnomalar</span>
            </Button>

            {/* Notification Dropdown */}
            {isNotificationOpen && (
              <div className="absolute right-0 top-10 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium">Bildirishnomalar</p>
                </div>
                <div className="py-1 max-h-96 overflow-y-auto">
                  {hasDraft ? (
                    <button
                      onClick={handleDraftClick}
                      className="w-full text-left px-3 py-3 text-sm hover:bg-[#f0b84d] dark:hover:bg-[#f0b84d] flex items-start gap-3 border-b border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        <FileText className="h-4 w-4 text-[#e4a216]" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          Davom ettirilmay qolgan integratsiya
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Sizda saqlangan draft integratsiya mavjud. Davom ettirish uchun bosing.
                        </p>
                      </div>
                    </button>
                  ) : (
                    <div className="px-3 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      Bildirishnomalar yo'q
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <ThemeToggle />

          {/* User Menu */}
          <div className="relative" ref={menuRef}>
            <Button
              variant="ghost"
              className="relative h-8 w-8 rounded-full hover:!bg-[#f0b84d]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatars/01.png" alt="@username" />
                <AvatarFallback className="text-[#e4a216] dark:text-inherit">
                  {user?.email
                    ? user.email.split("@")[0].substring(0, 2).toUpperCase()
                    : "U"}
                </AvatarFallback>
              </Avatar>
            </Button>

            {/* Custom Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 top-10 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Foydalanuvchi
                    </p>
                    <p className="text-xs leading-none text-gray-500 dark:text-gray-400">
                      {user?.email || "email@example.com"}
                    </p>
                    <p className="text-xs leading-none text-gray-500 dark:text-gray-400">
                      Administrator
                    </p>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    className="w-full text-left px-3 py-2 text-sm hover:bg-[#f0b84d] dark:hover:bg-[#f0b84d]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profil sozlamalari
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 text-sm hover:bg-[#f0b84d] dark:hover:bg-[#f0b84d]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Yordam
                  </button>
                  <hr className="my-1 border-gray-200 dark:border-gray-700" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-[#f0b84d] dark:hover:bg-[#f0b84d] flex items-center"
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
