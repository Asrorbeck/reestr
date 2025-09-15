"use client"

import type { Integration } from "@/lib/types"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, Building2, FileText, Settings, ArrowLeftRight, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface IntegrationModalProps {
  integration: Integration | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const statusColors = {
  Active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  Test: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  Archived: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
}

const technologyColors = {
  REST: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  SOAP: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  MQ: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  "File exchange": "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300",
}

export function IntegrationModal({ integration, open, onOpenChange }: IntegrationModalProps) {
  if (!integration) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-xl leading-tight pr-4">{integration.nomi}</DialogTitle>
              <DialogDescription className="mt-2">Integratsiya tafsilotlari va texnik ma'lumotlar</DialogDescription>
            </div>
            <Badge className={cn("flex-shrink-0", statusColors[integration.status])}>{integration.status}</Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Asosiy ma'lumotlar</h3>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium">Vazirlik/Tashkilot</p>
                  <p className="text-muted-foreground">{integration.vazirlik}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium">Huquqiy asos</p>
                  <p className="text-muted-foreground">{integration.huquqiyAsos}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Technical Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Texnik ma'lumotlar</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Settings className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium">Texnologiya</p>
                  <Badge variant="outline" className={cn("mt-1", technologyColors[integration.texnologiya])}>
                    {integration.texnologiya}
                  </Badge>
                </div>
              </div>

              <div className="flex items-start gap-3">
                {integration.yonalish === "Two-way" ? (
                  <ArrowLeftRight className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                ) : (
                  <ArrowRight className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="font-medium">Yo'nalish</p>
                  <p className="text-muted-foreground">
                    {integration.yonalish === "Two-way" ? "Ikki tomonlama" : "Bir tomonlama"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Timeline Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Vaqt ma'lumotlari</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium">Boshlangan sana</p>
                  <p className="text-muted-foreground">
                    {new Date(integration.sana).toLocaleDateString("uz-UZ", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium">Tugash sanasi</p>
                  <p className="text-muted-foreground">
                    {new Date(integration.muddat).toLocaleDateString("uz-UZ", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {integration.tavsif && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Tavsif</h3>
                <p className="text-muted-foreground leading-relaxed">{integration.tavsif}</p>
              </div>
            </>
          )}

          {/* Metadata */}
          <Separator />
          <div className="text-xs text-muted-foreground space-y-1">
            <p>Yaratilgan: {new Date(integration.createdAt).toLocaleString("uz-UZ")}</p>
            <p>Oxirgi yangilanish: {new Date(integration.updatedAt).toLocaleString("uz-UZ")}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
