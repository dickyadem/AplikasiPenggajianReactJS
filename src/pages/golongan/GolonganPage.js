import { Button, Card, Form, InputGroup, Table, Spinner } from "react-bootstrap";
import NavigationWidget from "../../widgets/commons/NavigationWidget";
import { useNavigate } from "react-router-dom";
import { VscAdd } from "react-icons/vsc";
import { FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";
import GolonganService from "../../services/GolonganService";
import Paginator from "../../widgets/commons/PaginatorWidget";
import ToastWidget from "../../widgets/commons/ToastWidget";
import useToast from "../../hooks/useToast";

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

  const callbackGolonganSearchInlineWidget = (query) => {
    setQueryGolongan((values) => ({ ...values, ...query }));
  };

  const handleRowClick = (id) => {
    if (document.activeElement && document.activeElement.blur) {
      document.activeElement.blur();
    }
    navigate(`/golongan/edit/${id}`);
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
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>ID Golongan</th>
                  <th>Nama Golongan</th>
                </tr>
              </thead>
              <tbody>
                {daftarGolongan.results && daftarGolongan.results.length > 0 ? (
                  daftarGolongan.results.map((golongan, index) => (
                    <tr
                      key={index}
                      onClick={() => handleRowClick(golongan.ID_Golongan)}
                      style={{ cursor: 'pointer' }}>
                      <td>{golongan.ID_Golongan}</td>
                      <td>{golongan.Nama_Golongan}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="text-center">
                      Tidak ada data golongan
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

export default GolonganPage;
