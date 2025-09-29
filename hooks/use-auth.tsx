"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "../lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthResponse {
  success: boolean;
  data?: {
    user: User;
    token: string;
    refresh_token: string;
  };
  error?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  logout: () => void;
  refreshAccessToken: () => Promise<boolean>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for existing tokens in sessionStorage (more secure than localStorage)
    const storedToken = sessionStorage.getItem("auth_token");
    const storedRefreshToken = sessionStorage.getItem("auth_refresh_token");
    const storedUser = sessionStorage.getItem("auth_user");

    if (storedToken && storedRefreshToken && storedUser) {
      try {
        setToken(storedToken);
        setRefreshToken(storedRefreshToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        // Clear invalid data
        sessionStorage.removeItem("auth_token");
        sessionStorage.removeItem("auth_refresh_token");
        sessionStorage.removeItem("auth_user");
      }
    }

    setIsLoading(false);
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    const result = await authApi.login(email, password);

    if (result.success && result.data) {
      setUser(result.data.user);
      setToken(result.data.token);
      setRefreshToken(result.data.refresh_token);

      // Store in sessionStorage (more secure than localStorage)
      sessionStorage.setItem("auth_token", result.data.token);
      sessionStorage.setItem("auth_refresh_token", result.data.refresh_token);
      sessionStorage.setItem("auth_user", JSON.stringify(result.data.user));

      // Redirect to dashboard
      router.push("/");
    }

    return result;
  };

  // Token refresh function
  const refreshAccessToken = async () => {
    if (!refreshToken) {
      logout();
      return false;
    }

    try {
      const result = await authApi.refresh(refreshToken);

      if (result.success && result.data) {
        setToken(result.data.token);
        sessionStorage.setItem("auth_token", result.data.token);
        return true;
      } else {
        // Refresh token is invalid, logout user
        logout();
        return false;
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      logout();
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setRefreshToken(null);
    sessionStorage.removeItem("auth_token");
    sessionStorage.removeItem("auth_refresh_token");
    sessionStorage.removeItem("auth_user");
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        refreshToken,
        isLoading,
        login,
        logout,
        refreshAccessToken,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
