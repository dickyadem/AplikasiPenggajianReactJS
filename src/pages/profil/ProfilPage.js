import { Button, Card, Form, InputGroup, Table } from "react-bootstrap";
import NavigationWidget from "../../widgets/commons/NavigationWidget";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ProfilService from "../../services/ProfilService";
import { VscAdd } from "react-icons/vsc";

const ProfilPage = () => {
  const navigate = useNavigate();
  const [isProfileDataExist, setIsProfileDataExist] = useState(false);
  const [daftarProfil, setDaftarProfil] = useState([]);
  const [paginateProfil, setPaginateProfil] = useState(null);
  const [queryProfil, setQueryProfil] = useState(""); // Nilai queryProfil yang Anda gunakan untuk memicu pengambilan data profil

  useEffect(() => {
    ProfilService.list(daftarProfil)
      .then((response) => {
        setDaftarProfil(response.data);
        if (response.headers.pagination) {
          setPaginateProfil(JSON.parse(response.headers.pagination));
        }
        
        // Cek keberadaan data profil
        setIsProfileDataExist(response.data.length > 0);
      })
      .catch((error) => console.log(error));
  }, [queryProfil]);

  const callbackPaginator = (page) => {
    setQueryProfil((values) => ({ ...values, page }));
  };

  const callbackProfilSearchInlineWidget = (query) => {
    setQueryProfil((values) => ({ ...values, ...query }));
  };
  return (
    <NavigationWidget  buttonCreate={
      <Button
        onClick={() => navigate("/profil/add")}
        disabled={!isProfileDataExist}
      >
        <VscAdd /> Tambah
      </Button>
    }>
      <Card className="mt-2">
        <Card.Header className="bg-secondary text-light">
          <h5>Profil</h5>
        </Card.Header>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama</th>
              <th>Alamat</th>
              <th>Telepon</th>
              <th>Fax</th>
              <th>Email</th>
              <th>Website</th>
            </tr>
          </thead>
          <tbody>
            {daftarProfil.results &&
              daftarProfil.results.map((profil, index) => (
                <tr key={index}>
                  <td>{profil.ID_Profil}</td>
                  <td>{profil.Nama}</td>
                  <td>{profil.Alamat}</td>
                  <td>{profil.Telepon}</td>
                  <td>{profil.Fax}</td>
                  <td>{profil.Email}</td>
                  <td>{profil.Website}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Card>
    </NavigationWidget>
  );
};

export default ProfilPage;
