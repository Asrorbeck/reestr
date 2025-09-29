// API utility functions for backend integration

const API_BASE_URL = "http://localhost:3001/api";

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = sessionStorage.getItem("auth_token");

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    // If token is expired (401), try to refresh it
    if (response.status === 401 && token && endpoint !== "/auth/refresh") {
      const refreshToken = sessionStorage.getItem("auth_refresh_token");

      if (refreshToken) {
        try {
          const refreshResult = await authApi.refresh(refreshToken);

          if (refreshResult.success && refreshResult.data) {
            // Update token in sessionStorage
            sessionStorage.setItem("auth_token", refreshResult.data.token);

            // Retry the original request with new token
            const retryConfig: RequestInit = {
              ...config,
              headers: {
                ...config.headers,
                Authorization: `Bearer ${refreshResult.data.token}`,
              },
            };

            const retryResponse = await fetch(
              `${API_BASE_URL}${endpoint}`,
              retryConfig
            );
            const retryData = await retryResponse.json();

            if (!retryResponse.ok) {
              return {
                success: false,
                error:
                  retryData.error ||
                  `HTTP error! status: ${retryResponse.status}`,
              };
            }

            return retryData;
          } else {
            // Refresh failed, clear tokens and redirect to login
            sessionStorage.removeItem("auth_token");
            sessionStorage.removeItem("auth_refresh_token");
            sessionStorage.removeItem("auth_user");
            window.location.href = "/login";
            return {
              success: false,
              error: "Session expired. Please login again.",
            };
          }
        } catch (refreshError) {
          // Refresh failed, clear tokens and redirect to login
          sessionStorage.removeItem("auth_token");
          sessionStorage.removeItem("auth_refresh_token");
          sessionStorage.removeItem("auth_user");
          window.location.href = "/login";
          return {
            success: false,
            error: "Session expired. Please login again.",
          };
        }
      } else {
        // No refresh token, redirect to login
        sessionStorage.removeItem("auth_token");
        sessionStorage.removeItem("auth_user");
        window.location.href = "/login";
        return {
          success: false,
          error: "Session expired. Please login again.",
        };
      }
    }

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `HTTP error! status: ${response.status}`,
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error occurred",
    };
  }
}

// Specific API functions
export const authApi = {
  login: (email: string, password: string) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  logout: () =>
    apiRequest("/auth/logout", {
      method: "POST",
    }),

  verifyToken: () =>
    apiRequest("/auth/verify", {
      method: "GET",
    }),

  refresh: (refreshToken: string) =>
    apiRequest("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refresh_token: refreshToken }),
    }),
};

export const integrationsApi = {
  getAll: () => apiRequest("/integrations"),

  getById: (id: string) => apiRequest(`/integrations/${id}`),

  create: (data: any) =>
    apiRequest("/integrations", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiRequest(`/integrations/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest(`/integrations/${id}`, {
      method: "DELETE",
    }),
};

export const usersApi = {
  getAll: () => apiRequest("/users"),

  getById: (id: string) => apiRequest(`/users/${id}`),

  create: (data: any) =>
    apiRequest("/users", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiRequest(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest(`/users/${id}`, {
      method: "DELETE",
    }),
};

export const auditApi = {
  getLogs: (params?: any) => {
    const queryString = params
      ? `?${new URLSearchParams(params).toString()}`
      : "";
    return apiRequest(`/audit/logs${queryString}`);
  },
};

export const settingsApi = {
  get: () => apiRequest("/settings"),

  update: (data: any) =>
    apiRequest("/settings", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};
