"use client"

import { useState } from "react"
import type { AuditLog } from "@/lib/types"
import { extendedAuditLogs, mockVersionHistory } from "@/lib/mock-data"
import { AuditLogTable } from "@/components/audit/audit-log-table"
import { VersionHistory } from "@/components/audit/version-history"
import { AuditDetailModal } from "@/components/audit/audit-detail-modal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, History, Activity, Users } from "lucide-react"

export default function AuditPage() {
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  const handleViewDetails = (log: AuditLog) => {
    setSelectedLog(log)
    setShowDetailModal(true)
  }

  // Statistics
  const totalLogs = extendedAuditLogs.length
  const uniqueUsers = new Set(extendedAuditLogs.map((log) => log.userName)).size
  const recentLogs = extendedAuditLogs.filter((log) => {
    const logDate = new Date(log.timestamp)
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    return logDate > weekAgo
  }).length

  const actionCounts = extendedAuditLogs.reduce(
    (acc, log) => {
      acc[log.action] = (acc[log.action] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Audit va Versiyalar</h1>
        <p className="text-muted-foreground">Tizim o'zgarishlari tarixi va integratsiya versiyalari</p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jami yozuvlar</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLogs}</div>
            <p className="text-xs text-muted-foreground">Barcha audit yozuvlari</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faol foydalanuvchilar</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueUsers}</div>
            <p className="text-xs text-muted-foreground">Oxirgi faoliyat ko'rsatgan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Haftalik faoliyat</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentLogs}</div>
            <p className="text-xs text-muted-foreground">Oxirgi 7 kun davomida</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Versiyalar</CardTitle>
            <History className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockVersionHistory.length}</div>
            <p className="text-xs text-muted-foreground">Saqlangan versiyalar</p>
          </CardContent>
        </Card>
      </div>

      {/* Action Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Harakatlar statistikasi</CardTitle>
          <CardDescription>Eng ko'p bajarilgan harakatlar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {Object.entries(actionCounts).map(([action, count]) => (
              <Badge key={action} variant="secondary" className="text-sm">
                {action}: {count}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="audit" className="space-y-4">
        <TabsList>
          <TabsTrigger value="audit">Audit jurnali</TabsTrigger>
          <TabsTrigger value="versions">Versiya tarixi</TabsTrigger>
        </TabsList>

        <TabsContent value="audit" className="space-y-4">
          <AuditLogTable logs={extendedAuditLogs} onViewDetails={handleViewDetails} />
        </TabsContent>

        <TabsContent value="versions" className="space-y-4">
          <VersionHistory versions={mockVersionHistory} />
        </TabsContent>
      </Tabs>

      {/* Detail Modal */}
      <AuditDetailModal log={selectedLog} open={showDetailModal} onOpenChange={setShowDetailModal} />
    </div>
  )
}
