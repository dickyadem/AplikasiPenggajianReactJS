import { Button, Card, Form } from "react-bootstrap";
import NavigationWidget from "../../widgets/commons/NavigationWidget";
import { ArrowLeft, FloppyDisk } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ProfilService from "../../services/ProfilService";

const ProfilAddPage = () => {
    const navigate = useNavigate();
    const [profil, setProfil] = useState({});
    const [errors, setErrors] = useState({});

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

        // Validasi Alamat (minimal 10 karakter)
        if (profil.Alamat && profil.Alamat.length < 10) {
            newErrors.Alamat = "Alamat minimal 10 karakter.";
        }

        // Validasi Telepon (10-13 digit)
        if (profil.Telepon) {
            const teleponRegex = /^[0-9]{10,13}$/;
            if (!teleponRegex.test(profil.Telepon)) {
                newErrors.Telepon = "Telepon harus 10-13 digit angka.";
            }
        }

        // Validasi Fax (10-15 digit)
        if (profil.Fax) {
            const faxRegex = /^[0-9]{10,15}$/;
            if (!faxRegex.test(profil.Fax)) {
                newErrors.Fax = "Fax harus 10-15 digit angka.";
            }
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

    const handleProfilServiceCreate = () => {
        if (!validateForm()) {
            alert("Mohon perbaiki error pada form.");
            return;
        }

        ProfilService.create(profil)
            .then((response) => {
                alert("Profil berhasil ditambahkan.");
                navigate("/profil");
            })
            .catch((error) => {
                const backendErrors = error.response?.data?.errors || [];
                const newErrors = {};
                backendErrors.forEach((err) => {
                    newErrors[err.path] = err.msg;
                });
                setErrors(newErrors);
                alert("Gagal menyimpan profil. Periksa error pada form.");
            });
    };

    return (
        <NavigationWidget
            actionTop={
                <>
                    <Button className="me-2" variant="secondary" onClick={() => navigate(-1)}>
                        <ArrowLeft /> Kembali
                    </Button>
                    <Button onClick={handleProfilServiceCreate}>
                        <FloppyDisk /> Simpan
                    </Button>
                </>
            }
        >
            <Card>
                <Card.Header>
                    <h5>Data Perusahaan</h5>
                </Card.Header>
                <Card.Body>
                <Form.Group>
                        <Form.Label>Kode Perusahaan</Form.Label>
                        <Form.Control
                            name="ID_Profil"
                            value={profil.ID_Profil || ""}
                            onChange={handleInput}
                            placeholder="Contoh: COMP001"
                            isInvalid={!!errors.ID_Profil}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.ID_Profil}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Nama Perusahaan</Form.Label>
                        <Form.Control
                            name="Nama"
                            value={profil.Nama || ""}
                            onChange={handleInput}
                            placeholder="Contoh: PT. Kelompok Teknologi Indonesia"
                            isInvalid={!!errors.Nama}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.Nama}
                        </Form.Control.Feedback>
                        <Form.Text className="text-muted">
                            Gunakan nama resmi perusahaan (contoh: PT, CV, atau UD)
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mt-3">
                        <Form.Label>Alamat Perusahaan</Form.Label>
                        <Form.Control
                            name="Alamat"
                            value={profil.Alamat || ""}
                            onChange={handleInput}
                            placeholder="Contoh: Jl. Merdeka No. 123, Jakarta"
                            isInvalid={!!errors.Alamat}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.Alamat}
                        </Form.Control.Feedback>
                    </Form.Group>
                         <Form.Group className="mt-3">
                        <Form.Label>Telepon</Form.Label>
                        <Form.Control
                            name="Telepon"
                            value={profil.Telepon || ""}
                            onChange={handleInput}
                            placeholder="Contoh: 02112345678"
                            isInvalid={!!errors.Telepon}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.Telepon}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mt-3">
                        <Form.Label>Fax</Form.Label>
                        <Form.Control
                            name="Fax"
                            value={profil.Fax || ""}
                            onChange={handleInput}
                            placeholder="Contoh: 02187654321"
                            isInvalid={!!errors.Fax}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.Fax}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mt-3">
                        <Form.Label>Email Perusahaan</Form.Label>
                        <Form.Control
                            name="Email"
                            value={profil.Email || ""}
                            onChange={handleInput}
                            placeholder="Contoh: info@perusahaan.com"
                            isInvalid={!!errors.Email}
                            type="email"
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.Email}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mt-3">
                        <Form.Label>Website Perusahaan</Form.Label>
                        <Form.Control
                            name="Website"
                            value={profil.Website || ""}
                            onChange={handleInput}
                            placeholder="Contoh: www.perusahaan.com"
                            isInvalid={!!errors.Website}
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

export default ProfilAddPage;
