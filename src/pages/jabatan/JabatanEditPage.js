import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Form } from "react-bootstrap";
import { ArrowLeft, FloppyDisk, Trash } from "@phosphor-icons/react";
import NavigationWidget from "../../widgets/commons/NavigationWidget";
import JabatanService from "../../services/JabatanService";
import { useToast } from "../../widgets/commons/ToastProvider";

const JabatanEditPage = () => {
    const navigate = useNavigate();
    const { ID_Jabatan } = useParams();
    const { success, error } = useToast();
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
            success(`Berhasil mengubah data jabatan ${ID_Jabatan}`);
            setTimeout(() => {
                navigate("/jabatan");
            }, 1000);
        }).catch((err) => {
            error(err.response?.data?.message || "Gagal mengubah data jabatan");
        });
    };

    const handleJabatanServiceDelete = () => {
        let isDelete = window.confirm(`Delete jabatan ${ID_Jabatan}?`)
        if (isDelete) {
            JabatanService.delete(ID_Jabatan, jabatan).then(() => {
                success(`Berhasil menghapus data jabatan ${ID_Jabatan}`);
                setTimeout(() => {
                    navigate("/jabatan");
                }, 1000);
            }).catch((err) => {
                error(err.response?.data?.message || "Gagal menghapus data jabatan");
            });
        }

    };

    return (
        <NavigationWidget actionTop={
            <>
                <Button className="me-2" variant="secondary" onClick={() => navigate(-1)}>
                    <ArrowLeft /> Kembali
                </Button>
                <Button className="me-2" variant="danger" onClick={handleJabatanServiceDelete}>
                    <Trash />Hapus
                </Button>
                <Button onClick={handleJabatanServiceEdit}>
                    <FloppyDisk />Simpan
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