"use client"

import { useState, useEffect } from "react"
import type { User } from "@/lib/types"
import { userUtils } from "@/lib/userUtils"
import toast from "react-hot-toast"
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
import { Search, Plus, Edit, Trash2, Shield, UserCheck, UserX, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"

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
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [showUserModal, setShowUserModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Viewer" as User["role"],
    password: "",
  })
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)

  // Foydalanuvchilarni yuklash
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const fetchedUsers = await userUtils.getUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Foydalanuvchilarni yuklashda xatolik:", error);
      toast.error("Foydalanuvchilarni yuklashda xatolik yuz berdi");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = roleFilter === "all" || user.role === roleFilter

    return matchesSearch && matchesRole
  })

  const handleAddUser = () => {
    setEditingUser(null)
    setFormData({ name: "", email: "", role: "Viewer", password: "" })
    setShowUserModal(true)
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setFormData({ name: user.name, email: user.email, role: user.role, password: "" })
    setShowUserModal(true)
  }

  const handleSaveUser = async () => {
    if (!formData.name || !formData.email) {
      toast.error("Ism va email to'ldirilishi shart");
      return;
    }

    if (!editingUser && !formData.password) {
      toast.error("Yangi foydalanuvchi uchun parol kiriting");
      return;
    }

    setIsSaving(true);
    try {
      if (editingUser) {
        // Update existing user
        await userUtils.updateUser(editingUser.id, {
          name: formData.name,
          email: formData.email,
          role: formData.role,
        });

        // Agar parol o'zgartirilgan bo'lsa
        if (formData.password) {
          await userUtils.updateUserPassword(editingUser.id, formData.password);
        }

        toast.success("Foydalanuvchi muvaffaqiyatli yangilandi");
      } else {
        // Add new user
        if (!formData.password) {
          toast.error("Parol kiriting");
          return;
        }

        await userUtils.addUser({
          name: formData.name,
          email: formData.email,
          role: formData.role,
          password: formData.password,
        });

        toast.success("Foydalanuvchi muvaffaqiyatli qo'shildi");
      }

      await loadUsers();
      setShowUserModal(false);
      setFormData({ name: "", email: "", role: "Viewer", password: "" });
    } catch (error: any) {
      console.error("Foydalanuvchini saqlashda xatolik:", error);
      
      // Agar "user already exists" xatosi bo'lsa, maxsus xabar ko'rsatish
      if (error.message?.includes("allaqachon mavjud") || 
          error.message?.includes("already exists") ||
          error.message?.includes("already registered")) {
        toast.error(
          "⚠️ Bu email bilan foydalanuvchi allaqachon mavjud.",
          {
            duration: 5000,
          }
        );
        // Ikkinchi toast - Administrator'ga murojaat qilish haqida
        setTimeout(() => {
          toast.error(
            "Bu muammoni hal qilish uchun Administrator'ga murojaat qiling. Administrator foydalanuvchini Supabase Dashboard orqali to'liq tiklash/o'chirish kerak.",
            {
              duration: 10000,
            }
          );
        }, 600);
      } else {
        toast.error(error.message || "Foydalanuvchini saqlashda xatolik yuz berdi");
      }
    } finally {
      setIsSaving(false);
    }
  }

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setDeleteConfirmOpen(true);
  }

  const confirmDelete = async () => {
    if (!userToDelete) return;

    setIsDeleting(userToDelete.id);
    try {
      await userUtils.deleteUser(userToDelete.id);
      toast.success("Foydalanuvchi muvaffaqiyatli o'chirildi");
      await loadUsers();
    } catch (error: any) {
      console.error("Foydalanuvchini o'chirishda xatolik:", error);
      toast.error(error.message || "Foydalanuvchini o'chirishda xatolik yuz berdi");
    } finally {
      setIsDeleting(null);
      setDeleteConfirmOpen(false);
      setUserToDelete(null);
    }
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
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    </TableRow>
                  ))
                ) : (
                  filteredUsers.map((user) => (
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
                          onClick={() => handleDeleteClick(user)}
                          className="text-destructive hover:text-destructive"
                          disabled={isDeleting === user.id}
                        >
                          {isDeleting === user.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {!isLoading && filteredUsers.length === 0 && users.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-2">Hali foydalanuvchilar mavjud emas</p>
              <p className="text-xs text-muted-foreground">Yangi foydalanuvchi qo'shish uchun "Yangi foydalanuvchi" tugmasini bosing</p>
            </div>
          )}
          {!isLoading && filteredUsers.length === 0 && users.length > 0 && (
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

            <div className="space-y-2">
              <Label htmlFor="password">
                {editingUser ? "Parolni yangilash (ixtiyoriy)" : "Parol *"}
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                placeholder={editingUser ? "Agar parolni o'zgartirmoqchi bo'lsangiz kiriting" : "Parol kiriting"}
                required={!editingUser}
              />
              {editingUser && (
                <p className="text-xs text-muted-foreground">
                  Parolni o'zgartirmasangiz bo'sh qoldiring
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowUserModal(false)}>
              Bekor qilish
            </Button>
            <Button type="button" onClick={handleSaveUser} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saqlanmoqda...
                </>
              ) : editingUser ? (
                "Saqlash"
              ) : (
                "Qo'shish"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Foydalanuvchini o'chirish</AlertDialogTitle>
            <AlertDialogDescription>
              {userToDelete && (
                <>
                  <span className="font-semibold">{userToDelete.name}</span> nomli foydalanuvchini o'chirishni tasdiqlaysizmi?
                  <br />
                  Bu amalni bekor qilib bo'lmaydi.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting !== null}>Bekor qilish</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting !== null}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  O'chirilmoqda...
                </>
              ) : (
                "O'chirish"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
