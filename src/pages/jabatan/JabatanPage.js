import { Button, Card, Form, InputGroup, Table } from "react-bootstrap";
import NavigationWidget from "../../widgets/commons/NavigationWidget";
import { useNavigate } from "react-router-dom";
import { VscAdd } from "react-icons/vsc";
import { FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";
import JabatanService from "../../services/JabatanService";
import Paginator from "../../widgets/commons/PaginatorWidget";

const JabatanPage = () => {
  const navigate = useNavigate();
  const [daftarJabatan, setDaftarJabatan] = useState({});
  const [paginateJabatan, setPaginateJabatan] = useState([]);
  const [queryJabatan, setQueryJabatan] = useState({ page: 1, limit: 10 });

  useEffect(() => {
    JabatanService.list(daftarJabatan)
      .then((response) => {
        setDaftarJabatan(response.data);
        if (response.headers.pagination) {
          setPaginateJabatan(JSON.parse(response.headers.pagination));
        }
      })
      .catch((error) => console.log(error));
  }, [queryJabatan]);

  const callbackPaginator = (page) => {
    setQueryJabatan((values) => ({ ...values, page }));
  };

  const callbackJabatanSearchInlineWidget = (query) => {
    setQueryJabatan((values) => ({ ...values, ...query }));
  };

  return (
    <NavigationWidget
      buttonCreate={
        <Button onClick={() => navigate("/jabatan/add")}>
          <VscAdd />  Tambah
        </Button>
      }
      // actionTop={
      //   <InputGroup >
      //     <Form.Control />
      //     <Button size="sm" variant="outline-secondary">
      //       <FaSearch />  Search
      //     </Button>
      //   </InputGroup>
      // }
    >
      <Card className="mt-2">
      <Card.Header className="bg-secondary text-light d-flex justify-content-between align-items-center">
          <h5>Jabatan</h5>
          <Paginator paginate={paginateJabatan} callbackPaginator={callbackPaginator} />
        </Card.Header>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>ID Jabatan</th>
              <th>Nama Jabatan</th>
            </tr>
          </thead>
          <tbody>
            {daftarJabatan.results && daftarJabatan.results.map((jabatan, index) => (
              <tr
                key={index}
                onClick={() => navigate(`/jabatan/edit/${jabatan.ID_Jabatan}`)}>
                <td>{jabatan.ID_Jabatan}</td>
                <td>{jabatan.Nama_Jabatan}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </NavigationWidget>
  );
};

export default JabatanPage;
