"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import toast from "react-hot-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Integration } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Upload,
  X,
  Plus,
  Loader2,
  Paperclip,
  FileSpreadsheet,
  Check,
} from "lucide-react";
import * as XLSX from "xlsx";
import { supabaseUtils } from "@/lib/supabaseUtils";
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

const DRAFT_STORAGE_KEY = "integration_draft";

export default function NewIntegrationPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const role = user?.role as
    | "Administrator"
    | "Operator"
    | "Viewer"
    | undefined;

  useEffect(() => {
    if (!loading && !hasPermission(role, "canCreateIntegrations")) {
      toast.error("Sizda yangi integratsiya qo'shish ruxsati yo'q");
      navigate("/integrations", { replace: true });
    }
  }, [user, loading, role, navigate]);

  const [activeTab, setActiveTab] = useState("passport");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTabName, setNewTabName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTabConfirmOpen, setDeleteTabConfirmOpen] = useState(false);
  const [deleteFileConfirmOpen, setDeleteFileConfirmOpen] = useState(false);
  const [tabToDelete, setTabToDelete] = useState<string | null>(null);
  const [fileToDelete, setFileToDelete] = useState<{
    tabId: string;
    fileId: string;
  } | null>(null);
  const [dynamicTabs, setDynamicTabs] = useState<
    Array<{
      id: string;
      name: string;
      columnKey: string;
      title: string;
      description: string;
      files: Array<{
        id: string;
        file: File | null;
      }>;
    }>
  >([]);
  const [formData, setFormData] = useState({
    // Yangi 18 column struktura
    axborotTizimiNomi: "",
    integratsiyaUsuli: "",
    malumotNomi: "",
    tashkilotNomiVaShakli: "",
    asosiyMaqsad: "",
    normativHuquqiyHujjat: "",
    texnologikYoriknomaMavjudligi: "",
    malumotFormati: "JSON" as "JSON" | "XML" | "CSV" | "SOAP" | "REST API",
    maqlumotAlmashishSharti: "",
    yangilanishDavriyligi: "",
    malumotHajmi: "",
    aloqaKanali: "",
    oxirgiUzatishVaqti: "",
    markaziyBankAloqa: "",
    hamkorAloqa: "",
    status: "faol" as "faol" | "testda" | "rejalashtirilgan" | "muammoli",
    izoh: "",
  });

  const fieldInputClasses =
    "bg-white/90 dark:bg-[#1f1f1f]/70 border border-gray-300 dark:border-gray-700 focus-visible:border-[#e4a216] focus-visible:ring-[#e4a216]/40 shadow-sm placeholder:text-gray-500 dark:placeholder:text-gray-400";
  const selectTriggerClasses =
    "bg-white/90 dark:bg-[#1f1f1f]/70 border border-gray-300 dark:border-gray-700 focus-visible:border-[#e4a216] focus-visible:ring-[#e4a216]/40 shadow-sm text-left";

  const attachmentFieldConfig = {
    normativHuquqiyHujjat: {
      label: "Normativ-huquqiy hujjat",
      columnKey: "normativHuquqiyHujjat",
    },
    texnologikYoriknomaMavjudligi: {
      label: "Axborot almashinuvi bo'yicha texnologik yo'riqnoma mavjudligi",
      columnKey: "texnologikYoriknomaMavjudligi",
    },
  } as const;

  type AttachmentField = keyof typeof attachmentFieldConfig;

  const createEmptyAttachmentFile = () => ({
    id: `attachment_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    file: null as File | null,
  });

  const [attachmentDialogOpen, setAttachmentDialogOpen] = useState(false);
  const [activeAttachmentField, setActiveAttachmentField] =
    useState<AttachmentField | null>(null);
  const [attachmentDraftFiles, setAttachmentDraftFiles] = useState<
    Array<{ id: string; file: File | null }>
  >([]);
  const [selectedColumnOption, setSelectedColumnOption] = useState<string>("");
  const [fieldAttachments, setFieldAttachments] = useState<
    Partial<
      Record<
        AttachmentField,
        { files: Array<{ id: string; file: File | null }> }
      >
    >
  >({});

  // Load draft from localStorage on mount
  useEffect(() => {
    try {
      const draftData = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (draftData) {
        const parsed = JSON.parse(draftData);
        if (parsed.formData) {
          setFormData(parsed.formData);
        }
        if (parsed.dynamicTabs) {
          setDynamicTabs(parsed.dynamicTabs);
        }
        if (parsed.activeTab) {
          setActiveTab(parsed.activeTab);
        }
        // Note: Files cannot be restored from localStorage, so fieldAttachments will be empty
        // This is expected behavior as File objects cannot be serialized
      }
    } catch (error) {
      console.error("Draft yuklashda xatolik:", error);
    }
  }, []);

  // Save draft to localStorage whenever data changes
  useEffect(() => {
    const hasData =
      formData.axborotTizimiNomi ||
      formData.integratsiyaUsuli ||
      formData.malumotNomi ||
      formData.tashkilotNomiVaShakli ||
      formData.asosiyMaqsad ||
      formData.normativHuquqiyHujjat ||
      formData.texnologikYoriknomaMavjudligi ||
      formData.maqlumotAlmashishSharti ||
      formData.yangilanishDavriyligi ||
      formData.malumotHajmi ||
      formData.aloqaKanali ||
      formData.oxirgiUzatishVaqti ||
      formData.markaziyBankAloqa ||
      formData.hamkorAloqa ||
      formData.izoh ||
      dynamicTabs.length > 0;

    if (hasData) {
      try {
        const draftData = {
          formData,
          dynamicTabs: dynamicTabs.map((tab) => ({
            ...tab,
            // Remove file objects as they cannot be serialized
            files: tab.files.map((f) => ({
              id: f.id,
              file: null, // Files cannot be stored in localStorage
            })),
          })),
          activeTab,
          timestamp: Date.now(),
        };
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftData));
        // Update global flag for header notification
        window.dispatchEvent(
          new CustomEvent("draftIntegrationUpdated", { detail: true })
        );
      } catch (error) {
        console.error("Draft saqlashda xatolik:", error);
      }
    } else {
      // Clear draft if no data
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      window.dispatchEvent(
        new CustomEvent("draftIntegrationUpdated", { detail: false })
      );
    }
  }, [formData, dynamicTabs, activeTab]);

  // Warn user before leaving page with unsaved data
  useEffect(() => {
    const hasData =
      formData.axborotTizimiNomi ||
      formData.integratsiyaUsuli ||
      formData.malumotNomi ||
      formData.tashkilotNomiVaShakli ||
      formData.asosiyMaqsad ||
      formData.normativHuquqiyHujjat ||
      formData.texnologikYoriknomaMavjudligi ||
      formData.maqlumotAlmashishSharti ||
      formData.yangilanishDavriyligi ||
      formData.malumotHajmi ||
      formData.aloqaKanali ||
      formData.oxirgiUzatishVaqti ||
      formData.markaziyBankAloqa ||
      formData.hamkorAloqa ||
      formData.izoh ||
      dynamicTabs.length > 0;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasData && !isSaving) {
        e.preventDefault();
        e.returnValue =
          "Ma'lumotlar draft holida saqlandi. Saytdan chiqmoqchimisiz?";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [formData, dynamicTabs, isSaving]);

  const columnOptions = [
    {
      value: "axborotTizimiNomi",
      label: "Axborot tizimi yoki resursning to'liq nomi",
    },
    {
      value: "integratsiyaUsuli",
      label: "Integratsiyani amalga oshirish usuli",
    },
    {
      value: "malumotNomi",
      label: "Uzatiladigan/qabul qilinadigan ma'lumot nomi",
    },
    {
      value: "tashkilotNomiVaShakli",
      label: "Integratsiya qilingan tashkilot nomi va shakli",
    },
    { value: "asosiyMaqsad", label: "Integratsiyadan asosiy maqsad" },
    { value: "normativHuquqiyHujjat", label: "Normativ-huquqiy hujjat" },
    {
      value: "texnologikYoriknomaMavjudligi",
      label: "Texnologik yo'riqnoma mavjudligi",
    },
    { value: "maqlumotAlmashishSharti", label: "Ma'lumot almashish sharti" },
    {
      value: "yangilanishDavriyligi",
      label: "Ma'lumot yangilanish davriyligi",
    },
    { value: "malumotHajmi", label: "Ma'lumot hajmi" },
    { value: "aloqaKanali", label: "Hamkor tashkilot bilan aloqa kanali" },
    {
      value: "oxirgiUzatishVaqti",
      label: "So'nggi muvaffaqiyatli uzatish vaqti",
    },
    {
      value: "markaziyBankAloqa",
      label: "Markaziy bank tomonidan texnik aloqa shaxsi",
    },
    {
      value: "hamkorAloqa",
      label: "Hamkor tashkilot tomonidan texnik aloqa shaxsi",
    },
    { value: "izoh", label: "Izoh / qo'shimcha ma'lumot" },
  ];

  type ParsedImportRecord = {
    rowNumber: number;
    raw: Record<string, any>;
    data: Partial<Integration>;
    errors: string[];
  };

  const importColumnConfig: Array<{
    header: string;
    key: keyof Integration;
    required?: boolean;
  }> = [
    {
      header: "Axborot tizimi nomi",
      key: "axborotTizimiNomi",
      required: true,
    },
    {
      header: "Integratsiya usuli",
      key: "integratsiyaUsuli",
      required: true,
    },
    { header: "Ma'lumot nomi", key: "malumotNomi", required: true },
    {
      header: "Tashkilot nomi va shakli",
      key: "tashkilotNomiVaShakli",
      required: true,
    },
    { header: "Asosiy maqsad", key: "asosiyMaqsad", required: true },
    {
      header: "Normativ-huquqiy hujjat",
      key: "normativHuquqiyHujjat",
      required: true,
    },
    {
      header: "Texnologik yo'riqnoma mavjudligi",
      key: "texnologikYoriknomaMavjudligi",
    },
    {
      header: "Ma'lumot formati",
      key: "malumotFormati",
      required: true,
    },
    {
      header: "Ma'lumot almashish sharti",
      key: "maqlumotAlmashishSharti",
    },
    {
      header: "Ma'lumot yangilanish davriyligi",
      key: "yangilanishDavriyligi",
    },
    { header: "Ma'lumot hajmi", key: "malumotHajmi" },
    { header: "Hamkor aloqa", key: "hamkorAloqa" },
    { header: "Markaziy bank aloqa", key: "markaziyBankAloqa" },
    { header: "Aloqa kanali", key: "aloqaKanali" },
    { header: "Oxirgi uzatish vaqti", key: "oxirgiUzatishVaqti" },
    { header: "Status", key: "status", required: true },
    { header: "Izoh", key: "izoh" },
  ];

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isParsingImport, setIsParsingImport] = useState(false);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [parsedImportRecords, setParsedImportRecords] = useState<
    ParsedImportRecord[]
  >([]);
  const [importPreviewRows, setImportPreviewRows] = useState<
    ParsedImportRecord[]
  >([]);
  const [importTotalRows, setImportTotalRows] = useState(0);
  const [isImportProgressOpen, setIsImportProgressOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState({
    current: 0,
    total: 0,
  });
  const [importResult, setImportResult] = useState<{
    success: number;
    failed: number;
    failures: Array<{ row: number; message: string }>;
  } | null>(null);
  const [isImportReviewOpen, setIsImportReviewOpen] = useState(false);
  const allowedFormats: Integration["malumotFormati"][] = [
    "JSON",
    "XML",
    "CSV",
    "SOAP",
    "REST API",
  ];
  const allowedStatuses: Integration["status"][] = [
    "faol",
    "testda",
    "rejalashtirilgan",
    "muammoli",
  ];

  const generateUniqueColumnKey = (
    name: string,
    options?: { preserveOriginal?: boolean }
  ) => {
    const normalized = options?.preserveOriginal
      ? name
      : name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "_")
          .replace(/^_|_$/g, "");
    const baseKey =
      normalized && normalized.length > 0 ? normalized : `tab_${Date.now()}`;

    const reservedKeys = new Set([
      ...dynamicTabs.map((tab) => tab.columnKey),
      ...Object.values(attachmentFieldConfig).map((config) => config.columnKey),
    ]);

    let uniqueKey = baseKey;
    let counter = 1;

    while (reservedKeys.has(uniqueKey)) {
      uniqueKey = `${baseKey}_${counter++}`;
    }

    return uniqueKey;
  };

  const handleInputChange = (
    field: string,
    value: string | number | boolean
  ) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      // Auto-save to localStorage is handled by useEffect
      return updated;
    });
  };

  const handleFileUpload = (field: string, file: File | null): void => {
    setFormData((prev) => ({ ...prev, [field]: file }));
  };

  const handleDynamicTabFieldChange = (
    tabId: string,
    field: string,
    value: string
  ) => {
    setDynamicTabs((prev) =>
      prev.map((tab) => (tab.id === tabId ? { ...tab, [field]: value } : tab))
    );
  };

  const handleFileChange = (
    tabId: string,
    fileId: string,
    file: File | null
  ) => {
    setDynamicTabs((prev) =>
      prev.map((tab) =>
        tab.id === tabId
          ? {
              ...tab,
              files: tab.files.map((f) =>
                f.id === fileId ? { ...f, file } : f
              ),
            }
          : tab
      )
    );
  };

  const handleAddFileInput = (tabId: string) => {
    setDynamicTabs((prev) =>
      prev.map((tab) =>
        tab.id === tabId
          ? {
              ...tab,
              files: [
                ...tab.files,
                {
                  id: `file_${Date.now()}`,
                  file: null,
                },
              ],
            }
          : tab
      )
    );
  };

  const handleRemoveFileInput = (tabId: string, fileId: string) => {
    setFileToDelete({ tabId, fileId });
    setDeleteFileConfirmOpen(true);
  };

  const confirmDeleteFile = () => {
    if (!fileToDelete) return;
    setDynamicTabs((prev) =>
      prev.map((tab) =>
        tab.id === fileToDelete.tabId
          ? {
              ...tab,
              files: tab.files.filter((f) => f.id !== fileToDelete.fileId),
            }
          : tab
      )
    );
    setDeleteFileConfirmOpen(false);
    setFileToDelete(null);
  };

  const resetImportState = () => {
    setImportFile(null);
    setIsParsingImport(false);
    setImportErrors([]);
    setParsedImportRecords([]);
    setImportPreviewRows([]);
    setImportTotalRows(0);
    setImportProgress({ current: 0, total: 0 });
    setImportResult(null);
    setIsImportModalOpen(false);
    setIsImportReviewOpen(false);
    setIsImportProgressOpen(false);
  };

  const openImportModal = () => {
    resetImportState();
    setIsImportModalOpen(true);
  };

  const handleImportModalChange = (open: boolean) => {
    if (open) {
      setIsImportModalOpen(true);
      return;
    }

    setIsImportModalOpen(false);

    if (!isImportReviewOpen && !isImportProgressOpen) {
      resetImportState();
    }
  };

  const handleImportReviewChange = (open: boolean) => {
    if (open) {
      setIsImportReviewOpen(true);
      return;
    }

    setIsImportReviewOpen(false);

    if (!isImportProgressOpen) {
      resetImportState();
    }
  };

  const getCellValue = (row: Record<string, any>, header: string) => {
    if (Object.prototype.hasOwnProperty.call(row, header)) {
      return row[header];
    }

    const matchKey = Object.keys(row).find(
      (key) => key.trim().toLowerCase() === header.toLowerCase()
    );

    return matchKey ? row[matchKey] : "";
  };

  const toSafeString = (value: any) =>
    value === null || value === undefined ? "" : String(value).trim();

  const normalizeFormatValue = (value: string) =>
    allowedFormats.find((item) => item.toLowerCase() === value.toLowerCase()) ||
    null;

  const normalizeStatusValue = (value: string) =>
    allowedStatuses.find(
      (item) => item.toLowerCase() === value.toLowerCase()
    ) || null;

  const exampleRowValues: Record<string, string> = {
    "Axborot tizimi nomi": "Elektron to'lovlar monitoringi",
    "Integratsiya usuli": "Idoralararo integrallashuv platformasi",
    "Ma'lumot nomi": "Kunlik to'lovlar statistikasi",
    "Tashkilot nomi va shakli": "Markaziy bank - Davlat",
    "Asosiy maqsad": "To'lovlar monitoringi va tahlili",
    "Normativ-huquqiy hujjat": "Markaziy bank qarori №123",
    "Texnologik yo'riqnoma mavjudligi": "Ha, 2024-yil 15-martdagi yo'riqnoma",
    "Ma'lumot formati": "JSON",
    "Ma'lumot almashish sharti": "So'rov-javob (API)",
    "Ma'lumot yangilanish davriyligi": "Kunlik",
    "Ma'lumot hajmi": "20 MB",
    "Hamkor aloqa": "Aliyev Aziz, aziz@partner.uz",
    "Markaziy bank aloqa": "Karimova Diyoraxon, diyoraxon@cbu.uz",
    "Aloqa kanali": "VPN orqali REST API",
    "Oxirgi uzatish vaqti": "2024-01-20 09:30",
    Status: "faol",
    Izoh: "Pilot loyiha sifatida ishga tushirilgan",
  };

  const handleDownloadTemplate = () => {
    try {
      const headers = importColumnConfig.map((column) => column.header);
      const row = headers.map((header) => exampleRowValues[header] || "");

      const worksheet = XLSX.utils.aoa_to_sheet([headers, row]);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Integratsiyalar");

      const arrayBuffer = XLSX.write(workbook, {
        type: "array",
        bookType: "xlsx",
      });

      const blob = new Blob([arrayBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "integration-import-template.xlsx";
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Sample faylni yuklab olishda xatolik:", error);
      toast.error("Excel namunaviy faylini yaratishda xatolik yuz berdi.");
    }
  };

  const handleImportFileSelected = async (file: File | null) => {
    setIsParsingImport(false);
    setImportErrors([]);
    setParsedImportRecords([]);
    setImportPreviewRows([]);
    setImportTotalRows(0);
    setImportResult(null);

    if (!file) {
      setImportFile(null);
      return;
    }

    if (!/\.(xlsx|xls)$/i.test(file.name)) {
      setImportFile(null);
      setImportErrors([
        "Faqat .xlsx yoki .xls formatidagi fayllarni yuklash mumkin.",
      ]);
      return;
    }

    setImportFile(file);
    setIsParsingImport(true);

    try {
      const fileBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(fileBuffer, { type: "array" });

      if (!workbook.SheetNames.length) {
        setImportErrors(["Excel faylda varaq topilmadi."]);
        return;
      }

      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows: Record<string, any>[] = XLSX.utils.sheet_to_json(sheet, {
        defval: "",
        raw: false,
      });

      setImportTotalRows(rows.length);

      if (!rows.length) {
        setImportErrors(["Excel fayl bo'sh. Ma'lumotlar topilmadi."]);
        return;
      }

      const headerKeys = Object.keys(rows[0]).map((key) => key.trim());
      const missingHeaders = importColumnConfig
        .filter((column) => column.required)
        .filter(
          (column) =>
            !headerKeys.some(
              (header) => header.toLowerCase() === column.header.toLowerCase()
            )
        );

      if (missingHeaders.length > 0) {
        setImportErrors([
          `Quyidagi ustunlar topilmadi: ${missingHeaders
            .map((column) => `"${column.header}"`)
            .join(", ")}`,
        ]);
        setIsParsingImport(false);
        return;
      }

      const records: ParsedImportRecord[] = rows.map((row, index) => {
        const rowNumber = index + 2;
        const errors: string[] = [];

        const integrationData: Partial<Integration> = {
          axborotTizimiNomi: toSafeString(
            getCellValue(row, "Axborot tizimi nomi")
          ),
          integratsiyaUsuli: toSafeString(
            getCellValue(row, "Integratsiya usuli")
          ),
          malumotNomi: toSafeString(getCellValue(row, "Ma'lumot nomi")),
          tashkilotNomiVaShakli: toSafeString(
            getCellValue(row, "Tashkilot nomi va shakli")
          ),
          asosiyMaqsad: toSafeString(getCellValue(row, "Asosiy maqsad")),
          normativHuquqiyHujjat: toSafeString(
            getCellValue(row, "Normativ-huquqiy hujjat")
          ),
          texnologikYoriknomaMavjudligi: toSafeString(
            getCellValue(row, "Texnologik yo'riqnoma mavjudligi")
          ),
          maqlumotAlmashishSharti: toSafeString(
            getCellValue(row, "Ma'lumot almashish sharti")
          ),
          yangilanishDavriyligi: toSafeString(
            getCellValue(row, "Ma'lumot yangilanish davriyligi")
          ),
          malumotHajmi: toSafeString(getCellValue(row, "Ma'lumot hajmi")),
          aloqaKanali: toSafeString(getCellValue(row, "Aloqa kanali")),
          oxirgiUzatishVaqti: toSafeString(
            getCellValue(row, "Oxirgi uzatish vaqti")
          ),
          markaziyBankAloqa: toSafeString(
            getCellValue(row, "Markaziy bank aloqa")
          ),
          hamkorAloqa: toSafeString(getCellValue(row, "Hamkor aloqa")),
          izoh: toSafeString(getCellValue(row, "Izoh")),
          dynamicTabs: [],
        };

        importColumnConfig.forEach((column) => {
          const value = toSafeString(getCellValue(row, column.header));
          if (column.required && !value) {
            errors.push(`"${column.header}" ustuni bo'sh.`);
          }
        });

        const formatValue = toSafeString(getCellValue(row, "Ma'lumot formati"));
        const normalizedFormat = normalizeFormatValue(formatValue);
        if (!normalizedFormat) {
          errors.push(
            `Ma'lumot formati noto'g'ri. Ruxsat etilgan qiymatlar: ${allowedFormats.join(
              ", "
            )}.`
          );
        } else {
          integrationData.malumotFormati = normalizedFormat;
        }

        const statusValue = toSafeString(getCellValue(row, "Status"));
        const normalizedStatus = normalizeStatusValue(statusValue);
        if (!normalizedStatus) {
          errors.push(
            `Status noto'g'ri. Ruxsat etilgan qiymatlar: ${allowedStatuses.join(
              ", "
            )}.`
          );
        } else {
          integrationData.status = normalizedStatus;
        }

        return {
          rowNumber,
          raw: row,
          data: integrationData,
          errors,
        };
      });

      setParsedImportRecords(records);
      setImportPreviewRows(records.slice(0, 5));
      setIsImportModalOpen(false);
      setIsImportReviewOpen(true);
    } catch (error: any) {
      setImportErrors([
        error?.message ||
          "Excel faylini o'qishda kutilmagan xatolik yuz berdi.",
      ]);
    } finally {
      setIsParsingImport(false);
    }
  };

  const handleStartImport = async () => {
    const validRecords = parsedImportRecords.filter(
      (record) => record.errors.length === 0
    );

    if (!validRecords.length) {
      toast.error(
        "Import uchun mos keladigan qatorlar topilmadi. Excel faylini tekshiring."
      );
      return;
    }

    setIsImportReviewOpen(false);
    setIsImportModalOpen(false);
    setIsImportProgressOpen(true);
    setIsImporting(true);
    setImportProgress({ current: 0, total: validRecords.length });
    setImportResult(null);

    let successCount = 0;
    const failures: Array<{ row: number; message: string }> = [];

    for (let index = 0; index < validRecords.length; index++) {
      const record = validRecords[index];
      setImportProgress({ current: index, total: validRecords.length });

      try {
        await supabaseUtils.addIntegration({
          ...(record.data as Integration),
          dynamicTabs: [],
        });
        successCount++;
      } catch (error: any) {
        failures.push({
          row: record.rowNumber,
          message: error?.message || "Ma'lumotni saqlashda xatolik yuz berdi",
        });
      }

      setImportProgress({ current: index + 1, total: validRecords.length });
    }

    setIsImporting(false);
    setImportResult({
      success: successCount,
      failed: failures.length,
      failures,
    });

    if (!failures.length) {
      toast.success(
        `${successCount} ta integratsiya muvaffaqiyatli import qilindi.`
      );
      setTimeout(() => {
        navigate("/integrations", { replace: true });
      }, 500);
    } else {
      toast.error(
        `${failures.length} ta qatorni import qilishda xatolik yuz berdi. Tafsilotlarni ko'rib chiqing.`
      );
    }
  };

  const handleCloseImportProgress = (open: boolean) => {
    if (open) {
      setIsImportProgressOpen(true);
      return;
    }

    if (isImporting) {
      return;
    }

    setIsImportProgressOpen(false);
    resetImportState();
  };

  const openAttachmentDialog = (field: AttachmentField) => {
    const existingFiles = fieldAttachments[field]?.files.map((item) => ({
      id: item.id,
      file: item.file,
    })) ?? [createEmptyAttachmentFile()];
    setActiveAttachmentField(field);
    setAttachmentDraftFiles(existingFiles);
    setAttachmentDialogOpen(true);
  };

  const closeAttachmentDialog = () => {
    setAttachmentDialogOpen(false);
    setActiveAttachmentField(null);
    setAttachmentDraftFiles([]);
  };

  const handleAttachmentFileChange = (id: string, file: File | null) => {
    setAttachmentDraftFiles((prev) =>
      prev.map((item) => (item.id === id ? { ...item, file } : item))
    );
  };

  const handleAttachmentAddFile = () => {
    setAttachmentDraftFiles((prev) => [...prev, createEmptyAttachmentFile()]);
  };

  const handleAttachmentRemoveFile = (id: string) => {
    setAttachmentDraftFiles((prev) => {
      const filtered = prev.filter((item) => item.id !== id);
      return filtered.length > 0 ? filtered : [createEmptyAttachmentFile()];
    });
  };

  const handleAttachmentSave = () => {
    if (!activeAttachmentField) {
      closeAttachmentDialog();
      return;
    }

    const validFiles = attachmentDraftFiles.filter((item) => item.file);

    setFieldAttachments((prev) => {
      if (validFiles.length === 0) {
        const next = { ...prev };
        delete next[activeAttachmentField];
        return next;
      }

      return {
        ...prev,
        [activeAttachmentField]: { files: validFiles },
      };
    });

    closeAttachmentDialog();
  };

  const handleAddNewTab = (
    columnKeyOverride?: string | null,
    columnLabel?: string
  ) => {
    const trimmedName = newTabName.trim();
    if (!trimmedName) {
      return;
    }

    const columnKey =
      columnKeyOverride && columnKeyOverride.trim().length > 0
        ? generateUniqueColumnKey(columnKeyOverride, { preserveOriginal: true })
        : generateUniqueColumnKey(trimmedName);
    const labelToUse = columnLabel || trimmedName;

    const newTab = {
      id: `tab_${Date.now()}`,
      name: trimmedName,
      columnKey,
      title: labelToUse,
      description: labelToUse,
      files: [
        {
          id: `file_${Date.now()}`,
          file: null,
        },
      ],
    };

    setDynamicTabs((prev) => [...prev, newTab]);
    setNewTabName("");
    setSelectedColumnOption("");
    setIsModalOpen(false);
    setActiveTab(newTab.id);
  };

  const handleRemoveTab = (tabId: string) => {
    setTabToDelete(tabId);
    setDeleteTabConfirmOpen(true);
  };

  const confirmDeleteTab = () => {
    if (!tabToDelete) return;
    setDynamicTabs((prev) => prev.filter((tab) => tab.id !== tabToDelete));
    if (activeTab === tabToDelete) {
      setActiveTab("passport");
    }
    setDeleteTabConfirmOpen(false);
    setTabToDelete(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent, field: string) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      // Check file type
      const allowedTypes = [".pdf", ".doc", ".docx", ".txt"];
      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();

      if (allowedTypes.includes(fileExtension)) {
        handleFileUpload(field, file);
      } else {
        toast.error(
          "Faqat PDF, DOC, DOCX, TXT formatlarida fayl yuklash mumkin"
        );
      }
    }
  };

  const handleSave = async () => {
    // Ma'lumotlarni tekshirish
    if (
      !formData.axborotTizimiNomi ||
      !formData.integratsiyaUsuli ||
      !formData.malumotNomi ||
      !formData.tashkilotNomiVaShakli ||
      !formData.asosiyMaqsad ||
      !formData.normativHuquqiyHujjat ||
      !formData.malumotFormati ||
      !formData.status
    ) {
      toast.error("Barcha majburiy maydonlarni to'ldiring!");
      return;
    }

    setIsSaving(true);
    try {
      // Dynamic tablarni tayyorlash
      // Fayllarni base64 formatda saqlash
      const processFiles = async (files: any[]) => {
        const processedFiles = [];
        for (const file of files) {
          if (file.file) {
            const base64 = await new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.readAsDataURL(file.file);
            });
            processedFiles.push({
              name: file.file.name,
              size: file.file.size,
              type: file.file.type,
              url: base64,
            });
          }
        }
        return processedFiles;
      };

      const preparedDynamicTabs = await Promise.all(
        dynamicTabs.map(async (tab: any) => ({
          name: tab.name,
          columnKey: tab.columnKey,
          title: tab.title,
          description: tab.description,
          files: await processFiles(tab.files),
        }))
      );

      const attachmentTabs = await Promise.all(
        (
          Object.entries(fieldAttachments) as Array<
            [
              AttachmentField,
              { files: Array<{ id: string; file: File | null }> }
            ]
          >
        )
          .filter(([, data]) => data.files.some((file) => file.file))
          .map(async ([fieldKey, data]) => ({
            name: attachmentFieldConfig[fieldKey].label,
            columnKey: attachmentFieldConfig[fieldKey].columnKey,
            title: attachmentFieldConfig[fieldKey].label,
            description: attachmentFieldConfig[fieldKey].label,
            files: await processFiles(data.files),
          }))
      );

      const allDynamicTabs = [...preparedDynamicTabs, ...attachmentTabs];

      // Supabase'ga saqlash - yangi struktura
      const newIntegration = await supabaseUtils.addIntegration({
        axborotTizimiNomi: formData.axborotTizimiNomi,
        integratsiyaUsuli: formData.integratsiyaUsuli,
        malumotNomi: formData.malumotNomi,
        tashkilotNomiVaShakli: formData.tashkilotNomiVaShakli,
        asosiyMaqsad: formData.asosiyMaqsad,
        normativHuquqiyHujjat: formData.normativHuquqiyHujjat,
        texnologikYoriknomaMavjudligi: formData.texnologikYoriknomaMavjudligi,
        malumotFormati: formData.malumotFormati,
        maqlumotAlmashishSharti: formData.maqlumotAlmashishSharti,
        yangilanishDavriyligi: formData.yangilanishDavriyligi,
        malumotHajmi: formData.malumotHajmi,
        aloqaKanali: formData.aloqaKanali,
        oxirgiUzatishVaqti: formData.oxirgiUzatishVaqti,
        markaziyBankAloqa: formData.markaziyBankAloqa,
        hamkorAloqa: formData.hamkorAloqa,
        status: formData.status,
        izoh: formData.izoh,
        // Dynamic tabs
        dynamicTabs: allDynamicTabs,
      });

      toast.success("Integratsiya muvaffaqiyatli saqlandi!");

      // Clear draft from localStorage after successful save
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      window.dispatchEvent(
        new CustomEvent("draftIntegrationUpdated", { detail: false })
      );

      // Integrations listiga qaytish
      navigate("/integrations", { replace: true });
    } catch (error) {
      console.error("Saqlashda xatolik:", error);
      toast.error("Saqlashda xatolik yuz berdi!");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    const hasData =
      formData.axborotTizimiNomi ||
      formData.integratsiyaUsuli ||
      formData.malumotNomi ||
      formData.tashkilotNomiVaShakli ||
      formData.asosiyMaqsad ||
      formData.normativHuquqiyHujjat ||
      formData.texnologikYoriknomaMavjudligi ||
      formData.maqlumotAlmashishSharti ||
      formData.yangilanishDavriyligi ||
      formData.malumotHajmi ||
      formData.aloqaKanali ||
      formData.oxirgiUzatishVaqti ||
      formData.markaziyBankAloqa ||
      formData.hamkorAloqa ||
      formData.izoh ||
      dynamicTabs.length > 0;

    if (hasData && !isSaving) {
      const confirmed = window.confirm(
        "Ma'lumotlar saqlanmaydi. Sahifadan chiqmoqchimisiz?"
      );
      if (!confirmed) {
        return;
      }
      // Clear draft when user confirms cancellation
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      window.dispatchEvent(
        new CustomEvent("draftIntegrationUpdated", { detail: false })
      );
    }
    navigate("/integrations", { replace: true });
  };

  const renderPassportContent = () => {
    const normAttachments =
      fieldAttachments.normativHuquqiyHujjat?.files.filter(
        (file) => file.file
      ) ?? [];
    const techAttachments =
      fieldAttachments.texnologikYoriknomaMavjudligi?.files.filter(
        (file) => file.file
      ) ?? [];

    return (
      <div className="space-y-8">
        {/* I. Integratsiya ma'lumotlari */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#e4a216] text-white dark:text-black rounded-full flex items-center justify-center text-sm font-bold">
              I
            </div>
            <h3 className="text-lg font-semibold">Integratsiya ma'lumotlari</h3>
          </div>

          {/* Select fields row - Ma'lumot formati va Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="malumotFormati">Ma'lumot formati *</Label>
              <Select
                value={formData.malumotFormati}
                onValueChange={(value) =>
                  handleInputChange(
                    "malumotFormati",
                    value as "JSON" | "XML" | "CSV" | "SOAP" | "REST API"
                  )
                }
              >
                <SelectTrigger className={`w-full ${selectTriggerClasses}`}>
                  <SelectValue placeholder="Ma'lumot formatini tanlang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="JSON">JSON</SelectItem>
                  <SelectItem value="XML">XML</SelectItem>
                  <SelectItem value="CSV">CSV</SelectItem>
                  <SelectItem value="SOAP">SOAP</SelectItem>
                  <SelectItem value="REST API">REST API</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Integratsiya holati / statusi *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  handleInputChange(
                    "status",
                    value as "faol" | "testda" | "rejalashtirilgan" | "muammoli"
                  )
                }
              >
                <SelectTrigger className={`w-full ${selectTriggerClasses}`}>
                  <SelectValue placeholder="Statusni tanlang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="faol">Faol</SelectItem>
                  <SelectItem value="testda">Testda</SelectItem>
                  <SelectItem value="rejalashtirilgan">
                    Rejalashtirilgan
                  </SelectItem>
                  <SelectItem value="muammoli">Muammoli</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Asosiy input fields */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="axborotTizimiNomi">
                  Axborot tizimi yoki resursning to'liq nomi (yoki interfeys) *
                </Label>
                <Textarea
                  id="axborotTizimiNomi"
                  value={formData.axborotTizimiNomi}
                  onChange={(e) =>
                    handleInputChange("axborotTizimiNomi", e.target.value)
                  }
                  placeholder="Axborot tizimi nomini kiriting"
                  className={fieldInputClasses}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="integratsiyaUsuli">
                  Integratsiyani amalga oshirish usuli *
                </Label>
                <Textarea
                  id="integratsiyaUsuli"
                  value={formData.integratsiyaUsuli}
                  onChange={(e) =>
                    handleInputChange("integratsiyaUsuli", e.target.value)
                  }
                  placeholder="Idoralararo integrallashuv platformasi orqali yoki to'g'ridan to'g'ri"
                  className={fieldInputClasses}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="malumotNomi">
                  Uzatiladigan/qabul qilinadigan ma'lumot nomi *
                </Label>
                <Textarea
                  id="malumotNomi"
                  value={formData.malumotNomi}
                  onChange={(e) =>
                    handleInputChange("malumotNomi", e.target.value)
                  }
                  placeholder="Ma'lumot nomini kiriting"
                  className={fieldInputClasses}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tashkilotNomiVaShakli">
                  Integratsiya qilingan tashkilot nomi va shakli *
                </Label>
                <Textarea
                  id="tashkilotNomiVaShakli"
                  value={formData.tashkilotNomiVaShakli}
                  onChange={(e) =>
                    handleInputChange("tashkilotNomiVaShakli", e.target.value)
                  }
                  placeholder="Tashkilot nomi va shakli (davlat / xususiy)"
                  className={fieldInputClasses}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="normativHuquqiyHujjat">
                    Normativ-huquqiy hujjat *
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      openAttachmentDialog("normativHuquqiyHujjat")
                    }
                    className={`h-9 w-9 ${
                      normAttachments.length > 0
                        ? "border-[#e4a216] text-[#e4a216]"
                        : "border-gray-300 text-muted-foreground"
                    } hover:border-[#e4a216] hover:bg-[#fef6e8] dark:hover:bg-[#3a3728] hover:text-[#e4a216]`}
                    title="Fayl biriktirish"
                  >
                    <Paperclip className="h-4 w-4" />
                    <span className="sr-only">
                      Normativ-huquqiy hujjat uchun fayl biriktirish
                    </span>
                  </Button>
                </div>
                <Textarea
                  id="normativHuquqiyHujjat"
                  value={formData.normativHuquqiyHujjat}
                  onChange={(e) =>
                    handleInputChange("normativHuquqiyHujjat", e.target.value)
                  }
                  placeholder="Normativ-huquqiy hujjat nomini kiriting"
                  className={fieldInputClasses}
                  rows={2}
                />
                {normAttachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 text-xs text-gray-600 dark:text-gray-300">
                    {normAttachments.map((item) => (
                      <span
                        key={item.id}
                        className="inline-flex items-center gap-1 rounded-full border border-dashed border-[#e4a216]/60 px-2 py-1"
                      >
                        <Paperclip className="h-3 w-3" />
                        {item.file?.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="texnologikYoriknomaMavjudligi">
                    Axborot almashinuvi bo'yicha texnologik yo'riqnoma
                    mavjudligi
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      openAttachmentDialog("texnologikYoriknomaMavjudligi")
                    }
                    className={`h-9 w-9 ${
                      techAttachments.length > 0
                        ? "border-[#e4a216] text-[#e4a216]"
                        : "border-gray-300 text-muted-foreground"
                    } hover:border-[#e4a216] hover:bg-[#fef6e8] dark:hover:bg-[#3a3728] hover:text-[#e4a216]`}
                    title="Fayl biriktirish"
                  >
                    <Paperclip className="h-4 w-4" />
                    <span className="sr-only">
                      Texnologik yo'riqnoma hujjati uchun fayl biriktirish
                    </span>
                  </Button>
                </div>
                <Textarea
                  id="texnologikYoriknomaMavjudligi"
                  value={formData.texnologikYoriknomaMavjudligi}
                  onChange={(e) =>
                    handleInputChange(
                      "texnologikYoriknomaMavjudligi",
                      e.target.value
                    )
                  }
                  placeholder="Texnologik yo'riqnoma mavjudligi"
                  className={fieldInputClasses}
                  rows={2}
                />
                {techAttachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 text-xs text-gray-600 dark:text-gray-300">
                    {techAttachments.map((item) => (
                      <span
                        key={item.id}
                        className="inline-flex items-center gap-1 rounded-full border border-dashed border-[#e4a216]/60 px-2 py-1"
                      >
                        <Paperclip className="h-3 w-3" />
                        {item.file?.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="maqlumotAlmashishSharti">
                  Ma'lumot almashish sharti
                </Label>
                <Textarea
                  id="maqlumotAlmashishSharti"
                  value={formData.maqlumotAlmashishSharti}
                  onChange={(e) =>
                    handleInputChange("maqlumotAlmashishSharti", e.target.value)
                  }
                  placeholder="So'rov-javob, push, fayl almashinuvi"
                  className={fieldInputClasses}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="yangilanishDavriyligi">
                  Ma'lumot yangilanish davriyligi
                </Label>
                <Textarea
                  id="yangilanishDavriyligi"
                  value={formData.yangilanishDavriyligi}
                  onChange={(e) =>
                    handleInputChange("yangilanishDavriyligi", e.target.value)
                  }
                  placeholder="Real vaqt, kunlik, haftalik, oylik va hokazo"
                  className={fieldInputClasses}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="malumotHajmi">Ma'lumot hajmi</Label>
                <Textarea
                  id="malumotHajmi"
                  value={formData.malumotHajmi}
                  onChange={(e) =>
                    handleInputChange("malumotHajmi", e.target.value)
                  }
                  placeholder="Kunlik / oylik MB yoki GB"
                  className={fieldInputClasses}
                  rows={2}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="aloqaKanali">
                  Hamkor tashkilot bilan aloqa kanali
                </Label>
                <Textarea
                  id="aloqaKanali"
                  value={formData.aloqaKanali}
                  onChange={(e) =>
                    handleInputChange("aloqaKanali", e.target.value)
                  }
                  placeholder="API, VPN, server va hokazo"
                  className={fieldInputClasses}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="oxirgiUzatishVaqti">
                  So'nggi muvaffaqiyatli uzatish vaqti
                </Label>
                <Textarea
                  id="oxirgiUzatishVaqti"
                  value={formData.oxirgiUzatishVaqti}
                  onChange={(e) =>
                    handleInputChange("oxirgiUzatishVaqti", e.target.value)
                  }
                  placeholder="Tizimdan online olib beriladi"
                  className={fieldInputClasses}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="markaziyBankAloqa">
                  Markaziy bank tomonidan texnik aloqa shaxsi
                </Label>
                <Textarea
                  id="markaziyBankAloqa"
                  value={formData.markaziyBankAloqa}
                  onChange={(e) =>
                    handleInputChange("markaziyBankAloqa", e.target.value)
                  }
                  placeholder="F.I.Sh, telefon, e-mail"
                  className={fieldInputClasses}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hamkorAloqa">
                  Hamkor tashkilot tomonidan texnik aloqa shaxsi
                </Label>
                <Textarea
                  id="hamkorAloqa"
                  value={formData.hamkorAloqa}
                  onChange={(e) =>
                    handleInputChange("hamkorAloqa", e.target.value)
                  }
                  placeholder="F.I.Sh, telefon, e-mail"
                  className={fieldInputClasses}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="izoh">Izoh / qo'shimcha ma'lumot</Label>
                <Textarea
                  id="izoh"
                  value={formData.izoh}
                  onChange={(e) => handleInputChange("izoh", e.target.value)}
                  placeholder="Qo'shimcha ma'lumot"
                  className={fieldInputClasses}
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Asosiy maqsad textarea */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="asosiyMaqsad">
                Integratsiyadan asosiy maqsad *
              </Label>
              <Textarea
                id="asosiyMaqsad"
                value={formData.asosiyMaqsad}
                onChange={(e) =>
                  handleInputChange("asosiyMaqsad", e.target.value)
                }
                placeholder="Integratsiyadan asosiy maqsadni kiriting"
                className={fieldInputClasses}
                rows={4}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDynamicTabContent = (tab: {
    id: string;
    name: string;
    title: string;
    description: string;
    files: Array<{
      id: string;
      file: File | null;
    }>;
  }) => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{tab.name}</h3>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleRemoveTab(tab.id)}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-6">
        {/* Title Input */}
        <div className="space-y-2">
          <Label htmlFor={`${tab.id}_title`}>Sarlavha *</Label>
          <Textarea
            id={`${tab.id}_title`}
            value={tab.title}
            onChange={(e) =>
              handleDynamicTabFieldChange(tab.id, "title", e.target.value)
            }
            placeholder="Sarlavha kiriting"
            className={fieldInputClasses}
            rows={2}
          />
        </div>

        {/* Description Input */}
        <div className="space-y-2">
          <Label htmlFor={`${tab.id}_description`}>Tavsif *</Label>
          <Textarea
            id={`${tab.id}_description`}
            value={tab.description}
            onChange={(e) =>
              handleDynamicTabFieldChange(tab.id, "description", e.target.value)
            }
            placeholder="Tavsif kiriting"
            className={fieldInputClasses}
            rows={3}
          />
        </div>

        {/* File Inputs */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Fayllar</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleAddFileInput(tab.id)}
              className="hover:bg-[#f6f5e7] dark:hover:bg-[#3a3728] hover:border-[#e4a216] dark:hover:border-[#e4a216] hover:text-[#e4a216] dark:hover:text-[#e4a216]"
            >
              <Plus className="h-4 w-4 mr-2" />
              Fayl qo'shish
            </Button>
          </div>

          {tab.files.map((fileInput, index) => (
            <div key={fileInput.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor={`${fileInput.id}_file`}>Fayl {index + 1}</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveFileInput(tab.id, fileInput.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-2">
                {fileInput.file ? (
                  <div className="flex items-center justify-between p-4 border border-[#f6f5e7] dark:border-[#3a3728] bg-[#f6f5e7] dark:bg-[#3a3728] rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-[#f6f5e7] dark:bg-[#3a3728] rounded-full flex items-center justify-center">
                          <Upload className="h-4 w-4 text-[#e4a216] dark:text-[#e4a216]" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {fileInput.file.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {(fileInput.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleRemoveFileInput(tab.id, fileInput.id)
                      }
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div
                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const files = e.dataTransfer.files;
                      if (files && files.length > 0) {
                        const file = files[0];
                        const allowedTypes = [".pdf", ".doc", ".docx", ".txt"];
                        const fileExtension =
                          "." + file.name.split(".").pop()?.toLowerCase();
                        if (allowedTypes.includes(fileExtension)) {
                          handleFileChange(tab.id, fileInput.id, file);
                        } else {
                          toast.error(
                            "Faqat PDF, DOC, DOCX, TXT formatlarida fayl yuklash mumkin"
                          );
                        }
                      }
                    }}
                  >
                    <div className="mx-auto w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
                      <Upload className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor={`${fileInput.id}_file`}
                        className="cursor-pointer"
                      >
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300">
                          Fayl yuklash uchun bosing
                        </span>
                      </Label>
                      <input
                        id={`${fileInput.id}_file`}
                        type="file"
                        className="sr-only"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          handleFileChange(tab.id, fileInput.id, file);
                        }}
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        yoki faylni bu yerga sudrab tashlang
                      </p>
                    </div>
                    <div className="mt-3">
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        PDF, DOC, DOCX, TXT formatlarida • Maksimal 10MB
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const selectedColumnMeta = selectedColumnOption
    ? columnOptions.find((option) => option.value === selectedColumnOption) ||
      null
    : null;

  const handleColumnOptionChange = (value: string) => {
    if (value === "__clear__") {
      setSelectedColumnOption("");
    } else {
      setSelectedColumnOption(value);
    }
  };

  const validImportRecords = parsedImportRecords.filter(
    (record) => record.errors.length === 0
  );
  const invalidImportRecords = parsedImportRecords.filter(
    (record) => record.errors.length > 0
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!hasPermission(role, "canCreateIntegrations")) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">Ruxsat yo'q</p>
          <p className="text-muted-foreground">
            Sizda yangi integratsiya qo'shish ruxsati yo'q
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Yangi integratsiya
          </h1>
          <p className="text-muted-foreground">
            Integratsiya ma'lumotlarini to'ldiring
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={openImportModal}
            className="border-dashed border-[#e4a216] text-[#e4a216] hover:bg-[#fef6e8] dark:hover:bg-[#3a3728]"
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Import qilish
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="hover:!bg-[#f6f5e7] dark:hover:!bg-[#3a3728] hover:!text-[#e4a216] dark:hover:!text-[#e4a216]"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Orqaga qaytish
          </Button>
        </div>
      </div>

      <Dialog open={isImportModalOpen} onOpenChange={handleImportModalChange}>
        <DialogContent className="max-w-4xl space-y-4">
          <DialogHeader>
            <DialogTitle>Excel orqali import qilish</DialogTitle>
            <DialogDescription>
              Quyidagi formatdagi Excel faylni yuklash orqali bir nechta
              integratsiyalarni bir vaqtning o'zida yaratishingiz mumkin.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-md border border-dashed border-[#e4a216]/60 bg-[#fef6e8] p-4 text-sm dark:border-[#e4a216]/40 dark:bg-[#3a3728]">
              <p className="font-medium text-[#a06700] dark:text-[#f9c36b]">
                Majburiy ustunlar:
              </p>
              <ul className="mt-2 grid gap-1 sm:grid-cols-2">
                {importColumnConfig
                  .filter((column) => column.required)
                  .map((column) => (
                    <li key={column.key} className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-[#e4a216]" />
                      <span>{column.header}</span>
                    </li>
                  ))}
              </ul>
              <div className="mt-3 space-y-1 text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground dark:text-white">
                    Ma'lumot formati
                  </span>
                  : {allowedFormats.join(", ")}
                </p>
                <p>
                  <span className="font-medium text-foreground dark:text-white">
                    Status
                  </span>
                  : {allowedStatuses.join(", ")}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDownloadTemplate}
                className="border-[#e4a216] text-[#e4a216] hover:bg-[#fef6e8] dark:hover:bg-[#3a3728]"
              >
                <FileSpreadsheet className="h-4 w-4" />
                Namuna Excel faylini yuklab olish
              </Button>
              <p className="text-xs text-muted-foreground">
                Namuna faylda majburiy ustunlar va test qiymatlar keltirilgan.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="import-file">Excel faylini yuklang</Label>
              <Input
                id="import-file"
                type="file"
                accept=".xlsx,.xls"
                onChange={(event) =>
                  handleImportFileSelected(event.target.files?.[0] ?? null)
                }
              />
              {importFile && (
                <p className="text-xs text-muted-foreground">
                  Tanlangan fayl:{" "}
                  <span className="font-medium">{importFile.name}</span>
                </p>
              )}
            </div>

            {isParsingImport && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Fayl tahlil qilinmoqda...
              </div>
            )}

            {importErrors.length > 0 && (
              <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
                <ul className="list-disc space-y-1 pl-4">
                  {importErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleImportModalChange(false)}
            >
              Bekor qilish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isImportReviewOpen} onOpenChange={handleImportReviewChange}>
        <DialogContent className="sm:max-w-[90rem] sm:w-[90vw] w-screen max-h-[85vh] overflow-hidden flex flex-col space-y-4 p-6">
          <DialogHeader>
            <DialogTitle>Importni ko'rib chiqish</DialogTitle>
            <DialogDescription>
              Yuklangan Excel faylidan {importTotalRows} ta qator topildi.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-auto space-y-4">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                <Check className="h-4 w-4" />
                {validImportRecords.length} ta qator importga tayyor
              </span>
              {invalidImportRecords.length > 0 && (
                <span className="text-red-600 dark:text-red-400">
                  {invalidImportRecords.length} ta qator xatolik bilan
                </span>
              )}
              <span className="text-muted-foreground">
                Jami qatorlar: {importTotalRows}
              </span>
            </div>

            <div className="rounded-md border bg-muted/40">
              <div className="max-h-[50vh] overflow-auto">
                <Table className="min-w-max">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">№</TableHead>
                      {importColumnConfig.map((column) => (
                        <TableHead key={column.key}>{column.header}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {importPreviewRows.map((record) => (
                      <TableRow key={record.rowNumber}>
                        <TableCell className="font-mono text-xs">
                          {record.rowNumber}
                        </TableCell>
                        {importColumnConfig.map((column) => (
                          <TableCell key={column.key}>
                            {toSafeString(
                              getCellValue(record.raw, column.header)
                            ) || (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {invalidImportRecords.length > 0 && (
              <div className="space-y-2 rounded-md border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-900 dark:border-yellow-800 dark:bg-yellow-950/40 dark:text-yellow-200">
                <p className="font-medium">
                  Xatoliklar (birinchi{" "}
                  {Math.min(invalidImportRecords.length, 5)} ta):
                </p>
                <ul className="space-y-1">
                  {invalidImportRecords.slice(0, 5).map((record) => (
                    <li key={record.rowNumber}>
                      <span className="font-medium">
                        {record.rowNumber}-qator:
                      </span>{" "}
                      {record.errors.join("; ")}
                    </li>
                  ))}
                </ul>
                {invalidImportRecords.length > 5 && (
                  <p className="text-xs">
                    Yana {invalidImportRecords.length - 5} ta qator
                    xatoliklarini tuzatish zarur.
                  </p>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetImportState();
                  setIsImportModalOpen(true);
                }}
              >
                Excel faylini almashtirish
              </Button>
              <Button
                type="button"
                onClick={handleStartImport}
                disabled={
                  isParsingImport ||
                  validImportRecords.length === 0 ||
                  isImporting
                }
                className="bg-[#e4a216] hover:bg-[#d19214] text-white dark:text-black"
              >
                Importni boshlash
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isImportProgressOpen}
        onOpenChange={handleCloseImportProgress}
      >
        <DialogContent className="sm:max-w-[420px] space-y-4">
          <DialogHeader>
            <DialogTitle>Import jarayoni</DialogTitle>
            <DialogDescription>
              {importFile?.name || "Excel fayl"} bo'yicha import natijalari.
            </DialogDescription>
          </DialogHeader>

          {isImporting ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Ma'lumotlar yuborilmoqda...
              </div>
              <Progress
                value={
                  importProgress.total
                    ? (importProgress.current / importProgress.total) * 100
                    : 0
                }
              />
              <p className="text-xs text-muted-foreground">
                {importProgress.current} / {importProgress.total} qator qayta
                ishlangan
              </p>
            </div>
          ) : importResult ? (
            <div className="space-y-3">
              <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-200">
                <p className="font-medium">
                  {importResult.success} ta qator muvaffaqiyatli import qilindi.
                </p>
              </div>
              {importResult.failed > 0 && (
                <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
                  <p className="font-medium">
                    {importResult.failed} ta qator import qilinmadi:
                  </p>
                  <ul className="mt-2 space-y-1">
                    {importResult.failures.slice(0, 5).map((failure, index) => (
                      <li key={index}>
                        {failure.row}-qator: {failure.message}
                      </li>
                    ))}
                  </ul>
                  {importResult.failures.length > 5 && (
                    <p className="text-xs">
                      Yana {importResult.failures.length - 5} ta qator
                      xatoliklarini ko'rish uchun Excel faylni yangilang.
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Import jarayonini boshlash uchun Excel faylni yuklang.
            </p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isImporting}
              onClick={() => handleCloseImportProgress(false)}
            >
              Yopish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Integratsiya ma'lumotlari</CardTitle>
          <CardDescription>
            Barcha kerakli ma'lumotlarni to'ldiring va fayllarni yuklang
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="flex w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <TabsTrigger
                value="passport"
                className="cursor-pointer data-[state=active]:bg-[#e4a216] data-[state=active]:text-white dark:data-[state=active]:bg-[#e4a216] dark:data-[state=active]:text-white dark:data-[state=inactive]:bg-gray-800 data-[state=inactive]:text-gray-700 dark:data-[state=inactive]:text-gray-300 hover:data-[state=inactive]:bg-gray-50 dark:hover:data-[state=inactive]:bg-gray-700 transition-all"
              >
                Pasport
              </TabsTrigger>
              {dynamicTabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="cursor-pointer data-[state=active]:bg-[#e4a216] data-[state=active]:text-white dark:data-[state=active]:bg-[#e4a216] dark:data-[state=active]:text-white dark:data-[state=inactive]:bg-gray-800 data-[state=inactive]:text-gray-700 dark:data-[state=inactive]:text-gray-300 hover:data-[state=inactive]:bg-gray-50 dark:hover:data-[state=inactive]:bg-gray-700 transition-all"
                >
                  {tab.name}
                </TabsTrigger>
              ))}
              <Dialog
                open={isModalOpen}
                onOpenChange={(open) => {
                  setIsModalOpen(open);
                  if (!open) {
                    setNewTabName("");
                    setSelectedColumnOption("");
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="ml-2 h-9 px-3 hover:!bg-[#f6f5e7] dark:hover:!bg-[#3a3728] hover:!text-[#e4a216] dark:hover:!text-[#e4a216] flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Yangi tab qo‘shish</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Yangi tab qo'shish</DialogTitle>
                    <DialogDescription>
                      Tab nomini kiriting. Istasangiz, mavjud columnlardan
                      birini tanlab, qo'shimcha hujjatlar shu maydon bilan
                      bog'lanishini belgilashingiz mumkin.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="tab-name">Tab nomi *</Label>
                      <Input
                        id="tab-name"
                        value={newTabName}
                        onChange={(e) => setNewTabName(e.target.value)}
                        placeholder="Tab nomini kiriting"
                        className={fieldInputClasses}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="column-select">
                        Column tanlash (ixtiyoriy)
                      </Label>
                      <Select
                        value={selectedColumnOption || undefined}
                        onValueChange={handleColumnOptionChange}
                      >
                        <SelectTrigger
                          id="column-select"
                          className={`w-full ${selectTriggerClasses}`}
                        >
                          <SelectValue placeholder="Column tanlanmagan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__clear__">
                            Column tanlanmagan
                          </SelectItem>
                          {columnOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsModalOpen(false);
                        setNewTabName("");
                        setSelectedColumnOption("");
                      }}
                      className="hover:bg-[#f6f5e7] dark:hover:bg-[#3a3728] hover:border-[#e4a216] dark:hover:border-[#e4a216] hover:text-[#e4a216] dark:hover:text-[#e4a216]"
                    >
                      Bekor qilish
                    </Button>
                    <Button
                      type="button"
                      onClick={() =>
                        handleAddNewTab(
                          selectedColumnMeta?.value,
                          selectedColumnMeta?.label
                        )
                      }
                      disabled={!newTabName.trim()}
                      className="bg-[#e4a216] hover:bg-[#d19214] text-white dark:text-black"
                    >
                      Qo'shish
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TabsList>

            <TabsContent value="passport" className="space-y-4">
              {renderPassportContent()}
            </TabsContent>

            {dynamicTabs.map((tab) => (
              <TabsContent key={tab.id} value={tab.id} className="space-y-4">
                {renderDynamicTabContent(tab)}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <Dialog
        open={attachmentDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeAttachmentDialog();
          }
        }}
      >
        {activeAttachmentField && (
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle>
                {attachmentFieldConfig[activeAttachmentField].label} uchun
                hujjatlar
              </DialogTitle>
              <DialogDescription>
                Fayllarni yuklang va saqlang. Maksimal fayl hajmi 10MB.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {attachmentDraftFiles.map((item, index) => (
                <div
                  key={item.id}
                  className="space-y-2 rounded-md border border-dashed border-gray-300 dark:border-gray-600 p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Fayl {index + 1}
                    </span>
                    {attachmentDraftFiles.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleAttachmentRemoveFile(item.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/50"
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Faylni olib tashlash</span>
                      </Button>
                    )}
                  </div>
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={(e) =>
                      handleAttachmentFileChange(
                        item.id,
                        e.target.files?.[0] ?? null
                      )
                    }
                    className={fieldInputClasses}
                  />
                  {item.file && (
                    <p className="text-xs text-muted-foreground truncate">
                      {item.file.name}
                    </p>
                  )}
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAttachmentAddFile}
                className="hover:bg-[#f6f5e7] dark:hover:bg-[#3a3728] hover:border-[#e4a216] dark:hover:border-[#e4a216] hover:text-[#e4a216] dark:hover:text-[#e4a216]"
              >
                <Plus className="h-4 w-4 mr-2" />
                Yana fayl qo'shish
              </Button>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={closeAttachmentDialog}
                className="hover:bg-[#f6f5e7] dark:hover:bg-[#3a3728] hover:border-[#e4a216] dark:hover:border-[#e4a216] hover:text-[#e4a216] dark:hover:text-[#e4a216]"
              >
                Bekor qilish
              </Button>
              <Button
                type="button"
                onClick={handleAttachmentSave}
                className="bg-[#e4a216] hover:bg-[#d19214] text-white dark:text-black"
              >
                Saqlash
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <Button
          variant="outline"
          onClick={handleCancel}
          disabled={isSaving}
          className="hover:bg-[#f6f5e7] dark:hover:bg-[#3a3728] hover:border-[#e4a216] dark:hover:border-[#e4a216] hover:text-[#e4a216] dark:hover:text-[#e4a216]"
        >
          Bekor qilish
        </Button>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[#e4a216] hover:bg-[#d19214] text-white dark:text-black"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saqlanmoqda...
            </>
          ) : (
            "Saqlash"
          )}
        </Button>
      </div>

      {/* Delete Tab Confirmation Dialog */}
      <AlertDialog
        open={deleteTabConfirmOpen}
        onOpenChange={setDeleteTabConfirmOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tab'ni o'chirish</AlertDialogTitle>
            <AlertDialogDescription>
              Bu tab'ni o'chirishni tasdiqlaysizmi? Barcha tab ichidagi
              ma'lumotlar va fayllar o'chiriladi. Bu amalni bekor qilib
              bo'lmaydi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteTab}
              className="bg-red-600 hover:bg-red-700"
            >
              O'chirish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete File Confirmation Dialog */}
      <AlertDialog
        open={deleteFileConfirmOpen}
        onOpenChange={setDeleteFileConfirmOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Faylni o'chirish</AlertDialogTitle>
            <AlertDialogDescription>
              Bu faylni o'chirishni tasdiqlaysizmi? Bu amalni bekor qilib
              bo'lmaydi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteFile}
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
