import { Button, Card, Spinner } from "react-bootstrap";
import NavigationWidget from "../../widgets/commons/NavigationWidget";
import { useNavigate } from "react-router-dom";
import { VscAdd } from "react-icons/vsc";
import { useEffect, useState } from "react";
import PendapatanService from "../../services/PendapatanService";
import Paginator from "../../widgets/commons/PaginatorWidget";
import ToastWidget from "../../widgets/commons/ToastWidget";
import useToast from "../../hooks/useToast";
import AdvancedTable from "../../widgets/commons/AdvancedTable";
import { helperReadableCurrency } from "../../utils/helpers";


const PendapatanPage = () => {
  const navigate = useNavigate();
  const { toast, hideToast, error, success } = useToast();
  const [daftarPendapatan, setDaftarPendapatan] = useState({});
  const [queryPendapatan, setQueryPendapatan] = useState({ page: 1, limit: 10 });
  const [paginatePendapatan, setPaginatePendapatan] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    PendapatanService.list(queryPendapatan)
      .then((response) => {
        const data = response.data;
        setDaftarPendapatan(data);
        if (response.headers.pagination) {
          setPaginatePendapatan(JSON.parse(response.headers.pagination));
        }
      })
      .catch((err) => {
        const errorMsg = err.response?.data?.message || "Gagal memuat data pendapatan.";
        error(errorMsg);
        console.error("Error loading pendapatan:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [queryPendapatan]);

  const callbackPaginator = (page) => {
    setQueryPendapatan((values) => ({ ...values, page }));
  };

  // Table columns
  const pendapatanColumns = [
    {
      header: 'ID Pendapatan',
      accessor: 'ID_Pendapatan',
      style: { minWidth: '120px' }
    },
    {
      header: 'Nama Pendapatan',
      accessor: 'Nama_Pendapatan',
      style: { minWidth: '250px' }
    },
    {
      header: 'Jenis',
      accessor: 'Jenis',
      style: { minWidth: '120px' }
    },
    {
      header: 'Nominal',
      accessor: 'Nominal',
      render: (row) => (
        <span className="text-success fw-bold">
          {helperReadableCurrency((row.Nominal || 0).toString())}
        </span>
      )
    }
  ];

  // Handlers
  const handleSearch = (term) => {
    console.log('Search:', term);
  };

  const handleEdit = (row) => {
    navigate(`/pendapatan/edit/${row.ID_Pendapatan}`);
  };

  const handleDelete = (row) => {
    const confirmed = window.confirm(`Hapus pendapatan ${row.Nama_Pendapatan}?`);
    if (confirmed) {
      success(`Berhasil menghapus ${row.Nama_Pendapatan}`);
    }
  };

  const handleExport = () => {
    success('Data sedang diexport...');
  };

  const formatRupiah = (value) => {
    if (!value) return "Rp 0";
    const numeric = value.toString().replace(/[^0-9]/g, "");
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(numeric);
  };

  const handleRowClick = (id) => {
    if (document.activeElement && document.activeElement.blur) {
      document.activeElement.blur();
    }
    navigate(`/pendapatan/edit/${id}`);
  };

  return (
    <>
      <NavigationWidget
        buttonCreate={
          <Button onClick={() => navigate("/pendapatan/add")}>
            <VscAdd />  Tambah
          </Button>
        }
      >
        <Card className="mt-2">
          <Card.Header className="bg-secondary text-light d-flex justify-content-between align-items-center">
            <h5>Pendapatan</h5>
            <Paginator paginate={paginatePendapatan} callbackPaginator={callbackPaginator} />
          </Card.Header>
          {loading ? (
            <div className="d-flex justify-content-center p-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <AdvancedTable
              columns={pendapatanColumns}
              data={daftarPendapatan.results || []}
              loading={loading}
              searchable={true}
              selectable={true}
              exportable={true}
              onSearch={handleSearch}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onExport={handleExport}
              pagination={{
                currentPage: queryPendapatan.page,
                total: daftarPendapatan.total || 0,
                from: (queryPendapatan.page - 1) * queryPendapatan.limit + 1,
                to: queryPendapatan.page * queryPendapatan.limit,
                lastPage: Math.ceil((daftarPendapatan.total || 0) / queryPendapatan.limit)
              }}
              onPageChange={(page, limit) => {
                setQueryPendapatan((values) => ({ ...values, page, limit }));
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

export default PendapatanPage;
