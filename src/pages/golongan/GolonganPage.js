import { Button, Card, Form, InputGroup, Table } from "react-bootstrap";
import NavigationWidget from "../../widgets/commons/NavigationWidget";
import { useNavigate } from "react-router-dom";
import { VscAdd } from "react-icons/vsc";
import { FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";
import GolonganService from "../../services/GolonganService";
import Paginator from "../../widgets/commons/PaginatorWidget";

const GolonganPage = () => {
  const navigate = useNavigate();
  const [daftarGolongan, setDaftarGolongan] = useState({});
  const [paginateGolongan, setPaginateGolongan] = useState([]);
  const [queryGolongan, setQueryGolongan] = useState({ page: 1, limit: 10 });

  useEffect(() => {
    GolonganService.list(daftarGolongan)
      .then((response) => {
        setDaftarGolongan(response.data);
        if (response.headers.pagination) {
          setPaginateGolongan(JSON.parse(response.headers.pagination));
        }
      })
      .catch((error) => console.log(error));
  }, [queryGolongan]);

  const callbackPaginator = (page) => {
    setQueryGolongan((values) => ({ ...values, page }));
  };

  const callbackGolonganSearchInlineWidget = (query) => {
    setQueryGolongan((values) => ({ ...values, ...query }));
  };

  return (
    <NavigationWidget
      buttonCreate={
        <Button onClick={() => navigate("/golongan/add")}>
          <VscAdd />  Tambah
        </Button>
      }
      actionTop={
        <InputGroup >
          <Form.Control />
          <Button size="sm" variant="outline-secondary">
            <FaSearch />  Search
          </Button>
        </InputGroup>
      }
    >
      <Card className="mt-2">
        <Card.Header className="bg-secondary text-light d-flex justify-content-between align-items-center">
          <h5>Golongan</h5>
          <Paginator paginate={paginateGolongan} callbackPaginator={callbackPaginator} />
        </Card.Header>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>ID Golongan</th>
              <th>Nama Golongan</th>
            </tr>
          </thead>
          <tbody>
            {daftarGolongan.results && daftarGolongan.results.map((golongan, index) => (
              <tr
                key={index}
                onClick={() => navigate(`/golongan/edit/${golongan.ID_Golongan}`)}>
                <td>{golongan.ID_Golongan}</td>
                <td>{golongan.Nama_Golongan}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </NavigationWidget>
  );
};

export default GolonganPage;
