"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Shield, Eye, Edit, Plus, Trash2, Settings, BarChart3, FileText, Users } from "lucide-react"

interface Permission {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}

interface RolePermission {
  role: "Administrator" | "Operator" | "Viewer"
  permissions: string[]
  description: string
  color: string
}

const allPermissions: Permission[] = [
  {
    id: "view_integrations",
    name: "Integratsiyalarni ko'rish",
    description: "Integratsiyalar ro'yxati va tafsilotlarini ko'rish",
    icon: Eye,
  },
  {
    id: "create_integrations",
    name: "Integratsiya yaratish",
    description: "Yangi integratsiyalar qo'shish",
    icon: Plus,
  },
  {
    id: "edit_integrations",
    name: "Integratsiyalarni tahrirlash",
    description: "Mavjud integratsiyalarni o'zgartirish",
    icon: Edit,
  },
  {
    id: "delete_integrations",
    name: "Integratsiyalarni o'chirish",
    description: "Integratsiyalarni o'chirish va arxivlash",
    icon: Trash2,
  },
  {
    id: "view_monitoring",
    name: "Monitoringni ko'rish",
    description: "Tizim holati va statistikalarni ko'rish",
    icon: BarChart3,
  },
  {
    id: "view_audit",
    name: "Audit jurnalini ko'rish",
    description: "Tizim o'zgarishlari tarixini ko'rish",
    icon: FileText,
  },
  {
    id: "manage_users",
    name: "Foydalanuvchilarni boshqarish",
    description: "Foydalanuvchilar va rollarni boshqarish",
    icon: Users,
  },
  {
    id: "system_settings",
    name: "Tizim sozlamalari",
    description: "Tizim sozlamalarini o'zgartirish",
    icon: Settings,
  },
]

const rolePermissions: RolePermission[] = [
  {
    role: "Administrator",
    permissions: [
      "view_integrations",
      "create_integrations",
      "edit_integrations",
      "delete_integrations",
      "view_monitoring",
      "view_audit",
      "manage_users",
      "system_settings",
    ],
    description: "To'liq tizim ruxsatlariga ega. Barcha amallarni bajarish mumkin.",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  },
  {
    role: "Operator",
    permissions: ["view_integrations", "create_integrations", "edit_integrations", "view_monitoring", "view_audit"],
    description: "Integratsiyalarni boshqarish va monitoring qilish ruxsati.",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  },
  {
    role: "Viewer",
    permissions: ["view_integrations", "view_monitoring", "view_audit"],
    description: "Faqat ma'lumotlarni ko'rish ruxsati. O'zgartirish mumkin emas.",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  },
]

export function RolePermissions() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Rollar va ruxsatlar</h2>
        <p className="text-muted-foreground">Har bir rol uchun mavjud ruxsatlar va cheklovlar</p>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {rolePermissions.map((rolePermission) => (
          <Card key={rolePermission.role} className="h-fit">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  {rolePermission.role}
                </CardTitle>
                <Badge className={rolePermission.color}>{rolePermission.permissions.length} ruxsat</Badge>
              </div>
              <CardDescription>{rolePermission.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {rolePermission.permissions.map((permissionId) => {
                  const permission = allPermissions.find((p) => p.id === permissionId)
                  if (!permission) return null

                  const IconComponent = permission.icon

                  return (
                    <div key={permissionId} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        <IconComponent className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{permission.name}</p>
                        <p className="text-xs text-muted-foreground">{permission.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator />

      {/* All Permissions Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Barcha ruxsatlar ro'yxati</CardTitle>
          <CardDescription>Tizimda mavjud bo'lgan barcha ruxsatlar va ularning tavsifi</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {allPermissions.map((permission) => {
              const IconComponent = permission.icon
              const rolesWithPermission = rolePermissions.filter((rp) => rp.permissions.includes(permission.id))

              return (
                <div key={permission.id} className="flex items-start gap-3 p-3 rounded-lg border">
                  <div className="flex-shrink-0 mt-0.5">
                    <IconComponent className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{permission.name}</p>
                    <p className="text-sm text-muted-foreground mb-2">{permission.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {rolesWithPermission.map((role) => (
                        <Badge key={role.role} variant="outline" className="text-xs">
                          {role.role}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
