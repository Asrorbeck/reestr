"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  X,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  Settings,
  Check,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface AdvancedFilterProps {
  onFiltersChange: (filters: HeaderFilters) => void;
  visibleColumns?: string[];
  onColumnsChange?: (columns: string[]) => void;
}

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

const malumotFormatiOptions = [
  { value: "all", label: "Barcha formatlar" },
  { value: "JSON", label: "JSON" },
  { value: "XML", label: "XML" },
  { value: "CSV", label: "CSV" },
  { value: "SOAP", label: "SOAP" },
  { value: "REST API", label: "REST API" },
];

const statusOptions = [
  { value: "all", label: "Barcha statuslar" },
  { value: "faol", label: "Faol" },
  { value: "testda", label: "Testda" },
  { value: "rejalashtirilgan", label: "Rejalashtirilgan" },
  { value: "muammoli", label: "Muammoli" },
];

const columnOptions = [
  { key: "axborotTizimiNomi", label: "Axborot tizimi yoki resursning to'liq nomi" },
  { key: "integratsiyaUsuli", label: "Integratsiyani amalga oshirish usuli" },
  { key: "malumotNomi", label: "Uzatiladigan/qabul qilinadigan ma'lumot nomi" },
  { key: "tashkilotNomiVaShakli", label: "Integratsiya qilingan tashkilot nomi va shakli" },
  { key: "asosiyMaqsad", label: "Integratsiyadan asosiy maqsad" },
  { key: "normativHuquqiyHujjat", label: "Normativ-huquqiy hujjat" },
  { key: "texnologikYoriknomaMavjudligi", label: "Texnologik yo'riqnoma mavjudligi" },
  { key: "malumotFormati", label: "Ma'lumot formati" },
  { key: "maqlumotAlmashishSharti", label: "Ma'lumot almashish sharti" },
  { key: "yangilanishDavriyligi", label: "Ma'lumot yangilanish davriyligi" },
  { key: "malumotHajmi", label: "Ma'lumot hajmi" },
  { key: "aloqaKanali", label: "Hamkor tashkilot bilan aloqa kanali" },
  { key: "oxirgiUzatishVaqti", label: "So'nggi muvaffaqiyatli uzatish vaqti" },
  { key: "markaziyBankAloqa", label: "Markaziy bank tomonidan texnik aloqa shaxsi" },
  { key: "hamkorAloqa", label: "Hamkor tashkilot tomonidan texnik aloqa shaxsi" },
  { key: "status", label: "Integratsiya holati / statusi" },
  { key: "izoh", label: "Izoh / qo'shimcha ma'lumot" },
];

