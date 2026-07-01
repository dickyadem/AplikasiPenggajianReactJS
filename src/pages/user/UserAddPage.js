import { Button, Card, Form, Row, Col, InputGroup } from "react-bootstrap";
import NavigationWidget from "../../widgets/commons/NavigationWidget";
import { ArrowLeft, FloppyDisk, Eye, EyeSlash } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import UserService from "../../services/UserService";
import { useState } from "react";
import useToast from "../../hooks/useToast";
import ToastWidget from "../../widgets/commons/ToastWidget";

const UserAddPage = () => {
  const navigate = useNavigate();
  const { toast, hideToast, error, success } = useToast();
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "employee",
    department: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setUser((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = () => {
    // Validasi
    if (!user.firstName || user.firstName.trim().length < 2) {
      error("Nama depan minimal 2 karakter!");
      return;
    }
    if (!user.email || !user.email.includes("@")) {
      error("Email tidak valid!");
      return;
    }
    if (!user.password || user.password.length < 8) {
      error("Password minimal 8 karakter!");
      return;
    }
    if (user.password !== user.confirmPassword) {
      error("Password dan Konfirmasi Password tidak sama!");
      return;
    }

    setLoading(true);

    const payload = {
      firstName: user.firstName.trim(),
      lastName: user.lastName.trim(),
      email: user.email.trim(),
      password: user.password,
      role: user.role || "employee",
      department: user.department.trim()
    };

    UserService.create(payload)
      .then((response) => {
        success("User berhasil ditambahkan!");
        setTimeout(() => navigate("/user"), 1500);
      })
      .catch((err) => {
        let errorMessage = "Gagal menambahkan user!";
        if (err?.response?.data?.errors) {
          errorMessage = err.response.data.errors[0]?.msg || errorMessage;
        } else if (err?.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err?.message) {
          errorMessage = err.message;
        }
        error(errorMessage);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <NavigationWidget
        actionTop={
          <>
            <Button className="me-2" variant="secondary" onClick={() => navigate(-1)}>
              <ArrowLeft /> Kembali
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              <FloppyDisk /> {loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </>
        }
      >
        <Card>
          <Card.Header className="bg-secondary text-light">
            <h5 className="mb-0">Tambah User</h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nama Depan <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    name="firstName"
                    value={user.firstName}
                    onChange={handleInput}
                    placeholder="John"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nama Belakang</Form.Label>
                  <Form.Control
                    name="lastName"
                    value={user.lastName}
                    onChange={handleInput}
                    placeholder="Doe"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Email <span className="text-danger">*</span></Form.Label>
              <Form.Control
                name="email"
                value={user.email}
                onChange={handleInput}
                type="email"
                placeholder="john@email.com"
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Password <span className="text-danger">*</span></Form.Label>
                  <InputGroup>
                    <Form.Control
                      name="password"
                      value={user.password}
                      onChange={handleInput}
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimal 8 karakter"
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeSlash /> : <Eye />}
                    </Button>
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Konfirmasi Password <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    name="confirmPassword"
                    value={user.confirmPassword}
                    onChange={handleInput}
                    type="password"
                    placeholder="Ulangi password"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Select
                    name="role"
                    value={user.role}
                    onChange={handleInput}
                  >
                    <option value="employee">Employee</option>
                    <option value="finance">Finance</option>
                    <option value="hr_staff">HR Staff</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Departemen</Form.Label>
                  <Form.Control
                    name="department"
                    value={user.department}
                    onChange={handleInput}
                    placeholder="IT, HR, Finance, dll"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
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

export default UserAddPage;
