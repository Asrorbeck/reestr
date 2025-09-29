# Frontend API Integration Guide

Bu hujjat frontend loyihangizni yangi backend API bilan integratsiya qilish uchun yo'riqnoma hisoblanadi.

## 🔄 Frontend O'zgarishlari

### 1. API Base URL ni sozlang

`lib/api.ts` faylini yarating:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: "Network error" }));
      throw new Error(error.error || "Request failed");
    }

    return response.json();
  }

  // Auth methods
  async login(email: string, password: string) {
    return this.request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async logout() {
    const result = await this.request("/api/auth/logout", {
      method: "POST",
    });
    this.clearToken();
    return result;
  }

  async getProfile() {
    return this.request("/api/auth/profile");
  }

  // Integration methods
  async getIntegrations(filters: any = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, String(value));
      }
    });

    return this.request(`/api/integrations?${params.toString()}`);
  }

  async getIntegration(id: string) {
    return this.request(`/api/integrations/${id}`);
  }

  async createIntegration(data: any) {
    return this.request("/api/integrations", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateIntegration(id: string, data: any) {
    return this.request(`/api/integrations/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteIntegration(id: string) {
    return this.request(`/api/integrations/${id}`, {
      method: "DELETE",
    });
  }

  async exportIntegrations(filters: any = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, String(value));
      }
    });

    const response = await fetch(
      `${this.baseURL}/api/integrations/export?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Export failed");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `integratsiyalar_${
      new Date().toISOString().split("T")[0]
    }.xlsx`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  // File methods
  async uploadFile(integrationId: string, file: File) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("integration_id", integrationId);

    const response = await fetch(
      `${this.baseURL}/api/integrations/${integrationId}/files`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: "Upload failed" }));
      throw new Error(error.error || "Upload failed");
    }

    return response.json();
  }

  async getFiles(integrationId: string) {
    return this.request(`/api/integrations/${integrationId}/files`);
  }

  async downloadFile(fileId: string) {
    const response = await fetch(
      `${this.baseURL}/api/integrations/files/${fileId}/download`,
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Download failed");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `file_${fileId}`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  async deleteFile(fileId: string) {
    return this.request(`/api/integrations/files/${fileId}`, {
      method: "DELETE",
    });
  }

  // User methods
  async getUsers(filters: any = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, String(value));
      }
    });

    return this.request(`/api/users?${params.toString()}`);
  }

  async createUser(data: any) {
    return this.request("/api/users", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateUser(id: string, data: any) {
    return this.request(`/api/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteUser(id: string) {
    return this.request(`/api/users/${id}`, {
      method: "DELETE",
    });
  }

  // Audit methods
  async getAuditLogs(filters: any = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, String(value));
      }
    });

    return this.request(`/api/audit/logs?${params.toString()}`);
  }

  async getRecentActivity(limit: number = 10) {
    return this.request(`/api/audit/recent?limit=${limit}`);
  }

  async getIntegrationVersions(integrationId: string) {
    return this.request(`/api/audit/integrations/${integrationId}/versions`);
  }

  // Settings methods
  async getSettings() {
    return this.request("/api/settings");
  }

  async updateSettings(data: any) {
    return this.request("/api/settings", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // Stats methods
  async getStats() {
    return this.request("/api/integrations/stats");
  }
}

export const apiClient = new ApiClient();
```

### 2. Environment Variables

`.env.local` faylini yarating:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. Auth Context ni yangilang

`hooks/use-auth.ts` faylini yangilang:

```typescript
import { createContext, useContext, useEffect, useState } from "react";
import { apiClient } from "@/lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  role: "Administrator" | "Operator" | "Viewer";
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const response = await apiClient.getProfile();
        if (response.success) {
          setUser(response.data);
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.login(email, password);
      if (response.success) {
        apiClient.setToken(response.data.token);
        setUser(response.data.user);
      } else {
        throw new Error(response.error || "Login failed");
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
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
```

### 4. Login Form ni yangilang

`components/auth/login-form.tsx` faylini yangilang:

```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2, Eye, EyeOff } from "lucide-react";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await login(email, password);
      router.push("/");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Building2 className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Markaziy Bank</CardTitle>
          <CardDescription>
            Integratsiyalar reestriga kirish uchun ma'lumotlaringizni kiriting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email manzil</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@cbu.uz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Parol</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Parolingizni kiriting"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
                  </span>
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Kirilmoqda..." : "Kirish"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            <p>Default credentials:</p>
            <p>Email: admin@cbu.uz</p>
            <p>Password: admin123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

### 5. Integrations Page ni yangilang

`app/integrations/page.tsx` faylini yangilang (asosiy o'zgarishlar):

```typescript
// Mock data o'rniga API dan ma'lumot olish
const [integrations, setIntegrations] = useState<Integration[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const loadIntegrations = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getIntegrations({
        page: currentPage,
        limit: pageSize,
        ...headerFilters,
        search: searchTerm,
      });

      if (response.success) {
        setIntegrations(response.data);
        // Pagination ma'lumotlarini ham saqlang
      }
    } catch (error) {
      console.error("Failed to load integrations:", error);
    } finally {
      setLoading(false);
    }
  };

  loadIntegrations();
}, [currentPage, pageSize, searchTerm, headerFilters]);

// CRUD operatsiyalarni API ga ulash
const handleSave = async (integrationData: Partial<Integration>) => {
  try {
    let response;
    if (editingIntegration) {
      response = await apiClient.updateIntegration(
        editingIntegration.id,
        integrationData
      );
    } else {
      response = await apiClient.createIntegration(integrationData);
    }

    if (response.success) {
      // Ma'lumotlarni yangilash
      await loadIntegrations();
    }
  } catch (error) {
    console.error("Save failed:", error);
  }
};

const handleDelete = async (integration: Integration) => {
  if (
    window.confirm(
      `"${integration.nomi}" integratsiyasini o'chirishni xohlaysizmi?`
    )
  ) {
    try {
      const response = await apiClient.deleteIntegration(integration.id);
      if (response.success) {
        await loadIntegrations();
      }
    } catch (error) {
      console.error("Delete failed:", error);
    }
  }
};

