import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Form } from "react-bootstrap";
import { FaArrowLeft, FaSave, FaTrash } from "react-icons/fa";
import NavigationWidget from "../../widgets/commons/NavigationWidget";
import PendapatanService from "../../services/PendapatanService";
import JabatanService from "../../services/JabatanService";
import useToast from "../../hooks/useToast";
import ToastWidget from "../../widgets/commons/ToastWidget";
import LoadingOverlay from "../../widgets/commons/LoadingOverlay";

const PendapatanEditPage = () => {
    const navigate = useNavigate();
    const { ID_Pendapatan } = useParams();
    const { toast, hideToast, success, error } = useToast();
    const [pendapatan, setPendapatan] = useState({
        ID_Pendapatan: "",
        Nama_Pendapatan: "",
        ID_Jabatan: "",
        Nominal: "",
        Keterangan: "",
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showNominalDropdown, setShowNominalDropdown] = useState(false);
    const [daftarJabatan, setDaftarJabatan] = useState([]);

    // Preset nominal umum (dalam rupiah)
    const presetNominal = [
        { value: 500000, label: "Rp 500.000" },
        { value: 1000000, label: "Rp 1.000.000" },
        { value: 1500000, label: "Rp 1.500.000" },
        { value: 2000000, label: "Rp 2.000.000" },
        { value: 3000000, label: "Rp 3.000.000" },
        { value: 5000000, label: "Rp 5.000.000" },
        { value: 7500000, label: "Rp 7.500.000" },
        { value: 10000000, label: "Rp 10.000.000" },
        { value: 15000000, label: "Rp 15.000.000" },
    ];

    const handleInput = (e) => {
        let name = e.target.name;
        let value = e.target.value;

        setPendapatan((values) => ({ ...values, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const handleNominalChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, "");
        setPendapatan((values) => ({ ...values, Nominal: value }));
        if (errors.Nominal) {
            setErrors((prev) => ({ ...prev, Nominal: null }));
        }
    };

    const handleNominalPresetSelect = (value) => {
        setPendapatan((values) => ({ ...values, Nominal: value.toString() }));
        setShowNominalDropdown(false);
        if (errors.Nominal) {
            setErrors((prev) => ({ ...prev, Nominal: null }));
        }
    };

    const formatRupiah = (value) => {
        if (!value) return "";
        const numeric = value.toString().replace(/[^0-9]/g, "");
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(numeric);
    };

    useEffect(() => {
        PendapatanService.get(ID_Pendapatan)
            .then((response) => {
                setPendapatan(response.data);
            })
            .catch((err) => {
                const errorMsg = err.response?.data?.message || "Gagal memuat data pendapatan.";
                error(errorMsg);
            });

        // Load data Jabatan
        JabatanService.list({})
            .then((response) => {
                const data = response.data.results || response.data;
                setDaftarJabatan(data);
            })
            .catch((err) => console.log(err));
    }, [ID_Pendapatan]);

    const validateForm = () => {
        const newErrors = {};

        if (!pendapatan.Nama_Pendapatan || !pendapatan.Nama_Pendapatan.trim()) {
            newErrors.Nama_Pendapatan = "Nama Pendapatan harus diisi";
        } else if (pendapatan.Nama_Pendapatan.length < 3) {
            newErrors.Nama_Pendapatan = "Nama Pendapatan minimal 3 karakter";
        }

        if (pendapatan.Nominal && (isNaN(pendapatan.Nominal) || parseInt(pendapatan.Nominal) <= 0)) {
            newErrors.Nominal = "Nominal harus angka > 0";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePendapatanServiceEdit = () => {
        if (!validateForm()) {
            error("Mohon lengkapi data yang belum terisi");
            return;
        }

        const dataToSend = {
            ID_Pendapatan: pendapatan.ID_Pendapatan,
            Nama_Pendapatan: pendapatan.Nama_Pendapatan,
            ID_Jabatan: pendapatan.ID_Jabatan || null,
            Nominal: pendapatan.Nominal ? parseInt(pendapatan.Nominal) : 0,
            Keterangan: pendapatan.Keterangan,
        };

        console.log("Updating data:", dataToSend);

        setLoading(true);
        PendapatanService.edit(ID_Pendapatan, dataToSend)
            .then((response) => {
                success(`Berhasil mengubah data pendapatan ${ID_Pendapatan}`);
                setTimeout(() => navigate("/pendapatan"), 1000);
            })
            .catch((err) => {
                const errorMsg = err.response?.data?.message || "Gagal mengupdate pendapatan.";
                error(errorMsg);
                console.error("Error detail:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handlePendapatanServiceDelete = () => {
        let isDelete = window.confirm(`Delete pendapatan ${ID_Pendapatan}?`)
        if (isDelete) {
            setLoading(true);
            PendapatanService.delete(ID_Pendapatan, pendapatan)
                .then(() => {
                    success(`Berhasil menghapus pendapatan ${ID_Pendapatan}`);
                    setTimeout(() => navigate("/pendapatan"), 1000);
                })
                .catch((err) => {
                    const errorMsg = err.response?.data?.message || "Gagal menghapus pendapatan.";
                    error(errorMsg);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    };

    return (
        <>
            <NavigationWidget
                actionTop={
                    <>
                        <Button className="me-2" variant="secondary" onClick={() => navigate(-1)} disabled={loading}>
                            <FaArrowLeft /> Kembali
                        </Button>
                        <Button className="me-2" variant="danger" onClick={handlePendapatanServiceDelete} disabled={loading}>
                            <FaTrash /> Hapus
                        </Button>
                        <Button onClick={handlePendapatanServiceEdit} disabled={loading}>
                            <FaSave /> {loading ? "Menyimpan..." : "Simpan"}
                        </Button>
                    </>
                }
            >
                <Card>
                    <Card.Header>
                        <h5>Edit Pendapatan</h5>
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
                            <Form.Label>Nama Pendapatan *</Form.Label>
                            <Form.Control
                                name="Nama_Pendapatan"
                                value={pendapatan.Nama_Pendapatan || ""}
                                onChange={handleInput}
                                placeholder="Contoh: Tunjangan Transport"
                                isInvalid={!!errors.Nama_Pendapatan}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.Nama_Pendapatan}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mt-3">
                            <Form.Label>Jabatan (Opsional)</Form.Label>
                            <Form.Select
                                name="ID_Jabatan"
                                value={pendapatan.ID_Jabatan || ""}
                                onChange={handleInput}
                            >
                                <option value="">Semua Jabatan</option>
                                {daftarJabatan.map((jab) => (
                                    <option key={jab.ID_Jabatan} value={jab.ID_Jabatan}>
                                        {jab.ID_Jabatan} - {jab.Nama_Jabatan}
                                    </option>
                                ))}
                            </Form.Select>
                            <Form.Text className="text-muted">
                                Kosongkan jika berlaku untuk semua jabatan.
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className="mt-3">
                            <Form.Label>Nominal (Rp)</Form.Label>
                            <div className="position-relative">
                                <Form.Control
                                    name="Nominal"
                                    value={pendapatan.Nominal ? formatRupiah(pendapatan.Nominal) : ""}
                                    onChange={handleNominalChange}
                                    onFocus={() => setShowNominalDropdown(true)}
                                    onBlur={() => setTimeout(() => setShowNominalDropdown(false), 200)}
                                    placeholder="0"
                                    isInvalid={!!errors.Nominal}
                                    type="text"
                                />
                                {showNominalDropdown && (
                                    <div
                                        style={{
                                            position: "absolute",
                                            top: "100%",
                                            left: 0,
                                            right: 0,
                                            zIndex: 1000,
                                            backgroundColor: "white",
                                            border: "1px solid #ced4da",
                                            borderRadius: "0.25rem",
                                            maxHeight: "200px",
                                            overflowY: "auto",
                                        }}
                                    >
                                        <div className="list-group">
                                            {presetNominal.map((item) => (
                                                <button
                                                    key={item.value}
                                                    type="button"
                                                    className="list-group-item list-group-item-action"
                                                    onClick={() => handleNominalPresetSelect(item.value)}
                                                    style={{ cursor: "pointer", border: "none" }}
                                                >
                                                    {item.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <Form.Control.Feedback type="invalid">
                                {errors.Nominal}
                            </Form.Control.Feedback>
                            <Form.Text className="text-muted">
                                Masukkan nominal atau pilih dari saran dropdown.
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className="mt-3">
                            <Form.Label>Keterangan</Form.Label>
                            <Form.Control
                                name="Keterangan"
                                value={pendapatan.Keterangan || ""}
                                onChange={handleInput}
                                as="textarea"
                                rows={3}
                                placeholder="Keterangan tambahan (opsional)..."
                            />
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

export default PendapatanEditPage;