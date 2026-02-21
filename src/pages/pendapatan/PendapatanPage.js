import { Button, Card, Form, InputGroup, Table, Spinner } from "react-bootstrap";
import NavigationWidget from "../../widgets/commons/NavigationWidget";
import { useNavigate } from "react-router-dom";
import { VscAdd } from "react-icons/vsc";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";
import PendapatanService from "../../services/PendapatanService";
import Paginator from "../../widgets/commons/PaginatorWidget";
import ToastWidget from "../../widgets/commons/ToastWidget";
import useToast from "../../hooks/useToast";


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

  const callbackPendapatanSearchInlineWidget = (query) => {
    setQueryPendapatan((values) => ({ ...values, ...query }));
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
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>ID Pendapatan</th>
                  <th>Nama Pendapatan</th>
                  <th>Jabatan</th>
                  <th>Nominal</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {daftarPendapatan.results && daftarPendapatan.results.length > 0 ? (
                  daftarPendapatan.results.map((pendapatan, index) => (
                    <tr
                      key={index}
                      onClick={() => handleRowClick(pendapatan.ID_Pendapatan)}
                      style={{ cursor: 'pointer' }}>
                      <td>{pendapatan.ID_Pendapatan}</td>
                      <td>{pendapatan.Nama_Pendapatan}</td>
                      <td>{pendapatan.ID_Jabatan ? pendapatan.ID_Jabatan : <span className="text-muted">Semua Jabatan</span>}</td>
                      <td>{formatRupiah((pendapatan.Nominal || 0).toString())}</td>
                      <td>
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRowClick(pendapatan.ID_Pendapatan);
                          }}
                        >
                          <FiEdit /> Edit
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      Tidak ada data pendapatan
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
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
