/**
 * Export utilities for CSV and PDF generation
 */

export function exportToCSV(data: Record<string, any>[], filename: string, headers?: Record<string, string>) {
  if (data.length === 0) return;

  const keys = Object.keys(headers || data[0]);
  const headerRow = headers
    ? keys.map((k) => headers[k] || k)
    : keys;

  // Add BOM for Arabic support in Excel
  const BOM = "\uFEFF";
  const csvRows = [
    headerRow.join(","),
    ...data.map((row) =>
      keys.map((k) => {
        const val = row[k];
        if (val === null || val === undefined) return "";
        const str = typeof val === "object" ? JSON.stringify(val) : String(val);
        // Escape quotes and wrap in quotes
        return `"${str.replace(/"/g, '""')}"`;
      }).join(",")
    ),
  ];

  const blob = new Blob([BOM + csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
  downloadBlob(blob, `${filename}.csv`);
}

export function exportToPDF(title: string, data: Record<string, any>[], headers?: Record<string, string>) {
  if (data.length === 0) return;

  const keys = Object.keys(headers || data[0]);
  const headerLabels = headers ? keys.map((k) => headers[k] || k) : keys;

  // Generate HTML-based PDF
  const html = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, sans-serif; padding: 40px; direction: rtl; background: #0a0a0a; color: #e5e5e5; }
    h1 { color: #d4a843; font-size: 24px; margin-bottom: 8px; }
    .meta { color: #888; font-size: 12px; margin-bottom: 24px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th { background: #1a1a1a; color: #d4a843; padding: 10px 12px; text-align: right; border-bottom: 2px solid #333; }
    td { padding: 8px 12px; border-bottom: 1px solid #222; }
    tr:nth-child(even) td { background: #111; }
    .footer { margin-top: 24px; text-align: center; color: #666; font-size: 10px; }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <div class="meta">تاريخ التصدير: ${new Date().toLocaleDateString("ar-SA")} | مشروكي</div>
  <table>
    <thead><tr>${headerLabels.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
    <tbody>
      ${data.map((row) => `<tr>${keys.map((k) => {
        const val = row[k];
        const str = val === null || val === undefined ? "" : typeof val === "object" ? JSON.stringify(val) : String(val);
        return `<td>${str}</td>`;
      }).join("")}</tr>`).join("")}
    </tbody>
  </table>
  <div class="footer">تم إنشاء هذا التقرير آلياً بواسطة نظام مشروكي</div>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html;charset=utf-8;" });
  // Open in new window for printing as PDF
  const url = URL.createObjectURL(blob);
  const win = window.open(url, "_blank");
  if (win) {
    win.addEventListener("load", () => {
      win.print();
    });
  }
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
