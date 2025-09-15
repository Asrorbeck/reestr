"use client"

import { useState } from "react"
import type { User } from "@/lib/types"
import { mockUsers } from "@/lib/mock-data"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Plus, Edit, Trash2, Shield, UserCheck, UserX } from "lucide-react"
import { cn } from "@/lib/utils"

const roleColors = {
  Administrator: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  Operator: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  Viewer: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
}

const roleDescriptions = {
  Administrator: "To'liq ruxsat - barcha amallarni bajarish",
  Operator: "Integratsiyalarni qo'shish va tahrirlash",
  Viewer: "Faqat ko'rish ruxsati",
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [showUserModal, setShowUserModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Viewer" as User["role"],
  })

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = roleFilter === "all" || user.role === roleFilter

    return matchesSearch && matchesRole
  })

  const handleAddUser = () => {
    setEditingUser(null)
    setFormData({ name: "", email: "", role: "Viewer" })
    setShowUserModal(true)
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setFormData({ name: user.name, email: user.email, role: user.role })
    setShowUserModal(true)
  }

  const handleSaveUser = () => {
    if (editingUser) {
      // Update existing user
      setUsers((prev) => prev.map((user) => (user.id === editingUser.id ? { ...user, ...formData } : user)))
    } else {
      // Add new user
      const newUser: User = {
        id: Date.now().toString(),
        ...formData,
      }
      setUsers((prev) => [newUser, ...prev])
    }
    setShowUserModal(false)
  }

  const handleDeleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((user) => user.id !== userId))
  }

  const roleStats = users.reduce(
    (acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administratorlar</CardTitle>
            <Shield className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{roleStats.Administrator || 0}</div>
            <p className="text-xs text-muted-foreground">To'liq ruxsatga ega</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Operatorlar</CardTitle>
            <UserCheck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{roleStats.Operator || 0}</div>
            <p className="text-xs text-muted-foreground">Tahrirlash ruxsati</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ko'ruvchilar</CardTitle>
            <UserX className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{roleStats.Viewer || 0}</div>
            <p className="text-xs text-muted-foreground">Faqat ko'rish ruxsati</p>
          </CardContent>
        </Card>
      </div>

      {/* User Management Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Foydalanuvchilar boshqaruvi</CardTitle>
              <CardDescription>Tizim foydalanuvchilari va ularning ruxsatlari</CardDescription>
            </div>
            <Button onClick={handleAddUser}>
              <Plus className="h-4 w-4 mr-2" />
              Yangi foydalanuvchi
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Foydalanuvchilarni qidirish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Rol bo'yicha filtr" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Barcha rollar</SelectItem>
                <SelectItem value="Administrator">Administrator</SelectItem>
                <SelectItem value="Operator">Operator</SelectItem>
                <SelectItem value="Viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results count */}
          <div className="text-sm text-muted-foreground">{filteredUsers.length} ta foydalanuvchi topildi</div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ism</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Ruxsatlar</TableHead>
                  <TableHead className="w-[150px]">Amallar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge className={cn("text-xs", roleColors[user.role])}>{user.role}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{roleDescriptions[user.role]}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditUser(user)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Qidiruv bo'yicha natija topilmadi</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Modal */}
      <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingUser ? "Foydalanuvchini tahrirlash" : "Yangi foydalanuvchi qo'shish"}</DialogTitle>
            <DialogDescription>Foydalanuvchi ma'lumotlari va ruxsatlarini belgilang</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Ism *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Foydalanuvchi ismini kiriting"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="example@cbu.uz"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Rol *</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, role: value as User["role"] }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Viewer">
                    <div className="flex flex-col items-start">
                      <span>Viewer</span>
                      <span className="text-xs text-muted-foreground">Faqat ko'rish ruxsati</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Operator">
                    <div className="flex flex-col items-start">
                      <span>Operator</span>
                      <span className="text-xs text-muted-foreground">Qo'shish va tahrirlash</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Administrator">
                    <div className="flex flex-col items-start">
                      <span>Administrator</span>
                      <span className="text-xs text-muted-foreground">To'liq ruxsat</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowUserModal(false)}>
              Bekor qilish
            </Button>
            <Button type="button" onClick={handleSaveUser}>
              {editingUser ? "Saqlash" : "Qo'shish"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
