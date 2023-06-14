import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Form } from "react-bootstrap";
import { FaArrowLeft, FaSave, FaTrash } from "react-icons/fa";
import NavigationWidget from "../../widgets/commons/NavigationWidget";
import PendapatanService from "../../services/PendapatanService";

const PendapatanEditPage = () => {
    const navigate = useNavigate();
    const { ID_Pendapatan } = useParams();
    const [pendapatan, setPendapatan] = useState({});

    const handleInput = (e) => {
        let name = e.target.name;
        let value = e.target.value;

        setPendapatan((values) => ({ ...values, [name]: value }));
    };

    useEffect(() => {
        PendapatanService.get(ID_Pendapatan).then((response) => {
            setPendapatan(response.data);
        });
    }, [ID_Pendapatan]);

    const handlePendapatanServiceEdit = () => {
        PendapatanService.edit(ID_Pendapatan, pendapatan).then((response) => {
            alert(`Berhasil mengubah data pendapatan ${ID_Pendapatan}`);
            navigate("/pendapatan");
        });
    };

    const handlePendapatanServiceDelete = () => {
        let isDelete = window.confirm(`Delete pendapatan ${ID_Pendapatan}?`)
        if (isDelete) {
            PendapatanService.delete(ID_Pendapatan, pendapatan).then(() => {
                alert(`Berhasil mengubah data pendapatan ${ID_Pendapatan}`);
                navigate("/pendapatan");
            });
        }

    };

    return (
        <NavigationWidget actionTop={
            <>
                <Button className="me-2" variant="secondary" onClick={() => navigate(-1)}>
                    <FaArrowLeft /> Kembali
                </Button>
                <Button className="me-2" variant="danger" onClick={handlePendapatanServiceDelete}>
                    <FaTrash />Hapus
                </Button>
                <Button onClick={handlePendapatanServiceEdit}>
                    <FaSave />Simpan
                </Button>
            </>
        }>
            <Card>
                <Card.Header>
                    <h5>Edit </h5>
                </Card.Header>
                <Card.Body>
                    <Form.Group>
                        <Form.Label>ID Pendapatan</Form.Label>
                        <Form.Control
                            disabled
                            name="ID_Pendapatan"
                            value={pendapatan.ID_Pendapatan || ""}
                            onChange={handleInput} />
                    </Form.Group>
                    <Form.Group className="mt-3">
                        <Form.Label>Nama Pendapatan</Form.Label>
                        <Form.Control
                            name="Nama_Pendapatan"
                            value={pendapatan.Nama_Pendapatan || ""}
                            onChange={handleInput} />
                    </Form.Group>
                </Card.Body>
            </Card>
        </NavigationWidget>
    );
};

export default PendapatanEditPage;