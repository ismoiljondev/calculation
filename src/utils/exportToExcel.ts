import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { MRT_ColumnDef } from "material-react-table";

// --- helper ---
export function exportToExcel(
  data: any[],
  columns: MRT_ColumnDef<any>[],
  fileName: string
) {
  // only include table columns that have accessorKey
  const headers = columns.map((col) => col.header as string);
  const keys = columns.map((col) => col.accessorKey as string);

  // map rows according to keys
  const rows = data.map((row) => {
    const obj: Record<string, any> = {};
    keys.forEach((key, i) => {
      obj[headers[i]] = row[key] ?? "";
    });
    return obj;
  });

  // 1. Create worksheet from JSON
  const worksheet = XLSX.utils.json_to_sheet(rows);

  // 2. Create workbook and append worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // 3. Generate buffer
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

  // 4. Save as file
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, `${fileName}.xlsx`);
}
