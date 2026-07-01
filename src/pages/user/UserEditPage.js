import { Button, Card, Form, Row, Col, Spinner } from "react-bootstrap";
import NavigationWidget from "../../widgets/commons/NavigationWidget";
import { ArrowLeft, FloppyDisk } from "@phosphor-icons/react";
import { useNavigate, useParams } from "react-router-dom";
import UserService from "../../services/UserService";
import { useState, useEffect } from "react";
import useToast from "../../hooks/useToast";
import ToastWidget from "../../widgets/commons/ToastWidget";

const UserEditPage = () => {
  const navigate = useNavigate();
  const { email } = useParams();
  const { toast, hideToast, error, success } = useToast();
  const [user, setUser] = useState({
    NamaLengkap: "",
    role: "",
    department: "",
    Status: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    UserService.get(email)
      .then((response) => {
        const data = response.data?.data || response.data;
        setUser({
          NamaLengkap: data.NamaLengkap || data.username || "",
          role: data.role || "employee",
          department: data.department || "",
          Status: data.Status || "Active"
        });
      })
      .catch((err) => {
        const msg = err?.response?.data?.message || "Gagal memuat data user.";
        error(msg);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [email]);

  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setUser((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = () => {
    if (!user.NamaLengkap || user.NamaLengkap.trim().length < 2) {
      error("Nama lengkap minimal 2 karakter!");
      return;
    }

    setSaving(true);

    const payload = {
      NamaLengkap: user.NamaLengkap.trim(),
      role: user.role,
      department: user.department.trim(),
      Status: user.Status
    };

    UserService.edit(email, payload)
      .then((response) => {
        success("User berhasil diupdate!");
        setTimeout(() => navigate("/user"), 1500);
      })
      .catch((err) => {
        let errorMessage = "Gagal mengupdate user!";
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
        setSaving(false);
      });
  };

  if (loading) {
    return (
      <NavigationWidget>
        <div className="d-flex justify-content-center p-5">
          <Spinner animation="border" variant="primary" />
        </div>
      </NavigationWidget>
    );
  }

  return (
    <>
      <NavigationWidget
        actionTop={
          <>
            <Button className="me-2" variant="secondary" onClick={() => navigate(-1)}>
              <ArrowLeft /> Kembali
            </Button>
            <Button onClick={handleSubmit} disabled={saving}>
              <FloppyDisk /> {saving ? "Menyimpan..." : "Simpan"}
            </Button>
          </>
        }
      >
        <Card>
          <Card.Header className="bg-secondary text-light">
            <h5 className="mb-0">Edit User - {email}</h5>
          </Card.Header>
          <Card.Body>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control value={email} disabled className="bg-light" />
              <Form.Text className="text-muted">Email tidak dapat diubah (Primary Key)</Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Nama Lengkap <span className="text-danger">*</span></Form.Label>
              <Form.Control
                name="NamaLengkap"
                value={user.NamaLengkap}
                onChange={handleInput}
              />
            </Form.Group>

            <Row>
              <Col md={4}>
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
              <Col md={4}>
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
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="Status"
                    value={user.Status}
                    onChange={handleInput}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </Form.Select>
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

export default UserEditPage;
