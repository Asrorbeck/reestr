import * as XLSX from "xlsx";
import type { Integration } from "./types";

export function exportToExcel(
  integrations: Integration[],
  filename: string = "integratsiyalar",
  visibleColumns: string[] = []
) {
  // Barcha ustunlar ro'yxatini tayyorlaymiz
  const allColumns = [
    { key: "nomi", label: "Nomi" },
    { key: "vazirlik", label: "Vazirlik" },
    { key: "tashkilotShakli", label: "Tashkilot shakli" },
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
    { key: "createdAt", label: "Yaratilgan sana" },
    { key: "updatedAt", label: "Yangilangan sana" },
  ];

  // Faqat tanlangan ustunlarni olamiz
  const columns =
    visibleColumns.length > 0
      ? allColumns.filter((col) => visibleColumns.includes(col.key))
      : allColumns;

  // Ma'lumotlarni Excel formatiga o'tkazamiz
  const excelData = integrations.map((integration, index) => {
    const row: any = {
      "T/r": index + 1,
    };

    columns.forEach((column) => {
      let value = integration[column.key as keyof Integration];

      // Ma'lumotlarni formatlaymiz
      if (column.key === "texnologikYoriknomaMavjudligi") {
        value = value ? "Mavjud" : "Yo'q";
      } else if (column.key === "createdAt" || column.key === "updatedAt") {
        value = value ? new Date(value).toLocaleDateString("uz-UZ") : "";
      } else if (column.key === "sorovlarOrtachaOylik") {
        value = typeof value === "number" ? value.toLocaleString() : value;
      }

      row[column.label] = value;
    });

    return row;
  });

  // Excel workbook yaratamiz
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(excelData);

  // Ustun kengliklarini dinamik ravishda sozlaymiz
  const columnWidthMap: Record<string, number> = {
    nomi: 30,
    vazirlik: 25,
    tashkilotShakli: 20,
    asosiyMaqsad: 40,
    normativHuquqiyHujjat: 35,
    texnologikYoriknomaMavjudligi: 15,
    texnologiya: 15,
    maqlumotAlmashishSharti: 30,
    sorovlarOrtachaOylik: 15,
    qaysiTashkilotTomondan: 25,
    mspdManzil: 30,
    axborotTizimiNomi: 25,
    status: 12,
    createdAt: 15,
    updatedAt: 15,
  };

  const columnWidths = [
    { wch: 5 }, // T/r
    ...columns.map((col) => ({ wch: columnWidthMap[col.key] || 20 })),
  ];

  worksheet["!cols"] = columnWidths;

  // Worksheet'ni workbook'ga qo'shamiz
  XLSX.utils.book_append_sheet(workbook, worksheet, "Integratsiyalar");

  // Excel faylini yuklab olish
  const fileName = `${filename}_${new Date().toISOString().split("T")[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
}

export function exportFilteredToExcel(
  integrations: Integration[],
  searchTerm: string = "",
  filename: string = "integratsiyalar",
  visibleColumns: string[] = []
) {
  const filteredFilename = searchTerm
    ? `${filename}_qidiruv_${searchTerm.replace(/[^a-zA-Z0-9]/g, "_")}`
    : filename;

  exportToExcel(integrations, filteredFilename, visibleColumns);
}
