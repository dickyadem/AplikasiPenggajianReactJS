import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Card, Row, Col, Form, Button } from "react-bootstrap";
import config from "../../config";
import HTTPService from "../../services/HTTPService";

const AuthRegisterPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    NamaLengkap: "",
    email: "",
    password: "",
    confirmPassword: "",
    Status: "user",
  });

  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setUser((values) => ({ ...values, [name]: value }));
  };

  const handleRegister = () => {
    if (user.password !== user.confirmPassword) {
      alert("Password dan Konfirmasi Password tidak sama!");
      return;
    }

    if (user.password.length < 6) {
      alert("Password minimal 6 karakter!");
      return;
    }

    HTTPService.post(`/user/register`, {
      NamaLengkap: user.NamaLengkap,
      email: user.email,
      password: user.password,
      Status: user.Status,
    })
      .then((response) => {
        alert("Registrasi berhasil! Silakan login.");
        navigate("/");
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.errors?.[0]?.msg ||
                            error.response?.data?.message ||
                            "Registrasi gagal!";
        alert(errorMessage);
      });
  };

  return (
    <>
      <Container>
        <Row className="vh-100 d-flex justify-content-center align-items-center">
          <Col md={5}>
            <div className="d-flex justify-content-center">
              <h2>Register</h2>
            </div>
            <Card className="mt-3">
              <Card.Body>
                <Form.Group className="my-3">
                  <Form.Label>Nama Lengkap</Form.Label>
                  <Form.Control
                    name="NamaLengkap"
                    onChange={handleInput}
                    value={user.NamaLengkap || ""}
                    type="text"
                    placeholder="Masukan nama lengkap..."
                  />
                </Form.Group>
                <Form.Group className="my-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    name="email"
                    onChange={handleInput}
                    value={user.email || ""}
                    type="email"
                    placeholder="Masukan email..."
                  />
                </Form.Group>
                <Form.Group className="my-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="Status"
                    onChange={handleInput}
                    value={user.Status || ""}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="my-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    name="password"
                    onChange={handleInput}
                    value={user.password || ""}
                    type="password"
                    placeholder="Masukan password..."
                  />
                </Form.Group>
                <Form.Group className="my-3">
                  <Form.Label>Konfirmasi Password</Form.Label>
                  <Form.Control
                    name="confirmPassword"
                    onChange={handleInput}
                    value={user.confirmPassword || ""}
                    type="password"
                    placeholder="Konfirmasi password..."
                  />
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button onClick={handleRegister}>Register</Button>
                </div>
                <div className="text-center mt-3">
                  <span>Sudah punya akun? </span>
                  <Link to="/">Login</Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AuthRegisterPage;
