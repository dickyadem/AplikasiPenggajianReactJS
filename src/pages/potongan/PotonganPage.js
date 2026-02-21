import { Button, Card, Form, InputGroup, Table, Spinner } from "react-bootstrap";
import NavigationWidget from "../../widgets/commons/NavigationWidget";
import { useNavigate } from "react-router-dom";
import { VscAdd } from "react-icons/vsc";
import { FiEdit } from "react-icons/fi";
import { FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";
import PotonganService from "../../services/PotonganService";
import Paginator from "../../widgets/commons/PaginatorWidget";
import ToastWidget from "../../widgets/commons/ToastWidget";
import useToast from "../../hooks/useToast";

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

  const callbackPotonganSearchInlineWidget = (query) => {
    setQueryPotongan((values) => ({ ...values, ...query }));
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
    navigate(`/potongan/edit/${id}`);
  };

  return (
    <>
      <NavigationWidget
        buttonCreate={
          <Button onClick={() => navigate("/potongan/add")}>
            <VscAdd />  Tambah
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
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>ID Potongan</th>
                  <th>Nama Potongan</th>
                  <th>Jabatan</th>
                  <th>Nominal</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {daftarPotongan.results && daftarPotongan.results.length > 0 ? (
                  daftarPotongan.results.map((potongan, index) => (
                    <tr
                      key={index}
                      onClick={() => handleRowClick(potongan.ID_Potongan)}
                      style={{ cursor: 'pointer' }}>
                      <td>{potongan.ID_Potongan}</td>
                      <td>{potongan.Nama_Potongan}</td>
                      <td>{potongan.ID_Jabatan ? potongan.ID_Jabatan : <span className="text-muted">Semua Jabatan</span>}</td>
                      <td>{formatRupiah((potongan.Nominal || 0).toString())}</td>
                      <td>
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRowClick(potongan.ID_Potongan);
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
                      Tidak ada data potongan
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

export default PotonganPage;
