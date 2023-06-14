import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Form } from "react-bootstrap";
import { FaArrowLeft, FaSave, FaTrash } from "react-icons/fa";
import KaryawanService from "../../services/KaryawanService";
import NavigationWidget from "../../widgets/commons/NavigationWidget";

const KaryawanEditPage = () => {
    const navigate = useNavigate();
    const { ID_Karyawan } = useParams();
    const [karyawan, setKaryawan] = useState({});

    const handleInput = (e) => {
        let name = e.target.name;
        let value = e.target.value;

        setKaryawan((values) => ({ ...values, [name]: value }));
    };

    useEffect(() => {
        KaryawanService.get(ID_Karyawan).then((response) => {
            setKaryawan(response.data);
        });
    }, [ID_Karyawan]);

    const handleKaryawanServiceEdit = () => {
        KaryawanService.edit(ID_Karyawan, karyawan).then((response) => {
            alert(`Berhasil mengubah data karyawan ${ID_Karyawan}`);
            navigate("/karyawan");
        });
    };

    const handleKaryawanServiceDelete = () => {
        let isDelete = window.confirm(`Delete karyawan ${ID_Karyawan}?`)
        if (isDelete) {
            KaryawanService.delete(ID_Karyawan, karyawan).then(() => {
                alert(`Berhasil mengubah data karyawan ${ID_Karyawan}`);
                navigate("/karyawan");
            });
        }

    };

    return (
        <NavigationWidget actionTop={
            <>
                <Button className="me-2" variant="secondary" onClick={() => navigate(-1)}>
                    <FaArrowLeft /> Kembali
                </Button>
                <Button className="me-2" variant="danger" onClick={handleKaryawanServiceDelete}>
                    <FaTrash />Hapus
                </Button>
                <Button onClick={handleKaryawanServiceEdit}>
                    <FaSave />Simpan
                </Button>
            </>
        }>
            <Card>
                <Card.Header>
                    <h5>Tambah Karyawan</h5>
                </Card.Header>
                <Card.Body>
                    <Form.Group>
                        <Form.Label>ID Karyawan</Form.Label>
                        <Form.Control
                            disabled
                            name="ID_Karyawan"
                            value={karyawan.ID_Karyawan || ""}
                            onChange={handleInput} />
                    </Form.Group>
                    <Form.Group className="mt-3">
                        <Form.Label>Nama Karyawan</Form.Label>
                        <Form.Control
                            name="Nama_Karyawan"
                            value={karyawan.Nama_Karyawan || ""}
                            onChange={handleInput} />
                    </Form.Group>
                    <Form.Group className="mt-3">
                        <Form.Label>ID Golongan</Form.Label>
                        <Form.Control name="ID_Golongan"
                            value={karyawan.ID_Golongan || ""}
                            onChange={handleInput} />
                    </Form.Group>
                    <Form.Group className="mt-3">
                        <Form.Label>ID Jabatan</Form.Label>
                        <Form.Control name="ID_Jabatan"
                            value={karyawan.ID_Jabatan || ""}
                            onChange={handleInput} />
                    </Form.Group>
                    <Form.Group className="mt-3">
                        <Form.Label>Divisi</Form.Label>
                        <Form.Control name="Divisi"
                            value={karyawan.Divisi || ""}
                            onChange={handleInput} />
                    </Form.Group>
                    <Form.Group className="mt-3">
                        <Form.Label>Status Pernikahan</Form.Label>
                        <Form.Control name="Status_Pernikahan"
                            value={karyawan.Status_Pernikahan || ""}
                            onChange={handleInput} />
                    </Form.Group>
                    <Form.Group className="mt-3">
                        <Form.Label>Jumlah Anak</Form.Label>
                        <Form.Control name="Jumlah_Anak"
                            value={karyawan.Jumlah_Anak || ""}
                            onChange={handleInput} />
                    </Form.Group>
                </Card.Body>
            </Card>
        </NavigationWidget>
    );
};

export default KaryawanEditPage;