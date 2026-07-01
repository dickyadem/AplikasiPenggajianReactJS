import { Button, Card } from "react-bootstrap";
import NavigationWidget from "../../widgets/commons/NavigationWidget";
import { useNavigate } from "react-router-dom";
import { Plus } from "@phosphor-icons/react";
import { useEffect, useState, useCallback } from "react";
import KaryawanService from "../../services/KaryawanService";
import Paginator from "../../widgets/commons/PaginatorWidget";
import ToastWidget from "../../widgets/commons/ToastWidget";
import useToast from "../../hooks/useToast";
import AdvancedTable from "../../widgets/commons/AdvancedTable";

const KaryawanPage = () => {
  const navigate = useNavigate();
  const { toast, hideToast, error, success } = useToast();
  const [daftarKaryawan, setDaftarKaryawan] = useState({});
  const [paginateKaryawan, setPaginateKaryawan] = useState([]);
  const [queryKaryawan, setQueryKaryawan] = useState({ page: 1, limit: 10 });
  const [loading, setLoading] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    // Kirim ke API hanya page & limit — filter dilakukan client-side
    const { Divisi, Status_Pernikahan, search, ...apiQuery } = queryKaryawan;
    setLoading(true);
    KaryawanService.list(apiQuery)
      .then((response) => {
        setDaftarKaryawan(response.data);
        if (response.headers.pagination) {
          setPaginateKaryawan(JSON.parse(response.headers.pagination))
        }
      })
      .catch((err) => {
        const errorMsg = err.response?.data?.message || "Gagal memuat data karyawan.";
        error(errorMsg);
        console.error("Error loading karyawan:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [queryKaryawan.page, queryKaryawan.limit]); // eslint-disable-line react-hooks/exhaustive-deps

  // Client-side filter + search
  const filteredData = (daftarKaryawan.results || []).filter((row) => {
    if (activeFilters.Divisi) {
      const rowDiv = row.Divisi?.toLowerCase() || "";
      const filterDiv = activeFilters.Divisi.toLowerCase();
      // cocokkan jika salah satu mengandung yang lain (handle "Hrd" vs "HR", "HRD" vs "HR", dll)
      if (!rowDiv.includes(filterDiv) && !filterDiv.includes(rowDiv)) return false;
    }
    if (activeFilters.Status_Pernikahan && row.Status_Pernikahan?.toLowerCase() !== activeFilters.Status_Pernikahan.toLowerCase()) return false;
    if (searchKeyword) {
      const kw = searchKeyword.toLowerCase();
      return (
        row.ID_Karyawan?.toLowerCase().includes(kw) ||
        row.Nama_Karyawan?.toLowerCase().includes(kw) ||
        row.email?.toLowerCase().includes(kw)
      );
    }
    return true;
  });

  const callbackPaginator = (page) => {
    setQueryKaryawan((values) => ({ ...values, page }));
  };

  // Table columns definition
  const karyawanColumns = [
    {
      header: 'ID Karyawan',
      accessor: 'ID_Karyawan',
      style: { minWidth: '120px' }
    },
    {
      header: 'Nama Karyawan',
      accessor: 'Nama_Karyawan',
      style: { minWidth: '200px' }
    },
    {
      header: 'Email',
      accessor: 'email',
      render: (row) => row.email || '-'
    },
    {
      header: 'Golongan',
      accessor: 'ID_Golongan',
      style: { minWidth: '100px' }
    },
    {
      header: 'Jabatan',
      accessor: 'ID_Jabatan',
      style: { minWidth: '100px' }
    },
    {
      header: 'Divisi',
      accessor: 'Divisi',
      style: { minWidth: '120px' }
    },
    {
      header: 'Status',
      accessor: 'Status_Pernikahan',
      render: (row) => (
        <span className="table-badge success">
          {row.Status_Pernikahan || '-'}
        </span>
      )
    }
  ];

  // Filter options
  const karyawanFilters = [
    {
      key: 'Divisi',
      label: 'Divisi',
      placeholder: 'Semua Divisi',
      options: [
        { value: 'IT', label: 'IT - Information Technology' },
        { value: 'HR', label: 'HR - Human Resources' },
        { value: 'FN', label: 'FN - Finance' },
        { value: 'MK', label: 'MK - Marketing' },
        { value: 'OP', label: 'OP - Operations' },
        { value: 'GD', label: 'GD - General Affairs' },
      ]
    },
    {
      key: 'Status_Pernikahan',
      label: 'Status Pernikahan',
      placeholder: 'Semua Status',
      options: [
        { value: 'Menikah', label: 'Menikah' },
        { value: 'Belum Menikah', label: 'Belum Menikah' },
        { value: 'Cerai', label: 'Cerai' },
      ]
    }
  ];

  // Handlers — client-side filter & search
  const handleSearch = useCallback((term) => {
    setSearchKeyword(term || "");
  }, []);

  const handleFilter = useCallback((filters) => {
    setActiveFilters({
      Divisi: filters.Divisi || "",
      Status_Pernikahan: filters.Status_Pernikahan || "",
    });
  }, []);

  const handleEdit = (row) => {
    navigate(`/karyawan/edit/${row.ID_Karyawan}`);
  };

  const handleDelete = (row) => {
    const confirmed = window.confirm(`Hapus karyawan ${row.Nama_Karyawan}?`);
    if (confirmed) {
      KaryawanService.delete(row.ID_Karyawan)
        .then(() => {
          success(`Berhasil menghapus ${row.Nama_Karyawan}`);
          setQueryKaryawan((v) => ({ ...v }));
        })
        .catch((err) => {
          error(err.response?.data?.message || "Gagal menghapus karyawan.");
        });
    }
  };

  const handleBulkDelete = (ids) => {
    console.log('Bulk delete:', ids);
    // Implement bulk delete logic here
    success(`Berhasil menghapus ${ids.length} data`);
  };

  const handleExport = () => {
    console.log('Export to Excel');
    // Implement export logic here
    success('Data sedang diexport...');
  };

  return (
    <>
      <NavigationWidget
        buttonCreate={
          <Button onClick={() => navigate("/karyawan/add")}>
            <Plus /> Tambah
          </Button>
        }
      >
        <Card className="mt-2">
          <Card.Header className="bg-secondary text-light d-flex justify-content-between align-items-center">
            <h5>Karyawan</h5>
            <Paginator paginate={paginateKaryawan} callbackPaginator={callbackPaginator} />
          </Card.Header>
          <AdvancedTable
            columns={karyawanColumns}
            data={filteredData}
            loading={loading}
            searchable={true}
            selectable={true}
            exportable={true}
            deletable={true}
            filters={karyawanFilters}
            onSearch={handleSearch}
            onFilter={handleFilter}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onBulkDelete={handleBulkDelete}
            onExport={handleExport}
            pagination={{
              currentPage: queryKaryawan.page,
              total: daftarKaryawan.total || 0,
              from: (queryKaryawan.page - 1) * queryKaryawan.limit + 1,
              to: queryKaryawan.page * queryKaryawan.limit,
              lastPage: Math.ceil((daftarKaryawan.total || 0) / queryKaryawan.limit)
            }}
            onPageChange={(page, limit) => {
              setQueryKaryawan((values) => ({ ...values, page, limit }));
            }}
          />
        </Card>
      </NavigationWidget>
      <ToastWidget
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />
    </>
  );
};

export default KaryawanPage;
