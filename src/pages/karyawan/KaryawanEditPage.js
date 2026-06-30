import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Form } from "react-bootstrap";
import { FaArrowLeft, FaSave, FaTrash } from "react-icons/fa";
import KaryawanService from "../../services/KaryawanService";
import NavigationWidget from "../../widgets/commons/NavigationWidget";
import { useToast } from "../../widgets/commons/ToastProvider";

const KaryawanEditPage = () => {
    const navigate = useNavigate();
    const { ID_Karyawan } = useParams();
    const { success, error } = useToast();
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
        // Siapkan data yang akan dikirim (filter field yang kosong)
        const dataToSend = { ...karyawan };
        
        // Jika email kosong, jangan kirim field email (untuk menghindari error backend)
        if (!dataToSend.email || dataToSend.email.trim() === "") {
            delete dataToSend.email;
        }

        KaryawanService.edit(ID_Karyawan, dataToSend)
            .then((response) => {
                success(`Berhasil mengubah data karyawan ${ID_Karyawan}`);
                setTimeout(() => {
                    navigate("/karyawan");
                }, 1000);
            })
            .catch((error) => {
                console.error("Error detail:", error);
                const errorMsg = error.response?.data?.message ||
                                error.response?.data?.errors?.map(e => e.msg).join(", ") ||
                                "Gagal mengupdate data karyawan. Periksa koneksi atau data Anda.";
                error(errorMsg);
                setTimeout(() => {
                    navigate("/karyawan");
                }, 1000);
            });
    };

    const handleKaryawanServiceDelete = () => {
        let isDelete = window.confirm(`Delete karyawan ${ID_Karyawan}?`)
        if (isDelete) {
            KaryawanService.delete(ID_Karyawan, karyawan).then(() => {
                success(`Berhasil menghapus data karyawan ${ID_Karyawan}`);
                setTimeout(() => {
                    navigate("/karyawan");
                }, 1000);
            }).catch((err) => {
                error(err.response?.data?.message || "Gagal menghapus data karyawan");
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
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            name="email"
                            value={karyawan.email || ""}
                            onChange={handleInput}
                            type="email" />
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
                            type="number"
                            onChange={handleInput} />
                    </Form.Group>
                    <Form.Group className="mt-3">
                        <Form.Label>Gaji Pokok (Rp)</Form.Label>
                        <Form.Control name="Gaji_Pokok"
                            value={karyawan.Gaji_Pokok || ""}
                            type="number"
                            min="0"
                            onChange={handleInput} />
                    </Form.Group>
                </Card.Body>
            </Card>
        </NavigationWidget>
    );
};

export default KaryawanEditPage;