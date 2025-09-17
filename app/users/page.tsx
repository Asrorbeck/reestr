"use client";

import { RoleGuard } from "@/components/auth/role-guard";
import { UserManagement } from "@/components/admin/user-management";
import { RolePermissions } from "@/components/admin/role-permissions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function UsersPage() {
  return (
    <RoleGuard allowedRoles={["Administrator"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Foydalanuvchilar
          </h1>
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
    </RoleGuard>
  );
}
