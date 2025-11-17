import { useEffect, useCallback } from "react";

interface ShortcutConfig {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  action: () => void;
  description: string;
}

export const useKeyboardShortcuts = (shortcuts: ShortcutConfig[]) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Agar input, textarea yoki contenteditable element ichida bo'lsak, shortcuts ishlamasin
      const target = event.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.contentEditable === "true" ||
        target.closest('[contenteditable="true"]')
      ) {
        return;
      }

      shortcuts.forEach(
        ({ key, ctrlKey, shiftKey, altKey, metaKey, action }) => {
          const isCtrlPressed = ctrlKey ? event.ctrlKey : !event.ctrlKey;
          const isShiftPressed = shiftKey ? event.shiftKey : !event.shiftKey;
          const isAltPressed = altKey ? event.altKey : !event.altKey;
          const isMetaPressed = metaKey ? event.metaKey : !event.metaKey;

          if (
            event.key.toLowerCase() === key.toLowerCase() &&
            isCtrlPressed &&
            isShiftPressed &&
            isAltPressed &&
            isMetaPressed
          ) {
            event.preventDefault();
            action();
          }
        }
      );
    },
    [shortcuts]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
};

export const useIntegrationShortcuts = (
  onSelectAll: () => void,
  onExportSelected: () => void
) => {
  const shortcuts: ShortcutConfig[] = [
    {
      key: "a",
      ctrlKey: true,
      action: onSelectAll,
      description: "Barcha rowlarni tanlash",
    },
    {
      key: "e",
      ctrlKey: true,
      action: onExportSelected,
      description: "Tanlangan rowlarni Excel export qilish",
    },
  ];

  useKeyboardShortcuts(shortcuts);
};
