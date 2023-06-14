import { Button, Card, Form, InputGroup, Table } from "react-bootstrap";
import NavigationWidget from "../../widgets/commons/NavigationWidget";
import { useNavigate } from "react-router-dom";
import { VscAdd } from "react-icons/vsc";
import { FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";
import KaryawanService from "../../services/KaryawanService";

const KaryawanPage = () => {
  const navigate = useNavigate();
  const [daftarKaryawan, setDaftarKaryawan] = useState({});
  const [paginateKaryawan, setPaginateKaryawan] = useState([]);
  const [queryKaryawan, setQueryKaryawan] = useState({ page: 1, limit: 10 });

  useEffect(() => {
    KaryawanService.list(daftarKaryawan)
      .then((response) => {
        setDaftarKaryawan(response.data);
        if (response.headers.pagination) {
          setPaginateKaryawan(JSON.parse(response.headers.pagination));
        }
      })
      .catch((error) => console.log(error));
  }, [queryKaryawan]);

  const callbackPaginator = (page) => {
    setQueryKaryawan((values) => ({ ...values, page }));
  };

  const callbackKaryawanSearchInlineWidget = (query) => {
    setQueryKaryawan((values) => ({ ...values, ...query }));
  };

  return (
    <NavigationWidget
      buttonCreate={
        <Button onClick={() => navigate("/karyawan/add")}>
          <VscAdd /> Tambah
        </Button>
      }
      actionTop={
        <InputGroup>
          <Form.Control />
          <Button size="sm" variant="outline-secondary">
            <FaSearch /> Search
          </Button>
        </InputGroup>
      }
    >
      <Card className="mt-2">
        <Card.Header className="bg-secondary text-light">
          <h5>Karyawan</h5>
        </Card.Header>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>ID Karyawan</th>
              <th>Nama Karyawan</th>
              <th>ID Golongan</th>
              <th>ID Jabatan</th>
              <th>Divisi</th>
              <th>Status Pernikahan</th>
              <th>Jumlah Anak</th>
            </tr>
          </thead>
          <tbody>
            {daftarKaryawan.results &&
              daftarKaryawan.results.map((karyawan, index) => (
                <tr key={index}>
                  <td>{karyawan.ID_Karyawan}</td>
                  <td>{karyawan.Nama_Karyawan}</td>
                  <td>{karyawan.ID_Golongan}</td>
                  <td>{karyawan.ID_Jabatan}</td>
                  <td>{karyawan.Divisi}</td>
                  <td>{karyawan.Status_Pernikahan}</td>
                  <td>{karyawan.Jumlah_Anak}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Card>
    </NavigationWidget>
  );
};

export default KaryawanPage;
