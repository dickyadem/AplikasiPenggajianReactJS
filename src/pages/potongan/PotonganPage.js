import { Button, Card, Spinner } from "react-bootstrap";
import NavigationWidget from "../../widgets/commons/NavigationWidget";
import { useNavigate } from "react-router-dom";
import { Plus } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import PotonganService from "../../services/PotonganService";
import Paginator from "../../widgets/commons/PaginatorWidget";
import ToastWidget from "../../widgets/commons/ToastWidget";
import useToast from "../../hooks/useToast";
import AdvancedTable from "../../widgets/commons/AdvancedTable";
import { helperReadableCurrency } from "../../utils/helpers";

const PotonganPage = () => {
  const navigate = useNavigate();
  const { toast, hideToast, error, success } = useToast();
  const [daftarPotongan, setDaftarPotongan] = useState({});
  const [paginatePotongan, setPaginatePotongan] = useState([]);
  const [queryPotongan, setQueryPotongan] = useState({ page: 1, limit: 10 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    PotonganService.list(queryPotongan)
      .then((response) => {
        const data = response.data;
        setDaftarPotongan(data);
        if (response.headers.pagination) {
          setPaginatePotongan(JSON.parse(response.headers.pagination));
        }
      })
      .catch((err) => {
        const errorMsg = err.response?.data?.message || "Gagal memuat data potongan.";
        error(errorMsg);
        console.error("Error loading potongan:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [queryPotongan]);

  const callbackPaginator = (page) => {
    setQueryPotongan((values) => ({ ...values, page }));
  };

  // Table columns
  const potonganColumns = [
    {
      header: 'ID Potongan',
      accessor: 'ID_Potongan',
      style: { minWidth: '100px' }
    },
    {
      header: 'Nama Potongan',
      accessor: 'Nama_Potongan',
      style: { minWidth: '200px' }
    },
    {
      header: 'Jabatan',
      accessor: 'ID_Jabatan',
      render: (row) => row.ID_Jabatan || <span className="text-muted">Semua Jabatan</span>
    },
    {
      header: 'Nominal',
      accessor: 'Nominal',
      render: (row) => (
        <span className="text-danger fw-bold">
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
    navigate(`/potongan/edit/${row.ID_Potongan}`);
  };

  const handleDelete = (row) => {
    const confirmed = window.confirm(`Hapus potongan ${row.Nama_Potongan}?`);
    if (confirmed) {
      success(`Berhasil menghapus ${row.Nama_Potongan}`);
    }
  };

  const handleExport = () => {
    success('Data sedang diexport...');
  };

  return (
    <>
      <NavigationWidget
        buttonCreate={
          <Button onClick={() => navigate("/potongan/add")}>
            <Plus />  Tambah
          </Button>
        }
      >
        <Card className="mt-2">
          <Card.Header className="bg-secondary text-light d-flex justify-content-between align-items-center">
            <h5>Potongan</h5>
            <Paginator paginate={paginatePotongan} callbackPaginator={callbackPaginator} />
          </Card.Header>
          {loading ? (
            <div className="d-flex justify-content-center p-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <AdvancedTable
              columns={potonganColumns}
              data={daftarPotongan.results || []}
              loading={loading}
              searchable={true}
              selectable={true}
              exportable={true}
              onSearch={handleSearch}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onExport={handleExport}
              pagination={{
                currentPage: queryPotongan.page,
                total: daftarPotongan.total || 0,
                from: (queryPotongan.page - 1) * queryPotongan.limit + 1,
                to: queryPotongan.page * queryPotongan.limit,
                lastPage: Math.ceil((daftarPotongan.total || 0) / queryPotongan.limit)
              }}
              onPageChange={(page, limit) => {
                setQueryPotongan((values) => ({ ...values, page, limit }));
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

export default PotonganPage;
