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
  Trash2,
} from "lucide-react";
import { cn, formatDate } from "@/lib/utils";

interface IntegrationTableProps {
  integrations: Integration[];
  onView?: (integration: Integration) => void;
  onViewPurpose?: (integration: Integration) => void;
  onViewConditions?: (integration: Integration) => void;
  onDelete?: (integration: Integration) => void;
  userRole?: "Administrator" | "Operator" | "Viewer";
  selectedColumns?: string[];
}

const columnConfig = {
  nomi: { label: "Nomi", minWidth: "200px" },
  tashkilotShakli: { label: "Tashkilot va shakli", minWidth: "180px" },
  asosiyMaqsad: { label: "Asosiy maqsad", minWidth: "200px" },
  normativHuquqiyHujjat: {
    label: "Normativ-huquqiy hujjat",
    minWidth: "200px",
  },
  texnologikYoriknomaMavjudligi: {
    label: "Texnologik yo'riqnoma",
    minWidth: "150px",
  },
  texnologiya: { label: "Texnologiya", minWidth: "120px" },
  maqlumotAlmashishSharti: {
    label: "Ma'lumot almashish sharti",
    minWidth: "200px",
  },
  sorovlarOrtachaOylik: { label: "Oylik sorovlar", minWidth: "120px" },
  qaysiTashkilotTomondan: { label: "Ma'lumot beruvchi", minWidth: "200px" },
  mspdManzil: { label: "MSPD manzili", minWidth: "200px" },
  axborotTizimiNomi: { label: "Axborot tizimi", minWidth: "200px" },
  status: { label: "Status", minWidth: "100px" },
};

const statusColors = {
  Active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  Test: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  Archived: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
};

