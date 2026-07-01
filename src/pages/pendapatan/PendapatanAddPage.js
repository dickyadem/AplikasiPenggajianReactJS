import { Button, Card, Form } from "react-bootstrap";
import NavigationWidget from "../../widgets/commons/NavigationWidget";
import { ArrowLeft, FloppyDisk, ArrowsClockwise } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import PendapatanService from "../../services/PendapatanService";
import JabatanService from "../../services/JabatanService";
import useToast from "../../hooks/useToast";
import ToastWidget from "../../widgets/commons/ToastWidget";
import LoadingOverlay from "../../widgets/commons/LoadingOverlay";

const PendapatanAddPage = () => {
    const navigate = useNavigate();
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

    // Load data Jabatan
    useEffect(() => {
        JabatanService.list({})
            .then((response) => {
                const data = response.data.results || response.data;
                setDaftarJabatan(data);
            })
            .catch((err) => console.log(err));
    }, []);

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

    // Template pendapatan umum
    const templatePendapatan = [
        { id: "PDN001", nama: "Gaji Pokok", jenis: "Tetap" },
        { id: "PDN002", nama: "Tunjangan Transport", jenis: "Tetap" },
        { id: "PDN003", nama: "Tunjangan Makan", jenis: "Tetap" },
        { id: "PDN004", nama: "Tunjangan Jabatan", jenis: "Tetap" },
        { id: "PDN005", nama: "Tunjangan Kesehatan", jenis: "Tetap" },
        { id: "PDN006", nama: "Bonus Tahunan", jenis: "Tidak Tetap" },
        { id: "PDN007", nama: "Komisi Penjualan", jenis: "Tidak Tetap" },
        { id: "PDN008", nama: "Uang Lembur", jenis: "Tidak Tetap" },
        { id: "PDN009", nama: "Reward Kinerja", jenis: "Tidak Tetap" },
    ];

    const handleInput = (e) => {
        let name = e.target.name;
        let value = e.target.value;

        setPendapatan((values) => ({ ...values, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const handleTemplateChange = (e) => {
        const selectedId = e.target.value;
        const selected = templatePendapatan.find((t) => t.id === selectedId);
        if (selected) {
            setPendapatan({
                ...pendapatan,
                ID_Pendapatan: selected.id,
                Nama_Pendapatan: selected.nama,
                Jenis: selected.jenis,
            });
        }
    };

    const handleGenerateId = () => {
        const year = new Date().getFullYear().toString().slice(-2);
        const randomNum = Math.floor(Math.random() * 9000) + 1000;
        const newId = `PDN-${year}-${randomNum}`;
        setPendapatan((values) => ({ ...values, ID_Pendapatan: newId }));
    };

    const formatRupiah = (value) => {
        // Remove non-numeric characters
        const numeric = value.replace(/[^0-9]/g, "");
        // Format with thousand separator
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(numeric);
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

    const validateForm = () => {
        const newErrors = {};

        if (!pendapatan.ID_Pendapatan || !pendapatan.ID_Pendapatan.trim()) {
            newErrors.ID_Pendapatan = "ID Pendapatan harus diisi";
        }

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

    const handlePendapatanServiceCreate = () => {
        if (!validateForm()) {
            error("Mohon lengkapi data yang belum terisi");
            return;
        }

        // Konfirmasi jika nominal kosong
        if (!pendapatan.Nominal || parseInt(pendapatan.Nominal) === 0) {
            const confirmSave = window.confirm(
                "Nominal masih kosong atau 0. Yakin ingin menyimpan tanpa nominal?"
            );
            if (!confirmSave) {
                return;
            }
        }

        // Siapkan data untuk dikirim
        const dataToSend = {
            ID_Pendapatan: pendapatan.ID_Pendapatan,
            Nama_Pendapatan: pendapatan.Nama_Pendapatan,
            ID_Jabatan: pendapatan.ID_Jabatan || null,
            Nominal: pendapatan.Nominal ? parseInt(pendapatan.Nominal) : 0,
            Keterangan: pendapatan.Keterangan,
        };

        console.log("Sending data:", dataToSend);

        setLoading(true);
        PendapatanService.create(dataToSend)
            .then((response) => {
                success("Pendapatan berhasil ditambahkan.");
                setTimeout(() => navigate("/pendapatan"), 1000);
            })
            .catch((err) => {
                const errorMsg = err.response?.data?.message || "Gagal menambahkan pendapatan.";
                error(errorMsg);
                console.error("Error detail:", err);
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
                            <ArrowLeft /> Kembali
                        </Button>
                        <Button onClick={handlePendapatanServiceCreate} disabled={loading}>
                            <FloppyDisk /> {loading ? "Menyimpan..." : "Simpan"}
                        </Button>
                    </>
                }
            >
                <Card>
                    <Card.Header>
                        <h5>Tambah Pendapatan</h5>
                    </Card.Header>
                    <Card.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Template Pendapatan (Opsional)</Form.Label>
                            <Form.Select onChange={handleTemplateChange} value="">
                                <option value="">-- Pilih template pendapatan --</option>
                                {templatePendapatan.map((tpl) => (
                                    <option key={tpl.id} value={tpl.id}>
                                        {tpl.id} - {tpl.nama} ({tpl.jenis})
                                    </option>
                                ))}
                            </Form.Select>
                            <Form.Text className="text-muted">
                                Pilih template atau isi manual di bawah.
                            </Form.Text>
                        </Form.Group>

                        <hr />

                        <Form.Group>
                            <Form.Label>ID Pendapatan *</Form.Label>
                            <div className="input-group">
                                <Form.Control
                                    name="ID_Pendapatan"
                                    value={pendapatan.ID_Pendapatan || ""}
                                    onChange={handleInput}
                                    placeholder="PDN-XXX"
                                    isInvalid={!!errors.ID_Pendapatan}
                                />
                                <Button
                                    variant="outline-secondary"
                                    onClick={handleGenerateId}
                                    type="button"
                                    title="Generate ID Otomatis"
                                >
                                    <ArrowsClockwise /> Generate
                                </Button>
                            </div>
                            <Form.Control.Feedback type="invalid">
                                {errors.ID_Pendapatan}
                            </Form.Control.Feedback>
                            <Form.Text className="text-muted">
                                Format: PDN-Tahun-Angka (contoh: PDN-25-1234)
                            </Form.Text>
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
                                Masukkan nominal atau pilih dari saran.
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

export default PendapatanAddPage;
