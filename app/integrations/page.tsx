"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { Integration } from "@/lib/types";
import { mockIntegrations } from "@/lib/mock-data";
import { localStorageUtils } from "@/lib/localStorage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IntegrationCard } from "@/components/integrations/integration-card";
import { IntegrationTable } from "@/components/integrations/integration-table";
import { IntegrationForm } from "@/components/integrations/integration-form";
import TableHeaderFilters from "@/components/integrations/table-header-filters";
import DetailModal from "@/components/integrations/detail-modal";
import { PurposeModal } from "@/components/integrations/purpose-modal";
import { ConditionsModal } from "@/components/integrations/conditions-modal";
import { AdvancedFilter } from "@/components/integrations/advanced-filter";
import Pagination from "@/components/integrations/pagination";
import { ShortcutsModal } from "@/components/integrations/shortcuts-modal";
import { RoleGuard } from "@/components/auth/role-guard";
import { exportFilteredToExcel } from "@/lib/excel-export";
import { useIntegrationShortcuts } from "@/hooks/use-keyboard-shortcuts";
import {
  Plus,
  Grid3X3,
  Table as TableIcon,
  Search,
  Download,
  Keyboard,
  RefreshCw,
} from "lucide-react";

interface HeaderFilters {
  nomi: string;
  vazirlik: string;
  tashkilotShakli: string;
  normativHuquqiyHujjat: string;
  texnologikYoriknomaMavjudligi: string;
  texnologiya: string;
  qaysiTashkilotTomondan: string;
  mspdManzil: string;
  axborotTizimiNomi: string;
  status: string;
}

