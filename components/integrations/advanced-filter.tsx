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
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  X,
  Filter,
  Search,
  MapPin,
  ChevronDown,
  ChevronUp,
  Settings,
  Check,
  ChevronDown as ChevronDownIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface AdvancedFilterProps {
  onFiltersChange: (filters: FilterState) => void;
  visibleColumns?: string[];
  onColumnsChange?: (columns: string[]) => void;
}

interface FilterState {
  // Asosiy qidiruv
  nomi: string;
  vazirlik: string;
  tashkilotShakli: string;
  normativHuquqiyHujjat: string;

  // Texnologiya va texnik xususiyatlar
  texnologikYoriknomaMavjudligi: string;
  texnologiya: string;

  // Qo'shimcha ma'lumotlar
  qaysiTashkilotTomondan: string;
  mspdManzil: string;
  axborotTizimiNomi: string;
  status: string;
}

const tashkilotShakliOptions = [
  { value: "all", label: "Barcha tashkilotlar" },
  { value: "Davlat tashkiloti", label: "Davlat tashkiloti" },
  { value: "Xususiy tashkilot", label: "Xususiy tashkilot" },
];

const texnologiyaOptions = [
  { value: "all", label: "Barcha texnologiyalar" },
  { value: "REST", label: "REST API" },
  { value: "SOAP", label: "SOAP" },
  { value: "MQ", label: "Message Queue" },
  { value: "File exchange", label: "Fayl almashinuvi" },
];

const texnologikYoriknomaOptions = [
  { value: "all", label: "Barcha" },
  { value: "true", label: "Mavjud" },
  { value: "false", label: "Yo'q" },
];

const statusOptions = [
  { value: "all", label: "Barcha statuslar" },
  { value: "Active", label: "Faol" },
  { value: "Test", label: "Test" },
  { value: "Archived", label: "Arxivlangan" },
];

const columnOptions = [
  { key: "nomi", label: "Nomi" },
  { key: "tashkilotShakli", label: "Tashkilot va shakli" },
  { key: "asosiyMaqsad", label: "Asosiy maqsad" },
  { key: "normativHuquqiyHujjat", label: "Normativ-huquqiy hujjat" },
  { key: "texnologikYoriknomaMavjudligi", label: "Texnologik yo'riqnoma" },
  { key: "texnologiya", label: "Texnologiya" },
  { key: "maqlumotAlmashishSharti", label: "Ma'lumot almashish sharti" },
  { key: "sorovlarOrtachaOylik", label: "Oylik sorovlar" },
  { key: "qaysiTashkilotTomondan", label: "Ma'lumot beruvchi" },
  { key: "mspdManzil", label: "MSPD manzili" },
  { key: "axborotTizimiNomi", label: "Axborot tizimi" },
  { key: "status", label: "Status" },
];

export function AdvancedFilter({
  onFiltersChange,
  visibleColumns = [],
  onColumnsChange,
}: AdvancedFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isColumnDropdownOpen, setIsColumnDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [filters, setFilters] = useState<FilterState>({
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

  const handleFilterChange = (key: keyof FilterState, value: any) => {
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
    const clearedFilters: FilterState = {
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
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.nomi) count++;
    if (filters.vazirlik) count++;
    if (filters.tashkilotShakli !== "all") count++;
    if (filters.normativHuquqiyHujjat) count++;
    if (filters.texnologikYoriknomaMavjudligi !== "all") count++;
    if (filters.texnologiya !== "all") count++;
    if (filters.qaysiTashkilotTomondan) count++;
    if (filters.mspdManzil) count++;
    if (filters.axborotTizimiNomi) count++;
    if (filters.status !== "all") count++;
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tashkilot shakli
                  </Label>
                  <Select
                    value={filters.tashkilotShakli}
                    onValueChange={(value) =>
                      handleFilterChange("tashkilotShakli", value)
                    }
                  >
                    <SelectTrigger className="w-full h-11 border-blue-200 focus:border-blue-500 focus:ring-blue-500/20">
                      <SelectValue placeholder="Tashkilot shaklini tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      {tashkilotShakliOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Texnologiya
                  </Label>
                  <Select
                    value={filters.texnologiya}
                    onValueChange={(value) =>
                      handleFilterChange("texnologiya", value)
                    }
                  >
                    <SelectTrigger className="w-full h-11 border-blue-200 focus:border-blue-500 focus:ring-blue-500/20">
                      <SelectValue placeholder="Texnologiyani tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      {texnologiyaOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Texnologik yo'riqnoma
                  </Label>
                  <Select
                    value={filters.texnologikYoriknomaMavjudligi}
                    onValueChange={(value) =>
                      handleFilterChange("texnologikYoriknomaMavjudligi", value)
                    }
                  >
                    <SelectTrigger className="w-full h-11 border-blue-200 focus:border-blue-500 focus:ring-blue-500/20">
                      <SelectValue placeholder="Yo'riqnoma holati" />
                    </SelectTrigger>
                    <SelectContent>
                      {texnologikYoriknomaOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Status
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Integratsiya nomi
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Integratsiya nomini kiriting..."
                      value={filters.nomi}
                      onChange={(e) =>
                        handleFilterChange("nomi", e.target.value)
                      }
                      className="pl-10 h-11 border-blue-200 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Vazirlik
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Vazirlikni qidirish..."
                      value={filters.vazirlik}
                      onChange={(e) =>
                        handleFilterChange("vazirlik", e.target.value)
                      }
                      className="pl-10 h-11 border-blue-200 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

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
              </div>

              {/* Qo'shimcha ma'lumotlar */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Ma'lumot beruvchi
                  </Label>
                  <Input
                    placeholder="Tashkilot nomini kiriting..."
                    value={filters.qaysiTashkilotTomondan}
                    onChange={(e) =>
                      handleFilterChange(
                        "qaysiTashkilotTomondan",
                        e.target.value
                      )
                    }
                    className="h-11 border-blue-200 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    MSPD manzili
                  </Label>
                  <Input
                    placeholder="MSPD manzilini kiriting..."
                    value={filters.mspdManzil}
                    onChange={(e) =>
                      handleFilterChange("mspdManzil", e.target.value)
                    }
                    className="h-11 border-blue-200 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Axborot tizimi
                  </Label>
                  <Input
                    placeholder="Tizim nomini kiriting..."
                    value={filters.axborotTizimiNomi}
                    onChange={(e) =>
                      handleFilterChange("axborotTizimiNomi", e.target.value)
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
