/**
 * Export utilities for downloading Excel-compatible CSV files with UTF-8 BOM encoding.
 */

export function exportToCSV(filename: string, headers: string[], rows: (string | number)[][]) {
  const processRow = (row: (string | number)[]) => {
    return row
      .map((val) => {
        let str = String(val ?? '');
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          str = `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      })
      .join(',');
  };

  const csvContent = [headers.join(','), ...rows.map(processRow)].join('\r\n');
  // UTF-8 BOM ensures Excel displays Persian characters properly
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