export default function IntegrationsPage() {
  const router = useRouter();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingIntegration, setEditingIntegration] =
    useState<Integration | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState<"card" | "table">("table");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [headerFilters, setHeaderFilters] = useState<HeaderFilters>({
    nomi: "",
    vazirlik: "",
    tashkilotShakli: "all",
    normativHuquqiyHujjat: "",
    texnologikYoriknomaMavjudligi: "all",
    texnologiya: "all",
    qaysiTashkilotTomondan: "",
    mspdManzil: "",
    axborotTizimiNomi: "",
    status: "all",
  });
  const [selectedIntegration, setSelectedIntegration] =
    useState<Integration | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [purposeIntegration, setPurposeIntegration] =
    useState<Integration | null>(null);
  const [isPurposeModalOpen, setIsPurposeModalOpen] = useState(false);
  const [conditionsIntegration, setConditionsIntegration] =
    useState<Integration | null>(null);
  const [isConditionsModalOpen, setIsConditionsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>(
    []
  );
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Column visibility state
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    "nomi",
    "tashkilotShakli",
    "asosiyMaqsad",
    "normativHuquqiyHujjat",
    "texnologikYoriknomaMavjudligi",
    "texnologiya",
    "maqlumotAlmashishSharti",
    "sorovlarOrtachaOylik",
    "qaysiTashkilotTomondan",
    "mspdManzil",
    "axborotTizimiNomi",
    "status",
  ]);

  // Search and filter logic
  const filteredIntegrations = useMemo(() => {
    return integrations.filter((integration) => {
      // Search term filter
      const matchesSearch =
        searchTerm === "" ||
        integration.nomi.toLowerCase().includes(searchTerm.toLowerCase()) ||
        integration.vazirlik.toLowerCase().includes(searchTerm.toLowerCase()) ||
        integration.texnologiya
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        integration.tashkilotTuri
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        integration.qaysiTashkilotTomondan
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        integration.axborotTizimiNomi
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        integration.tashkilotShakli
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        integration.normativHuquqiyHujjat
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        integration.mspdManzil.toLowerCase().includes(searchTerm.toLowerCase());

      // Header filters
      const matchesNomi =
        headerFilters.nomi === "" ||
        integration.nomi
          .toLowerCase()
          .includes(headerFilters.nomi.toLowerCase());

      const matchesVazirlik =
        headerFilters.vazirlik === "" ||
        integration.vazirlik
          .toLowerCase()
          .includes(headerFilters.vazirlik.toLowerCase());

      const matchesTashkilotShakli =
        headerFilters.tashkilotShakli === "all" ||
        integration.tashkilotShakli === headerFilters.tashkilotShakli;

      const matchesNormativHujjat =
        headerFilters.normativHuquqiyHujjat === "" ||
        integration.normativHuquqiyHujjat
          .toLowerCase()
          .includes(headerFilters.normativHuquqiyHujjat.toLowerCase());

      const matchesTexnologikYoriknoma =
        headerFilters.texnologikYoriknomaMavjudligi === "all" ||
        integration.texnologikYoriknomaMavjudligi.toString() ===
          headerFilters.texnologikYoriknomaMavjudligi;

      const matchesTexnologiya =
        headerFilters.texnologiya === "all" ||
        integration.texnologiya === headerFilters.texnologiya;

      const matchesQaysiTashkilot =
        headerFilters.qaysiTashkilotTomondan === "" ||
        integration.qaysiTashkilotTomondan
          .toLowerCase()
          .includes(headerFilters.qaysiTashkilotTomondan.toLowerCase());

      const matchesMspdManzil =
        headerFilters.mspdManzil === "" ||
        integration.mspdManzil
          .toLowerCase()
          .includes(headerFilters.mspdManzil.toLowerCase());

      const matchesAxborotTizimi =
        headerFilters.axborotTizimiNomi === "" ||
        integration.axborotTizimiNomi
          .toLowerCase()
          .includes(headerFilters.axborotTizimiNomi.toLowerCase());

      const matchesStatus =
        headerFilters.status === "all" ||
        integration.status === headerFilters.status;

      return (
        matchesSearch &&
        matchesNomi &&
        matchesVazirlik &&
        matchesTashkilotShakli &&
        matchesNormativHujjat &&
        matchesTexnologikYoriknoma &&
        matchesTexnologiya &&
        matchesQaysiTashkilot &&
        matchesMspdManzil &&
        matchesAxborotTizimi &&
        matchesStatus
      );
    });
  }, [integrations, searchTerm, headerFilters]);

  // Pagination logic
  const totalPages = Math.ceil(filteredIntegrations.length / pageSize);
  const paginatedIntegrations = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredIntegrations.slice(startIndex, endIndex);
  }, [filteredIntegrations, currentPage, pageSize]);

  const handleView = (integration: Integration) => {
    router.push(`/integrations/${integration.id}`);
  };

  const handleViewPurpose = (integration: Integration) => {
    setPurposeIntegration(integration);
    setIsPurposeModalOpen(true);
  };

  const handleViewConditions = (integration: Integration) => {
    setConditionsIntegration(integration);
    setIsConditionsModalOpen(true);
  };

  const handleDelete = (integration: Integration) => {
    if (
      window.confirm(
        `"${integration.nomi}" integratsiyasini o'chirishni xohlaysizmi?`
      )
    ) {
      try {
        const updatedIntegrations = integrations.filter(
          (item) => item.id !== integration.id
        );
        localStorageUtils.saveIntegrations(updatedIntegrations);
        setIntegrations(updatedIntegrations);
        console.log("Integratsiya o'chirildi:", integration.nomi);
      } catch (error) {
        console.error("Integratsiyani o'chirishda xatolik:", error);
      }
    }
  };

  const handleEdit = (integration: Integration) => {
    setEditingIntegration(integration);
    setShowForm(true);
  };

  const handleAdd = () => {
    router.push("/integrations/new");
  };

  const handleSave = (integrationData: Partial<Integration>) => {
    if (editingIntegration) {
      // Update existing integration
      const updatedIntegration = localStorageUtils.updateIntegration(
        editingIntegration.id,
        integrationData
      );

      if (updatedIntegration) {
        setIntegrations((prev) =>
          prev.map((item) =>
            item.id === editingIntegration.id ? updatedIntegration : item
          )
        );
      }
    } else {
      // Add new integration
      const { id, ...integrationDataWithoutId } =
        integrationData as Integration;
      const newIntegration = localStorageUtils.addIntegration(
        integrationDataWithoutId
      );
      setIntegrations((prev) => [newIntegration, ...prev]);
    }
  };

  // Reset page when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, headerFilters]);

  // Handle mounting and localStorage loading
  useEffect(() => {
    setMounted(true);

    // LocalStorage'dan ma'lumotlarni o'qish
    const savedIntegrations = localStorageUtils.getIntegrations();

    // Agar LocalStorage'da ma'lumot yo'q bo'lsa, mock ma'lumotlarni yuklash
    if (savedIntegrations.length === 0) {
      localStorageUtils.loadMockData(mockIntegrations);
      setIntegrations(mockIntegrations);
    } else {
      setIntegrations(savedIntegrations);
    }

    // Sahifa hajmini o'qish
    const saved = localStorage.getItem("integrations-page-size");
    if (saved) {
      const parsedSize = parseInt(saved);
      if ([10, 15, 25, 50].includes(parsedSize)) {
        setPageSize(parsedSize);
      }
    }
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when page size changes
    // Save to localStorage only when mounted
    if (mounted) {
      localStorage.setItem("integrations-page-size", newPageSize.toString());
    }
  };

  const handleExportToExcel = () => {
    exportFilteredToExcel(
      filteredIntegrations,
      searchTerm,
      "integratsiyalar",
      visibleColumns
    );
  };

  // Selection handlers
  const handleSelectAll = () => {
    if (selectedIntegrations.length === filteredIntegrations.length) {
      setSelectedIntegrations([]);
    } else {
      setSelectedIntegrations(
        filteredIntegrations.map((integration) => integration.id)
      );
    }
  };

  const handleExportSelected = () => {
    if (selectedIntegrations.length === 0) {
      alert("Hech qanday integratsiya tanlanmagan!");
      return;
    }

    const selectedIntegrationsData = filteredIntegrations.filter(
      (integration) => selectedIntegrations.includes(integration.id)
    );

    exportFilteredToExcel(
      selectedIntegrationsData,
      `Tanlangan ${selectedIntegrations.length} ta integratsiya`,
      "tanlangan-integratsiyalar",
      visibleColumns
    );
  };

  // Setup shortcuts
  useIntegrationShortcuts(handleSelectAll, handleExportSelected);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Integratsiyalar
            </h1>
            <p className="text-muted-foreground">
              Markaziy Bank va vazirliklar o'rtasidagi integratsiyalar reestri
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Yuklanmoqda...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Integratsiyalar</h1>
          <p className="text-muted-foreground">
            Markaziy Bank va vazirliklar o'rtasidagi integratsiyalar reestri
          </p>
        </div>

        <RoleGuard allowedRoles={["Administrator", "Operator"]}>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Yangi integratsiya
          </Button>
        </RoleGuard>
      </div>

      {/* Advanced Filter */}
      <AdvancedFilter
        onFiltersChange={setHeaderFilters}
        visibleColumns={visibleColumns}
        onColumnsChange={setVisibleColumns}
      />

      {/* Search and Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              ref={searchInputRef}
              placeholder="Integratsiyalarni qidirish... (Alt+F yoki Ctrl+Shift+F)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {filteredIntegrations.length} ta integratsiya topildi
            {selectedIntegrations.length > 0 && (
              <span className="ml-2 text-blue-600 dark:text-blue-400 font-medium">
                ({selectedIntegrations.length} ta tanlangan)
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Shortcuts Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsShortcutsModalOpen(true)}
            className="h-8 px-3"
            title="Keyboard shortcuts (? key)"
          >
            <Keyboard className="h-4 w-4 mr-2" />
            Shortcuts
          </Button>

          {/* Refresh Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
            className="h-8 px-3"
            title="Sahifani yangilash"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Yangilash
          </Button>

          {/* Excel Export Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={
              selectedIntegrations.length > 0
                ? handleExportSelected
                : handleExportToExcel
            }
            className="h-8 px-3 bg-green-50 hover:bg-green-100 border-green-200 text-green-700 hover:text-green-800"
            title={
              selectedIntegrations.length > 0
                ? `Tanlangan ${selectedIntegrations.length} ta integratsiyani export qilish (Ctrl+E)`
                : `Barcha integratsiyalarni export qilish (Ctrl+E)`
            }
          >
            <Download className="h-4 w-4 mr-2" />
            {selectedIntegrations.length > 0
              ? "Tanlanganlarni export"
              : "Excel yuklab olish"}
            {selectedIntegrations.length > 0 && (
              <span className="ml-1 text-xs opacity-75">
                ({selectedIntegrations.length})
              </span>
            )}
          </Button>

          {/* Page Size Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Sahifa hajmi:
            </span>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => handlePageSizeChange(parseInt(value))}
            >
              <SelectTrigger className="w-20 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 ta</SelectItem>
                <SelectItem value="15">15 ta</SelectItem>
                <SelectItem value="25">25 ta</SelectItem>
                <SelectItem value="50">50 ta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* View Toggle */}
          <div className="flex items-center space-x-1 bg-muted p-1 rounded-lg">
            <Button
              variant={viewMode === "card" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("card")}
              className="h-8 px-3"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="h-8 px-3"
            >
              <TableIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Integration Content */}
      {viewMode === "card" ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {paginatedIntegrations.map((integration) => (
            <IntegrationCard
              key={integration.id}
              integration={integration}
              onView={handleView}
            />
          ))}
        </div>
      ) : (
        <IntegrationTable
          integrations={paginatedIntegrations}
          onView={handleView}
          onViewPurpose={handleViewPurpose}
          onViewConditions={handleViewConditions}
          onDelete={handleDelete}
          userRole="Administrator"
          selectedColumns={visibleColumns}
          selectedIntegrations={selectedIntegrations}
          onSelectionChange={setSelectedIntegrations}
        />
      )}

      {filteredIntegrations.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchTerm
              ? "Qidiruv bo'yicha natija topilmadi"
              : "Hech qanday integratsiya topilmadi"}
          </p>
        </div>
      )}

      {/* Pagination */}
      {filteredIntegrations.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={filteredIntegrations.length}
          onPageChange={handlePageChange}
        />
      )}

      {/* Detail Modal */}
      <DetailModal
        integration={selectedIntegration}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedIntegration(null);
        }}
      />

      {/* Purpose Modal */}
      <PurposeModal
        integration={purposeIntegration}
        isOpen={isPurposeModalOpen}
        onClose={() => {
          setIsPurposeModalOpen(false);
          setPurposeIntegration(null);
        }}
      />

      {/* Conditions Modal */}
      <ConditionsModal
        integration={conditionsIntegration}
        isOpen={isConditionsModalOpen}
        onClose={() => {
          setIsConditionsModalOpen(false);
          setConditionsIntegration(null);
        }}
      />

      {/* Form Modal */}
      <IntegrationForm
        integration={editingIntegration}
        open={showForm}
        onOpenChange={setShowForm}
        onSave={handleSave}
      />

      {/* Shortcuts Modal */}
      <ShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />
    </div>
  );
}
