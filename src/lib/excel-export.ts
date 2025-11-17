import * as XLSX from "xlsx";
import type { Integration } from "./types";

// Table'dagi columnConfig bilan bir xil
const columnConfig = {
  axborotTizimiNomi: {
    label: "Axborot tizimi yoki resursning to'liq nomi (yoki interfeys)",
  },
  integratsiyaUsuli: {
    label: "Integratsiyani amalga oshirish usuli",
  },
  malumotNomi: {
    label: "Uzatiladigan/qabul qilinadigan ma'lumot nomi",
  },
  tashkilotNomiVaShakli: {
    label: "Integratsiya qilingan tashkilot nomi va shakli",
  },
  asosiyMaqsad: {
    label: "Integratsiyadan asosiy maqsad",
  },
  normativHuquqiyHujjat: {
    label: "Normativ-huquqiy hujjat",
  },
  texnologikYoriknomaMavjudligi: {
    label: "Texnologik yo'riqnoma mavjudligi",
  },
  malumotFormati: {
    label: "Ma'lumot formati",
  },
  maqlumotAlmashishSharti: {
    label: "Ma'lumot almashish sharti",
  },
  yangilanishDavriyligi: {
    label: "Ma'lumot yangilanish davriyligi",
  },
  malumotHajmi: {
    label: "Ma'lumot hajmi",
  },
  aloqaKanali: {
    label: "Hamkor tashkilot bilan aloqa kanali",
  },
  oxirgiUzatishVaqti: {
    label: "So'nggi muvaffaqiyatli uzatish vaqti",
  },
  markaziyBankAloqa: {
    label: "Markaziy bank tomonidan texnik aloqa shaxsi",
  },
  hamkorAloqa: {
    label: "Hamkor tashkilot tomonidan texnik aloqa shaxsi",
  },
  status: {
    label: "Integratsiya holati / statusi",
  },
  izoh: {
    label: "Izoh / qo'shimcha ma'lumot",
  },
};

export function exportToExcel(
  integrations: Integration[],
  filename: string = "integratsiyalar",
  visibleColumns: string[] = []
) {
  // Barcha ustunlar ro'yxatini tayyorlaymiz (table'dagi columnConfig'dan)
  const allColumns = Object.keys(columnConfig).map((key) => ({
    key,
    label: columnConfig[key as keyof typeof columnConfig].label,
  }));

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
      } else if (value === null || value === undefined) {
        value = "";
      } else if (typeof value === "string" && value.trim() === "") {
        value = "";
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
    axborotTizimiNomi: 35,
    integratsiyaUsuli: 30,
    malumotNomi: 30,
    tashkilotNomiVaShakli: 30,
    asosiyMaqsad: 40,
    normativHuquqiyHujjat: 35,
    texnologikYoriknomaMavjudligi: 25,
    malumotFormati: 20,
    maqlumotAlmashishSharti: 30,
    yangilanishDavriyligi: 25,
    malumotHajmi: 20,
    aloqaKanali: 25,
    oxirgiUzatishVaqti: 25,
    markaziyBankAloqa: 30,
    hamkorAloqa: 30,
    status: 20,
    izoh: 30,
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
