"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Keyboard, X } from "lucide-react";

interface Shortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  description: string;
  category: string;
}

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const shortcuts: Shortcut[] = [
  // Selection shortcuts
  {
    key: "a",
    ctrlKey: true,
    description: "Barcha rowlarni tanlash",
    category: "Selection",
  },
  {
    key: "e",
    ctrlKey: true,
    description: "Tanlangan rowlarni Excel export qilish",
    category: "Export",
  },
];

const categories = ["All", "Selection", "Export"];

export function ShortcutsModal({ isOpen, onClose }: ShortcutsModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredShortcuts = shortcuts.filter((shortcut) => {
    const matchesSearch =
      shortcut.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shortcut.key.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || shortcut.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatKeyCombo = (shortcut: Shortcut) => {
    const keys = [];
    if (shortcut.ctrlKey) keys.push("Ctrl");
    if (shortcut.shiftKey) keys.push("Shift");
    if (shortcut.altKey) keys.push("Alt");
    if (shortcut.metaKey) keys.push("Cmd");
    keys.push(shortcut.key);
    return keys.join(" + ");
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Selection":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "Export":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  // Escape key bilan modal yopish
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Integrations sahifasida foydalanish mumkin bo'lgan qisqa tugmalar
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Shortcut qidirish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Shortcuts List */}
          <div className="max-h-96 overflow-y-auto space-y-2">
            {filteredShortcuts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Hech qanday shortcut topilmadi
              </div>
            ) : (
              filteredShortcuts.map((shortcut, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Badge className={getCategoryColor(shortcut.category)}>
                      {shortcut.category}
                    </Badge>
                    <span className="text-sm font-medium">
                      {shortcut.description}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {formatKeyCombo(shortcut)
                      .split(" + ")
                      .map((key, keyIndex) => (
                        <div key={keyIndex} className="flex items-center gap-1">
                          <kbd className="px-2 py-1 text-xs font-mono bg-muted rounded border">
                            {key}
                          </kbd>
                          {keyIndex <
                            formatKeyCombo(shortcut).split(" + ").length -
                              1 && (
                            <span className="text-muted-foreground">+</span>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              {filteredShortcuts.length} ta shortcut topildi
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                <X className="h-4 w-4 mr-2" />
                Yopish
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
