import { Card, Button, Spinner, Badge } from "react-bootstrap";
import NavigationWidget from "../../widgets/commons/NavigationWidget";
import GajiService from "../../services/GajiService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../widgets/commons/ToastProvider";
import AdvancedTable from "../../widgets/commons/AdvancedTable";
import { FaTrash, FaFileDownload, FaPlus, FaEye } from "react-icons/fa";
import { helperReadableCurrency } from "../../utils/helpers";
import { exportToExcel } from "../../utils/exportToExcel";

const PenggajianListPage = () => {
  const navigate = useNavigate();
  const { success, error } = useToast();
  const [daftarGaji, setDaftarGaji] = useState({});
  const [queryGaji, setQueryGaji] = useState({ page: 1, limit: 10 });
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    setLoading(true);
    GajiService.list(queryGaji)
      .then((response) => {
        setDaftarGaji(response.data);
      })
      .catch((err) => {
        error("Gagal memuat data penggajian.");
        console.error("Error loading gaji:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [queryGaji, refreshTrigger, error]);

  // Table columns configuration
  const gajiColumns = [
    {
      header: 'ID Gaji',
      accessor: 'ID_Gaji',
      style: { minWidth: '130px' },
      render: (row) => (
        <span className="fw-bold text-primary">{row.ID_Gaji}</span>
      )
    },
    {
      header: 'Tanggal',
      accessor: 'Tanggal',
      style: { minWidth: '120px' },
      render: (row) => {
        const date = new Date(row.Tanggal);
        return date.toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });
      }
    },
    {
      header: 'Karyawan',
      accessor: 'ID_Karyawan',
      style: { minWidth: '150px' }
    },
    {
      header: 'Total Pendapatan',
      accessor: 'Total_Pendapatan',
      style: { minWidth: '140px' },
      render: (row) => (
        <span className="text-success fw-bold">
          {helperReadableCurrency(row.Total_Pendapatan)}
        </span>
      )
    },
    {
      header: 'Total Potongan',
      accessor: 'Total_Potongan',
      style: { minWidth: '140px' },
      render: (row) => (
        <span className="text-danger fw-bold">
          {helperReadableCurrency(row.Total_Potongan)}
        </span>
      )
    },
    {
      header: 'Gaji Bersih',
      accessor: 'Gaji_Bersih',
      style: { minWidth: '140px' },
      render: (row) => (
        <Badge bg="success" className="px-3 py-2">
          {helperReadableCurrency(row.Gaji_Bersih)}
        </Badge>
      )
    },
    {
      header: 'Status',
      accessor: 'Gaji_Bersih',
      style: { minWidth: '100px' },
      render: (row) => (
        row.Gaji_Bersih > 0 ? (
          <Badge bg="success">Lunas</Badge>
        ) : (
          <Badge bg="warning">Pending</Badge>
        )
      )
    }
  ];

  // Handlers
  const handleSearch = (term) => {
    console.log('Search:', term);
  };

  const handleFilter = (filters) => {
    console.log('Filters:', filters);
  };

  const handleView = (row) => {
    // Open slip gaji or detail view
    success(`Melihat detail ${row.ID_Gaji}`);
  };

  const handleDelete = (row) => {
    const confirmDelete = window.confirm(
      `Apakah Anda yakin ingin menghapus data penggajian ${row.ID_Gaji}?\n\nData yang terhapus tidak dapat dikembalikan!`
    );

    if (!confirmDelete) return;

    setLoading(true);
    GajiService.delete(row.ID_Gaji)
      .then(() => {
        success(`Data penggajian ${row.ID_Gaji} berhasil dihapus.`);
        setRefreshTrigger(prev => prev + 1);
      })
      .catch((err) => {
        error(err.response?.data?.message || "Gagal menghapus data penggajian.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleExport = async (data, columns) => {
    try {
      await exportToExcel(data, 'Data-Penggajian', gajiColumns);
      success('Data penggajian berhasil diexport ke Excel!');
    } catch (error) {
      error('Gagal export data penggajian.');
      console.error('Export error:', error);
    }
  };

  const handleBulkDelete = (ids) => {
    const confirmed = window.confirm(`Hapus ${ids.length} data penggajian yang dipilih?`);
    if (confirmed) {
      success(`${ids.length} data berhasil dihapus.`);
      setRefreshTrigger(prev => prev + 1);
    }
  };

  return (
    <NavigationWidget
      buttonCreate={
        <Button
          variant="success"
          onClick={() => navigate('/penggajian/input')}
        >
          <FaPlus /> Input Penggajian
        </Button>
      }
    >
      <Card className="mt-2">
        <Card.Header className="bg-secondary text-light d-flex justify-content-between align-items-center">
          <h5 className="mb-0">💰 List Penggajian</h5>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="d-flex justify-content-center p-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <AdvancedTable
              columns={gajiColumns}
              data={daftarGaji.results || []}
              loading={loading}
              searchable={true}
              selectable={true}
              exportable={true}
              filters={[
                {
                  key: 'status',
                  label: 'Status',
                  placeholder: 'Semua Status',
                  options: [
                    { value: 'paid', label: 'Lunas' },
                    { value: 'pending', label: 'Pending' }
                  ]
                }
              ]}
              onSearch={handleSearch}
              onFilter={handleFilter}
              onView={handleView}
              onDelete={handleDelete}
              onBulkDelete={handleBulkDelete}
              onExport={handleExport}
              pagination={{
                currentPage: queryGaji.page,
                total: daftarGaji.total || 0,
                from: (queryGaji.page - 1) * queryGaji.limit + 1,
                to: queryGaji.page * queryGaji.limit,
                lastPage: Math.ceil((daftarGaji.total || 0) / queryGaji.limit)
              }}
              onPageChange={(page, limit) => {
                setQueryGaji((values) => ({ ...values, page, limit }));
              }}
            />
          )}
        </Card.Body>
      </Card>
    </NavigationWidget>
  );
};

export default PenggajianListPage;
