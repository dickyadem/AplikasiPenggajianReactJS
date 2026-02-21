import { Button, Card, Form, InputGroup, Table, Spinner } from "react-bootstrap";
import NavigationWidget from "../../widgets/commons/NavigationWidget";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ProfilService from "../../services/ProfilService";
import { VscAdd } from "react-icons/vsc";
import ToastWidget from "../../widgets/commons/ToastWidget";
import useToast from "../../hooks/useToast";

const ProfilPage = () => {
  const navigate = useNavigate();
  const { toast, hideToast, error, success } = useToast();
  const [isProfileDataExist, setIsProfileDataExist] = useState(false);
  const [daftarProfil, setDaftarProfil] = useState([]);
  const [paginateProfil, setPaginateProfil] = useState(null);
  const [queryProfil, setQueryProfil] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    ProfilService.list(queryProfil)
      .then((response) => {
        setDaftarProfil(response.data);
        if (response.headers.pagination) {
          setPaginateProfil(JSON.parse(response.headers.pagination));
        }

        setIsProfileDataExist(response.data.length > 0);
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

  const callbackProfilSearchInlineWidget = (query) => {
    setQueryProfil((values) => ({ ...values, ...query }));
  };

  const handleRowClick = (id) => {
    if (document.activeElement && document.activeElement.blur) {
      document.activeElement.blur();
    }
    // Navigate to edit or view profil
    navigate(`/profil/edit/${id}`);
  };

  return (
    <>
      <NavigationWidget buttonCreate={
        <Button
          onClick={() => navigate("/profil/add")}
          disabled={isProfileDataExist}
        >
          <VscAdd /> Tambah
        </Button>
      }>
        <Card className="mt-2">
          <Card.Header className="bg-secondary text-light">
            <h5>Data Perusahaan</h5>
          </Card.Header>
          {loading ? (
            <div className="d-flex justify-content-center p-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>Kode</th>
                  <th>Nama Perusahaan</th>
                  <th>Alamat</th>
                  <th>Telepon</th>
                  <th>Fax</th>
                  <th>Email</th>
                  <th>Website</th>
                </tr>
              </thead>
              <tbody>
                {daftarProfil.results && daftarProfil.results.length > 0 ? (
                  daftarProfil.results.map((profil, index) => (
                    <tr key={index} style={{ cursor: 'pointer' }}>
                      <td>{profil.ID_Profil}</td>
                      <td>{profil.Nama}</td>
                      <td>{profil.Alamat}</td>
                      <td>{profil.Telepon}</td>
                      <td>{profil.Fax}</td>
                      <td>{profil.Email}</td>
                      <td>{profil.Website}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      Tidak ada data perusahaan
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

export default ProfilPage;
