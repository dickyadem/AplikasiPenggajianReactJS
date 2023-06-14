import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Form } from "react-bootstrap";
import { FaArrowLeft, FaSave, FaTrash } from "react-icons/fa";
import NavigationWidget from "../../widgets/commons/NavigationWidget";
import PotonganService from "../../services/PotonganService";

const PotonganEditPage = () => {
    const navigate = useNavigate();
    const { ID_Potongan } = useParams();
    const [potongan, setPotongan] = useState({});

    const handleInput = (e) => {
        let name = e.target.name;
        let value = e.target.value;

        setPotongan((values) => ({ ...values, [name]: value }));
    };

    useEffect(() => {
        PotonganService.get(ID_Potongan).then((response) => {
            setPotongan(response.data);
        });
    }, [ID_Potongan]);

    const handlePotonganServiceEdit = () => {
        PotonganService.edit(ID_Potongan, potongan).then((response) => {
            alert(`Berhasil mengubah data potongan ${ID_Potongan}`);
            navigate("/potongan");
        });
    };

    const handlePotonganServiceDelete = () => {
        let isDelete = window.confirm(`Delete potongan ${ID_Potongan}?`)
        if (isDelete) {
            PotonganService.delete(ID_Potongan, potongan).then(() => {
                alert(`Berhasil mengubah data potongan ${ID_Potongan}`);
                navigate("/potongan");
            });
        }

    };

    return (
        <NavigationWidget actionTop={
            <>
                <Button className="me-2" variant="secondary" onClick={() => navigate(-1)}>
                    <FaArrowLeft /> Kembali
                </Button>
                <Button className="me-2" variant="danger" onClick={handlePotonganServiceDelete}>
                    <FaTrash />Hapus
                </Button>
                <Button onClick={handlePotonganServiceEdit}>
                    <FaSave />Simpan
                </Button>
            </>
        }>
            <Card>
                <Card.Header>
                    <h5>Edit Potongan</h5>
                </Card.Header>
                <Card.Body>
                    <Form.Group>
                        <Form.Label>ID Potongan</Form.Label>
                        <Form.Control
                            disabled
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

export default PotonganEditPage;