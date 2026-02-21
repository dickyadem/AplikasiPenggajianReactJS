import { Button, Card, Form, InputGroup, Table, Spinner } from "react-bootstrap";
import NavigationWidget from "../../widgets/commons/NavigationWidget";
import { useNavigate } from "react-router-dom";
import { VscAdd } from "react-icons/vsc";
import { FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";
import KaryawanService from "../../services/KaryawanService";
import Paginator from "../../widgets/commons/PaginatorWidget";
import ToastWidget from "../../widgets/commons/ToastWidget";
import useToast from "../../hooks/useToast";

const KaryawanPage = () => {
  const navigate = useNavigate();
  const { toast, hideToast, error, success } = useToast();
  const [daftarKaryawan, setDaftarKaryawan] = useState({});
  const [paginateKaryawan, setPaginateKaryawan] = useState([]);
  const [queryKaryawan, setQueryKaryawan] = useState({ page: 1, limit: 10 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    KaryawanService.list(queryKaryawan)
      .then((response) => {
        setDaftarKaryawan(response.data);
        if (response.headers.pagination) {
          setPaginateKaryawan(JSON.parse(response.headers.pagination))
        }
      })
      .catch((err) => {
        const errorMsg = err.response?.data?.message || "Gagal memuat data karyawan.";
        error(errorMsg);
        console.error("Error loading karyawan:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [queryKaryawan]);

  const callbackPaginator = (page) => {
    setQueryKaryawan((values) => ({ ...values, page }));
  };

  const callbackKaryawanSearchInlineWidget = (query) => {
    setQueryKaryawan((values) => ({ ...values, ...query }));
  };

  const handleRowClick = (id) => {
    // Blur any focused element to prevent text cursor
    if (document.activeElement && document.activeElement.blur) {
      document.activeElement.blur();
    }
    navigate(`/karyawan/edit/${id}`);
  };

  return (
    <>
      <NavigationWidget
        buttonCreate={
          <Button onClick={() => navigate("/karyawan/add")}>
            <VscAdd /> Tambah
          </Button>
        }
      >
        <Card className="mt-2">
          <Card.Header className="bg-secondary text-light d-flex justify-content-between align-items-center">
            <h5>Karyawan</h5>
            <Paginator paginate={paginateKaryawan} callbackPaginator={callbackPaginator} />
          </Card.Header>
          {loading ? (
            <div className="d-flex justify-content-center p-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>ID Karyawan</th>
                  <th>Nama Karyawan</th>
                  <th>Email</th>
                  <th>Golongan</th>
                  <th>Jabatan</th>
                  <th>Divisi</th>
                  <th>Status Pernikahan</th>
                  <th>Jumlah Anak</th>
                </tr>
              </thead>
              <tbody>
                {daftarKaryawan.results && daftarKaryawan.results.length > 0 ? (
                  daftarKaryawan.results.map((karyawan, index) => (
                    <tr
                      key={index}
                      onClick={() => handleRowClick(karyawan.ID_Karyawan)}
                      style={{ cursor: 'pointer' }}>
                      <td>{karyawan.ID_Karyawan}</td>
                      <td>{karyawan.Nama_Karyawan}</td>
                      <td>{karyawan.email || "-"}</td>
                      <td>{karyawan.ID_Golongan}</td>
                      <td>{karyawan.ID_Jabatan}</td>
                      <td>{karyawan.Divisi}</td>
                      <td>{karyawan.Status_Pernikahan}</td>
                      <td>{karyawan.Jumlah_Anak}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      Tidak ada data karyawan
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

export default KaryawanPage;
