import { Button, Card, Spinner } from "react-bootstrap";
import NavigationWidget from "../../widgets/commons/NavigationWidget";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ProfilService from "../../services/ProfilService";
import { Plus } from "@phosphor-icons/react";
import ToastWidget from "../../widgets/commons/ToastWidget";
import useToast from "../../hooks/useToast";
import AdvancedTable from "../../widgets/commons/AdvancedTable";
import Paginator from "../../widgets/commons/PaginatorWidget";
import { exportToExcel } from "../../utils/exportToExcel";

const ProfilPage = () => {
  const navigate = useNavigate();
  const { toast, hideToast, error, success } = useToast();
  const [isProfileDataExist, setIsProfileDataExist] = useState(false);
  const [daftarProfil, setDaftarProfil] = useState([]);
  const [paginateProfil, setPaginateProfil] = useState(null);
  const [queryProfil, setQueryProfil] = useState({ page: 1, limit: 10 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    ProfilService.list(queryProfil)
      .then((response) => {
        setDaftarProfil(response.data);
        if (response.headers.pagination) {
          setPaginateProfil(JSON.parse(response.headers.pagination));
        }

        setIsProfileDataExist(response.data.results && response.data.results.length > 0);
      })
      .catch((err) => {
        const errorMsg = err.response?.data?.message || "Gagal memuat data profil.";
        error(errorMsg);
        console.error("Error loading profil:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [queryProfil]);

  const callbackPaginator = (page) => {
    setQueryProfil((values) => ({ ...values, page }));
  };

  // Table columns
  const profilColumns = [
    {
      header: 'Kode',
      accessor: 'ID_Profil',
      style: { minWidth: '100px' }
    },
    {
      header: 'Nama Perusahaan',
      accessor: 'Nama',
      style: { minWidth: '250px' },
      render: (row) => (
        <span className="fw-bold text-primary">{row.Nama}</span>
      )
    },
    {
      header: 'Alamat',
      accessor: 'Alamat',
      style: { minWidth: '300px' }
    },
    {
      header: 'Telepon',
      accessor: 'Telepon',
      style: { minWidth: '120px' }
    },
    {
      header: 'Email',
      accessor: 'Email',
      style: { minWidth: '180px' },
      render: (row) => (
        <a href={`mailto:${row.Email}`} className="text-decoration-none">
          {row.Email}
        </a>
      )
    },
    {
      header: 'Website',
      accessor: 'Website',
      style: { minWidth: '180px' },
      render: (row) => (
        row.Website ? (
          <a href={row.Website} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
            {row.Website}
          </a>
        ) : '-'
      )
    }
  ];

  // Handlers
  const handleSearch = (term) => {
    console.log('Search:', term);
  };

  const handleEdit = (row) => {
    navigate(`/profil/edit/${row.ID_Profil}`);
  };

  const handleDelete = (row) => {
    const confirmed = window.confirm(`Hapus profil ${row.Nama}?`);
    if (confirmed) {
      success(`Berhasil menghapus ${row.Nama}`);
    }
  };

  const handleExport = async (data, columns) => {
    try {
      await exportToExcel(data, 'Data-Perusahaan', profilColumns);
      success('Data berhasil diexport ke Excel!');
    } catch (error) {
      error('Gagal export data.');
      console.error('Export error:', error);
    }
  };

  return (
    <>
      <NavigationWidget buttonCreate={
        <Button
          onClick={() => navigate("/profil/add")}
          variant="primary"
        >
          <Plus /> Tambah Data Perusahaan
        </Button>
      }>
        <Card className="mt-2">
          <Card.Header className="bg-secondary text-light d-flex justify-content-between align-items-center">
            <h5>Data Perusahaan</h5>
            {paginateProfil && (
              <Paginator paginate={paginateProfil} callbackPaginator={callbackPaginator} />
            )}
          </Card.Header>
          {loading ? (
            <div className="d-flex justify-content-center p-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <AdvancedTable
              columns={profilColumns}
              data={daftarProfil.results || []}
              loading={loading}
              searchable={true}
              selectable={true}
              exportable={true}
              onSearch={handleSearch}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onExport={handleExport}
              pagination={{
                currentPage: queryProfil.page,
                total: daftarProfil.total || 0,
                from: (queryProfil.page - 1) * queryProfil.limit + 1,
                to: queryProfil.page * queryProfil.limit,
                lastPage: Math.ceil((daftarProfil.total || 0) / queryProfil.limit)
              }}
              onPageChange={(page, limit) => {
                setQueryProfil((values) => ({ ...values, page, limit }));
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

export default ProfilPage;
