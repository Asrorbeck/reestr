"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { Integration } from "@/lib/types";
import { supabaseUtils } from "@/lib/supabaseUtils";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IntegrationTable } from "@/components/integrations/integration-table";
import { IntegrationForm } from "@/components/integrations/integration-form";
import { AdvancedFilter } from "@/components/integrations/advanced-filter";
import Pagination from "@/components/integrations/pagination";
import { ShortcutsModal } from "@/components/integrations/shortcuts-modal";
import { exportFilteredToExcel } from "@/lib/excel-export";
import { useIntegrationShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { useAuth } from "@/lib/auth";
import { getRolePermissions } from "@/lib/permissions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  Search,
  Download,
  Keyboard,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface HeaderFilters {
  axborotTizimiNomi: string;
  integratsiyaUsuli: string;
  malumotNomi: string;
  tashkilotNomiVaShakli: string;
  asosiyMaqsad: string;
  normativHuquqiyHujjat: string;
  texnologikYoriknomaMavjudligi: string;
  malumotFormati: string;
  maqlumotAlmashishSharti: string;
  yangilanishDavriyligi: string;
  malumotHajmi: string;
  aloqaKanali: string;
  oxirgiUzatishVaqti: string;
  markaziyBankAloqa: string;
  hamkorAloqa: string;
  status: string;
  izoh: string;
}

export default function IntegrationsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const role = user?.role as "Administrator" | "Operator" | "Viewer" | undefined;
  const permissions = getRolePermissions(role);
  
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingIntegration, setEditingIntegration] =
    useState<Integration | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [headerFilters, setHeaderFilters] = useState<HeaderFilters>({
    axborotTizimiNomi: "",
    integratsiyaUsuli: "",
    malumotNomi: "",
    tashkilotNomiVaShakli: "",
    asosiyMaqsad: "",
    normativHuquqiyHujjat: "",
    texnologikYoriknomaMavjudligi: "",
    malumotFormati: "all",
    maqlumotAlmashishSharti: "",
    yangilanishDavriyligi: "",
    malumotHajmi: "",
    aloqaKanali: "",
    oxirgiUzatishVaqti: "",
    markaziyBankAloqa: "",
    hamkorAloqa: "",
    status: "all",
    izoh: "",
  });
  const [mounted, setMounted] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [integrationToDelete, setIntegrationToDelete] =
    useState<Integration | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Column visibility state
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    "axborotTizimiNomi",
    "integratsiyaUsuli",
    "malumotNomi",
    "tashkilotNomiVaShakli",
    "asosiyMaqsad",
    "normativHuquqiyHujjat",
    "texnologikYoriknomaMavjudligi",
    "malumotFormati",
    "maqlumotAlmashishSharti",
    "yangilanishDavriyligi",
    "malumotHajmi",
    "aloqaKanali",
    "oxirgiUzatishVaqti",
    "markaziyBankAloqa",
    "hamkorAloqa",
    "status",
    "izoh",
  ]);

  // Search and filter logic
  const filteredIntegrations = useMemo(() => {
    return integrations.filter((integration) => {
      // Search term filter - search across all string fields
      const matchesSearch =
        searchTerm === "" ||
        integration.axborotTizimiNomi
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        integration.integratsiyaUsuli
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        integration.malumotNomi
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        integration.tashkilotNomiVaShakli
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        integration.asosiyMaqsad
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        integration.normativHuquqiyHujjat
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        integration.texnologikYoriknomaMavjudligi
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        integration.maqlumotAlmashishSharti
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        integration.yangilanishDavriyligi
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        integration.malumotHajmi
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        integration.aloqaKanali
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        integration.oxirgiUzatishVaqti
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        integration.markaziyBankAloqa
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        integration.hamkorAloqa
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        integration.izoh.toLowerCase().includes(searchTerm.toLowerCase());

      // Header filters
      const matchesAxborotTizimiNomi =
        headerFilters.axborotTizimiNomi === "" ||
        integration.axborotTizimiNomi
          .toLowerCase()
          .includes(headerFilters.axborotTizimiNomi.toLowerCase());

      const matchesIntegratsiyaUsuli =
        headerFilters.integratsiyaUsuli === "" ||
        integration.integratsiyaUsuli
          .toLowerCase()
          .includes(headerFilters.integratsiyaUsuli.toLowerCase());

      const matchesMalumotNomi =
        headerFilters.malumotNomi === "" ||
        integration.malumotNomi
          .toLowerCase()
          .includes(headerFilters.malumotNomi.toLowerCase());

      const matchesTashkilotNomiVaShakli =
        headerFilters.tashkilotNomiVaShakli === "" ||
        integration.tashkilotNomiVaShakli
          .toLowerCase()
          .includes(headerFilters.tashkilotNomiVaShakli.toLowerCase());

      const matchesAsosiyMaqsad =
        headerFilters.asosiyMaqsad === "" ||
        integration.asosiyMaqsad
          .toLowerCase()
          .includes(headerFilters.asosiyMaqsad.toLowerCase());

      const matchesNormativHujjat =
        headerFilters.normativHuquqiyHujjat === "" ||
        integration.normativHuquqiyHujjat
          .toLowerCase()
          .includes(headerFilters.normativHuquqiyHujjat.toLowerCase());

      const matchesTexnologikYoriknoma =
        headerFilters.texnologikYoriknomaMavjudligi === "" ||
        integration.texnologikYoriknomaMavjudligi
          .toLowerCase()
          .includes(headerFilters.texnologikYoriknomaMavjudligi.toLowerCase());

      const matchesMalumotFormati =
        headerFilters.malumotFormati === "all" ||
        integration.malumotFormati === headerFilters.malumotFormati;

      const matchesMaqlumotAlmashishSharti =
        headerFilters.maqlumotAlmashishSharti === "" ||
        integration.maqlumotAlmashishSharti
          .toLowerCase()
          .includes(headerFilters.maqlumotAlmashishSharti.toLowerCase());

      const matchesYangilanishDavriyligi =
        headerFilters.yangilanishDavriyligi === "" ||
        integration.yangilanishDavriyligi
          .toLowerCase()
          .includes(headerFilters.yangilanishDavriyligi.toLowerCase());

      const matchesMalumotHajmi =
        headerFilters.malumotHajmi === "" ||
        integration.malumotHajmi
          .toLowerCase()
          .includes(headerFilters.malumotHajmi.toLowerCase());

      const matchesAloqaKanali =
        headerFilters.aloqaKanali === "" ||
        integration.aloqaKanali
          .toLowerCase()
          .includes(headerFilters.aloqaKanali.toLowerCase());

      const matchesOxirgiUzatishVaqti =
        headerFilters.oxirgiUzatishVaqti === "" ||
        integration.oxirgiUzatishVaqti
          .toLowerCase()
          .includes(headerFilters.oxirgiUzatishVaqti.toLowerCase());

      const matchesMarkaziyBankAloqa =
        headerFilters.markaziyBankAloqa === "" ||
        integration.markaziyBankAloqa
          .toLowerCase()
          .includes(headerFilters.markaziyBankAloqa.toLowerCase());

      const matchesHamkorAloqa =
        headerFilters.hamkorAloqa === "" ||
        integration.hamkorAloqa
          .toLowerCase()
          .includes(headerFilters.hamkorAloqa.toLowerCase());

      const matchesStatus =
        headerFilters.status === "all" ||
        integration.status === headerFilters.status;

      const matchesIzoh =
        headerFilters.izoh === "" ||
        integration.izoh
          .toLowerCase()
          .includes(headerFilters.izoh.toLowerCase());

      return (
        matchesSearch &&
        matchesAxborotTizimiNomi &&
        matchesIntegratsiyaUsuli &&
        matchesMalumotNomi &&
        matchesTashkilotNomiVaShakli &&
        matchesAsosiyMaqsad &&
        matchesNormativHujjat &&
        matchesTexnologikYoriknoma &&
        matchesMalumotFormati &&
        matchesMaqlumotAlmashishSharti &&
        matchesYangilanishDavriyligi &&
        matchesMalumotHajmi &&
        matchesAloqaKanali &&
        matchesOxirgiUzatishVaqti &&
        matchesMarkaziyBankAloqa &&
        matchesHamkorAloqa &&
        matchesStatus &&
        matchesIzoh
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

  const handleDelete = (integration: Integration) => {
    setIntegrationToDelete(integration);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!integrationToDelete) return;

    try {
      setIsDeleting(integrationToDelete.id);
      const success = await supabaseUtils.deleteIntegration(
        integrationToDelete.id
      );
      if (success) {
        setIntegrations((prev) =>
          prev.filter((i) => i.id !== integrationToDelete.id)
        );
        console.log(
          "Integratsiya o'chirildi:",
          integrationToDelete.axborotTizimiNomi
        );
      } else {
        toast.error("Integratsiyani o'chirishda xatolik yuz berdi");
      }
    } catch (error) {
      console.error("Integratsiyani o'chirishda xatolik:", error);
      toast.error("Integratsiyani o'chirishda xatolik yuz berdi");
    } finally {
      setIsDeleting(null);
      setDeleteConfirmOpen(false);
      setIntegrationToDelete(null);
    }
  };

  const handleEdit = (integration: Integration) => {
    router.push(`/integrations/edit/${integration.id}`);
  };

  const handleAdd = () => {
    router.push("/integrations/new");
  };

  const handleSave = async (integrationData: Partial<Integration>) => {
    try {
      if (editingIntegration) {
        // Update existing integration
        const updatedIntegration = await supabaseUtils.updateIntegration(
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
        const newIntegration = await supabaseUtils.addIntegration(
          integrationDataWithoutId
        );
        setIntegrations((prev) => [newIntegration, ...prev]);
      }
    } catch (error) {
      console.error("Integratsiyani saqlashda xatolik:", error);
      toast.error("Integratsiyani saqlashda xatolik yuz berdi");
    }
  };

  // Reset page when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, headerFilters]);

  // Handle mounting and Supabase loading
  useEffect(() => {
    const loadIntegrations = async () => {
      try {
        setIsLoading(true);
        setMounted(true);
        // Supabase'dan ma'lumotlarni o'qish
        const savedIntegrations = await supabaseUtils.getIntegrations();
        setIntegrations(savedIntegrations);
      } catch (error) {
        console.error("Integratsiyalarni yuklashda xatolik:", error);
        setIntegrations([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadIntegrations();

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

        {permissions.canCreateIntegrations && (
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Yangi integratsiya
          </Button>
        )}
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
            onClick={async () => {
              setIsLoading(true);
              try {
                const savedIntegrations = await supabaseUtils.getIntegrations();
                setIntegrations(savedIntegrations);
              } catch (error) {
                console.error("Yangilashda xatolik:", error);
              } finally {
                setIsLoading(false);
              }
            }}
            disabled={isLoading}
            className="h-8 px-3"
            title="Sahifani yangilash"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            {isLoading ? "Yuklanmoqda..." : "Yangilash"}
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
        </div>
      </div>

      {/* Integration Content */}
      {isLoading ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">
                  <Skeleton className="h-4 w-4" />
                </TableHead>
                <TableHead className="text-center">
                  <Skeleton className="h-4 w-12 mx-auto" />
                </TableHead>
                {visibleColumns.slice(0, 5).map((key) => (
                  <TableHead key={key}>
                    <Skeleton className="h-4 w-32" />
                  </TableHead>
                ))}
                <TableHead className="text-right">
                  <Skeleton className="h-4 w-16 ml-auto" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center justify-center">
                      <Skeleton className="h-4 w-4" />
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-4 w-8 mx-auto" />
                  </TableCell>
                  {visibleColumns.slice(0, 5).map((key) => (
                    <TableCell key={key}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <>
          <IntegrationTable
            integrations={paginatedIntegrations}
            onView={handleView}
            onEdit={permissions.canEditIntegrations ? handleEdit : undefined}
            onDelete={permissions.canDeleteIntegrations ? handleDelete : undefined}
            userRole={role || "Viewer"}
            selectedColumns={visibleColumns}
            selectedIntegrations={selectedIntegrations}
            onSelectionChange={setSelectedIntegrations}
            isDeleting={isDeleting}
          />

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
        </>
      )}

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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Integratsiyani o'chirish</AlertDialogTitle>
            <AlertDialogDescription>
              "{integrationToDelete?.axborotTizimiNomi}" integratsiyasini
              o'chirishni tasdiqlaysizmi? Bu amalni bekor qilib bo'lmaydi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              O'chirish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