export function IntegrationTable({
  integrations,
  onView,
  onViewPurpose,
  onViewConditions,
  onDelete,
  userRole = "Administrator",
  selectedColumns = [],
}: IntegrationTableProps) {
  // Default to all columns if none selected
  const visibleColumns =
    selectedColumns.length > 0 ? selectedColumns : Object.keys(columnConfig);

  const renderCell = (integration: Integration, columnKey: string) => {
    switch (columnKey) {
      case "nomi":
        return (
          <TableCell className="font-semibold text-gray-900 dark:text-gray-100 py-4">
            <div className="max-w-sm">
              <div
                className="break-words whitespace-normal"
                title={integration.nomi}
              >
                {integration.nomi}
              </div>
            </div>
          </TableCell>
        );

      case "tashkilotShakli":
        return (
          <TableCell className="text-gray-700 dark:text-gray-300 py-4">
            <div className="max-w-sm">
              <div className="font-medium break-words whitespace-normal">
                {integration.vazirlik}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500 break-words whitespace-normal">
                {integration.tashkilotShakli}
              </div>
            </div>
          </TableCell>
        );

      case "asosiyMaqsad":
        return (
          <TableCell className="text-gray-700 dark:text-gray-300 py-4">
            <div className="max-w-xs">
              <div className="truncate" title={integration.asosiyMaqsad}>
                {integration.asosiyMaqsad}
              </div>
              {integration.asosiyMaqsad.length > 50 && (
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 h-auto text-blue-600 hover:text-blue-800 text-xs mt-1"
                  onClick={() => onViewPurpose?.(integration)}
                >
                  ...davomini o'qish
                </Button>
              )}
            </div>
          </TableCell>
        );

      case "normativHuquqiyHujjat":
        return (
          <TableCell className="text-gray-600 dark:text-gray-400 py-4">
            <div
              className="max-w-xs break-words whitespace-normal text-sm"
              title={integration.normativHuquqiyHujjat}
            >
              {integration.normativHuquqiyHujjat}
            </div>
          </TableCell>
        );

      case "texnologikYoriknomaMavjudligi":
        return (
          <TableCell className="text-center py-4">
            <Badge
              className={cn(
                "text-xs font-medium px-2.5 py-1",
                integration.texnologikYoriknomaMavjudligi
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
              )}
            >
              {integration.texnologikYoriknomaMavjudligi ? "Mavjud" : "Yo'q"}
            </Badge>
          </TableCell>
        );

      case "texnologiya":
        return (
          <TableCell className="py-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 break-words whitespace-normal">
              {integration.texnologiya}
            </span>
          </TableCell>
        );

      case "maqlumotAlmashishSharti":
        return (
          <TableCell className="text-gray-700 dark:text-gray-300 py-4">
            <div className="max-w-xs">
              <div
                className="truncate"
                title={integration.maqlumotAlmashishSharti}
              >
                {integration.maqlumotAlmashishSharti}
              </div>
              {integration.maqlumotAlmashishSharti.length > 50 && (
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 h-auto text-blue-600 hover:text-blue-800 text-xs mt-1"
                  onClick={() => onViewConditions?.(integration)}
                >
                  ...davomini o'qish
                </Button>
              )}
            </div>
          </TableCell>
        );

      case "sorovlarOrtachaOylik":
        return (
          <TableCell className="text-center py-4">
            <div className="flex items-center justify-center gap-2">
              <Activity className="h-4 w-4 text-green-500" />
              <div className="text-sm font-mono text-gray-700 dark:text-gray-300">
                {integration.sorovlarOrtachaOylik.toLocaleString()}
              </div>
            </div>
          </TableCell>
        );

      case "qaysiTashkilotTomondan":
        return (
          <TableCell className="text-gray-700 dark:text-gray-300 py-4">
            <div
              className="max-w-xs break-words whitespace-normal"
              title={integration.qaysiTashkilotTomondan}
            >
              {integration.qaysiTashkilotTomondan}
            </div>
          </TableCell>
        );

      case "mspdManzil":
        return (
          <TableCell className="text-gray-700 dark:text-gray-300 py-4">
            <div
              className="max-w-xs break-words whitespace-normal"
              title={integration.mspdManzil}
            >
              {integration.mspdManzil}
            </div>
          </TableCell>
        );

      case "axborotTizimiNomi":
        return (
          <TableCell className="text-gray-700 dark:text-gray-300 py-4">
            <div
              className="max-w-xs break-words whitespace-normal"
              title={integration.axborotTizimiNomi}
            >
              {integration.axborotTizimiNomi}
            </div>
          </TableCell>
        );

      case "status":
        return (
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
        );

      default:
        return null;
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm bg-white dark:bg-gray-900">
      <div className="overflow-x-auto">
        <Table className="w-full">
          <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
            <TableRow className="hover:bg-transparent border-b border-gray-200 dark:border-gray-600">
              <TableHead className="font-semibold text-gray-900 dark:text-gray-100 py-4 text-center pl-6 ">
                T/p
              </TableHead>
              {visibleColumns.map((columnKey) => (
                <TableHead
                  key={columnKey}
                  className="font-semibold text-gray-900 dark:text-gray-100 py-4 text-left"
                  style={{
                    minWidth:
                      columnConfig[columnKey as keyof typeof columnConfig]
                        ?.minWidth,
                  }}
                >
                  {columnConfig[columnKey as keyof typeof columnConfig]?.label}
                </TableHead>
              ))}
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
                <TableCell className="text-center text-gray-600 dark:text-gray-400 py-4 pl-6 ">
                  <div className="font-mono text-sm">{index + 1}</div>
                </TableCell>
                {visibleColumns.map((columnKey) =>
                  renderCell(integration, columnKey)
                )}
                <TableCell className="text-right py-4 pr-6">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onView?.(integration)}
                      className="hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-950/50 dark:hover:border-blue-700 transition-colors p-2"
                      title="Ko'rish"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {userRole === "Administrator" && onDelete && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete?.(integration)}
                        className="hover:bg-red-50 hover:border-red-300 dark:hover:bg-red-950/50 dark:hover:border-red-700 transition-colors p-2"
                        title="O'chirish"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