const handleExportToExcel = async () => {
  try {
    await apiClient.exportIntegrations({
      ...headerFilters,
      search: searchTerm,
      visibleColumns: visibleColumns.join(","),
    });
  } catch (error) {
    console.error("Export failed:", error);
  }
};
```

### 6. Layout ni yangilang

`app/layout.tsx` faylini yangilang:

```typescript
import { AuthProvider } from "@/hooks/use-auth";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex h-screen bg-background">
              <Sidebar />
              <div className="flex flex-1 flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-6">{children}</main>
              </div>
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
```

## 🚀 Ishga Tushirish

1. **Backend ni ishga tushiring:**

```bash
cd backend
docker-compose up -d
npm run migrate
npm run seed
```

2. **Frontend ni yangilang va ishga tushiring:**

```bash
cd frontend
npm install
npm run dev
```

3. **Test qiling:**

- http://localhost:3000/login - Login sahifasi
- Default credentials: admin@cbu.uz / admin123
- http://localhost:3001/docs - API dokumentatsiyasi

## 🔧 Qo'shimcha Sozlamalar

### Error Handling

API xatoliklarini boshqarish uchun `lib/error-handler.ts` yarating:

```typescript
export class ApiError extends Error {
  constructor(message: string, public status: number, public code?: string) {
    super(message);
    this.name = "ApiError";
  }
}

export const handleApiError = (error: any) => {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error.message === "Network error") {
    return "Server bilan bog'lanishda xatolik";
  }

  return "Noma'lum xatolik yuz berdi";
};
```

### Loading States

Loading holatlarini ko'rsatish uchun `components/ui/loading.tsx` yarating:

```typescript
export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}
```

Bu o'zgarishlar frontend loyihangizni yangi backend API bilan to'liq integratsiya qiladi va barcha funksionallik ishlaydi.

