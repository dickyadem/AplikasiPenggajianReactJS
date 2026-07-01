import { Button, Card, Spinner } from "react-bootstrap";
import NavigationWidget from "../../widgets/commons/NavigationWidget";
import { useNavigate } from "react-router-dom";
import { Plus } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import JabatanService from "../../services/JabatanService";
import Paginator from "../../widgets/commons/PaginatorWidget";
import ToastWidget from "../../widgets/commons/ToastWidget";
import useToast from "../../hooks/useToast";
import AdvancedTable from "../../widgets/commons/AdvancedTable";

const JabatanPage = () => {
  const navigate = useNavigate();
  const { toast, hideToast, error, success } = useToast();
  const [daftarJabatan, setDaftarJabatan] = useState({});
  const [paginateJabatan, setPaginateJabatan] = useState([]);
  const [queryJabatan, setQueryJabatan] = useState({ page: 1, limit: 10 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    JabatanService.list(queryJabatan)
      .then((response) => {
        setDaftarJabatan(response.data);
        if (response.headers.pagination) {
          setPaginateJabatan(JSON.parse(response.headers.pagination));
        }
      })
      .catch((err) => {
        const errorMsg = err.response?.data?.message || "Gagal memuat data jabatan.";
        error(errorMsg);
        console.error("Error loading jabatan:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [queryJabatan]);

  const callbackPaginator = (page) => {
    setQueryJabatan((values) => ({ ...values, page }));
  };

  // Table columns
  const jabatanColumns = [
    {
      header: 'ID Jabatan',
      accessor: 'ID_Jabatan',
      style: { minWidth: '120px' }
    },
    {
      header: 'Nama Jabatan',
      accessor: 'Nama_Jabatan',
      style: { minWidth: '250px' }
    }
  ];

  // Handlers
  const handleSearch = (term) => {
    console.log('Search:', term);
  };

  const handleEdit = (row) => {
    navigate(`/jabatan/edit/${row.ID_Jabatan}`);
  };

  const handleDelete = (row) => {
    const confirmed = window.confirm(`Hapus jabatan ${row.Nama_Jabatan}?`);
    if (confirmed) {
      success(`Berhasil menghapus ${row.Nama_Jabatan}`);
    }
  };

  const handleExport = () => {
    success('Data sedang diexport...');
  };

  return (
    <>
      <NavigationWidget
        buttonCreate={
          <Button onClick={() => navigate("/jabatan/add")}>
            <Plus />  Tambah
          </Button>
        }
      >
        <Card className="mt-2">
          <Card.Header className="bg-secondary text-light d-flex justify-content-between align-items-center">
            <h5>Jabatan</h5>
            <Paginator paginate={paginateJabatan} callbackPaginator={callbackPaginator} />
          </Card.Header>
          {loading ? (
            <div className="d-flex justify-content-center p-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <AdvancedTable
              columns={jabatanColumns}
              data={daftarJabatan.results || []}
              loading={loading}
              searchable={true}
              selectable={true}
              exportable={true}
              onSearch={handleSearch}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onExport={handleExport}
              pagination={{
                currentPage: queryJabatan.page,
                total: daftarJabatan.total || 0,
                from: (queryJabatan.page - 1) * queryJabatan.limit + 1,
                to: queryJabatan.page * queryJabatan.limit,
                lastPage: Math.ceil((daftarJabatan.total || 0) / queryJabatan.limit)
              }}
              onPageChange={(page, limit) => {
                setQueryJabatan((values) => ({ ...values, page, limit }));
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

export default JabatanPage;
