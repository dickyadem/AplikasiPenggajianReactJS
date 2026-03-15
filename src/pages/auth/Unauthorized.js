import { useNavigate } from "react-router-dom";
import { Button, Card, Container } from "react-bootstrap";
import { FaLock, FaHome, FaArrowLeft } from "react-icons/fa";
import "./Unauthorized.css";

const Unauthorized = () => {
    const navigate = useNavigate();

    return (
        <Container className="unauthorized-container">
            <Card className="unauthorized-card">
                <Card.Body className="text-center">
                    <div className="unauthorized-icon">
                        <FaLock />
                    </div>
                    <h1 className="unauthorized-title">403 - Access Denied</h1>
                    <p className="unauthorized-message">
                        Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.
                    </p>
                    <div className="unauthorized-actions">
                        <Button
                            variant="primary"
                            onClick={() => navigate(-1)}
                            className="me-2"
                        >
                            <FaArrowLeft /> Kembali
                        </Button>
                        <Button
                            variant="success"
                            onClick={() => navigate("/dashboard")}
                        >
                            <FaHome /> Dashboard
                        </Button>
                    </div>
                    <div className="unauthorized-help">
                        <p>Butuh bantuan?</p>
                        <p className="text-muted">
                            Hubungi administrator jika Anda memerlukan akses ke halaman ini.
                        </p>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Unauthorized;
