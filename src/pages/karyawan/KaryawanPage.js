import { Button, Card, Spinner } from "react-bootstrap";
import NavigationWidget from "../../widgets/commons/NavigationWidget";
import { useNavigate } from "react-router-dom";
import { VscAdd } from "react-icons/vsc";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    setLoading(true);
    KaryawanService.list(queryKaryawan)
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
  }, [queryKaryawan]);

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
      key: 'divisi',
      label: 'Divisi',
      placeholder: 'Semua Divisi',
      options: [
        { value: 'IT', label: 'IT' },
        { value: 'HR', label: 'HR' },
        { value: 'Finance', label: 'Finance' },
        { value: 'Operational', label: 'Operational' }
      ]
    },
    {
      key: 'status',
      label: 'Status Pernikahan',
      placeholder: 'Semua Status',
      options: [
        { value: 'KAWIN', label: 'Kawin' },
        { value: 'TIDAK_KAWIN', label: 'Tidak Kawin' }
      ]
    }
  ];

  // Handlers
  const handleSearch = (term) => {
    console.log('Search:', term);
    // Implement search logic here
  };

  const handleFilter = (filters) => {
    console.log('Filters:', filters);
    // Implement filter logic here
  };

  const handleEdit = (row) => {
    navigate(`/karyawan/edit/${row.ID_Karyawan}`);
  };

  const handleDelete = (row) => {
    const confirmed = window.confirm(`Hapus karyawan ${row.Nama_Karyawan}?`);
    if (confirmed) {
      // Implement delete logic here
      success(`Berhasil menghapus ${row.Nama_Karyawan}`);
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
            <VscAdd /> Tambah
          </Button>
        }
      >
        <Card className="mt-2">
          <Card.Header className="bg-secondary text-light d-flex justify-content-between align-items-center">
            <h5>Karyawan</h5>
            <Paginator paginate={paginateKaryawan} callbackPaginator={callbackPaginator} />
          </Card.Header>
          {loading ? (
            <div className="d-flex justify-content-center p-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <AdvancedTable
              columns={karyawanColumns}
              data={daftarKaryawan.results || []}
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
          )}
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
