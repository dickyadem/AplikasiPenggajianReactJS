import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthService from "../../services/AuthService";
import { Container, Card, Row, Col, Form, Button } from "react-bootstrap";
import useToast from "../../hooks/useToast";
import ToastWidget from "../../widgets/commons/ToastWidget";
import LoadingOverlay from "../../widgets/commons/LoadingOverlay";

const AuthLoginPage = () => {
  const navigate = useNavigate();
  const { toast, hideToast, success, error } = useToast();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setUser((values) => ({ ...values, [name]: value }));
  };

  const validateForm = () => {
    if (!user.email || !user.email.trim()) {
      error("Email harus diisi!");
      return false;
    }
    if (!user.password || user.password.length < 6) {
      error("Password minimal 6 karakter!");
      return false;
    }
    return true;
  };

  const handleAuthServiceLogin = () => {
    if (!validateForm()) return;

    setLoading(true);
    AuthService.login(user)
      .then((response) => {
        AuthService.saveToken(response.data.token);
        success("Login berhasil! Selamat datang.");
        setTimeout(() => navigate("/user"), 1000);
      })
      .catch((err) => {
        const errorMsg = err.response?.data?.message || "Login gagal. Periksa kredensial Anda.";
        error(errorMsg);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <Container>
        <Row className="vh-100 d-flex justify-content-center align-items-center">
          <Col md={4}>
            <div className="d-flex justify-content-center">
              <h2>Admin Login</h2>
            </div>
            <Card className="mt-3">
              <Card.Body>
                <Form.Group className="my-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    name="email"
                    onChange={handleInput}
                    value={user.email || ""}
                    type="email"
                    placeholder="Masukan email..."
                    isInvalid={!user.email}
                  />
                </Form.Group>
                <Form.Group className="my-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    name="password"
                    onChange={handleInput}
                    value={user.password || ""}
                    type="password"
                    placeholder="Masukan password..."
                    isInvalid={user.password && user.password.length < 6}
                  />
                  <Form.Control.Feedback type="invalid">
                    Password minimal 6 karakter
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button 
                    onClick={handleAuthServiceLogin} 
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                </div>
                <div className="text-center mt-3">
                  <span>Belum punya akun? </span>
                  <Link to="/register">Register</Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <ToastWidget
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />
      <LoadingOverlay show={loading} />
    </>
  );
};

export default AuthLoginPage;
