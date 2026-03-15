import { useState } from "react";
import { Link } from "react-router-dom";

import { Container, Card, Row, Col, Form, Button, InputGroup } from "react-bootstrap";
import HTTPService from "../../services/HTTPService";
import useToast from "../../hooks/useToast";
import ToastWidget from "../../widgets/commons/ToastWidget";
import { FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash, FaUserPlus, FaCheck } from "react-icons/fa";
import "./Auth.css";

const AuthRegisterPage = () => {
  const { toast, hideToast, success, error } = useToast();
  const [user, setUser] = useState({
    NamaLengkap: "",
    email: "",
    password: "",
    confirmPassword: "",
    Status: "Active",
    role: "employee",  // Default role
    department: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setUser((values) => ({ ...values, [name]: value }));
  };

  const handleRegister = () => {
    if (user.password !== user.confirmPassword) {
      error("Password dan Konfirmasi Password tidak sama!");
      return;
    }

    if (user.password.length < 8) {
      error("Password minimal 8 karakter!");
      return;
    }

    if (!user.NamaLengkap || user.NamaLengkap.trim().length < 2) {
      error("Nama lengkap minimal 2 karakter!");
      return;
    }

    const nameParts = user.NamaLengkap.trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

    const registerPayload = {
      firstName: firstName,
      lastName: lastName,
      email: user.email,
      password: user.password,
      role: user.role || 'employee',
      department: user.department || ''
    };

    HTTPService.post(`/user/register`, registerPayload)
      .then((response) => {
        success("User berhasil didaftarkan!");
      })
      .catch((err) => {
        
        // Get specific error message
        let errorMessage = "Registrasi gagal!";
        
        if (err?.response?.data?.errors) {
          const firstError = err.response.data.errors[0];
          errorMessage = firstError.msg || errorMessage;
        } else if (err?.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err?.message) {
          errorMessage = err.message;
        }
        
        error(errorMessage);
      });
  };

  return (
    <>
      <div className="auth-page">
        {/* Background Elements */}
        <div className="auth-background">
          <div className="auth-shape shape-1"></div>
          <div className="auth-shape shape-2"></div>
          <div className="auth-shape shape-3"></div>
        </div>

        <Container fluid className="auth-container">
          <Row className="align-items-center min-vh-100">
            {/* Left Side - Branding */}
            <Col lg={6} className="d-none d-lg-block">
              <div className="auth-branding">
                <div className="brand-content">
                  <div className="brand-logo">💼</div>
                  <h1 className="brand-title">Sistem Penggajian</h1>
                  <p className="brand-subtitle">Payroll Management System</p>
                  <p className="brand-description">
                    Bergabunglah dan kelola penggajian dengan lebih efisien. 
                    Dapatkan akses ke fitur-fitur unggulan kami.
                  </p>
                  
                  <div className="register-features">
                    <h6>🎁 Keuntungan Register:</h6>
                    <ul>
                      <li><FaCheck className="check-icon" /> Akses Dashboard Analytics</li>
                      <li><FaCheck className="check-icon" /> Kelola Data Karyawan</li>
                      <li><FaCheck className="check-icon" /> Generate Slip Gaji Otomatis</li>
                      <li><FaCheck className="check-icon" /> Laporan BPJS & PPh</li>
                      <li><FaCheck className="check-icon" /> Export Data ke Excel</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Col>

            {/* Right Side - Register Form */}
            <Col lg={6}>
              <div className="auth-form-container">
                <Card className="auth-card">
                  <Card.Body>
                    <div className="auth-header">
                      <div className="mobile-logo d-lg-none">💼</div>
                      <h2 className="auth-title">Buat Akun</h2>
                      <p className="auth-subtitle">Daftar untuk mulai menggunakan</p>
                    </div>

                    <Form className="auth-form">
                      <Form.Group className="form-group">
                        <Form.Label>Nama Lengkap</Form.Label>
                        <InputGroup className="input-group-custom">
                          <InputGroup.Text className="input-icon">
                            <FaUser />
                          </InputGroup.Text>
                          <Form.Control
                            name="NamaLengkap"
                            onChange={handleInput}
                            value={user.NamaLengkap || ""}
                            type="text"
                            placeholder="John Doe"
                            className="custom-input"
                          />
                        </InputGroup>
                      </Form.Group>

                      <Form.Group className="form-group">
                        <Form.Label>Email Address</Form.Label>
                        <InputGroup className="input-group-custom">
                          <InputGroup.Text className="input-icon">
                            <FaEnvelope />
                          </InputGroup.Text>
                          <Form.Control
                            name="email"
                            onChange={handleInput}
                            value={user.email || ""}
                            type="email"
                            placeholder="nama@email.com"
                            className="custom-input"
                          />
                        </InputGroup>
                      </Form.Group>

                      <Form.Group className="form-group">
                        <Form.Label>Password</Form.Label>
                        <InputGroup className="input-group-custom">
                          <InputGroup.Text className="input-icon">
                            <FaLock />
                          </InputGroup.Text>
                          <Form.Control
                            name="password"
                            onChange={handleInput}
                            value={user.password || ""}
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="custom-input"
                          />
                          <InputGroup.Text 
                            className="input-icon toggle-password"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </InputGroup.Text>
                        </InputGroup>
                      </Form.Group>

                      <Form.Group className="form-group">
                        <Form.Label>Konfirmasi Password</Form.Label>
                        <InputGroup className="input-group-custom">
                          <InputGroup.Text className="input-icon">
                            <FaLock />
                          </InputGroup.Text>
                          <Form.Control
                            name="confirmPassword"
                            onChange={handleInput}
                            value={user.confirmPassword || ""}
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="custom-input"
                          />
                          <InputGroup.Text 
                            className="input-icon toggle-password"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                          </InputGroup.Text>
                        </InputGroup>
                      </Form.Group>

                      <Form.Group className="form-group">
                        <Form.Label>Departemen</Form.Label>
                        <Form.Control
                          name="department"
                          onChange={handleInput}
                          value={user.department || ""}
                          type="text"
                          placeholder="IT, HR, Finance, dll"
                          className="custom-input"
                        />
                      </Form.Group>

                      <Form.Group className="form-group">
                        <Form.Label>Role (Default: Employee)</Form.Label>
                        <Form.Select
                          name="role"
                          onChange={handleInput}
                          value={user.role || "employee"}
                          className="custom-input"
                        >
                          <option value="employee">Employee</option>
                          <option value="finance">Finance</option>
                          <option value="hr_staff">HR Staff</option>
                          <option value="manager">Manager</option>
                        </Form.Select>
                        <Form.Text className="text-muted">
                          * Role "Admin" hanya bisa dibuat oleh Admin existing
                        </Form.Text>
                      </Form.Group>

                      <div className="form-actions">
                        <Button
                          type="button"
                          className="btn-register"
                          onClick={handleRegister}
                        >
                          <FaUserPlus /> Daftar
                        </Button>
                      </div>

                      <div className="auth-footer">
                        <p><Link to="/user" className="link">Kembali ke daftar user</Link></p>
                      </div>
                    </Form>
                  </Card.Body>
                </Card>

                {/* Footer Info */}
                <div className="auth-footer-info">
                  <p>© 2024 Sistem Penggajian. All rights reserved.</p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <ToastWidget
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />
    </>
  );
};

export default AuthRegisterPage;
