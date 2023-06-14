import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Form } from "react-bootstrap";
import { FaArrowLeft, FaSave, FaTrash } from "react-icons/fa";
import NavigationWidget from "../../widgets/commons/NavigationWidget";
import GolonganService from "../../services/GolonganService";

const GolonganEditPage = () => {
    const navigate = useNavigate();
    const { ID_Golongan } = useParams();
    const [golongan, setGolongan] = useState({});

    const handleInput = (e) => {
        let name = e.target.name;
        let value = e.target.value;

        setGolongan((values) => ({ ...values, [name]: value }));
    };

    useEffect(() => {
        GolonganService.get(ID_Golongan).then((response) => {
            setGolongan(response.data);
        });
    }, [ID_Golongan]);

    const handleGolonganServiceEdit = () => {
        GolonganService.edit(ID_Golongan, golongan).then((response) => {
            alert(`Berhasil mengubah data golongan ${ID_Golongan}`);
            navigate("/golongan");
        });
    };

    const handleGolonganServiceDelete = () => {
        let isDelete = window.confirm(`Delete golongan ${ID_Golongan}?`)
        if (isDelete) {
            GolonganService.delete(ID_Golongan, golongan).then(() => {
                alert(`Berhasil mengubah data golongan ${ID_Golongan}`);
                navigate("/golongan");
            });
        }

    };

    return (
        <NavigationWidget actionTop={
            <>
                <Button className="me-2" variant="secondary" onClick={() => navigate(-1)}>
                    <FaArrowLeft /> Kembali
                </Button>
                <Button className="me-2" variant="danger" onClick={handleGolonganServiceDelete}>
                    <FaTrash />Hapus
                </Button>
                <Button onClick={handleGolonganServiceEdit}>
                    <FaSave />Simpan
                </Button>
            </>
        }>
            <Card>
                <Card.Header>
                    <h5>Edit Golongan</h5>
                </Card.Header>
                <Card.Body>
                    <Form.Group>
                        <Form.Label>ID Golongan</Form.Label>
                        <Form.Control
                            disabled
                            name="ID_Golongan"
                            value={golongan.ID_Golongan || ""}
                            onChange={handleInput}
                        />
                    </Form.Group>
                    <Form.Group className="mt-3">
                        <Form.Label>Nama Golongan</Form.Label>
                        <Form.Control
                            name="Nama_Golongan"
                            value={golongan.Nama_Golongan || ""}
                            onChange={handleInput}
                        />
                    </Form.Group>
                </Card.Body>
            </Card>
        </NavigationWidget>
    );
};

export default GolonganEditPage;