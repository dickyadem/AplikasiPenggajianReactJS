import { Button, Card, Form } from "react-bootstrap";
import NavigationWidget from "../../widgets/commons/NavigationWidget";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import UserService from "../../services/UserService";
import { useState } from "react";

const UserAddPage = () => {
  const navigate = useNavigate();
  const [User, setUser] = useState({});

  const handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setUser((values) => ({ ...values, [name]: value }));
  };

  const handleUserServiceCreate = () => {
    UserService.create(User).then((response) => {
      alert("User berhasil ditambahkan.");
      navigate("/user");
    });
  };

  return (
    <NavigationWidget
      actionTop={
        <>
          <Button className="me-2" variant="secondary" onClick={() => navigate(-1)}>
            <FaArrowLeft /> Kembali
          </Button>
          <Button onClick={handleUserServiceCreate}>
            <FaSave /> Simpan
          </Button>
        </>
      }
    >
      <Card>
        <Card.Header>
          <h5>Tambah User</h5>
        </Card.Header>
        <Card.Body>
          <Form.Group>
            <Form.Label>Nama Lengkap</Form.Label>
            <Form.Control name="NamaLengkap" value={User.NamaLengkap || ""} onChange={handleInput} />
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label>Email</Form.Label>
            <Form.Control name="email" value={User.email || ""}
              onChange={handleInput}
              required // Tambahkan atribut required
              type="email" // Tambahkan tipe email untuk validasi
            />
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label>Password</Form.Label>
            <Form.Control name="password" value={User.password || ""} onChange={handleInput} />
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label>Status</Form.Label>
            <Form.Control name="Status" value={User.Status || ""} onChange={handleInput} />
          </Form.Group>
        </Card.Body>
      </Card>
    </NavigationWidget>
  );
};

export default UserAddPage;