export function AdvancedFilter({
  onFiltersChange,
  visibleColumns = [],
  onColumnsChange,
}: AdvancedFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isColumnDropdownOpen, setIsColumnDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [filters, setFilters] = useState<HeaderFilters>({
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsColumnDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFilterChange = (key: keyof HeaderFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleColumnToggle = (columnKey: string) => {
    if (!onColumnsChange) return;

    if (visibleColumns.includes(columnKey)) {
      onColumnsChange(visibleColumns.filter((col) => col !== columnKey));
    } else {
      onColumnsChange([...visibleColumns, columnKey]);
    }
  };

  const handleSelectAllColumns = () => {
    if (!onColumnsChange) return;
    onColumnsChange(columnOptions.map((option) => option.key));
  };

  const handleSelectNoneColumns = () => {
    if (!onColumnsChange) return;
    onColumnsChange([]);
  };

  const clearAllFilters = () => {
    const clearedFilters: HeaderFilters = {
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
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.axborotTizimiNomi) count++;
    if (filters.integratsiyaUsuli) count++;
    if (filters.malumotNomi) count++;
    if (filters.tashkilotNomiVaShakli) count++;
    if (filters.asosiyMaqsad) count++;
    if (filters.normativHuquqiyHujjat) count++;
    if (filters.texnologikYoriknomaMavjudligi) count++;
    if (filters.malumotFormati !== "all") count++;
    if (filters.maqlumotAlmashishSharti) count++;
    if (filters.yangilanishDavriyligi) count++;
    if (filters.malumotHajmi) count++;
    if (filters.aloqaKanali) count++;
    if (filters.oxirgiUzatishVaqti) count++;
    if (filters.markaziyBankAloqa) count++;
    if (filters.hamkorAloqa) count++;
    if (filters.status !== "all") count++;
    if (filters.izoh) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Card className="w-full p-0 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
      <CardContent className="p-0">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          {/* Header - Always visible */}
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between p-6 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Filter className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Kengaytirilgan qidiruv
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Integratsiyalarni batafsil qidirish va filtrlash
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {activeFiltersCount > 0 && (
                  <Badge className="bg-blue-600 text-white px-3 py-1">
                    {activeFiltersCount} filter
                  </Badge>
                )}
                {activeFiltersCount > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearAllFilters();
                    }}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/50"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Tozalash
                  </Button>
                )}
                <div className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-all duration-200">
                  {isOpen ? (
                    <ChevronUp className="h-5 w-5 text-blue-600 dark:text-blue-400 transition-transform duration-200" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-blue-600 dark:text-blue-400 transition-transform duration-200" />
                  )}
                </div>
              </div>
            </div>
          </CollapsibleTrigger>

          {/* Filter Content - Collapsible */}
          <CollapsibleContent className="px-6 pb-6 overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
            <div className="space-y-6 mt-4">
              {/* Select fields - First row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Ma'lumot formati
                  </Label>
                  <Select
                    value={filters.malumotFormati}
                    onValueChange={(value) =>
                      handleFilterChange("malumotFormati", value)
                    }
                  >
                    <SelectTrigger className="w-full h-11 border-blue-200 focus:border-blue-500 focus:ring-blue-500/20">
                      <SelectValue placeholder="Ma'lumot formatini tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      {malumotFormatiOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Integratsiya holati / statusi
                  </Label>
                  <Select
                    value={filters.status}
                    onValueChange={(value) =>
                      handleFilterChange("status", value)
                    }
                  >
                    <SelectTrigger className="w-full h-11 border-blue-200 focus:border-blue-500 focus:ring-blue-500/20">
                      <SelectValue placeholder="Statusni tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Asosiy qidiruv paneli */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Axborot tizimi yoki resursning to'liq nomi
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Axborot tizimi nomini kiriting..."
                      value={filters.axborotTizimiNomi}
                      onChange={(e) =>
                        handleFilterChange("axborotTizimiNomi", e.target.value)
                      }
                      className="pl-10 h-11 border-blue-200 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Integratsiyani amalga oshirish usuli
                  </Label>
                  <Input
                    placeholder="Integratsiya usulini kiriting..."
                    value={filters.integratsiyaUsuli}
                    onChange={(e) =>
                      handleFilterChange("integratsiyaUsuli", e.target.value)
                    }
                    className="h-11 border-blue-200 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              {/* Qo'shimcha ma'lumotlar */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Uzatiladigan/qabul qilinadigan ma'lumot nomi
                  </Label>
                  <Input
                    placeholder="Ma'lumot nomini kiriting..."
                    value={filters.malumotNomi}
                    onChange={(e) =>
                      handleFilterChange("malumotNomi", e.target.value)
                    }
                    className="h-11 border-blue-200 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Integratsiya qilingan tashkilot nomi va shakli
                  </Label>
                  <Input
                    placeholder="Tashkilot nomi va shaklini kiriting..."
                    value={filters.tashkilotNomiVaShakli}
                    onChange={(e) =>
                      handleFilterChange("tashkilotNomiVaShakli", e.target.value)
                    }
                    className="h-11 border-blue-200 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              {/* Qo'shimcha filterlar */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Normativ-huquqiy hujjat
                  </Label>
                  <Input
                    placeholder="Hujjat nomini kiriting..."
                    value={filters.normativHuquqiyHujjat}
                    onChange={(e) =>
                      handleFilterChange(
                        "normativHuquqiyHujjat",
                        e.target.value
                      )
                    }
                    className="h-11 border-blue-200 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Texnologik yo'riqnoma mavjudligi
                  </Label>
                  <Input
                    placeholder="Texnologik yo'riqnoma holati..."
                    value={filters.texnologikYoriknomaMavjudligi}
                    onChange={(e) =>
                      handleFilterChange(
                        "texnologikYoriknomaMavjudligi",
                        e.target.value
                      )
                    }
                    className="h-11 border-blue-200 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              {/* Ustunlarni tanlash */}
              {onColumnsChange && (
                <div className="space-y-4 border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Ustunlarni tanlash
                      </h4>
                      <Badge
                        variant="secondary"
                        className="px-2 py-0.5 text-xs"
                      >
                        {visibleColumns.length}/{columnOptions.length}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSelectAllColumns}
                        className="h-7 px-2 text-xs"
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Barchasi
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSelectNoneColumns}
                        className="h-7 px-2 text-xs"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Tozalash
                      </Button>
                    </div>
                  </div>

                  {/* Kompakt ustunlar ro'yxati */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    {columnOptions.map((option) => {
                      const isSelected = visibleColumns.includes(option.key);
                      return (
                        <div
                          key={option.key}
                          className={`group relative p-2 rounded-lg border cursor-pointer transition-all duration-200 ${
                            isSelected
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                              : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                          }`}
                          onClick={() => handleColumnToggle(option.key)}
                        >
                          <div className="flex items-center space-x-2">
                            <div
                              className={`w-4 h-4 rounded border flex items-center justify-center transition-all duration-200 ${
                                isSelected
                                  ? "border-blue-500 bg-blue-500"
                                  : "border-gray-300 dark:border-gray-600 group-hover:border-blue-400"
                              }`}
                            >
                              {isSelected && (
                                <Check className="h-2.5 w-2.5 text-white" />
                              )}
                            </div>
                            <span
                              className={`text-xs font-medium transition-colors duration-200 truncate ${
                                isSelected
                                  ? "text-blue-900 dark:text-blue-100"
                                  : "text-gray-900 dark:text-gray-100 group-hover:text-blue-700 dark:group-hover:text-blue-300"
                              }`}
                            >
                              {option.label}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Tanlangan ustunlar */}
                  {visibleColumns.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {visibleColumns.map((columnKey) => {
                        const option = columnOptions.find(
                          (opt) => opt.key === columnKey
                        );
                        return (
                          <div
                            key={columnKey}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-md"
                          >
                            <span>{option?.label}</span>
                            <button
                              onClick={() => handleColumnToggle(columnKey)}
                              className="hover:bg-blue-200 dark:hover:bg-blue-800/50 rounded-full p-0.5"
                            >
                              <X className="h-2.5 w-2.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
