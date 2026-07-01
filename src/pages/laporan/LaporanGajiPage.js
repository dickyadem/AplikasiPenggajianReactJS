import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavigationWidget from "../../widgets/commons/NavigationWidget";
import { DownloadSimple, FirstAidKit, FileText, Funnel, ChartBar } from "@phosphor-icons/react";
import ReportingService from "../../services/LaporanService";
import { Button, Card, Col, Form, Row, Spinner, Badge, Table } from "react-bootstrap";
import KaryawanService from "../../services/KaryawanService";
import GajiService from "../../services/GajiService";
import GajiDetailService from "../../services/GajiDetailService";
import { useToast } from "../../widgets/commons/ToastProvider";
import { helperReadableCurrency } from "../../utils/helpers";
import { exportToExcel } from "../../utils/exportToExcel";
import "./Laporan.css";

const LaporanPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { success, error } = useToast();
    const [daftarKaryawan, setDaftarKaryawan] = useState({});
    const [daftarGaji, setDaftarGaji] = useState({});
    const [daftarGajiDetail, setDaftarGajiDetail] = useState([]);
    const [loadingLaporan, setLoadingLaporan] = useState(false);

    const [showListPenggajian, setShowListPenggajian] = useState(false);
    const [showPotonganBPJS, setShowPotonganBPJS] = useState(false);
    const [showPotonganPPH, setShowPotonganPPH] = useState(false);

    const [filterTanggalFrom, setFilterTanggalFrom] = useState("");
    const [filterTanggalTo, setFilterTanggalTo] = useState("");
    const [filterJabatan, setFilterJabatan] = useState("");
    const [filterDivisi, setFilterDivisi] = useState("");

    // Auto-open report based on URL query parameter
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const filter = params.get('filter');
        const autoOpenReport = sessionStorage.getItem('autoOpenReport');
        
        if (filter || autoOpenReport) {
            const reportType = filter || autoOpenReport;
            
            if (reportType === 'bpjs') {
                setShowPotonganBPJS(true);
                setShowListPenggajian(false);
                setShowPotonganPPH(false);
            } else if (reportType === 'pph') {
                setShowPotonganPPH(true);
                setShowListPenggajian(false);
                setShowPotonganBPJS(false);
            } else {
                setShowListPenggajian(true);
                setShowPotonganBPJS(false);
                setShowPotonganPPH(false);
            }
            
            // Clear autoOpenReport
            sessionStorage.removeItem('autoOpenReport');
        }
    }, [location.search]);

    const formatRupiah = (value) => {
        if (!value && value !== 0) return "Rp 0";
        const numeric = parseFloat(value) || 0;
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(numeric);
    };

    // Load data
    useEffect(() => {
        setLoadingLaporan(true);
        
        // Load karyawan
        KaryawanService.list({ page: 1, limit: 1000 })
            .then((response) => {
                setDaftarKaryawan(response.data);
            })
            .catch((err) => {
                console.error("Error loading karyawan:", err);
            });

        // Load gaji
        GajiService.list({ page: 1, limit: 1000 })
            .then((response) => {
                setDaftarGaji(response.data);
            })
            .catch((err) => {
                console.error("Error loading gaji:", err);
            })
            .finally(() => {
                setLoadingLaporan(false);
            });
    }, []);

    // Load gaji detail for BPJS & PPh
    useEffect(() => {
        if (showPotonganBPJS || showPotonganPPH) {
            setLoadingLaporan(true);
            
            // Load all gaji data first
            GajiService.list({ page: 1, limit: 1000 })
                .then((response) => {
                    const gajiList = response.data.results || response.data || [];
                    
                    // Load detail for each gaji
                    const detailPromises = gajiList.map((gaji) => 
                        GajiDetailService.get(gaji.ID_Gaji)
                            .then((res) => res.data)
                            .catch(() => ({ ...gaji, itemsPotongan: [] }))
                    );
                    
                    return Promise.all(detailPromises);
                })
                .then((detailedData) => {
                    console.log("=== LOADED GAJI DETAIL ===", detailedData);
                    setDaftarGajiDetail(detailedData);
                })
                .catch((err) => {
                    console.error("Error loading gaji detail:", err);
                    error("Gagal memuat data laporan.");
                })
                .finally(() => {
                    setLoadingLaporan(false);
                });
        }
    }, [showPotonganBPJS, showPotonganPPH, error]);

    // Build filter payload from current filter state
    const buildFilterPayload = () => ({
        startDate: filterTanggalFrom || undefined,
        endDate: filterTanggalTo || undefined,
        terms: filterJabatan || filterDivisi || undefined,
    });

    // Export handlers
    const handleExportListGaji = async () => {
        try {
            await ReportingService.reportListGaji(buildFilterPayload());
            success('Laporan berhasil diexport!');
        } catch (err) {
            error('Gagal export laporan.');
        }
    };

    const handleExportBPJS = async () => {
        try {
            await ReportingService.reportBPJS(buildFilterPayload());
            success('Laporan BPJS berhasil diexport!');
        } catch (err) {
            error('Gagal export laporan BPJS.');
        }
    };

    const handleExportPPh = async () => {
        try {
            await ReportingService.reportPPh(buildFilterPayload());
            success('Laporan PPh berhasil diexport!');
        } catch (err) {
            error('Gagal export laporan PPh.');
        }
    };

    // Filter gaji data
    const filteredGaji = (daftarGaji.results || []).filter((gaji) => {
        if (filterTanggalFrom && gaji.Tanggal < filterTanggalFrom) return false;
        if (filterTanggalTo && gaji.Tanggal > filterTanggalTo) return false;

        const karyawan = daftarKaryawan.results?.find(
            (k) => k.ID_Karyawan === gaji.ID_Karyawan
        );

        if (filterJabatan && karyawan?.ID_Jabatan !== filterJabatan) return false;
        if (filterDivisi && karyawan?.Divisi !== filterDivisi) return false;

        return true;
    });

    // Get BPJS data - Filter semua potongan KECUALI PPh (ID berakhiran -02)
    const bpjsData = (daftarGajiDetail || []).filter((gajiDetail) => {
        console.log("=== CHECKING BPJS FOR ===", gajiDetail.ID_Gaji, gajiDetail.itemsPotongan);
        const itemsPotongan = gajiDetail.itemsPotongan || gajiDetail.ItemsPotongan || [];
        const hasBPJS = itemsPotongan.some(
            (item) => {
                const idPot = item.ID_Potongan || '';
                const namaPot = (item.Nama_Potongan || '').toLowerCase();
                const jumlahPot = parseInt(item.Jumlah_Potongan) || 0;
                
                // PPh biasanya ID berakhiran -02 atau mengandung "02"
                const isPPh = (
                    idPot === "02" ||
                    idPot === "PTG-02" ||
                    idPot.endsWith('-02') ||
                    idPot.includes('PPh') ||
                    namaPot.includes('pph') ||
                    namaPot.includes('pajak penghasilan')
                );
                
                // BPJS adalah semua potongan KECUALI PPh
                const isBPJS = !isPPh && jumlahPot > 0;
                
                console.log("=== CHECKING ITEM ===", { idPot, namaPot, jumlahPot, isPPh, isBPJS });
                return isBPJS;
            }
        );
        return hasBPJS;
    });

    // Get PPh data
    const pphData = (daftarGajiDetail || []).filter((gajiDetail) => {
        console.log("=== CHECKING PPH FOR ===", gajiDetail.ID_Gaji, gajiDetail.itemsPotongan);
        const itemsPotongan = gajiDetail.itemsPotongan || gajiDetail.ItemsPotongan || [];
        const hasPPh = itemsPotongan.some(
            (item) => {
                const idPot = item.ID_Potongan || '';
                const namaPot = (item.Nama_Potongan || '').toLowerCase();
                const jumlahPot = parseInt(item.Jumlah_Potongan) || 0;
                
                const isPPh = (
                    idPot === "02" ||
                    idPot === "PTG-02" ||
                    idPot.endsWith('-02') ||
                    namaPot.includes('pph') ||
                    namaPot.includes('pajak penghasilan')
                ) && jumlahPot > 0;
                
                console.log("=== CHECKING PPH ITEM ===", { idPot, namaPot, jumlahPot, isPPh });
                return isPPh;
            }
        );
        return hasPPh;
    });

    return (
        <NavigationWidget>
            <div className="laporan-page">
                {/* Filter Card */}
                <Card className="filter-card no-print">
                    <Card.Header>
                        <Funnel /> Filter Laporan
                    </Card.Header>
                    <Card.Body>
                        <Row>
                            <Col md={3}>
                                <Form.Group>
                                    <Form.Label className="form-label-modern">Dari Tanggal</Form.Label>
                                    <Form.Control
                                        type="date"
                                        className="form-control-modern"
                                        value={filterTanggalFrom}
                                        onChange={(e) => setFilterTanggalFrom(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group>
                                    <Form.Label className="form-label-modern">Sampai Tanggal</Form.Label>
                                    <Form.Control
                                        type="date"
                                        className="form-control-modern"
                                        value={filterTanggalTo}
                                        onChange={(e) => setFilterTanggalTo(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group>
                                    <Form.Label className="form-label-modern">Jabatan</Form.Label>
                                    <Form.Control
                                        type="text"
                                        className="form-control-modern"
                                        placeholder="Semua jabatan"
                                        value={filterJabatan}
                                        onChange={(e) => setFilterJabatan(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group>
                                    <Form.Label className="form-label-modern">Divisi</Form.Label>
                                    <Form.Control
                                        type="text"
                                        className="form-control-modern"
                                        placeholder="Semua divisi"
                                        value={filterDivisi}
                                        onChange={(e) => setFilterDivisi(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="mt-3">
                            <Col>
                                <Button
                                    className="action-btn action-btn-success"
                                    onClick={() => {
                                        setShowListPenggajian(true);
                                        setShowPotonganBPJS(false);
                                        setShowPotonganPPH(false);
                                    }}
                                >
                                    <FileText /> Laporan List Penggajian
                                </Button>
                                <Button
                                    className="action-btn action-btn-info"
                                    onClick={() => {
                                        setShowPotonganBPJS(true);
                                        setShowListPenggajian(false);
                                        setShowPotonganPPH(false);
                                    }}
                                >
                                    <FirstAidKit /> Laporan BPJS
                                </Button>
                                <Button
                                    className="action-btn action-btn-warning"
                                    onClick={() => {
                                        setShowPotonganPPH(true);
                                        setShowListPenggajian(false);
                                        setShowPotonganBPJS(false);
                                    }}
                                >
                                    <FileText /> Laporan PPh
                                </Button>
                                <Button
                                    className="action-btn action-btn-danger"
                                    onClick={handleExportListGaji}
                                >
                                    <DownloadSimple /> Export Excel
                                </Button>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                {/* Loading State */}
                {loadingLaporan && (
                    <div className="loading-container">
                        <Spinner animation="border" variant="primary" />
                        <p>Memuat data laporan...</p>
                    </div>
                )}

                {/* List Penggajian Report */}
                {showListPenggajian && !loadingLaporan && (
                    <Card className="report-card">
                        <Card.Header>
                            <FileText /> Laporan List Penggajian
                        </Card.Header>
                        <Card.Body>
                            <Table striped bordered hover responsive className="table-modern">
                                <thead>
                                    <tr>
                                        <th>ID Gaji</th>
                                        <th>Tanggal</th>
                                        <th>Nama Karyawan</th>
                                        <th>Divisi</th>
                                        <th>Total Pendapatan</th>
                                        <th>Total Potongan</th>
                                        <th>Gaji Bersih</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredGaji.length > 0 ? (
                                        filteredGaji.map((gaji, index) => {
                                            const karyawan = daftarKaryawan.results?.find(
                                                (k) => k.ID_Karyawan === gaji.ID_Karyawan
                                            );
                                            return (
                                                <tr key={index}>
                                                    <td>{gaji.ID_Gaji}</td>
                                                    <td>{gaji.Tanggal ? new Date(gaji.Tanggal).toLocaleDateString('id-ID') : '-'}</td>
                                                    <td>{karyawan?.Nama_Karyawan || "-"}</td>
                                                    <td>{karyawan?.Divisi || "-"}</td>
                                                    <td>{formatRupiah((gaji.TotalPendapatan || gaji.Total_Pendapatan || 0).toString())}</td>
                                                    <td>{formatRupiah((gaji.TotalPotongan || gaji.Total_Potongan || 0).toString())}</td>
                                                    <td>
                                                        <Badge bg="success">
                                                            {formatRupiah((gaji.GajiBersih || gaji.Gaji_Bersih || 0).toString())}
                                                        </Badge>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="text-center">
                                                Tidak ada data penggajian
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                )}

                {/* BPJS Report */}
                {showPotonganBPJS && !loadingLaporan && (
                    <Card className="report-card bpjs">
                        <Card.Header>
                            <FirstAidKit /> Laporan Potongan BPJS
                        </Card.Header>
                        <Card.Body>
                            <Table striped bordered hover responsive className="table-modern">
                                <thead>
                                    <tr>
                                        <th>ID Gaji</th>
                                        <th>Tanggal</th>
                                        <th>ID Karyawan</th>
                                        <th>Nama Karyawan</th>
                                        <th>Jumlah Potongan BPJS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bpjsData.length > 0 ? (
                                        bpjsData.map((gajiDetail, index) => {
                                            const karyawan = daftarKaryawan.results?.find(
                                                (k) => k.ID_Karyawan === gajiDetail.ID_Karyawan
                                            );
                                            const itemsPotongan = gajiDetail.itemsPotongan || [];
                                            
                                            // Get ALL non-PPh items (BPJS)
                                            const bpjsItems = itemsPotongan.filter((item) => {
                                                const idPot = item.ID_Potongan || '';
                                                const namaPot = (item.Nama_Potongan || '').toLowerCase();
                                                const jumlahPot = parseInt(item.Jumlah_Potongan) || 0;
                                                
                                                const isPPh = (
                                                    idPot === "02" ||
                                                    idPot === "PTG-02" ||
                                                    idPot.endsWith('-02') ||
                                                    namaPot.includes('pph')
                                                );
                                                
                                                return !isPPh && jumlahPot > 0;
                                            });
                                            
                                            // Sum all BPJS items
                                            const totalBPJS = bpjsItems.reduce((sum, item) => {
                                                return sum + (parseInt(item.Jumlah_Potongan) || 0);
                                            }, 0);

                                            return (
                                                <tr key={index}>
                                                    <td>{gajiDetail.ID_Gaji}</td>
                                                    <td>{gajiDetail.Tanggal ? new Date(gajiDetail.Tanggal).toLocaleDateString('id-ID') : '-'}</td>
                                                    <td>{gajiDetail.ID_Karyawan}</td>
                                                    <td>{karyawan?.Nama_Karyawan || "-"}</td>
                                                    <td className="text-success fw-bold">
                                                        {formatRupiah(totalBPJS.toString())}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center">
                                                Tidak ada data potongan BPJS
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                )}

                {/* PPh Report */}
                {showPotonganPPH && !loadingLaporan && (
                    <Card className="report-card pph">
                        <Card.Header>
                            <FileText /> Laporan Potongan PPh
                        </Card.Header>
                        <Card.Body>
                            <Table striped bordered hover responsive className="table-modern">
                                <thead>
                                    <tr>
                                        <th>ID Gaji</th>
                                        <th>Tanggal</th>
                                        <th>ID Karyawan</th>
                                        <th>Nama Karyawan</th>
                                        <th>Jumlah Potongan PPh</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pphData.length > 0 ? (
                                        pphData.map((gajiDetail, index) => {
                                            const karyawan = daftarKaryawan.results?.find(
                                                (k) => k.ID_Karyawan === gajiDetail.ID_Karyawan
                                            );
                                            const itemsPotongan = gajiDetail.itemsPotongan || [];
                                            
                                            // Get ALL PPh items
                                            const pphItems = itemsPotongan.filter((item) => {
                                                const idPot = item.ID_Potongan || '';
                                                const namaPot = (item.Nama_Potongan || '').toLowerCase();
                                                const jumlahPot = parseInt(item.Jumlah_Potongan) || 0;
                                                
                                                const isPPh = (
                                                    idPot === "02" ||
                                                    idPot === "PTG-02" ||
                                                    idPot.endsWith('-02') ||
                                                    namaPot.includes('pph')
                                                ) && jumlahPot > 0;
                                                
                                                return isPPh;
                                            });
                                            
                                            // Sum all PPh items
                                            const totalPPh = pphItems.reduce((sum, item) => {
                                                return sum + (parseInt(item.Jumlah_Potongan) || 0);
                                            }, 0);

                                            return (
                                                <tr key={index}>
                                                    <td>{gajiDetail.ID_Gaji}</td>
                                                    <td>{gajiDetail.Tanggal ? new Date(gajiDetail.Tanggal).toLocaleDateString('id-ID') : '-'}</td>
                                                    <td>{gajiDetail.ID_Karyawan}</td>
                                                    <td>{karyawan?.Nama_Karyawan || "-"}</td>
                                                    <td className="text-danger fw-bold">
                                                        {formatRupiah(totalPPh.toString())}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center">
                                                Tidak ada data potongan PPh
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                )}

                {/* Empty State */}
                {!showListPenggajian && !showPotonganBPJS && !showPotonganPPH && !loadingLaporan && (
                    <Card className="report-card">
                        <Card.Body className="empty-state">
                            <div className="empty-state-icon"><ChartBar weight="fill" /></div>
                            <h5 className="empty-state-title">Pilih Laporan</h5>
                            <p className="empty-state-text">
                                Silakan pilih jenis laporan yang ingin ditampilkan dari filter di atas
                            </p>
                        </Card.Body>
                    </Card>
                )}
            </div>
        </NavigationWidget>
    );
};

export default LaporanPage;
