import { Button, Card, Form } from "react-bootstrap";
import NavigationWidget from "../../widgets/commons/NavigationWidget";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import GolonganService from "../../services/GolonganService";
import useToast from "../../hooks/useToast";
import ToastWidget from "../../widgets/commons/ToastWidget";
import LoadingOverlay from "../../widgets/commons/LoadingOverlay";

const GolonganAddPage = () => {
    const navigate = useNavigate();
    const { toast, hideToast, success, error } = useToast();
    const [golongan, setGolongan] = useState({});
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const presetGolongan = [
        { id: "G001", nama: "Golongan I - Staff" },
        { id: "G002", nama: "Golongan II - Senior Staff" },
        { id: "G003", nama: "Golongan III - Supervisor" },
        { id: "G004", nama: "Golongan IV - Manager" },
        { id: "G005", nama: "Golongan V - Senior Manager" },
        { id: "G006", nama: "Golongan VI - Director" },
    ];

    const handleInput = (e) => {
        let name = e.target.name;
        let value = e.target.value;

        setGolongan((values) => ({ ...values, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const handlePresetChange = (e) => {
        const selectedId = e.target.value;
        const selected = presetGolongan.find((g) => g.id === selectedId);
        if (selected) {
            setGolongan({
                ID_Golongan: selected.id,
                Nama_Golongan: selected.nama,
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!golongan.ID_Golongan || golongan.ID_Golongan.trim() === "") {
            newErrors.ID_Golongan = "ID Golongan wajib diisi.";
        }

        if (!golongan.Nama_Golongan || golongan.Nama_Golongan.trim() === "") {
            newErrors.Nama_Golongan = "Nama Golongan wajib diisi.";
        } else if (golongan.Nama_Golongan.length < 3) {
            newErrors.Nama_Golongan = "Nama Golongan minimal 3 karakter.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleGolonganServiceCreate = () => {
        if (!validateForm()) {
            error("Mohon perbaiki error pada form.");
            return;
        }

        setLoading(true);
        GolonganService.create(golongan)
            .then((response) => {
                success("Golongan berhasil ditambahkan.");
                setTimeout(() => navigate("/golongan"), 1000);
            })
            .catch((err) => {
                const errorMsg = err.response?.data?.message || "Gagal menyimpan golongan.";
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
                        <Button onClick={handleGolonganServiceCreate} disabled={loading}>
                            <FaSave /> {loading ? "Menyimpan..." : "Simpan"}
                        </Button>
                    </>
                }
            >
                <Card>
                    <Card.Header>
                        <h5>Tambah Golongan</h5>
                    </Card.Header>
                    <Card.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Pilih Golongan (Opsional)</Form.Label>
                            <Form.Select onChange={handlePresetChange} value="">
                                <option value="">-- Pilih template golongan --</option>
                                <option value="G001">Golongan I - Staff</option>
                                <option value="G002">Golongan II - Senior Staff</option>
                                <option value="G003">Golongan III - Supervisor</option>
                                <option value="G004">Golongan IV - Manager</option>
                                <option value="G005">Golongan V - Senior Manager</option>
                                <option value="G006">Golongan VI - Director</option>
                            </Form.Select>
                            <Form.Text className="text-muted">
                                Pilih template atau isi manual di bawah.
                            </Form.Text>
                        </Form.Group>

                        <hr />

                        <Form.Group>
                            <Form.Label>ID Golongan *</Form.Label>
                            <Form.Control
                                name="ID_Golongan"
                                value={golongan.ID_Golongan || ""}
                                onChange={handleInput}
                                placeholder="Contoh: G001"
                                isInvalid={!!errors.ID_Golongan}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.ID_Golongan}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mt-3">
                            <Form.Label>Nama Golongan *</Form.Label>
                            <Form.Control
                                name="Nama_Golongan"
                                value={golongan.Nama_Golongan || ""}
                                onChange={handleInput}
                                placeholder="Contoh: Golongan I - Staff"
                                isInvalid={!!errors.Nama_Golongan}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.Nama_Golongan}
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

export default GolonganAddPage;
