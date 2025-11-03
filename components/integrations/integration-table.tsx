"use client";

import { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye, Trash2, Loader2, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { TruncatedTextCell } from "./truncated-text-cell";
import { useRouter } from "next/navigation";

interface IntegrationTableProps {
  integrations: Integration[];
  onView?: (integration: Integration) => void;
  onEdit?: (integration: Integration) => void;
  onDelete?: (integration: Integration) => void;
  userRole?: "Administrator" | "Operator" | "Viewer";
  selectedColumns?: string[];
  selectedIntegrations?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  isDeleting?: string | null;
}

const columnConfig = {
  axborotTizimiNomi: {
    label: "Axborot tizimi yoki resursning to'liq nomi (yoki interfeys)",
    minWidth: "250px",
  },
  integratsiyaUsuli: {
    label: "Integratsiyani amalga oshirish usuli",
    minWidth: "300px",
  },
  malumotNomi: {
    label: "Uzatiladigan/qabul qilinadigan ma'lumot nomi",
    minWidth: "250px",
  },
  tashkilotNomiVaShakli: {
    label: "Integratsiya qilingan tashkilot nomi va shakli",
    minWidth: "250px",
  },
  asosiyMaqsad: {
    label: "Integratsiyadan asosiy maqsad",
    minWidth: "250px",
  },
  normativHuquqiyHujjat: {
    label: "Normativ-huquqiy hujjat",
    minWidth: "250px",
  },
  texnologikYoriknomaMavjudligi: {
    label: "Texnologik yo'riqnoma mavjudligi",
    minWidth: "200px",
  },
  malumotFormati: {
    label: "Ma'lumot formati",
    minWidth: "150px",
  },
  maqlumotAlmashishSharti: {
    label: "Ma'lumot almashish sharti",
    minWidth: "200px",
  },
  yangilanishDavriyligi: {
    label: "Ma'lumot yangilanish davriyligi",
    minWidth: "220px",
  },
  malumotHajmi: {
    label: "Ma'lumot hajmi",
    minWidth: "180px",
  },
  aloqaKanali: {
    label: "Hamkor tashkilot bilan aloqa kanali",
    minWidth: "220px",
  },
  oxirgiUzatishVaqti: {
    label: "So'nggi muvaffaqiyatli uzatish vaqti",
    minWidth: "220px",
  },
  markaziyBankAloqa: {
    label: "Markaziy bank tomonidan texnik aloqa shaxsi",
    minWidth: "280px",
  },
  hamkorAloqa: {
    label: "Hamkor tashkilot tomonidan texnik aloqa shaxsi",
    minWidth: "280px",
  },
  status: {
    label: "Integratsiya holati / statusi",
    minWidth: "150px",
  },
  izoh: {
    label: "Izoh / qo'shimcha ma'lumot",
    minWidth: "200px",
  },
};

const statusColors = {
  faol: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  testda:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  rejalashtirilgan:
    "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  muammoli: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

const formatColors = {
  JSON: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  XML: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  CSV: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",
  SOAP: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
  "REST API":
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
};

export function IntegrationTable({
  integrations,
  onView,
  onEdit,
  onDelete,
  userRole = "Administrator",
  selectedColumns = [],
  selectedIntegrations = [],
  onSelectionChange,
  isDeleting = null,
}: IntegrationTableProps) {
  const router = useRouter();
  // Modal state for viewing full cell content
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{
    title: string;
    value: string;
  } | null>(null);

  // Default to all columns if none selected
  const visibleColumns =
    selectedColumns.length > 0 ? selectedColumns : Object.keys(columnConfig);

  // Selection handlers
  const handleSelectAll = () => {
    if (onSelectionChange) {
      if (selectedIntegrations.length === integrations.length) {
        onSelectionChange([]);
      } else {
        onSelectionChange(integrations.map((integration) => integration.id));
      }
    }
  };

  const handleSelectOne = (integrationId: string) => {
    if (onSelectionChange) {
      if (selectedIntegrations.includes(integrationId)) {
        onSelectionChange(
          selectedIntegrations.filter((id) => id !== integrationId)
        );
      } else {
        onSelectionChange([...selectedIntegrations, integrationId]);
      }
    }
  };

  const isAllSelected =
    selectedIntegrations.length === integrations.length &&
    integrations.length > 0;
  const isIndeterminate =
    selectedIntegrations.length > 0 &&
    selectedIntegrations.length < integrations.length;

  const handleViewFullText = (
    e: React.MouseEvent,
    title: string,
    value: string
  ) => {
    e.stopPropagation();
    setModalContent({ title, value });
    setModalOpen(true);
  };

  const handleViewDocument = (
    e: React.MouseEvent,
    integrationId: string,
    columnKey: string
  ) => {
    e.stopPropagation();
    const integration = integrations.find((i) => i.id === integrationId);
    if (integration?.dynamicTabs) {
      const tab = integration.dynamicTabs.find(
        (t) => t.columnKey === columnKey
      );
      if (tab) {
        router.push(`/integrations/${integrationId}?tab=${tab.id}`);
      }
    }
  };

  const getTabForColumn = (integration: Integration, columnKey: string) => {
    return integration.dynamicTabs?.find((tab) => tab.columnKey === columnKey);
  };

  const renderTextCellWithTab = (
    integration: Integration,
    columnKey: string,
    value: string,
    label: string,
    cellClassName: string,
    textClassName: string = "",
    maxWidth: string
  ) => {
    const hasTab = !!getTabForColumn(integration, columnKey);

    return (
      <TableCell
        className={`${cellClassName} border-r border-transparent group-hover:border-gray-200 dark:group-hover:border-gray-600`}
      >
        <div className="flex flex-col gap-1">
          <TruncatedTextCell
            value={value}
            label={label}
            onViewFullText={handleViewFullText}
            cellClassName=""
            textClassName={textClassName}
            maxWidth={maxWidth}
            showButton={!hasTab}
          />
          {hasTab && (
            <button
              onClick={(e) => handleViewDocument(e, integration.id, columnKey)}
              className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-xs underline flex-shrink-0 cursor-pointer w-fit mt-1"
              title="Dokumentni ko'rish"
            >
              Dokumentni ko'rish
            </button>
          )}
        </div>
      </TableCell>
    );
  };

  const renderCell = (integration: Integration, columnKey: string) => {
    switch (columnKey) {
      case "axborotTizimiNomi":
        return renderTextCellWithTab(
          integration,
          columnKey,
          integration.axborotTizimiNomi,
          columnConfig.axborotTizimiNomi.label,
          "font-semibold text-gray-900 dark:text-gray-100 py-4",
          "",
          "max-w-sm"
        );

      case "integratsiyaUsuli":
        return renderTextCellWithTab(
          integration,
          columnKey,
          integration.integratsiyaUsuli || "",
          columnConfig.integratsiyaUsuli.label,
          "text-gray-700 dark:text-gray-300 py-4",
          "",
          "max-w-sm"
        );

      case "malumotNomi":
        return renderTextCellWithTab(
          integration,
          columnKey,
          integration.malumotNomi || "",
          columnConfig.malumotNomi.label,
          "text-gray-700 dark:text-gray-300 py-4",
          "",
          "max-w-sm"
        );

      case "tashkilotNomiVaShakli":
        return renderTextCellWithTab(
          integration,
          columnKey,
          integration.tashkilotNomiVaShakli || "",
          columnConfig.tashkilotNomiVaShakli.label,
          "text-gray-700 dark:text-gray-300 py-4",
          "",
          "max-w-sm"
        );

      case "asosiyMaqsad":
        return renderTextCellWithTab(
          integration,
          columnKey,
          integration.asosiyMaqsad || "",
          columnConfig.asosiyMaqsad.label,
          "text-gray-700 dark:text-gray-300 py-4",
          "",
          "max-w-xs"
        );

      case "normativHuquqiyHujjat":
        return renderTextCellWithTab(
          integration,
          columnKey,
          integration.normativHuquqiyHujjat || "",
          columnConfig.normativHuquqiyHujjat.label,
          "text-gray-600 dark:text-gray-400 py-4",
          "text-sm",
          "max-w-xs"
        );

      case "texnologikYoriknomaMavjudligi":
        return renderTextCellWithTab(
          integration,
          columnKey,
          integration.texnologikYoriknomaMavjudligi || "",
          columnConfig.texnologikYoriknomaMavjudligi.label,
          "text-gray-700 dark:text-gray-300 py-4",
          "",
          "max-w-sm"
        );

      case "malumotFormati":
        return (
          <TableCell className="py-4 border-r border-transparent group-hover:border-gray-200 dark:group-hover:border-gray-600">
            <Badge
              className={cn(
                "text-xs font-medium px-2.5 py-1",
                formatColors[integration.malumotFormati] ||
                  "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
              )}
            >
              {integration.malumotFormati}
            </Badge>
          </TableCell>
        );

      case "maqlumotAlmashishSharti":
        return renderTextCellWithTab(
          integration,
          columnKey,
          integration.maqlumotAlmashishSharti || "",
          columnConfig.maqlumotAlmashishSharti.label,
          "text-gray-700 dark:text-gray-300 py-4",
          "",
          "max-w-xs"
        );

      case "yangilanishDavriyligi":
        return renderTextCellWithTab(
          integration,
          columnKey,
          integration.yangilanishDavriyligi || "",
          columnConfig.yangilanishDavriyligi.label,
          "text-gray-700 dark:text-gray-300 py-4",
          "",
          "max-w-xs"
        );

      case "malumotHajmi":
        return renderTextCellWithTab(
          integration,
          columnKey,
          integration.malumotHajmi || "",
          columnConfig.malumotHajmi.label,
          "text-gray-700 dark:text-gray-300 py-4",
          "",
          "max-w-xs"
        );

      case "aloqaKanali":
        return renderTextCellWithTab(
          integration,
          columnKey,
          integration.aloqaKanali || "",
          columnConfig.aloqaKanali.label,
          "text-gray-700 dark:text-gray-300 py-4",
          "",
          "max-w-xs"
        );

      case "oxirgiUzatishVaqti":
        return renderTextCellWithTab(
          integration,
          columnKey,
          integration.oxirgiUzatishVaqti || "",
          columnConfig.oxirgiUzatishVaqti.label,
          "text-gray-700 dark:text-gray-300 py-4",
          "",
          "max-w-xs"
        );

      case "markaziyBankAloqa":
        return renderTextCellWithTab(
          integration,
          columnKey,
          integration.markaziyBankAloqa || "",
          columnConfig.markaziyBankAloqa.label,
          "text-gray-700 dark:text-gray-300 py-4",
          "text-sm",
          "max-w-xs"
        );

      case "hamkorAloqa":
        return renderTextCellWithTab(
          integration,
          columnKey,
          integration.hamkorAloqa || "",
          columnConfig.hamkorAloqa.label,
          "text-gray-700 dark:text-gray-300 py-4",
          "text-sm",
          "max-w-xs"
        );

      case "status":
        return (
          <TableCell className="text-center py-4 border-r border-transparent group-hover:border-gray-200 dark:group-hover:border-gray-600">
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

      case "izoh":
        return renderTextCellWithTab(
          integration,
          columnKey,
          integration.izoh || "",
          columnConfig.izoh.label,
          "text-gray-700 dark:text-gray-300 py-4",
          "text-sm",
          "max-w-xs"
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
              <TableHead
                className="py-4 border-r border-gray-200 dark:border-gray-600"
                style={{
                  width: "80px",
                  minWidth: "80px",
                  paddingLeft: 0,
                  paddingRight: 0,
                }}
              >
                <div className="flex items-center justify-center w-full">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                    className={cn(
                      "border-2 border-gray-300 dark:border-gray-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 data-[state=checked]:text-white hover:border-blue-400 dark:hover:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 dark:data-[state=checked]:bg-blue-600 dark:data-[state=checked]:text-white [&>span]:text-white [&>span]:dark:text-white",
                      isIndeterminate &&
                        "data-[state=indeterminate]:bg-blue-400"
                    )}
                  />
                </div>
              </TableHead>
              <TableHead className="font-semibold text-gray-900 dark:text-gray-100 py-4 text-center px-3 border-r border-gray-200 dark:border-gray-600 break-words whitespace-normal">
                <div className="break-words whitespace-normal">
                  Integratsiya identifikatori
                </div>
              </TableHead>
              {visibleColumns.map((columnKey) => (
                <TableHead
                  key={columnKey}
                  className="font-semibold text-gray-900 dark:text-gray-100 py-4 text-left border-r border-gray-200 dark:border-gray-600 break-words whitespace-normal"
                  style={{
                    minWidth:
                      columnConfig[columnKey as keyof typeof columnConfig]
                        ?.minWidth,
                  }}
                >
                  <div className="break-words whitespace-normal">
                    {
                      columnConfig[columnKey as keyof typeof columnConfig]
                        ?.label
                    }
                  </div>
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
                className={`group hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all duration-200 border-b border-gray-100 dark:border-gray-700 cursor-pointer ${
                  index % 2 === 0
                    ? "bg-white dark:bg-gray-900"
                    : "bg-gray-50/30 dark:bg-gray-800/20"
                }`}
                data-integration-row
                onClick={() => onView?.(integration)}
              >
                <TableCell
                  className="py-4 border-r border-transparent group-hover:border-gray-200 dark:group-hover:border-gray-600"
                  style={{
                    width: "80px",
                    minWidth: "80px",
                    paddingLeft: 0,
                    paddingRight: 0,
                  }}
                >
                  <div className="flex items-center justify-center w-full">
                    <Checkbox
                      checked={selectedIntegrations.includes(integration.id)}
                      onCheckedChange={() => handleSelectOne(integration.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="border-2 border-gray-300 dark:border-gray-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 data-[state=checked]:text-white hover:border-blue-400 dark:hover:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 dark:data-[state=checked]:bg-blue-600 dark:data-[state=checked]:text-white [&>span]:text-white [&>span]:dark:text-white"
                    />
                  </div>
                </TableCell>
                <TableCell className="text-center text-gray-600 dark:text-gray-400 py-4 px-3 border-r border-transparent group-hover:border-gray-200 dark:group-hover:border-gray-600">
                  <div className="font-mono text-sm">
                    {integration.sequentialNumber
                      ? String(integration.sequentialNumber).padStart(4, "0")
                      : String(index + 1).padStart(4, "0")}
                  </div>
                </TableCell>
                {visibleColumns.map((columnKey) =>
                  renderCell(integration, columnKey)
                )}
                <TableCell className="text-right py-4 pr-6">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onView?.(integration);
                      }}
                      className="hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-950/50 dark:hover:border-blue-700 transition-colors p-2"
                      title="Ko'rish"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {(userRole === "Administrator" || userRole === "Operator") && onEdit && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit?.(integration);
                        }}
                        className="hover:bg-green-50 hover:border-green-300 dark:hover:bg-green-950/50 dark:hover:border-green-700 transition-colors p-2"
                        title="Tahrirlash"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                    {userRole === "Administrator" && onDelete && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete?.(integration);
                        }}
                        disabled={isDeleting === integration.id}
                        className="hover:bg-red-50 hover:border-red-300 dark:hover:bg-red-950/50 dark:hover:border-red-700 transition-colors p-2"
                        title="O'chirish"
                        data-delete-button
                      >
                        {isDeleting === integration.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal for viewing full cell content */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {modalContent?.title}
            </DialogTitle>
            <DialogDescription>To'liq ma'lumot</DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <p className="text-gray-900 dark:text-gray-100 leading-relaxed whitespace-pre-wrap break-words">
                {modalContent?.value || "Ma'lumot mavjud emas"}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
