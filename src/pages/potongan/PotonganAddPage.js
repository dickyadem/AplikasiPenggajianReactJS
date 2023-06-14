import { Button, Card, Form } from "react-bootstrap";
import NavigationWidget from "../../widgets/commons/NavigationWidget";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PotonganService from "../../services/PotonganService";

const PotonganAddPage = () => {
    const navigate = useNavigate();
    const [potongan, setPotongan] = useState({});

    const handleInput = (e) => {
        let name = e.target.name;
        let value = e.target.value;

        setPotongan((values) => ({ ...values, [name]: value }));
    };

    const handlePotonganServiceCreate = () => {
        PotonganService.create(potongan).then((response) => {
            alert("Potongan berhasil ditambahkan.");
            navigate("/potongan");
        });
    };

    return (
        <NavigationWidget
            actionTop={
                <>
                    <Button className="me-2" variant="secondary" onClick={() => navigate(-1)}>
                        <FaArrowLeft /> Kembali
                    </Button>
                    <Button onClick={handlePotonganServiceCreate}>
                        <FaSave /> Simpan
                    </Button>
                </>
            }
        >
            <Card>
                <Card.Header>
                    <h5>Tambah Potongan</h5>
                </Card.Header>
                <Card.Body>
                    <Form.Group>
                        <Form.Label>ID Potongan</Form.Label>
                        <Form.Control
                            name="ID_Potongan"
                            value={potongan.ID_Potongan || ""}
                            onChange={handleInput} />
                    </Form.Group>
                    <Form.Group className="mt-3">
                        <Form.Label>Nama Potongan</Form.Label>
                        <Form.Control
                            name="Nama_Potongan"
                            value={potongan.Nama_Potongan || ""}
                            onChange={handleInput} />
                    </Form.Group>
                </Card.Body>
            </Card>
        </NavigationWidget>
    );
};

export default PotonganAddPage;
