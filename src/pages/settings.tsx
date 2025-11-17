"use client";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Settings, Bell, Shield, Database, Clock, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const role = user?.role as
    | "Administrator"
    | "Operator"
    | "Viewer"
    | undefined;

  useEffect(() => {
    if (!loading && !hasPermission(role, "canViewSettings")) {
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

  if (!hasPermission(role, "canViewSettings")) {
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
        <h1 className="text-3xl font-bold tracking-tight">Sozlamalar</h1>
        <p className="text-muted-foreground">
          Tizim sozlamalari va konfiguratsiyasi
        </p>
      </div>

      <div className="grid gap-6">
        {/* System Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Tizim sozlamalari
            </CardTitle>
            <CardDescription>
              Asosiy tizim parametrlari va konfiguratsiyasi
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="system-name">Tizim nomi</Label>
                <Input
                  id="system-name"
                  defaultValue="Markaziy Bank - Integratsiyalar Reestri"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-email">Administrator email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  defaultValue="admin@cbu.uz"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Avtomatik arxivlash</Label>
                  <p className="text-sm text-muted-foreground">
                    Eski integratsiyalarni avtomatik arxivlash
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Audit yozuvlarini saqlash</Label>
                  <p className="text-sm text-muted-foreground">
                    Barcha o'zgarishlarni yozib borish
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Bildirishnoma sozlamalari
            </CardTitle>
            <CardDescription>
              Tizim hodisalari haqida bildirishnomalar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email bildirishnomalar</Label>
                <p className="text-sm text-muted-foreground">
                  Muhim hodisalar haqida email yuborish
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Xatolik haqida ogohlantirish</Label>
                <p className="text-sm text-muted-foreground">
                  Integratsiya xatoliklari haqida darhol xabar berish
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Haftalik hisobot</Label>
                <p className="text-sm text-muted-foreground">
                  Haftalik faoliyat hisobotini yuborish
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Xavfsizlik sozlamalari
            </CardTitle>
            <CardDescription>
              Tizim xavfsizligi va kirish nazorati
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="session-timeout">
                  Sessiya muddati (daqiqa)
                </Label>
                <Input id="session-timeout" type="number" defaultValue="30" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-attempts">Maksimal urinishlar soni</Label>
                <Input id="max-attempts" type="number" defaultValue="3" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Ikki faktorli autentifikatsiya</Label>
                  <p className="text-sm text-muted-foreground">
                    Qo'shimcha xavfsizlik uchun 2FA yoqish
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>IP manzil cheklash</Label>
                  <p className="text-sm text-muted-foreground">
                    Faqat ruxsat etilgan IP manzillardan kirish
                  </p>
                </div>
                <Switch />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monitoring Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Monitoring sozlamalari
            </CardTitle>
            <CardDescription>
              Tizim monitoring va performance sozlamalari
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="check-interval">
                  Tekshiruv intervali (daqiqa)
                </Label>
                <Input id="check-interval" type="number" defaultValue="5" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="alert-threshold">
                  Ogohlantirish chegarasi (%)
                </Label>
                <Input id="alert-threshold" type="number" defaultValue="95" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Avtomatik monitoring</Label>
                  <p className="text-sm text-muted-foreground">
                    Integratsiyalarni avtomatik tekshirish
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Performance logging</Label>
                  <p className="text-sm text-muted-foreground">
                    Tizim performance ma'lumotlarini yozib borish
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Tizim ma'lumotlari
            </CardTitle>
            <CardDescription>
              Joriy tizim holati va versiya ma'lumotlari
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Tizim versiyasi</Label>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">v1.0.0</Badge>
                  <span className="text-sm text-muted-foreground">
                    Oxirgi yangilanish: 2024-03-15
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Ma'lumotlar bazasi</Label>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-800"
                  >
                    Faol
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    PostgreSQL 14.2
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex justify-end space-x-2">
              <Button variant="outline">Sozlamalarni eksport qilish</Button>
              <Button>O'zgarishlarni saqlash</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
