"use client";

import { useState } from "react";
import type { AuditLog } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search, Eye, Download } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuditLogTableProps {
  logs: AuditLog[];
  onViewDetails?: (log: AuditLog) => void;
}

const actionColors = {
  "Integratsiya yaratildi":
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  "Integratsiya tahrirlandi":
    "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  "Integratsiya arxivlandi":
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  "Integratsiya o'chirildi":
    "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  "Integratsiya ko'rildi":
    "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  "Tizim sozlamalari o'zgartirildi":
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  default: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
};

export function AuditLogTable({ logs, onViewDetails }: AuditLogTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.integrationName &&
        log.integrationName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesAction = actionFilter === "all" || log.action === actionFilter;
    const matchesUser = userFilter === "all" || log.userName === userFilter;

    return matchesSearch && matchesAction && matchesUser;
  });

  const uniqueActions = Array.from(new Set(logs.map((log) => log.action)));
  const uniqueUsers = Array.from(new Set(logs.map((log) => log.userName)));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Audit jurnali</CardTitle>
            <CardDescription>
              Tizimda amalga oshirilgan barcha o'zgarishlar tarixi
            </CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Eksport
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Harakat turi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Barcha harakatlar</SelectItem>
              {uniqueActions.map((action) => (
                <SelectItem key={action} value={action}>
                  {action}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={userFilter} onValueChange={setUserFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Foydalanuvchi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Barcha foydalanuvchilar</SelectItem>
              {uniqueUsers.map((user) => (
                <SelectItem key={user} value={user}>
                  {user}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results count */}
        <div className="text-sm text-muted-foreground">
          {filteredLogs.length} ta yozuv topildi
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sana va vaqt</TableHead>
                <TableHead>Foydalanuvchi</TableHead>
                <TableHead>Harakat</TableHead>
                <TableHead>Integratsiya</TableHead>
                <TableHead>O'zgarishlar</TableHead>
                <TableHead className="w-[100px]">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-sm">
                    {new Date(log.timestamp).toLocaleString("en-GB")}
                  </TableCell>
                  <TableCell>{log.userName}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        actionColors[log.action as keyof typeof actionColors] ||
                          actionColors.default
                      )}
                    >
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {log.integrationName || "-"}
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    {log.changes ? (
                      <div className="text-xs text-muted-foreground">
                        {Object.entries(log.changes).map(([key, value]) => (
                          <div key={key} className="truncate">
                            {key}: {String(value)}
                          </div>
                        ))}
                      </div>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetails?.(log)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Qidiruv bo'yicha natija topilmadi
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
