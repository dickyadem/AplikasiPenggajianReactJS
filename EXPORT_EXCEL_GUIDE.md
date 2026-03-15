# 📊 Fitur Export to Excel

## 📋 Overview

Fitur export to Excel memungkinkan user untuk export data dari table ke format Excel (.xlsx) dengan satu klik.

## 🚀 Cara Menggunakan

### **1. Install Dependencies**

```bash
npm install xlsx
```

### **2. Import Utility**

```javascript
import { exportToExcel } from "../../utils/exportToExcel";
```

### **3. Implementasi di Component**

```javascript
const handleExport = async (data, columns) => {
  try {
    await exportToExcel(data, 'Nama-File', columns);
    success('Data berhasil diexport!');
  } catch (error) {
    error('Gagal export data.');
  }
};
```

### **4. Pass ke AdvancedTable**

```javascript
<AdvancedTable
  columns={columns}
  data={data}
  exportable={true}
  onExport={handleExport}
/>
```

---

## 📁 Struktur File

```
src/
├── utils/
│   ├── exportToExcel.js      # Utility function export
│   └── ...
├── widgets/
│   └── commons/
│       ├── AdvancedTable.js  # Table component dengan export
│       └── ...
└── pages/
    ├── profil/
    │   └── ProfilPage.js     # Contoh implementasi
    ├── penggajian/
    │   └── PenggajianListPage.js
    └── ...
```

---

## 🔧 API Reference

### **exportToExcel(data, filename, columns)**

Export data ke Excel dengan single worksheet.

**Parameters:**
- `data` (Array): Array of objects containing data to export
- `filename` (String): Nama file output (tanpa ekstensi)
- `columns` (Array): Column configuration dari AdvancedTable

**Returns:**
- `Promise<boolean>`: True jika berhasil, throw error jika gagal

**Example:**
```javascript
await exportToExcel(
  karyawanData,
  'Data-Karyawan',
  karyawanColumns
);
```

---

### **exportTableData(data, filename, columns)**

Shortcut function untuk export dari AdvancedTable.

**Parameters:**
- Same as `exportToExcel`

**Returns:**
- Same as `exportToExcel`

---

### **exportToExcelMultiSheet(sheets, filename)**

Export data ke Excel dengan multiple worksheets.

**Parameters:**
- `sheets` (Array): Array of sheet objects
  - `name` (String): Sheet name
  - `data` (Array): Sheet data
- `filename` (String): Nama file output

**Example:**
```javascript
await exportToExcelMultiSheet(
  [
    { name: 'Karyawan', data: karyawanData },
    { name: 'Gaji', data: gajiData }
  ],
  'Laporan-Lengkap'
);
```

---

## 📄 Contoh Implementasi Lengkap

### **ProfilPage.js**

```javascript
import { exportToExcel } from "../../utils/exportToExcel";

const ProfilPage = () => {
  const profilColumns = [
    { header: 'Kode', accessor: 'ID_Profil' },
    { header: 'Nama', accessor: 'Nama' },
    { header: 'Alamat', accessor: 'Alamat' },
    { header: 'Telepon', accessor: 'Telepon' },
    { header: 'Email', accessor: 'Email' }
  ];

  const handleExport = async (data, columns) => {
    try {
      await exportToExcel(data, 'Data-Perusahaan', profilColumns);
      success('Data berhasil diexport!');
    } catch (error) {
      error('Gagal export.');
    }
  };

  return (
    <AdvancedTable
      columns={profilColumns}
      data={daftarProfil.results}
      exportable={true}
      onExport={handleExport}
    />
  );
};
```

---

### **PenggajianListPage.js**

```javascript
import { exportToExcel } from "../../utils/exportToExcel";
import { helperReadableCurrency } from "../../utils/helpers";

const PenggajianListPage = () => {
  const gajiColumns = [
    { 
      header: 'ID Gaji', 
      accessor: 'ID_Gaji',
      render: (row) => <span className="fw-bold">{row.ID_Gaji}</span>
    },
    { 
      header: 'Tanggal', 
      accessor: 'Tanggal',
      render: (row) => new Date(row.Tanggal).toLocaleDateString('id-ID')
    },
    { 
      header: 'Total Pendapatan', 
      accessor: 'Total_Pendapatan',
      render: (row) => helperReadableCurrency(row.Total_Pendapatan)
    },
    { 
      header: 'Gaji Bersih', 
      accessor: 'Gaji_Bersih',
      render: (row) => helperReadableCurrency(row.Gaji_Bersih)
    }
  ];

  const handleExport = async (data, columns) => {
    try {
      await exportToExcel(data, 'Data-Penggajian', gajiColumns);
      success('Data penggajian berhasil diexport!');
    } catch (error) {
      error('Gagal export.');
    }
  };

  return (
    <AdvancedTable
      columns={gajiColumns}
      data={daftarGaji.results}
      exportable={true}
      onExport={handleExport}
    />
  );
};
```

---

## 🎨 Fitur Export

| Fitur | Status | Deskripsi |
|-------|--------|-----------|
| **Single Sheet** | ✅ | Export ke satu worksheet |
| **Multi Sheet** | ✅ | Export ke multiple worksheets |
| **Auto Column Width** | ✅ | Column width otomatis sesuai konten |
| **Custom Filename** | ✅ | Filename dengan timestamp |
| **Metadata** | ✅ | Title, Author, CreatedDate |
| **Error Handling** | ✅ | Try-catch error handling |
| **Toast Notification** | ✅ | Success/error feedback |

---

## 📊 Format Output

### **File Name:**
```
{filename}-{YYYY-MM-DD}.xlsx
```

**Example:**
- `Data-Perusahaan-2026-02-22.xlsx`
- `Data-Penggajian-2026-02-22.xlsx`

### **Worksheet:**
- **Name:** "Data"
- **Columns:** Sesuai column configuration
- **Rows:** Semua data yang di-export

### **Metadata:**
- **Title:** Filename
- **Author:** "Sistem Penggajian"
- **CreatedDate:** Current date/time

---

## 🔍 Troubleshooting

### **Error: "xlsx library not found"**

**Solution:**
```bash
npm install xlsx
```

### **Error: "Gagal export ke Excel"**

**Check:**
1. Library xlsx sudah terinstall
2. Data tidak kosong
3. Columns configuration benar
4. Browser support blob download

### **Export Button Disabled**

**Check:**
1. `exportable={true}` di AdvancedTable
2. `onExport` handler sudah di-pass
3. Data tidak kosong (`data.length > 0`)

---

## 📝 Notes

1. **Dynamic Import:** Library xlsx di-import secara dynamic untuk mengurangi bundle size
2. **Blob Download:** File di-download menggunakan blob URL
3. **Cleanup:** URL blob di-revoke setelah download untuk memory management
4. **Browser Support:** Chrome, Firefox, Edge, Safari (latest versions)

---

## 🚀 Future Enhancements

- [ ] Export selected rows only
- [ ] Custom column picker
- [ ] Export to CSV format
- [ ] Export to PDF format
- [ ] Include filters in export
- [ ] Custom date range export
- [ ] Background export for large datasets

---

## 📞 Support

Jika ada masalah atau pertanyaan, silakan hubungi tim development.

---

**Version:** 1.0.0  
**Last Updated:** February 22, 2026  
**Author:** Sistem Penggajian Team
