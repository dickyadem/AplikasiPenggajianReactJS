import { Button, Card, Form } from "react-bootstrap";
import NavigationWidget from "../../widgets/commons/NavigationWidget";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import PotonganService from "../../services/PotonganService";
import JabatanService from "../../services/JabatanService";
import useToast from "../../hooks/useToast";
import ToastWidget from "../../widgets/commons/ToastWidget";
import LoadingOverlay from "../../widgets/commons/LoadingOverlay";

const PotonganAddPage = () => {
    const navigate = useNavigate();
    const { toast, hideToast, success, error } = useToast();
    const [potongan, setPotongan] = useState({
        ID_Potongan: "",
        Nama_Potongan: "",
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
        { value: 50000, label: "Rp 50.000" },
        { value: 100000, label: "Rp 100.000" },
        { value: 250000, label: "Rp 250.000" },
        { value: 500000, label: "Rp 500.000" },
        { value: 1000000, label: "Rp 1.000.000" },
        { value: 1500000, label: "Rp 1.500.000" },
        { value: 2000000, label: "Rp 2.000.000" },
        { value: 3000000, label: "Rp 3.000.000" },
        { value: 5000000, label: "Rp 5.000.000" },
    ];

    // Template potongan umum
    const templatePotongan = [
        { id: "PTG001", nama: "BPJS Kesehatan", jenis: "Tetap" },
        { id: "PTG002", nama: "BPJS Ketenagakerjaan", jenis: "Tetap" },
        { id: "PTG003", nama: "Iuran Koperasi", jenis: "Tetap" },
        { id: "PTG004", nama: "Iuran Pensiun", jenis: "Tetap" },
        { id: "PTG005", nama: "Kasbon/Karyawan", jenis: "Tidak Tetap" },
        { id: "PTG006", nama: "Denda Keterlambatan", jenis: "Tidak Tetap" },
        { id: "PTG007", nama: "Potongan Absensi", jenis: "Tidak Tetap" },
        { id: "PTG008", nama: "Pinjaman Karyawan", jenis: "Tidak Tetap" },
    ];

    const handleInput = (e) => {
        let name = e.target.name;
        let value = e.target.value;

        setPotongan((values) => ({ ...values, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const handleTemplateChange = (e) => {
        const selectedId = e.target.value;
        const selected = templatePotongan.find((t) => t.id === selectedId);
        if (selected) {
            setPotongan({
                ...potongan,
                ID_Potongan: selected.id,
                Nama_Potongan: selected.nama,
                Jenis: selected.jenis,
            });
        }
    };

    const handleGenerateId = () => {
        const year = new Date().getFullYear().toString().slice(-2);
        const randomNum = Math.floor(Math.random() * 9000) + 1000;
        const newId = `PTG-${year}-${randomNum}`;
        setPotongan((values) => ({ ...values, ID_Potongan: newId }));
    };

    const formatRupiah = (value) => {
        const numeric = value.replace(/[^0-9]/g, "");
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(numeric);
    };

    const handleNominalChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, "");
        setPotongan((values) => ({ ...values, Nominal: value }));
        if (errors.Nominal) {
            setErrors((prev) => ({ ...prev, Nominal: null }));
        }
    };

    const handleNominalPresetSelect = (value) => {
        setPotongan((values) => ({ ...values, Nominal: value.toString() }));
        setShowNominalDropdown(false);
        if (errors.Nominal) {
            setErrors((prev) => ({ ...prev, Nominal: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!potongan.ID_Potongan || !potongan.ID_Potongan.trim()) {
            newErrors.ID_Potongan = "ID Potongan harus diisi";
        }

        if (!potongan.Nama_Potongan || !potongan.Nama_Potongan.trim()) {
            newErrors.Nama_Potongan = "Nama Potongan harus diisi";
        } else if (potongan.Nama_Potongan.length < 3) {
            newErrors.Nama_Potongan = "Nama Potongan minimal 3 karakter";
        }

        if (potongan.Nominal && (isNaN(potongan.Nominal) || parseInt(potongan.Nominal) <= 0)) {
            newErrors.Nominal = "Nominal harus angka > 0";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePotonganServiceCreate = () => {
        if (!validateForm()) {
            error("Mohon lengkapi data yang belum terisi");
            return;
        }

        // Konfirmasi jika nominal kosong
        if (!potongan.Nominal || parseInt(potongan.Nominal) === 0) {
            const confirmSave = window.confirm(
                "Nominal masih kosong atau 0. Yakin ingin menyimpan tanpa nominal?"
            );
            if (!confirmSave) {
                return;
            }
        }

        const dataToSend = {
            ID_Potongan: potongan.ID_Potongan,
            Nama_Potongan: potongan.Nama_Potongan,
            ID_Jabatan: potongan.ID_Jabatan || null,
            Nominal: potongan.Nominal ? parseInt(potongan.Nominal) : 0,
            Keterangan: potongan.Keterangan,
        };

        console.log("Sending data:", dataToSend);

        setLoading(true);
        PotonganService.create(dataToSend)
            .then((response) => {
                success("Potongan berhasil ditambahkan.");
                setTimeout(() => navigate("/potongan"), 1000);
            })
            .catch((err) => {
                const errorMsg = err.response?.data?.message || "Gagal menambahkan potongan.";
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
                            <FaArrowLeft /> Kembali
                        </Button>
                        <Button onClick={handlePotonganServiceCreate} disabled={loading}>
                            <FaSave /> {loading ? "Menyimpan..." : "Simpan"}
                        </Button>
                    </>
                }
            >
                <Card>
                    <Card.Header>
                        <h5>Tambah Potongan</h5>
                    </Card.Header>
                    <Card.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Template Potongan (Opsional)</Form.Label>
                            <Form.Select onChange={handleTemplateChange} value="">
                                <option value="">-- Pilih template potongan --</option>
                                {templatePotongan.map((tpl) => (
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
                            <Form.Label>ID Potongan *</Form.Label>
                            <div className="input-group">
                                <Form.Control
                                    name="ID_Potongan"
                                    value={potongan.ID_Potongan || ""}
                                    onChange={handleInput}
                                    placeholder="PTG-XXX"
                                    isInvalid={!!errors.ID_Potongan}
                                />
                                <Button
                                    variant="outline-secondary"
                                    onClick={handleGenerateId}
                                    type="button"
                                    title="Generate ID Otomatis"
                                >
                                    🔄 Generate
                                </Button>
                            </div>
                            <Form.Control.Feedback type="invalid">
                                {errors.ID_Potongan}
                            </Form.Control.Feedback>
                            <Form.Text className="text-muted">
                                Format: PTG-Tahun-Angka (contoh: PTG-25-1234)
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mt-3">
                            <Form.Label>Nama Potongan *</Form.Label>
                            <Form.Control
                                name="Nama_Potongan"
                                value={potongan.Nama_Potongan || ""}
                                onChange={handleInput}
                                placeholder="Contoh: BPJS Kesehatan"
                                isInvalid={!!errors.Nama_Potongan}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.Nama_Potongan}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mt-3">
                            <Form.Label>Jabatan (Opsional)</Form.Label>
                            <Form.Select
                                name="ID_Jabatan"
                                value={potongan.ID_Jabatan || ""}
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
                                    value={potongan.Nominal ? formatRupiah(potongan.Nominal) : ""}
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
                                value={potongan.Keterangan || ""}
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

export default PotonganAddPage;
