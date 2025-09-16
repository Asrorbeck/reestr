"use client";

import type { Integration } from "@/lib/types";
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
import {
  Eye,
  Building2,
  Calendar,
  FileText,
  Hash,
  Activity,
} from "lucide-react";
import { cn, formatDate } from "@/lib/utils";

interface IntegrationTableProps {
  integrations: Integration[];
  onView?: (integration: Integration) => void;
  userRole?: "Administrator" | "Operator" | "Viewer";
}

const statusColors = {
  Active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  Test: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  Archived: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
};

export function IntegrationTable({
  integrations,
  onView,
  userRole = "Administrator",
}: IntegrationTableProps) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm bg-white dark:bg-gray-900">
      <div className="overflow-x-auto">
        <Table className="w-full">
          <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
            <TableRow className="hover:bg-transparent border-b border-gray-200 dark:border-gray-600">
              <TableHead className="font-semibold text-gray-900 dark:text-gray-100 py-4 text-left pl-6">
                Nomi
              </TableHead>
              <TableHead className="font-semibold text-gray-900 dark:text-gray-100 py-4 text-left">
                Vazirlik
              </TableHead>
              <TableHead className="font-semibold text-gray-900 dark:text-gray-100 py-4 text-left">
                Huquqiy asos
              </TableHead>
              <TableHead className="font-semibold text-gray-900 dark:text-gray-100 py-4 text-left">
                Tashkilot turi
              </TableHead>
              <TableHead className="font-semibold text-gray-900 dark:text-gray-100 py-4 text-center">
                Ortacha oylik sorovlar
              </TableHead>
              <TableHead className="font-semibold text-gray-900 dark:text-gray-100 py-4 text-left">
                Qaysi tashkilot tomondan
              </TableHead>
              <TableHead className="font-semibold text-gray-900 dark:text-gray-100 py-4 text-left">
                Axborot tizimi nomi
              </TableHead>
              <TableHead className="font-semibold text-gray-900 dark:text-gray-100 py-4 text-center">
                Status
              </TableHead>
              <TableHead className="font-semibold text-gray-900 dark:text-gray-100 py-4 text-left">
                Muddat
              </TableHead>
              <TableHead className="font-semibold text-gray-900 dark:text-gray-100 py-4 text-right pr-6">
                Amallar
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {integrations.map((integration, index) => (
              <TableRow
                key={integration.id}
                className={`hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all duration-200 border-b border-gray-100 dark:border-gray-700 ${
                  index % 2 === 0
                    ? "bg-white dark:bg-gray-900"
                    : "bg-gray-50/30 dark:bg-gray-800/20"
                }`}
              >
                <TableCell className="font-semibold text-gray-900 dark:text-gray-100 py-4 pl-6">
                  <div className="max-w-xs">
                    <div className="truncate" title={integration.nomi}>
                      {integration.nomi}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-gray-700 dark:text-gray-300 py-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">{integration.vazirlik}</span>
                  </div>
                </TableCell>
                <TableCell
                  className="max-w-xs text-gray-600 dark:text-gray-400 py-4"
                  title={integration.huquqiyAsos}
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <div className="truncate text-sm">
                      {integration.huquqiyAsos}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    {integration.tashkilotTuri}
                  </span>
                </TableCell>
                <TableCell className="text-center py-4">
                  <div className="flex items-center justify-center gap-2">
                    <Activity className="h-4 w-4 text-green-500" />
                    <div className="text-sm font-mono text-gray-700 dark:text-gray-300">
                      {integration.sorovlarOrtachaOylik.toLocaleString()}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-gray-700 dark:text-gray-300 py-4">
                  <div
                    className="max-w-xs truncate"
                    title={integration.qaysiTashkilotTomondan}
                  >
                    {integration.qaysiTashkilotTomondan}
                  </div>
                </TableCell>
                <TableCell className="text-gray-700 dark:text-gray-300 py-4">
                  <div
                    className="max-w-xs truncate"
                    title={integration.axborotTizimiNomi}
                  >
                    {integration.axborotTizimiNomi}
                  </div>
                </TableCell>
                <TableCell className="text-center py-4">
                  <Badge
                    className={cn(
                      "text-xs font-medium px-2.5 py-1",
                      statusColors[integration.status]
                    )}
                  >
                    {integration.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-600 dark:text-gray-400 py-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div className="text-sm">
                      <div>{formatDate(integration.sana)}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">
                        - {formatDate(integration.muddat)}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right py-4 pr-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onView?.(integration)}
                    className="hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-950/50 dark:hover:border-blue-700 transition-colors"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ko'rish
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
