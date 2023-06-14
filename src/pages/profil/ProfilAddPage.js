import { Button, Card, Form } from "react-bootstrap";
import NavigationWidget from "../../widgets/commons/NavigationWidget";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ProfilService from "../../services/ProfilService";

const ProfilAddPage = () => {
    const navigate = useNavigate();
    const [profil, setProfil] = useState({});

    const handleInput = (e) => {
        let name = e.target.name;
        let value = e.target.value;

        setProfil((values) => ({ ...values, [name]: value }));
    };

    const handleProfilServiceCreate = () => {
        ProfilService.create(profil)
            .then((response) => {
                alert("Profil berhasil ditambahkan.");
                navigate("/profil");
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <NavigationWidget
            actionTop={
                <>
                    <Button className="me-2" variant="secondary" onClick={() => navigate(-1)}>
                        <FaArrowLeft /> Kembali
                    </Button>
                    <Button onClick={handleProfilServiceCreate}>
                        <FaSave /> Simpan
                    </Button>
                </>
            }
        >
            <Card>
                <Card.Header>
                    <h5>Tambah Profil</h5>
                </Card.Header>
                <Card.Body>
                <Form.Group>
                        <Form.Label>ID Profil</Form.Label>
                        <Form.Control
                            name="ID_Profil"
                            value={profil.ID_Profil || ""}
                            onChange={handleInput}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Nama</Form.Label>
                        <Form.Control
                            name="Nama"
                            value={profil.Nama || ""}
                            onChange={handleInput}
                        />
                    </Form.Group>

                    <Form.Group className="mt-3">
                        <Form.Label>Alamat</Form.Label>
                        <Form.Control
                            name="Alamat"
                            value={profil.Alamat || ""}
                            onChange={handleInput}
                        />
                         <Form.Group>
                        <Form.Label>Telepon</Form.Label>
                        <Form.Control
                            name="Telepon"
                            value={profil.Telepon || ""}
                            onChange={handleInput}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Fax</Form.Label>
                        <Form.Control
                            name="Fax"
                            value={profil.Fax || ""}
                            onChange={handleInput}
                        />
                    </Form.Group>
                    <Form.Group className="mt-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            name="Email"
                            value={profil.Email || ""}
                            onChange={handleInput}
                            required // Tambahkan atribut required
                            type="email"
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Website</Form.Label>
                        <Form.Control
                            name="Website"
                            value={profil.Website || ""}
                            onChange={handleInput}
                        />
                    </Form.Group>
                    </Form.Group>
                    {/* Tambahkan field lain sesuai kebutuhan */}
                </Card.Body>
            </Card>
        </NavigationWidget>
    );
};

export default ProfilAddPage;
