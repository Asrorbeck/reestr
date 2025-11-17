import { useEffect } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth/auth-provider";
import { ConditionalLayout } from "@/components/layout/conditional-layout";
import { Toaster } from "@/components/ui/sonner";
import { Toaster as HotToaster } from "react-hot-toast";

import HomeRedirect from "@/pages/home-redirect";
import LoginPage from "@/pages/login";
import IntegrationsPage from "@/pages/integrations";
import IntegrationDetailPage from "@/pages/integrations/integration-detail";
import IntegrationEditPage from "@/pages/integrations/integration-edit";
import NewIntegrationPage from "@/pages/integrations/integration-new";
import AnalyticsPage from "@/pages/analytics";
import AuditPage from "@/pages/audit";
import SettingsPage from "@/pages/settings";
import UsersPage from "@/pages/users";

function AppRoutes() {
  const navigate = useNavigate();

  useEffect(() => {
    const redirect = sessionStorage.getItem("redirect");
    if (redirect) {
      sessionStorage.removeItem("redirect");
      navigate(redirect, { replace: true });
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/integrations" element={<IntegrationsPage />} />
      <Route path="/integrations/new" element={<NewIntegrationPage />} />
      <Route path="/integrations/edit/:id" element={<IntegrationEditPage />} />
      <Route path="/integrations/:id" element={<IntegrationDetailPage />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
      <Route path="/audit" element={<AuditPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/users" element={<UsersPage />} />
      <Route path="*" element={<Navigate to="/integrations" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AuthProvider>
          <ConditionalLayout>
            <AppRoutes />
          </ConditionalLayout>
        </AuthProvider>
        <Toaster />
        <HotToaster position="top-right" />
      </ThemeProvider>
    </BrowserRouter>
  );
}
