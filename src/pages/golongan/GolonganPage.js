import { Button, Card, Spinner } from "react-bootstrap";
import NavigationWidget from "../../widgets/commons/NavigationWidget";
import { useNavigate } from "react-router-dom";
import { VscAdd } from "react-icons/vsc";
import { useEffect, useState } from "react";
import GolonganService from "../../services/GolonganService";
import Paginator from "../../widgets/commons/PaginatorWidget";
import ToastWidget from "../../widgets/commons/ToastWidget";
import useToast from "../../hooks/useToast";
import AdvancedTable from "../../widgets/commons/AdvancedTable";

const GolonganPage = () => {
  const navigate = useNavigate();
  const { toast, hideToast, error, success } = useToast();
  const [daftarGolongan, setDaftarGolongan] = useState({});
  const [paginateGolongan, setPaginateGolongan] = useState([]);
  const [queryGolongan, setQueryGolongan] = useState({ page: 1, limit: 10 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    GolonganService.list(queryGolongan)
      .then((response) => {
        setDaftarGolongan(response.data);
        if (response.headers.pagination) {
          setPaginateGolongan(JSON.parse(response.headers.pagination));
        }
      })
      .catch((err) => {
        const errorMsg = err.response?.data?.message || "Gagal memuat data golongan.";
        error(errorMsg);
        console.error("Error loading golongan:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [queryGolongan]);

  const callbackPaginator = (page) => {
    setQueryGolongan((values) => ({ ...values, page }));
  };

  // Table columns
  const golonganColumns = [
    {
      header: 'ID Golongan',
      accessor: 'ID_Golongan',
      style: { minWidth: '120px' }
    },
    {
      header: 'Nama Golongan',
      accessor: 'Nama_Golongan',
      style: { minWidth: '250px' }
    }
  ];

  // Handlers
  const handleSearch = (term) => {
    console.log('Search:', term);
  };

  const handleEdit = (row) => {
    navigate(`/golongan/edit/${row.ID_Golongan}`);
  };

  const handleDelete = (row) => {
    const confirmed = window.confirm(`Hapus golongan ${row.Nama_Golongan}?`);
    if (confirmed) {
      success(`Berhasil menghapus ${row.Nama_Golongan}`);
    }
  };

  const handleExport = () => {
    success('Data sedang diexport...');
  };

  return (
    <>
      <NavigationWidget
        buttonCreate={
          <Button onClick={() => navigate("/golongan/add")}>
            <VscAdd />  Tambah
          </Button>
        }
      >
        <Card className="mt-2">
          <Card.Header className="bg-secondary text-light d-flex justify-content-between align-items-center">
            <h5>Golongan</h5>
            <Paginator paginate={paginateGolongan} callbackPaginator={callbackPaginator} />
          </Card.Header>
          {loading ? (
            <div className="d-flex justify-content-center p-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <AdvancedTable
              columns={golonganColumns}
              data={daftarGolongan.results || []}
              loading={loading}
              searchable={true}
              selectable={true}
              exportable={true}
              onSearch={handleSearch}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onExport={handleExport}
              pagination={{
                currentPage: queryGolongan.page,
                total: daftarGolongan.total || 0,
                from: (queryGolongan.page - 1) * queryGolongan.limit + 1,
                to: queryGolongan.page * queryGolongan.limit,
                lastPage: Math.ceil((daftarGolongan.total || 0) / queryGolongan.limit)
              }}
              onPageChange={(page, limit) => {
                setQueryGolongan((values) => ({ ...values, page, limit }));
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

export default GolonganPage;
