'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";
type ThemeSetting = Theme | "system";

interface ThemeProviderProps {
  children: ReactNode;
  attribute?: string;
  defaultTheme?: ThemeSetting;
  storageKey?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}

interface ThemeContextValue {
  theme: ThemeSetting;
  resolvedTheme: Theme;
  setTheme: (theme: ThemeSetting) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const prefersDark = () =>
  window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;

const disableTransitionsTemporarily = () => {
  const style = document.createElement("style");
  style.appendChild(
    document.createTextNode(
      `*{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;transition:none!important}`
    )
  );
  document.head.appendChild(style);
  return () => {
    // Wait for next frame before removing to avoid flicker
    requestAnimationFrame(() => {
      document.head.removeChild(style);
    });
  };
};

export function ThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "system",
  storageKey = "theme",
  enableSystem = true,
  disableTransitionOnChange = false,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeSetting>(defaultTheme);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window === "undefined") {
      return;
    }

    const storedTheme = window.localStorage.getItem(storageKey) as
      | ThemeSetting
      | null;

    if (storedTheme) {
      setThemeState(storedTheme);
    } else {
      setThemeState(defaultTheme);
    }
  }, [defaultTheme, storageKey]);

  const resolvedTheme: Theme = useMemo(() => {
    if (!isMounted) {
      return "light";
    }
    if (theme === "system" && enableSystem) {
      return prefersDark() ? "dark" : "light";
    }
    return theme === "system" ? "light" : theme;
  }, [theme, enableSystem, isMounted]);

  const applyTheme = useCallback(
    (nextTheme: Theme) => {
      if (typeof document === "undefined") {
        return;
      }

      const root = document.documentElement;
      const cleanup =
        disableTransitionOnChange && isMounted
          ? disableTransitionsTemporarily()
          : undefined;

      if (attribute === "class") {
        root.classList.remove("light", "dark");
        root.classList.add(nextTheme);
      } else {
        root.setAttribute(attribute, nextTheme);
      }

      if (cleanup) {
        cleanup();
      }
    },
    [attribute, disableTransitionOnChange, isMounted]
  );

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    applyTheme(resolvedTheme);

    if (typeof window !== "undefined") {
      if (theme === "system") {
        window.localStorage.removeItem(storageKey);
      } else {
        window.localStorage.setItem(storageKey, theme);
      }
    }
  }, [applyTheme, resolvedTheme, storageKey, theme, isMounted]);

  useEffect(() => {
    if (!enableSystem || typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (theme === "system") {
        setThemeState("system");
      }
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [theme, enableSystem]);

  const setTheme = useCallback((value: ThemeSetting) => {
    setThemeState(value);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((current) => {
      const currentResolved =
        current === "system" && enableSystem
          ? prefersDark()
            ? "dark"
            : "light"
          : current === "system"
            ? "light"
            : current;

      return currentResolved === "dark" ? "light" : "dark";
    });
  }, [enableSystem]);

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      toggleTheme,
    }),
    [theme, resolvedTheme, setTheme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
