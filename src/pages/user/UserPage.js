import { Button, Card, Form, InputGroup, Table } from "react-bootstrap";
import NavigationWidget from "../../widgets/commons/NavigationWidget";
import { useNavigate } from "react-router-dom";
import { VscAdd } from "react-icons/vsc";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";
import UserService from "../../services/UserService"

const UserPage = () => {
  const navigate = useNavigate();
  const [daftarUser, setDaftarUser] = useState({});
  const [paginateUser, setPaginateUser] = useState([]);
  const [queryUser, setQueryUser] = useState({ page: 1, limit: 10 });

  useEffect(() => {
    UserService.list(daftarUser)
      .then((response) => {
        setDaftarUser(response.data);
        if (response.headers.pagination) {
          setPaginateUser(JSON.parse(response.headers.pagination));
        }
      })
      .catch((error) => console.log(error));
  }, [queryUser]);

  return (
    <NavigationWidget
      buttonCreate={
        <Button onClick={() => navigate("/user/add")}>
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
        <Card.Header className="bg-secondary text-light">
          <h5>User</h5>
        </Card.Header>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Email</th>
              <th>Nama Lengkap</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
          {daftarUser.results &&
              daftarUser.results.map((user, index) => (
                <tr key={index}>
                  <td>{user.email}</td>
                  <td>{user.NamaLengkap}</td>
                  <td>{user.Status}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Card>
    </NavigationWidget>
  );
};

export default UserPage;
