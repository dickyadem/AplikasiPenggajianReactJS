import { Button, Card, Col, Form, InputGroup, Row, Table } from "react-bootstrap";
import NavigationWidget from "../../widgets/commons/NavigationWidget";
import { useNavigate } from "react-router-dom";
import { MdCancel } from "react-icons/md";
import { FaArrowLeft, FaSave, FaSearch, FaTrash } from "react-icons/fa";
import { useEffect, useState } from "react";
import GajiDetailService from "../../services/GajiDetailService";
import PendapatanService from "../../services/PendapatanService";
import PotonganService from "../../services/PotonganService";
import GajiService from "../../services/GajiService";
import KaryawanService from "../../services/KaryawanService";
import ProfilService from "../../services/ProfilService";

const initGaji = {
    ID_Gaji: "",
    Tanggal: new Date().toISOString().split("T")[0],
    email: "",
    ID_Karyawan: "",
    ID_Profil: "",
    Keterangan: "",
    itemsPendapatan: [],
    itemsPotongan: [],
};

const PenggajianInputPage = () => {
    const navigate = useNavigate();
    const [gaji, setGaji] = useState(initGaji);
    const [daftarPotongan, setDaftarPotongan] = useState([]);
    const [daftarPendapatan, setDaftarPendapatan] = useState([]);
    const [daftarKaryawan, setDaftarKaryawan] = useState([]);
    const [daftarProfil, setDaftarProfil] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filteredPendapatan, setFilteredPendapatan] = useState([]);
    const [filteredPotongan, setFilteredPotongan] = useState([]);
    const [totalPendapatan, setTotalPendapatan] = useState(0);
    const [totalPotongan, setTotalPotongan] = useState(0);
    const [gajiBersih, setGajiBersih] = useState(0);

    const [queryPendapatan, setQueryPendapatan] = useState({ page: 1, limit: 10 });
    const [paginatePendapatan, setPaginatePendapatan] = useState([]);

    const [paginatePotongan, setPaginatePotongan] = useState([]);
    const [queryPotongan, setQueryPotongan] = useState({ page: 1, limit: 10 });

    // Load data Karyawan, Profil, Pendapatan, Potongan
    useEffect(() => {
        KaryawanService.list({})
            .then((response) => {
                const data = response.data.results || response.data;
                setDaftarKaryawan(data);
            })
            .catch((error) => console.log(error));

        ProfilService.list({})
            .then((response) => {
                const data = response.data.results || response.data;
                setDaftarProfil(data);
            })
            .catch((error) => console.log(error));

        PotonganService.list({})
            .then((response) => {
                const data = response.data.results || response.data;
                setDaftarPotongan(data);
                if (response.headers.pagination) {
                    setPaginatePotongan(JSON.parse(response.headers.pagination));
                }
            })
            .catch((error) => console.log(error));

        PendapatanService.list({})
            .then((response) => {
                const data = response.data.results || response.data;
                setDaftarPendapatan(data);
                if (response.headers.pagination) {
                    setPaginatePendapatan(JSON.parse(response.headers.pagination));
                }
            })
            .catch((error) => console.log(error));
    }, [queryPendapatan, queryPotongan]);

    // Auto-fill nominal saat data Pendapatan/Potongan sudah diload
    useEffect(() => {
        console.log("=== AUTO-FILL CHECK ===");
        console.log("daftarPendapatan:", daftarPendapatan);
        console.log("daftarPotongan:", daftarPotongan);
        
        // Filter berdasarkan jabatan karyawan (jika sudah pilih karyawan)
        let employeeJabatan = null;
        if (gaji.ID_Karyawan) {
            const selectedKaryawan = daftarKaryawan.find(k => k.ID_Karyawan === gaji.ID_Karyawan);
            if (selectedKaryawan) {
                employeeJabatan = selectedKaryawan.ID_Jabatan;
                console.log("Karyawan Jabatan:", employeeJabatan);
            }
        }
        
        // Filter Pendapatan berdasarkan jabatan
        const filteredPend = employeeJabatan 
            ? daftarPendapatan.filter(p => !p.ID_Jabatan || p.ID_Jabatan === employeeJabatan)
            : daftarPendapatan;
        
        const filteredPot = employeeJabatan
            ? daftarPotongan.filter(p => !p.ID_Jabatan || p.ID_Jabatan === employeeJabatan)
            : daftarPotongan;
        
        setFilteredPendapatan(filteredPend);
        setFilteredPotongan(filteredPot);
        
        console.log("Filtered Pendapatan:", filteredPend);
        console.log("Filtered Potongan:", filteredPot);
        
        // Initialize items dengan data yang sudah difilter
        if (filteredPend.length > 0 && Object.keys(gaji.itemsPendapatan).length === 0) {
            const initialPendapatan = {};
            let hasChanged = false;

            filteredPend.forEach((item, index) => {
                const nominalValue = item.Nominal || item.Jumlah || 0;
                if (nominalValue > 0) {
                    hasChanged = true;
                }
                initialPendapatan[index] = {
                    ID_Pendapatan: item.ID_Pendapatan,
                    Nama_Pendapatan: item.Nama_Pendapatan,
                    Jenis: item.Jenis || "",
                    Jumlah_Pendapatan: nominalValue ? nominalValue.toString() : "",
                };
            });

            if (hasChanged) {
                setGaji((prev) => ({ ...prev, itemsPendapatan: initialPendapatan }));
            }
        }

        if (filteredPot.length > 0 && Object.keys(gaji.itemsPotongan).length === 0) {
            const initialPotongan = {};
            let hasChanged = false;

            filteredPot.forEach((item, index) => {
                const nominalValue = item.Nominal || item.Jumlah || 0;
                if (nominalValue > 0) {
                    hasChanged = true;
                }
                initialPotongan[index] = {
                    ID_Potongan: item.ID_Potongan,
                    Nama_Potongan: item.Nama_Potongan,
                    Jenis: item.Jenis || "",
                    Jumlah_Potongan: nominalValue ? nominalValue.toString() : "",
                };
            });

            if (hasChanged) {
                setGaji((prev) => ({ ...prev, itemsPotongan: initialPotongan }));
            }
        }
    }, [daftarPendapatan, daftarPotongan, gaji.ID_Karyawan, daftarKaryawan]);

    // Generate ID Gaji otomatis
    const generateGajiId = () => {
        const year = new Date().getFullYear().toString().slice(-2);
        const month = (new Date().getMonth() + 1).toString().padStart(2, "0");
        const randomNum = Math.floor(Math.random() * 9000) + 1000;
        return `GJI-${year}${month}-${randomNum}`;
    };

    const handleGenerateId = () => {
        const newId = generateGajiId();
        setGaji((values) => ({ ...values, ID_Gaji: newId }));
    };

    const handleInput = (e) => {
        let name = e.target.name;
        let value = e.target.value;

        setGaji((values) => ({ ...values, [name]: value }));

        // Auto-fill email saat pilih karyawan
        if (name === "ID_Karyawan") {
            const selectedKaryawan = daftarKaryawan.find((k) => k.ID_Karyawan === value);
            if (selectedKaryawan) {
                // Cek apakah karyawan punya field email
                const emailKaryawan = selectedKaryawan.email || selectedKaryawan.Email || "";
                console.log("Selected Karyawan:", selectedKaryawan);
                console.log("Email found:", emailKaryawan);
                
                // Reset items saat ganti karyawan
                setGaji((prev) => ({
                    ...prev,
                    ID_Karyawan: value,
                    email: emailKaryawan,
                    itemsPendapatan: {},
                    itemsPotongan: {},
                }));
            }
        }
    };
    
    const handleInputPotongan = (e, index) => {
        const { name, value } = e.target;
        const cleanValue = value.replace(/[^0-9]/g, "");
        setGaji((prevGaji) => ({
            ...prevGaji,
            itemsPotongan: {
                ...prevGaji.itemsPotongan,
                [index]: {
                    ...prevGaji.itemsPotongan[index],
                    [name]: cleanValue,
                    ID_Potongan: filteredPotongan[index].ID_Potongan,
                    Nama_Potongan: filteredPotongan[index].Nama_Potongan,
                },
            },
        }));
    };

    const handleInputPendapatan = (e, index) => {
        const { name, value } = e.target;
        const cleanValue = value.replace(/[^0-9]/g, "");
        setGaji((prevGaji) => ({
            ...prevGaji,
            itemsPendapatan: {
                ...prevGaji.itemsPendapatan,
                [index]: {
                    ...prevGaji.itemsPendapatan[index],
                    [name]: cleanValue,
                    ID_Pendapatan: filteredPendapatan[index].ID_Pendapatan,
                    Nama_Pendapatan: filteredPendapatan[index].Nama_Pendapatan,
                },
            },
        }));
    };

    // Format Rupiah
    const formatRupiah = (value) => {
        if (!value) return "";
        const numeric = value.toString().replace(/[^0-9]/g, "");
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(numeric);
    };

    // Hitung Total saat items berubah
    useEffect(() => {
        const totalPend = Object.values(gaji.itemsPendapatan).reduce((sum, item) => {
            return sum + (parseInt(item.Jumlah_Pendapatan) || 0);
        }, 0);
        
        const totalPot = Object.values(gaji.itemsPotongan).reduce((sum, item) => {
            return sum + (parseInt(item.Jumlah_Potongan) || 0);
        }, 0);
        
        setTotalPendapatan(totalPend);
        setTotalPotongan(totalPot);
        setGajiBersih(totalPend - totalPot);
    }, [gaji.itemsPendapatan, gaji.itemsPotongan]);






    const handleGajiServiceCreate = () => {
        // Validasi
        if (!gaji.ID_Gaji) {
            alert("ID Gaji harus diisi!");
            return;
        }
        if (!gaji.ID_Karyawan) {
            alert("ID Karyawan harus dipilih!");
            return;
        }
        if (!gaji.Tanggal) {
            alert("Tanggal harus diisi!");
            return;
        }

        const { itemsPendapatan, itemsPotongan, ...gajiData } = gaji;

        const formattedItemsPendapatan = Object.values(itemsPendapatan).filter(item => item.Jumlah_Pendapatan);
        const formattedItemsPotongan = Object.values(itemsPotongan).filter(item => item.Jumlah_Potongan);

        const updatedGaji = {
            ...gajiData,
            itemsPendapatan: formattedItemsPendapatan,
            itemsPotongan: formattedItemsPotongan,
            TotalPendapatan: totalPendapatan,
            TotalPotongan: totalPotongan,
            GajiBersih: gajiBersih,
        };

        setLoading(true);
        GajiService.create(updatedGaji)
            .then((response) => {
                alert("Gaji berhasil ditambahkan.");
                navigate("/penggajian");
            })
            .catch((error) => {
                const errorMsg = error.response?.data?.message || "Gagal menambahkan gaji.";
                alert(errorMsg);
            })
            .finally(() => {
                setLoading(false);
            });
    };





    return (
        <NavigationWidget
            actionTop={
                <>
                    <Button className="me-2" variant="secondary" onClick={() => navigate(-1)} disabled={loading}>
                        <FaArrowLeft /> Kembali
                    </Button>
                    <Button onClick={handleGajiServiceCreate} disabled={loading}>
                        <FaSave /> {loading ? "Menyimpan..." : "Simpan"}
                    </Button>
                </>
            }
        >
            <Card style={{ marginBottom: "20px" }}>
                <Card.Header>
                    <h5>Data Utama Penggajian</h5>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>ID Gaji *</Form.Label>
                                <div className="input-group">
                                    <Form.Control
                                        name="ID_Gaji"
                                        value={gaji.ID_Gaji || ""}
                                        onChange={handleInput}
                                        placeholder="GJI-YYMM-XXXX"
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
                                <Form.Text className="text-muted">
                                    Format: GJI-TahunBulan-Angka (contoh: GJI-2602-1234)
                                </Form.Text>
                            </Form.Group>
                            <Form.Group className="mt-3">
                                <Form.Label>Tanggal Entry *</Form.Label>
                                <Form.Control
                                    name="Tanggal"
                                    value={gaji.Tanggal || ""}
                                    onChange={handleInput}
                                    type="date"
                                />
                            </Form.Group>
                            <Form.Group className="mt-3">
                                <Form.Label>ID Karyawan *</Form.Label>
                                <Form.Select
                                    name="ID_Karyawan"
                                    value={gaji.ID_Karyawan || ""}
                                    onChange={handleInput}
                                >
                                    <option value="">-- Pilih Karyawan --</option>
                                    {daftarKaryawan.map((karyawan) => (
                                        <option key={karyawan.ID_Karyawan} value={karyawan.ID_Karyawan}>
                                            {karyawan.ID_Karyawan} - {karyawan.Nama_Karyawan}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mt-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    name="email"
                                    value={gaji.email || ""}
                                    onChange={handleInput}
                                    type="email"
                                    placeholder="Email otomatis terisi jika ada, atau isi manual"
                                />
                                <Form.Text className="text-muted">
                                    Email dapat diisi manual jika tidak tersedia di data karyawan.
                                </Form.Text>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>ID Profil Perusahaan *</Form.Label>
                                <Form.Select
                                    name="ID_Profil"
                                    value={gaji.ID_Profil || ""}
                                    onChange={handleInput}
                                >
                                    <option value="">-- Pilih Profil Perusahaan --</option>
                                    {daftarProfil.map((profil) => (
                                        <option key={profil.ID_Profil} value={profil.ID_Profil}>
                                            {profil.ID_Profil} - {profil.Nama}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mt-3">
                                <Form.Label>Keterangan</Form.Label>
                                <Form.Control
                                    name="Keterangan"
                                    value={gaji.Keterangan || ""}
                                    onChange={handleInput}
                                    as="textarea"
                                    rows={3}
                                    placeholder="Catatan tambahan (opsional)..."
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
            <Card style={{ marginBottom: "20px" }}>
                <Card.Header>
                    <h5>Accounting - Pendapatan</h5>
                </Card.Header>
                <Card.Body>
                    <Table responsive bordered hover>
                        <thead>
                            <tr>
                                <th style={{ width: "20%" }}>ID Pendapatan</th>
                                <th style={{ width: "40%" }}>Nama Pendapatan</th>
                                <th style={{ width: "40%" }}>Jumlah (Rp)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPendapatan.length > 0 ? (
                                filteredPendapatan.map((pendapatan, index) => (
                                    <tr key={index}>
                                        <td>{pendapatan.ID_Pendapatan}</td>
                                        <td>{pendapatan.Nama_Pendapatan}</td>
                                        <td>
                                            <Form.Control
                                                name="Jumlah_Pendapatan"
                                                value={gaji.itemsPendapatan[index]?.Jumlah_Pendapatan || ""}
                                                onChange={(e) => handleInputPendapatan(e, index)}
                                                placeholder="0"
                                                type="text"
                                            />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="text-center">
                                        {gaji.ID_Karyawan 
                                            ? "Tidak ada pendapatan untuk jabatan ini."
                                            : "Pilih karyawan untuk melihat pendapatan yang sesuai."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            <Card style={{ marginBottom: "20px" }}>
                <Card.Header>
                    <h5>Accounting - Potongan</h5>
                </Card.Header>
                <Card.Body>
                    <Table responsive bordered hover>
                        <thead>
                            <tr>
                                <th style={{ width: "20%" }}>ID Potongan</th>
                                <th style={{ width: "40%" }}>Nama Potongan</th>
                                <th style={{ width: "40%" }}>Jumlah (Rp)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPotongan.length > 0 ? (
                                filteredPotongan.map((potongan, index) => (
                                    <tr key={index}>
                                        <td>{potongan.ID_Potongan}</td>
                                        <td>{potongan.Nama_Potongan}</td>
                                        <td>
                                            <Form.Control
                                                name="Jumlah_Potongan"
                                                value={gaji.itemsPotongan[index]?.Jumlah_Potongan || ""}
                                                onChange={(e) => handleInputPotongan(e, index)}
                                                placeholder="0"
                                                type="text"
                                            />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="text-center">
                                        {gaji.ID_Karyawan 
                                            ? "Tidak ada potongan untuk jabatan ini."
                                            : "Pilih karyawan untuk melihat potongan yang sesuai."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* Summary Section */}
            <Card>
                <Card.Header className="bg-primary text-white">
                    <h5 className="mb-0">💰 Ringkasan Gaji</h5>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={4}>
                            <div className="p-3 border rounded bg-success bg-opacity-10">
                                <h6 className="text-success">Total Pendapatan</h6>
                                <h4 className="text-success mb-0">
                                    {formatRupiah(totalPendapatan.toString())}
                                </h4>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="p-3 border rounded bg-danger bg-opacity-10">
                                <h6 className="text-danger">Total Potongan</h6>
                                <h4 className="text-danger mb-0">
                                    {formatRupiah(totalPotongan.toString())}
                                </h4>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="p-3 border rounded bg-primary bg-opacity-10">
                                <h6 className="text-primary">Gaji Bersih</h6>
                                <h4 className="text-primary mb-0">
                                    {formatRupiah(gajiBersih.toString())}
                                </h4>
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </NavigationWidget>
    );
};

export default PenggajianInputPage;
