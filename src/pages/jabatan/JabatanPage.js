import { Button, Card, Form, InputGroup, Table, Spinner } from "react-bootstrap";
import NavigationWidget from "../../widgets/commons/NavigationWidget";
import { useNavigate } from "react-router-dom";
import { VscAdd } from "react-icons/vsc";
import { FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";
import JabatanService from "../../services/JabatanService";
import Paginator from "../../widgets/commons/PaginatorWidget";
import ToastWidget from "../../widgets/commons/ToastWidget";
import useToast from "../../hooks/useToast";

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

  const callbackJabatanSearchInlineWidget = (query) => {
    setQueryJabatan((values) => ({ ...values, ...query }));
  };

  const handleRowClick = (id) => {
    if (document.activeElement && document.activeElement.blur) {
      document.activeElement.blur();
    }
    navigate(`/jabatan/edit/${id}`);
  };

  return (
    <>
      <NavigationWidget
        buttonCreate={
          <Button onClick={() => navigate("/jabatan/add")}>
            <VscAdd />  Tambah
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
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>ID Jabatan</th>
                  <th>Nama Jabatan</th>
                </tr>
              </thead>
              <tbody>
                {daftarJabatan.results && daftarJabatan.results.length > 0 ? (
                  daftarJabatan.results.map((jabatan, index) => (
                    <tr
                      key={index}
                      onClick={() => handleRowClick(jabatan.ID_Jabatan)}
                      style={{ cursor: 'pointer' }}>
                      <td>{jabatan.ID_Jabatan}</td>
                      <td>{jabatan.Nama_Jabatan}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="text-center">
                      Tidak ada data jabatan
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

export default JabatanPage;
