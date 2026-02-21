import { Button, Card, Form, InputGroup, Table, Spinner } from "react-bootstrap";
import NavigationWidget from "../../widgets/commons/NavigationWidget";
import { useNavigate } from "react-router-dom";
import { VscAdd } from "react-icons/vsc";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";
import UserService from "../../services/UserService";
import ToastWidget from "../../widgets/commons/ToastWidget";
import useToast from "../../hooks/useToast";

const UserPage = () => {
  const navigate = useNavigate();
  const { toast, hideToast, error, success } = useToast();
  const [daftarUser, setDaftarUser] = useState({});
  const [paginateUser, setPaginateUser] = useState([]);
  const [queryUser, setQueryUser] = useState({ page: 1, limit: 10 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    UserService.list(queryUser)
      .then((response) => {
        setDaftarUser(response.data);
        if (response.headers.pagination) {
          setPaginateUser(JSON.parse(response.headers.pagination));
        }
      })
      .catch((err) => {
        const errorMsg = err.response?.data?.message || "Gagal memuat data user.";
        error(errorMsg);
        console.error("Error loading user:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [queryUser]);

  const handleRowClick = (email) => {
    if (document.activeElement && document.activeElement.blur) {
      document.activeElement.blur();
    }
    // Navigate to edit user (adjust route as needed)
    // navigate(`/user/edit/${email}`);
  };

  return (
    <>
      <NavigationWidget
        buttonCreate={
          <Button onClick={() => navigate("/user/add")}>
            <VscAdd />  Tambah
          </Button>
        }
      >
        <Card className="mt-2">
          <Card.Header className="bg-secondary text-light">
            <h5>User</h5>
          </Card.Header>
          {loading ? (
            <div className="d-flex justify-content-center p-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Nama Lengkap</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {daftarUser.results && daftarUser.results.length > 0 ? (
                  daftarUser.results.map((user, index) => (
                    <tr key={index} style={{ cursor: 'pointer' }}>
                      <td>{user.email}</td>
                      <td>{user.NamaLengkap}</td>
                      <td>{user.Status}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center">
                      Tidak ada data user
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

export default UserPage;
