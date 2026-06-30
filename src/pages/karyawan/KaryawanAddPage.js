import { Button, Card, Form } from "react-bootstrap";
import NavigationWidget from "../../widgets/commons/NavigationWidget";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import KaryawanService from "../../services/KaryawanService";
import GolonganService from "../../services/GolonganService";
import JabatanService from "../../services/JabatanService";
import useToast from "../../hooks/useToast";
import ToastWidget from "../../widgets/commons/ToastWidget";
import LoadingOverlay from "../../widgets/commons/LoadingOverlay";

const KaryawanAddPage = () => {
    const navigate = useNavigate();
    const { toast, hideToast, success, error } = useToast();
    const [karyawan, setKaryawan] = useState({});
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [daftarGolongan, setDaftarGolongan] = useState([]);
    const [daftarJabatan, setDaftarJabatan] = useState([]);

    // Preset Divisi
    const presetDivisi = [
        { code: "IT", name: "Information Technology" },
        { code: "HR", name: "Human Resources" },
        { code: "FN", name: "Finance" },
        { code: "MK", name: "Marketing" },
        { code: "OP", name: "Operations" },
        { code: "GD", name: "General Affairs" },
    ];

    // Load data Golongan dan Jabatan saat component mount
    useEffect(() => {
        GolonganService.list({})
            .then((response) => {
                const data = response.data.results || response.data;
                setDaftarGolongan(data);
            })
            .catch((err) => console.log(err));

        JabatanService.list({})
            .then((response) => {
                const data = response.data.results || response.data;
                setDaftarJabatan(data);
            })
            .catch((err) => console.log(err));
    }, []);

    // Generate ID Karyawan otomatis
    const generateKaryawanId = () => {
        const year = new Date().getFullYear().toString().slice(-2); // 2 digit tahun
        const month = (new Date().getMonth() + 1).toString().padStart(2, "0"); // 2 digit bulan
        
        // Ambil kode divisi (jika ada)
        let divCode = "XX";
        if (karyawan.Divisi) {
            const foundDiv = presetDivisi.find(d => d.code === karyawan.Divisi);
            if (foundDiv) {
                divCode = foundDiv.code;
            } else {
                // Ambil 2 huruf pertama dari divisi
                divCode = karyawan.Divisi.substring(0, 2).toUpperCase();
            }
        }
        
        // Random 4 digit untuk unique
        const randomNum = Math.floor(Math.random() * 9000) + 1000;
        
        // Format: EMP-YYMM-DIV-XXXX
        return `EMP-${year}${month}-${divCode}-${randomNum}`;
    };

    const handleInput = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        setKaryawan((values) => ({ ...values, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const handleDivisiChange = (e) => {
        const selectedDivisi = e.target.value;
        setKaryawan((values) => ({ ...values, Divisi: selectedDivisi }));
        if (errors.Divisi) {
            setErrors((prev) => ({ ...prev, Divisi: null }));
        }
    };

    const handleGenerateId = () => {
        const newId = generateKaryawanId();
        setKaryawan((values) => ({ ...values, ID_Karyawan: newId }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!karyawan.ID_Karyawan || !karyawan.ID_Karyawan.trim()) {
            newErrors.ID_Karyawan = "ID Karyawan harus diisi";
        }
        if (!karyawan.Nama_Karyawan || !karyawan.Nama_Karyawan.trim()) {
            newErrors.Nama_Karyawan = "Nama Karyawan harus diisi";
        }
        if (!karyawan.email || !karyawan.email.trim()) {
            newErrors.email = "Email harus diisi";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(karyawan.email)) {
            newErrors.email = "Format email tidak valid";
        }
        if (!karyawan.ID_Golongan || !karyawan.ID_Golongan.trim()) {
            newErrors.ID_Golongan = "ID Golongan harus diisi";
        }
        if (!karyawan.ID_Jabatan || !karyawan.ID_Jabatan.trim()) {
            newErrors.ID_Jabatan = "ID Jabatan harus diisi";
        }
        if (!karyawan.Divisi || !karyawan.Divisi.trim()) {
            newErrors.Divisi = "Divisi harus diisi";
        }
        if (!karyawan.Status_Pernikahan) {
            newErrors.Status_Pernikahan = "Status Pernikahan harus diisi";
        }
        if (karyawan.Jumlah_Anak !== undefined && karyawan.Jumlah_Anak !== "") {
            const jumlahAnak = parseInt(karyawan.Jumlah_Anak);
            if (isNaN(jumlahAnak) || jumlahAnak < 0) {
                newErrors.Jumlah_Anak = "Jumlah Anak harus angka >= 0";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleKaryawanServiceCreate = () => {
        if (!validateForm()) {
            error("Mohon lengkapi data yang belum terisi");
            return;
        }

        setLoading(true);
        KaryawanService.create(karyawan)
            .then((response) => {
                success("Karyawan berhasil ditambahkan.");
                setTimeout(() => navigate("/karyawan"), 1000);
            })
            .catch((err) => {
                const errorMsg = err.response?.data?.message || "Gagal menambahkan karyawan.";
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
                        <Button onClick={handleKaryawanServiceCreate} disabled={loading}>
                            <FaSave /> {loading ? "Menyimpan..." : "Simpan"}
                        </Button>
                    </>
                }
            >
                <Card>
                    <Card.Header>
                        <h5>Tambah Karyawan</h5>
                    </Card.Header>
                    <Card.Body>
                        <Form.Group>
                            <Form.Label>ID Karyawan</Form.Label>
                            <div className="input-group">
                                <Form.Control
                                    name="ID_Karyawan"
                                    value={karyawan.ID_Karyawan || ""}
                                    onChange={handleInput}
                                    isInvalid={!!errors.ID_Karyawan}
                                    placeholder="EMP-YYMM-DIV-XXXX"
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
                                {errors.ID_Karyawan}
                            </Form.Control.Feedback>
                            <Form.Text className="text-muted">
                                Format: EMP-TahunBulan-Divisi-AngkaAcak (contoh: EMP-2602-IT-1234)
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className="mt-3">
                            <Form.Label>Nama Karyawan</Form.Label>
                            <Form.Control
                                name="Nama_Karyawan"
                                value={karyawan.Nama_Karyawan || ""}
                                onChange={handleInput}
                                placeholder="Contoh: John Doe"
                                isInvalid={!!errors.Nama_Karyawan}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.Nama_Karyawan}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mt-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                name="email"
                                value={karyawan.email || ""}
                                onChange={handleInput}
                                placeholder="Contoh: john.doe@example.com"
                                isInvalid={!!errors.email}
                                type="email"
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.email}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mt-3">
                            <Form.Label>ID Golongan</Form.Label>
                            <Form.Select
                                name="ID_Golongan"
                                value={karyawan.ID_Golongan || ""}
                                onChange={handleInput}
                                isInvalid={!!errors.ID_Golongan}
                            >
                                <option value="">-- Pilih Golongan --</option>
                                {daftarGolongan.map((gol) => (
                                    <option key={gol.ID_Golongan} value={gol.ID_Golongan}>
                                        {gol.ID_Golongan} - {gol.Nama_Golongan}
                                    </option>
                                ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                {errors.ID_Golongan}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mt-3">
                            <Form.Label>ID Jabatan</Form.Label>
                            <Form.Select
                                name="ID_Jabatan"
                                value={karyawan.ID_Jabatan || ""}
                                onChange={handleInput}
                                isInvalid={!!errors.ID_Jabatan}
                            >
                                <option value="">-- Pilih Jabatan --</option>
                                {daftarJabatan.map((jab) => (
                                    <option key={jab.ID_Jabatan} value={jab.ID_Jabatan}>
                                        {jab.ID_Jabatan} - {jab.Nama_Jabatan}
                                    </option>
                                ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                {errors.ID_Jabatan}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mt-3">
                            <Form.Label>Divisi</Form.Label>
                            <Form.Select
                                name="Divisi"
                                value={karyawan.Divisi || ""}
                                onChange={handleDivisiChange}
                                isInvalid={!!errors.Divisi}
                            >
                                <option value="">-- Pilih Divisi --</option>
                                {presetDivisi.map((div) => (
                                    <option key={div.code} value={div.code}>
                                        {div.code} - {div.name}
                                    </option>
                                ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                {errors.Divisi}
                            </Form.Control.Feedback>
                            <Form.Text className="text-muted">
                                Pilih divisi untuk generate ID yang sesuai.
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className="mt-3">
                            <Form.Label>Status Pernikahan</Form.Label>
                            <Form.Select
                                name="Status_Pernikahan"
                                value={karyawan.Status_Pernikahan || ""}
                                onChange={handleInput}
                                isInvalid={!!errors.Status_Pernikahan}
                            >
                                <option value="">-- Pilih Status --</option>
                                <option value="Belum Menikah">Belum Menikah</option>
                                <option value="Menikah">Menikah</option>
                                <option value="Cerai">Cerai</option>
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                {errors.Status_Pernikahan}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mt-3">
                            <Form.Label>Jumlah Anak</Form.Label>
                            <Form.Control
                                name="Jumlah_Anak"
                                value={karyawan.Jumlah_Anak || ""}
                                onChange={handleInput}
                                isInvalid={!!errors.Jumlah_Anak}
                                type="number"
                                min="0"
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.Jumlah_Anak}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mt-3">
                            <Form.Label>Gaji Pokok (Rp)</Form.Label>
                            <Form.Control
                                name="Gaji_Pokok"
                                value={karyawan.Gaji_Pokok || ""}
                                onChange={handleInput}
                                isInvalid={!!errors.Gaji_Pokok}
                                type="number"
                                min="0"
                                placeholder="Contoh: 5000000"
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.Gaji_Pokok}
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

export default KaryawanAddPage;
