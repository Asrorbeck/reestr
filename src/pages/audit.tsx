"use client";

import { useState, useEffect } from "react";
import type { AuditLog } from "@/lib/types";
import { mockVersionHistory } from "@/lib/mock-data";
import { getAuditLogs } from "@/lib/auditUtils";
import type { AuditLogEntry } from "@/lib/auditUtils";
import { AuditLogTable } from "@/components/audit/audit-log-table";
import { VersionHistory } from "@/components/audit/version-history";
import { AuditDetailModal } from "@/components/audit/audit-detail-modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, History, Activity, Users, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function AuditPage() {
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAuditLogs = async () => {
      setIsLoading(true);
      try {
        const logs = await getAuditLogs();
        console.log("Yuklangan audit log'lar:", logs);
        setAuditLogs(logs);
      } catch (error) {
        console.error("Audit log'larni yuklashda xatolik:", error);
        toast.error("Audit log'larni yuklashda xatolik yuz berdi");
      } finally {
        setIsLoading(false);
      }
    };
    loadAuditLogs();
  }, []);

  const handleViewDetails = (log: AuditLog) => {
    setSelectedLog(log);
    setShowDetailModal(true);
  };

  // Statistics
  const totalLogs = auditLogs.length;
  const uniqueUsers = new Set(auditLogs.map((log) => log.userEmail)).size;
  const recentLogs = auditLogs.filter((log) => {
    const logDate = new Date(log.createdAt);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return logDate > weekAgo;
  }).length;

  const actionCounts = auditLogs.reduce((acc, log) => {
    acc[log.action] = (acc[log.action] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Convert AuditLogEntry to AuditLog format for components
  const convertedLogs: AuditLog[] = auditLogs.map((log) => ({
    id: log.id,
    userId: log.userId || "",
    userName: log.userEmail,
    action: log.action,
    integrationId: log.integrationId,
    integrationName: log.integrationName,
    changes: log.changes,
    timestamp: log.createdAt,
  }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Audit va Versiyalar
        </h1>
        <p className="text-muted-foreground">
          Tizim o'zgarishlari tarixi va integratsiya versiyalari
        </p>
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
            <p className="text-xs text-muted-foreground">
              Barcha audit yozuvlari
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Faol foydalanuvchilar
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueUsers}</div>
            <p className="text-xs text-muted-foreground">
              Oxirgi faoliyat ko'rsatgan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Haftalik faoliyat
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentLogs}</div>
            <p className="text-xs text-muted-foreground">
              Oxirgi 7 kun davomida
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Versiyalar</CardTitle>
            <History className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockVersionHistory.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Saqlangan versiyalar
            </p>
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
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : convertedLogs.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">
                    Audit log'lar hali mavjud emas
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Integratsiya qo'shish, yangilash yoki o'chirish amallari
                    audit log'ga yoziladi
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <AuditLogTable
              logs={convertedLogs}
              onViewDetails={handleViewDetails}
            />
          )}
        </TabsContent>

        <TabsContent value="versions" className="space-y-4">
          <VersionHistory versions={mockVersionHistory} />
        </TabsContent>
      </Tabs>

      {/* Detail Modal */}
      <AuditDetailModal
        log={selectedLog}
        open={showDetailModal}
        onOpenChange={setShowDetailModal}
      />
    </div>
  );
}
