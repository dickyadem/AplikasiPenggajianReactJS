import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Form } from "react-bootstrap";
import { FaArrowLeft, FaSave, FaTrash } from "react-icons/fa";
import NavigationWidget from "../../widgets/commons/NavigationWidget";
import JabatanService from "../../services/JabatanService";

const JabatanEditPage = () => {
    const navigate = useNavigate();
    const { ID_Jabatan } = useParams();
    const [jabatan, setJabatan] = useState({});

    const handleInput = (e) => {
        let name = e.target.name;
        let value = e.target.value;

        setJabatan((values) => ({ ...values, [name]: value }));
    };

    useEffect(() => {
        JabatanService.get(ID_Jabatan).then((response) => {
            setJabatan(response.data);
        });
    }, [ID_Jabatan]);

    const handleJabatanServiceEdit = () => {
        JabatanService.edit(ID_Jabatan, jabatan).then((response) => {
            alert(`Berhasil mengubah data jabatan ${ID_Jabatan}`);
            navigate("/jabatan");
        });
    };

    const handleJabatanServiceDelete = () => {
        let isDelete = window.confirm(`Delete jabatan ${ID_Jabatan}?`)
        if (isDelete) {
            JabatanService.delete(ID_Jabatan, jabatan).then(() => {
                alert(`Berhasil mengubah data jabatan ${ID_Jabatan}`);
                navigate("/jabatan");
            });
        }

    };

    return (
        <NavigationWidget actionTop={
            <>
                <Button className="me-2" variant="secondary" onClick={() => navigate(-1)}>
                    <FaArrowLeft /> Kembali
                </Button>
                <Button className="me-2" variant="danger" onClick={handleJabatanServiceDelete}>
                    <FaTrash />Hapus
                </Button>
                <Button onClick={handleJabatanServiceEdit}>
                    <FaSave />Simpan
                </Button>
            </>
        }>
            <Card>
                <Card.Header>
                    <h5>Edit Jabatan</h5>
                </Card.Header>
                <Card.Body>
                    <Form.Group>
                        <Form.Label>ID Jabatan</Form.Label>
                        <Form.Control
                            disabled
                            name="ID_Jabatan"
                            value={jabatan.ID_Jabatan || ""}
                            onChange={handleInput} />
                    </Form.Group>
                    <Form.Group className="mt-3">
                        <Form.Label>Nama Jabatan</Form.Label>
                        <Form.Control
                            name="Nama_Jabatan"
                            value={jabatan.Nama_Jabatan || ""}
                            onChange={handleInput} />
                    </Form.Group>
                </Card.Body>
            </Card>
        </NavigationWidget>
    );
};

export default JabatanEditPage;