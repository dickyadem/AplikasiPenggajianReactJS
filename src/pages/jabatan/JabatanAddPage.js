import { Button, Card, Form } from "react-bootstrap";
import NavigationWidget from "../../widgets/commons/NavigationWidget";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import JabatanService from "../../services/JabatanService";
import useToast from "../../hooks/useToast";
import ToastWidget from "../../widgets/commons/ToastWidget";
import LoadingOverlay from "../../widgets/commons/LoadingOverlay";

const JabatanAddPage = () => {
    const navigate = useNavigate();
    const { toast, hideToast, success, error } = useToast();
    const [jabatan, setJabatan] = useState({});
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Preset daftar jabatan untuk dropdown
    const presetJabatan = [
        { id: "J001", nama: "Staff" },
        { id: "J002", nama: "Senior Staff" },
        { id: "J003", nama: "Supervisor" },
        { id: "J004", nama: "Manager" },
        { id: "J005", nama: "Senior Manager" },
        { id: "J006", nama: "Director" },
        { id: "J007", nama: "General Manager" },
        { id: "J008", nama: "Vice President" },
        { id: "J009", nama: "President Director" },
    ];

    const handleInput = (e) => {
        let name = e.target.name;
        let value = e.target.value;

        setJabatan((values) => ({ ...values, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const handlePresetChange = (e) => {
        const selectedId = e.target.value;
        const selected = presetJabatan.find((j) => j.id === selectedId);
        if (selected) {
            setJabatan({
                ID_Jabatan: selected.id,
                Nama_Jabatan: selected.nama,
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!jabatan.ID_Jabatan || !jabatan.ID_Jabatan.trim()) {
            newErrors.ID_Jabatan = "ID Jabatan harus diisi";
        }
        if (!jabatan.Nama_Jabatan || !jabatan.Nama_Jabatan.trim()) {
            newErrors.Nama_Jabatan = "Nama Jabatan harus diisi";
        } else if (jabatan.Nama_Jabatan.length < 3) {
            newErrors.Nama_Jabatan = "Nama Jabatan minimal 3 karakter";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleJabatanServiceCreate = () => {
        if (!validateForm()) {
            error("Mohon lengkapi data yang belum terisi");
            return;
        }

        setLoading(true);
        JabatanService.create(jabatan)
            .then((response) => {
                success("Jabatan berhasil ditambahkan.");
                setTimeout(() => navigate("/jabatan"), 1000);
            })
            .catch((err) => {
                const errorMsg = err.response?.data?.message || "Gagal menambahkan jabatan.";
                error(errorMsg);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <>
            <NavigationWidget
                actionTop={
                    <>
                        <Button className="me-2" variant="secondary" onClick={() => navigate(-1)} disabled={loading}>
                            <FaArrowLeft /> Kembali
                        </Button>
                        <Button onClick={handleJabatanServiceCreate} disabled={loading}>
                            <FaSave /> {loading ? "Menyimpan..." : "Simpan"}
                        </Button>
                    </>
                }
            >
                <Card>
                    <Card.Header>
                        <h5>Tambah Jabatan</h5>
                    </Card.Header>
                    <Card.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Pilih Jabatan (Opsional)</Form.Label>
                            <Form.Select onChange={handlePresetChange} value="">
                                <option value="">-- Pilih template jabatan --</option>
                                <option value="J001">Staff</option>
                                <option value="J002">Senior Staff</option>
                                <option value="J003">Supervisor</option>
                                <option value="J004">Manager</option>
                                <option value="J005">Senior Manager</option>
                                <option value="J006">Director</option>
                                <option value="J007">General Manager</option>
                                <option value="J008">Vice President</option>
                                <option value="J009">President Director</option>
                            </Form.Select>
                            <Form.Text className="text-muted">
                                Pilih template atau isi manual di bawah.
                            </Form.Text>
                        </Form.Group>

                        <hr />

                        <Form.Group>
                            <Form.Label>ID Jabatan *</Form.Label>
                            <Form.Control
                                name="ID_Jabatan"
                                value={jabatan.ID_Jabatan || ""}
                                onChange={handleInput}
                                placeholder="Contoh: J001"
                                isInvalid={!!errors.ID_Jabatan}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.ID_Jabatan}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mt-3">
                            <Form.Label>Nama Jabatan *</Form.Label>
                            <Form.Control
                                name="Nama_Jabatan"
                                value={jabatan.Nama_Jabatan || ""}
                                onChange={handleInput}
                                placeholder="Contoh: Staff"
                                isInvalid={!!errors.Nama_Jabatan}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.Nama_Jabatan}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Card.Body>
                </Card>
            </NavigationWidget>
            <ToastWidget
                show={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={hideToast}
            />
            <LoadingOverlay show={loading} />
        </>
    );
};

export default JabatanAddPage;
