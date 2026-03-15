/**
 * Export to Excel Utility
 * Menggunakan library xlsx untuk export data ke Excel
 */

export const exportToExcel = async (data, filename, columns = []) => {
    try {
        // Import xlsx library dynamically
        const XLSX = await import('xlsx');
        
        // Prepare data for export
        const exportData = data.map((row, index) => {
            const rowData = {};
            
            if (columns.length > 0) {
                // Use provided columns
                columns.forEach((col) => {
                    let value = row[col.accessor];
                    
                    // Handle custom render functions
                    if (col.render && typeof col.render === 'function') {
                        // For export, get raw value instead of rendered component
                        value = row[col.accessor];
                    }
                    
                    rowData[col.header] = value;
                });
            } else {
                // Use all row properties
                Object.keys(row).forEach((key) => {
                    rowData[key] = row[key];
                });
            }
            
            return rowData;
        });
        
        // Create worksheet
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        
        // Set column widths
        if (columns.length > 0) {
            const colWidths = columns.map((col) => ({
                wch: Math.max(
                    col.header.length,
                    ...exportData.map((row) => String(row[col.header] || '').length)
                ) + 2
            }));
            worksheet['!cols'] = colWidths;
        }
        
        // Create workbook
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
        
        // Add metadata
        workbook.Props = {
            Title: filename,
            Author: 'Sistem Penggajian',
            CreatedDate: new Date()
        };
        
        // Generate Excel file and trigger download
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}-${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        return true;
    } catch (error) {
        console.error('Error exporting to Excel:', error);
        throw new Error('Gagal export ke Excel. Pastikan library xlsx sudah terinstall.');
    }
};

/**
 * Export Table Data to Excel
 * Shortcut function untuk export dari AdvancedTable
 */
export const exportTableData = async (data, filename, columns) => {
    return exportToExcel(data, filename, columns);
};

/**
 * Export Multiple Sheets to Excel
 * Untuk export dengan multiple worksheets
 */
export const exportToExcelMultiSheet = async (sheets, filename) => {
    try {
        const XLSX = await import('xlsx');
        
        const workbook = XLSX.utils.book_new();
        
        sheets.forEach((sheet) => {
            const worksheet = XLSX.utils.json_to_sheet(sheet.data);
            XLSX.utils.book_append_sheet(workbook, worksheet, sheet.name);
        });
        
        workbook.Props = {
            Title: filename,
            Author: 'Sistem Penggajian',
            CreatedDate: new Date()
        };
        
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}-${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(link);
        link.click();
        
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        return true;
    } catch (error) {
        console.error('Error exporting to Excel:', error);
        throw new Error('Gagal export ke Excel.');
    }
};

export default {
    exportToExcel,
    exportTableData,
    exportToExcelMultiSheet
};
