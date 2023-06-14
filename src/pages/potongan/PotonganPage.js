import { Button, Card, Form, InputGroup, Table } from "react-bootstrap";
import NavigationWidget from "../../widgets/commons/NavigationWidget";
import { useNavigate } from "react-router-dom";
import { VscAdd } from "react-icons/vsc";
import { FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";
import PotonganService from "../../services/PotonganService";

const PotonganPage = () => {
  const navigate = useNavigate();
  const [daftarPotongan, setDaftarPotongan] = useState({});
  const [paginatePotongan, setPaginatePotongan] = useState([]);
  const [queryPotongan, setQueryPotongan] = useState({ page: 1, limit: 10 });

  useEffect(() => {
    PotonganService.list(daftarPotongan)
      .then((response) => {
        setDaftarPotongan(response.data);
        if (response.headers.pagination) {
          setPaginatePotongan(JSON.parse(response.headers.pagination));
        }
      })
      .catch((error) => console.log(error));
  }, [queryPotongan]);

  return (
    <NavigationWidget
      buttonCreate={
        <Button onClick={() => navigate("/potongan/add")}>
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
          <h5>Potongan</h5>
        </Card.Header>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>ID Potongan</th>
              <th>Nama Potongan</th>
            </tr>
          </thead>
          <tbody>
            {daftarPotongan.results &&
              daftarPotongan.results.map((Potongan, index) => (
                <tr key={index}>
                  <td>{Potongan.ID_Potongan}</td>
                  <td>{Potongan.Nama_Potongan}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Card>
    </NavigationWidget>
  );
};

export default PotonganPage;
