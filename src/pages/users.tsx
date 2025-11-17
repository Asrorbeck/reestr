"use client";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { UserManagement } from "@/components/admin/user-management";
import { RolePermissions } from "@/components/admin/role-permissions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function UsersPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const role = user?.role as "Administrator" | "Operator" | "Viewer" | undefined;

  useEffect(() => {
    if (!loading && !hasPermission(role, "canViewUsers")) {
      toast.error("Sizda bu sahifaga kirish ruxsati yo'q");
      navigate("/integrations", { replace: true });
    }
  }, [user, loading, role, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!hasPermission(role, "canViewUsers")) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">Ruxsat yo'q</p>
          <p className="text-muted-foreground">
            Sizda bu sahifaga kirish ruxsati yo'q
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Foydalanuvchilar</h1>
        <p className="text-muted-foreground">
          Tizim foydalanuvchilari va ruxsatlarini boshqarish
        </p>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Foydalanuvchilar</TabsTrigger>
          <TabsTrigger value="permissions">Rollar va ruxsatlar</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <UserManagement />
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <RolePermissions />
        </TabsContent>
      </Tabs>
    </div>
  );
}
