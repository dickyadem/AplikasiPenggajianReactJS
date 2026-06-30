import { Button, Card, Form, Spinner } from "react-bootstrap";
import NavigationWidget from "../../widgets/commons/NavigationWidget";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import ProfilService from "../../services/ProfilService";
import { useToast } from "../../widgets/commons/ToastProvider";

const ProfilEditPage = () => {
    const navigate = useNavigate();
    const { ID_Profil } = useParams();
    const { success, error } = useToast();
    const [profil, setProfil] = useState({});
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        // Load profil data
        ProfilService.get(ID_Profil)
            .then((response) => {
                setProfil(response.data);
            })
            .catch((err) => {
                error("Gagal memuat data profil.");
                console.error("Error loading profil:", err);
            })
            .finally(() => {
                setFetching(false);
            });
    }, [ID_Profil, error]);

    const handleInput = (e) => {
        let name = e.target.name;
        let value = e.target.value;

        setProfil((values) => ({ ...values, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Validasi Nama
        if (!profil.Nama || profil.Nama.trim().length === 0) {
            newErrors.Nama = "Nama perusahaan harus diisi.";
        }

        // Validasi Email
        if (profil.Email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(profil.Email)) {
                newErrors.Email = "Format email tidak valid.";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleProfilServiceEdit = () => {
        if (!validateForm()) {
            error("Mohon perbaiki error pada form.");
            return;
        }

        setLoading(true);
        ProfilService.edit(ID_Profil, profil)
            .then((response) => {
                success(`Profil ${profil.Nama} berhasil diupdate.`);
                setTimeout(() => {
                    navigate("/profil");
                }, 1000);
            })
            .catch((error) => {
                const backendErrors = error.response?.data?.errors || [];
                const newErrors = {};
                backendErrors.forEach((err) => {
                    newErrors[err.path] = err.msg;
                });
                setErrors(newErrors);
                if (Object.keys(newErrors).length === 0) {
                    error(error.response?.data?.message || "Gagal menyimpan profil.");
                } else {
                    error("Gagal menyimpan profil. Periksa error pada form.");
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    if (fetching) {
        return (
            <NavigationWidget>
                <Card>
                    <Card.Header>
                        <h5>Edit Data Perusahaan</h5>
                    </Card.Header>
                    <Card.Body className="text-center p-5">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-3">Memuat data...</p>
                    </Card.Body>
                </Card>
            </NavigationWidget>
        );
    }

    return (
        <NavigationWidget
            actionTop={
                <>
                    <Button className="me-2" variant="secondary" onClick={() => navigate(-1)}>
                        <FaArrowLeft /> Kembali
                    </Button>
                    <Button onClick={handleProfilServiceEdit} disabled={loading}>
                        <FaSave /> {loading ? "Menyimpan..." : "Simpan"}
                    </Button>
                </>
            }
        >
            <Card>
                <Card.Header>
                    <h5>Edit Data Perusahaan</h5>
                </Card.Header>
                <Card.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>ID Perusahaan</Form.Label>
                        <Form.Control
                            disabled
                            name="ID_Profil"
                            value={profil.ID_Profil || ""}
                            onChange={handleInput}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Nama Perusahaan <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            name="Nama"
                            value={profil.Nama || ""}
                            onChange={handleInput}
                            placeholder="PT. Nama Perusahaan"
                            isInvalid={!!errors.Nama}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.Nama}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Alamat <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="Alamat"
                            value={profil.Alamat || ""}
                            onChange={handleInput}
                            placeholder="Jl. Contoh No. 123, Kota"
                            isInvalid={!!errors.Alamat}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.Alamat}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Telepon</Form.Label>
                        <Form.Control
                            name="Telepon"
                            value={profil.Telepon || ""}
                            onChange={handleInput}
                            placeholder="02112345678"
                            isInvalid={!!errors.Telepon}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.Telepon}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Fax</Form.Label>
                        <Form.Control
                            name="Fax"
                            value={profil.Fax || ""}
                            onChange={handleInput}
                            placeholder="021-12345679"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            name="Email"
                            value={profil.Email || ""}
                            onChange={handleInput}
                            type="email"
                            placeholder="email@perusahaan.com"
                            isInvalid={!!errors.Email}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.Email}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Website</Form.Label>
                        <Form.Control
                            name="Website"
                            value={profil.Website || ""}
                            onChange={handleInput}
                            placeholder="https://www.perusahaan.com"
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.Website}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Card.Body>
            </Card>
        </NavigationWidget>
    );
};

export default ProfilEditPage;
