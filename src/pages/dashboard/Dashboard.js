import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col, Spinner, Badge, ProgressBar, Button } from "react-bootstrap";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import NavigationWidget from "../../widgets/commons/NavigationWidget";
import KaryawanService from "../../services/KaryawanService";
import GajiService from "../../services/GajiService";
import {
    FaUsers, FaMoneyBillWave, FaChartLine, FaCalendarAlt,
    FaUserPlus, FaArrowUp, FaArrowDown, FaClock, FaCheckCircle,
    FaFileAlt, FaWallet
} from "react-icons/fa";
import "./Dashboard.css";

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const Dashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState({
        totalKaryawan: 0,
        totalGaji: 0,
        karyawanBaru: 0,
        penggajianBulanIni: 0,
        totalPokok: 0,
        totalTunjangan: 0,
        totalPotongan: 0,
        totalBPJS: 0,
        totalPPh: 0,
        periodeAktif: '',
        chartData: [],
        departmentData: [],
        recentActivities: [],
        complianceStats: {
            bpjs: 0,
            pph: 0,
            onTime: 0
        }
    });

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            // Load karyawan
            const karyawanRes = await KaryawanService.list({ page: 1, limit: 1000 });
            const karyawanData = karyawanRes.data.results || karyawanRes.data || [];

            // Load gaji
            const gajiRes = await GajiService.list({ page: 1, limit: 1000 });
            const gajiData = gajiRes.data.results || gajiRes.data || [];

            // Calculate statistics
            const totalKaryawan = karyawanData.length;
            const totalGaji = gajiData.reduce((sum, g) => sum + (g.Gaji_Bersih || 0), 0);
            const totalPokok = gajiData.reduce((sum, g) => sum + (g.Total_Pendapatan || g.TotalPendapatan || 0), 0);
            const totalPotongan = gajiData.reduce((sum, g) => sum + (g.Total_Potongan || g.TotalPotongan || 0), 0);
            const totalTunjangan = totalPokok - totalGaji - totalPotongan;
            
            // Calculate BPJS & PPh from itemsPotongan
            let totalBPJS = 0;
            let totalPPh = 0;
            
            gajiData.forEach(g => {
                if (g.itemsPotongan && Array.isArray(g.itemsPotongan)) {
                    g.itemsPotongan.forEach(item => {
                        const idPot = item.ID_Potongan || '';
                        const jumlah = parseInt(item.Jumlah_Potongan) || 0;
                        
                        if (idPot === '01' || idPot === 'PTG001' || idPot.includes('BPJS')) {
                            totalBPJS += jumlah;
                        }
                        if (idPot === '02' || idPot.endsWith('-02') || idPot.includes('PPh')) {
                            totalPPh += jumlah;
                        }
                    });
                }
            });
            
            // Karyawan baru (30 hari terakhir)
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            const karyawanBaru = karyawanData.filter(k => {
                const createDate = new Date(k.createdAt || Date.now());
                return createDate >= thirtyDaysAgo;
            }).length;

            // Penggajian bulan ini
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();
            const penggajianBulanIni = gajiData.filter(g => {
                const tanggal = new Date(g.Tanggal);
                return tanggal.getMonth() === currentMonth && tanggal.getFullYear() === currentYear;
            }).length;

            // Periode aktif
            const periodeAktif = new Date().toLocaleDateString('id-ID', {
                month: 'long',
                year: 'numeric'
            });

            // Compliance stats
            const complianceStats = {
                bpjs: Math.round((totalBPJS / totalGaji) * 100) || 0,
                pph: Math.round((totalPPh / totalGaji) * 100) || 0,
                onTime: penggajianBulanIni > 0 ? 100 : 0
            };

            // Chart data - 6 bulan terakhir
            const last6Months = [];
            for (let i = 5; i >= 0; i--) {
                const date = new Date();
                date.setMonth(date.getMonth() - i);
                last6Months.push({
                    month: date.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' }),
                    monthIndex: date.getMonth(),
                    year: date.getFullYear()
                });
            }

            const chartData = last6Months.map(period => {
                const monthGaji = gajiData.filter(g => {
                    const tanggal = new Date(g.Tanggal);
                    return tanggal.getMonth() === period.monthIndex && tanggal.getFullYear() === period.year;
                });
                const total = monthGaji.reduce((sum, g) => sum + (g.Gaji_Bersih || 0), 0);
                return total;
            });

            // Department data
            const departmentCount = {};
            karyawanData.forEach(k => {
                const divisi = k.Divisi || 'Lainnya';
                departmentCount[divisi] = (departmentCount[divisi] || 0) + 1;
            });

            const departmentData = {
                labels: Object.keys(departmentCount),
                values: Object.values(departmentCount)
            };

            // Recent activities
            const recentActivities = gajiData
                .sort((a, b) => new Date(b.Tanggal) - new Date(a.Tanggal))
                .slice(0, 5)
                .map(g => ({
                    id: g.ID_Gaji,
                    type: 'penggajian',
                    title: `Penggajian ${g.ID_Gaji}`,
                    date: new Date(g.Tanggal).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                    }),
                    amount: g.Gaji_Bersih || 0
                }));

            setDashboardData({
                totalKaryawan,
                totalGaji,
                karyawanBaru,
                penggajianBulanIni,
                totalPokok,
                totalTunjangan,
                totalPotongan,
                totalBPJS,
                totalPPh,
                periodeAktif,
                chartData,
                departmentData,
                recentActivities,
                complianceStats
            });
        } catch (error) {
            console.error("Error loading dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Chart configurations
    const lineChartData = {
        labels: ['6 bulan lalu', '5 bulan lalu', '4 bulan lalu', '3 bulan lalu', '2 bulan lalu', 'Bulan ini'],
        datasets: [
            {
                label: 'Total Gaji Bersih',
                data: dashboardData.chartData,
                borderColor: 'rgb(14, 165, 233)',
                backgroundColor: 'rgba(14, 165, 233, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6
            }
        ]
    };

    const lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top'
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const value = context.raw;
                        return new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                            minimumFractionDigits: 0
                        }).format(value);
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        return 'Rp ' + (value / 1000000).toFixed(1) + 'Jt';
                    }
                }
            }
        }
    };

    const barChartData = {
        labels: dashboardData.departmentData.labels || [],
        datasets: [
            {
                label: 'Jumlah Karyawan',
                data: dashboardData.departmentData.values || [],
                backgroundColor: [
                    'rgba(14, 165, 233, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(139, 92, 246, 0.8)'
                ],
                borderColor: [
                    'rgb(14, 165, 233)',
                    'rgb(16, 185, 129)',
                    'rgb(245, 158, 11)',
                    'rgb(239, 68, 68)',
                    'rgb(59, 130, 246)',
                    'rgb(139, 92, 246)'
                ],
                borderWidth: 2,
                borderRadius: 8
            }
        ]
    };

    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1
                }
            }
        }
    };

    const doughnutChartData = {
        labels: ['Sudah Digaji', 'Belum Digaji'],
        datasets: [
            {
                data: [dashboardData.penggajianBulanIni, Math.max(0, dashboardData.totalKaryawan - dashboardData.penggajianBulanIni)],
                backgroundColor: [
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(239, 68, 68, 0.8)'
                ],
                borderColor: [
                    'rgb(16, 185, 129)',
                    'rgb(239, 68, 68)'
                ],
                borderWidth: 2
            }
        ]
    };

    const doughnutChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
            legend: {
                position: 'bottom'
            }
        }
    };

    const formatRupiah = (value) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(value);
    };

    if (loading) {
        return (
            <NavigationWidget>
                <div className="dashboard-loading">
                    <Spinner animation="border" variant="primary" size="xl" />
                    <h3 className="mt-4">Memuat Dashboard...</h3>
                </div>
            </NavigationWidget>
        );
    }

    return (
        <NavigationWidget>
            <div className="dashboard-page">
                {/* Welcome Section */}
                <div className="dashboard-welcome">
                    <h1>📊 Dashboard</h1>
                    <p>Selamat datang di Sistem Penggajian - Ringkasan lengkap perusahaan Anda</p>
                </div>

                {/* Summary Cards */}
                <Row className="dashboard-cards">
                    <Col xl={3} md={6} className="mb-4">
                        <Card className="summary-card card-karyawan">
                            <Card.Body>
                                <div className="card-icon">
                                    <FaUsers />
                                </div>
                                <div className="card-content">
                                    <h6 className="card-label">Total Karyawan</h6>
                                    <h3 className="card-value">{dashboardData.totalKaryawan}</h3>
                                    <div className="card-subtext">
                                        <FaUserPlus className="me-1" />
                                        <span>{dashboardData.karyawanBaru} baru bulan ini</span>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col xl={3} md={6} className="mb-4">
                        <Card className="summary-card card-gaji">
                            <Card.Body>
                                <div className="card-icon">
                                    <FaMoneyBillWave />
                                </div>
                                <div className="card-content">
                                    <h6 className="card-label">Total Gaji Bersih</h6>
                                    <h3 className="card-value">{formatRupiah(dashboardData.totalGaji)}</h3>
                                    <div className="card-subtext">
                                        <FaArrowUp className="me-1 text-success" />
                                        <span className="text-success">Periode {dashboardData.periodeAktif}</span>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col xl={3} md={6} className="mb-4">
                        <Card className="summary-card card-penggajian">
                            <Card.Body>
                                <div className="card-icon">
                                    <FaCalendarAlt />
                                </div>
                                <div className="card-content">
                                    <h6 className="card-label">Penggajian Bulan Ini</h6>
                                    <h3 className="card-value">{dashboardData.penggajianBulanIni}</h3>
                                    <div className="card-subtext">
                                        <FaCheckCircle className="me-1 text-success" />
                                        <span>Dari {dashboardData.totalKaryawan} karyawan</span>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col xl={3} md={6} className="mb-4">
                        <Card className="summary-card card-progress">
                            <Card.Body>
                                <div className="card-icon">
                                    <FaChartLine />
                                </div>
                                <div className="card-content">
                                    <h6 className="card-label">Progress Penggajian</h6>
                                    <h3 className="card-value">
                                        {dashboardData.totalKaryawan > 0 
                                            ? Math.round((dashboardData.penggajianBulanIni / dashboardData.totalKaryawan) * 100) 
                                            : 0}%
                                    </h3>
                                    <div className="card-progress">
                                        <ProgressBar 
                                            now={(dashboardData.penggajianBulanIni / dashboardData.totalKaryawan) * 100 || 0} 
                                            variant={dashboardData.penggajianBulanIni >= dashboardData.totalKaryawan ? 'success' : 'warning'}
                                        />
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Payroll Breakdown Section */}
                <Row className="mb-4">
                    <Col lg={12}>
                        <Card className="chart-card">
                            <Card.Header>
                                <div className="chart-header">
                                    💰 Breakdown Penggajian - {dashboardData.periodeAktif}
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col md={3} sm={6} className="text-center mb-3">
                                        <div className="breakdown-item">
                                            <div className="breakdown-icon text-primary">
                                                <FaMoneyBillWave />
                                            </div>
                                            <h6 className="breakdown-label">Total Pendapatan</h6>
                                            <h4 className="breakdown-value">{formatRupiah(dashboardData.totalPokok)}</h4>
                                        </div>
                                    </Col>
                                    <Col md={3} sm={6} className="text-center mb-3">
                                        <div className="breakdown-item">
                                            <div className="breakdown-icon text-success">
                                                <FaArrowUp />
                                            </div>
                                            <h6 className="breakdown-label">Total Tunjangan</h6>
                                            <h4 className="breakdown-value">{formatRupiah(dashboardData.totalTunjangan)}</h4>
                                        </div>
                                    </Col>
                                    <Col md={3} sm={6} className="text-center mb-3">
                                        <div className="breakdown-item">
                                            <div className="breakdown-icon text-danger">
                                                <FaArrowDown />
                                            </div>
                                            <h6 className="breakdown-label">Total Potongan</h6>
                                            <h4 className="breakdown-value">{formatRupiah(dashboardData.totalPotongan)}</h4>
                                        </div>
                                    </Col>
                                    <Col md={3} sm={6} className="text-center mb-3">
                                        <div className="breakdown-item">
                                            <div className="breakdown-icon text-info">
                                                <FaWallet />
                                            </div>
                                            <h6 className="breakdown-label">Gaji Bersih</h6>
                                            <h4 className="breakdown-value">{formatRupiah(dashboardData.totalGaji)}</h4>
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Compliance & Stats Section */}
                <Row className="mb-4">
                    <Col lg={6} className="mb-4">
                        <Card className="chart-card compliance-card">
                            <Card.Header>
                                <div className="chart-header">
                                    📊 Compliance & Statistik
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col md={4} className="text-center mb-3">
                                        <div className="compliance-item">
                                            <div className="compliance-value text-primary">
                                                {formatRupiah(dashboardData.totalBPJS)}
                                            </div>
                                            <h6 className="compliance-label">Total BPJS</h6>
                                            <small className="compliance-subtext">
                                                {dashboardData.complianceStats.bpjs}% dari gaji
                                            </small>
                                        </div>
                                    </Col>
                                    <Col md={4} className="text-center mb-3">
                                        <div className="compliance-item">
                                            <div className="compliance-value text-danger">
                                                {formatRupiah(dashboardData.totalPPh)}
                                            </div>
                                            <h6 className="compliance-label">Total PPh 21</h6>
                                            <small className="compliance-subtext">
                                                {dashboardData.complianceStats.pph}% dari gaji
                                            </small>
                                        </div>
                                    </Col>
                                    <Col md={4} className="text-center mb-3">
                                        <div className="compliance-item">
                                            <div className="compliance-value text-success">
                                                {dashboardData.complianceStats.onTime}%
                                            </div>
                                            <h6 className="compliance-label">On-Time Payment</h6>
                                            <small className="compliance-subtext">
                                                {dashboardData.penggajianBulanIni} dari {dashboardData.totalKaryawan}
                                            </small>
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col lg={6} className="mb-4">
                        <Card className="chart-card">
                            <Card.Header>
                                <div className="chart-header">
                                    <FaClock /> Status Penggajian
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <div className="chart-container" style={{ height: '200px' }}>
                                    <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
                                </div>
                                <div className="chart-legend">
                                    <div className="legend-item">
                                        <span className="legend-dot dot-success"></span>
                                        <span>Sudah Digaji: {dashboardData.penggajianBulanIni}</span>
                                    </div>
                                    <div className="legend-item">
                                        <span className="legend-dot dot-danger"></span>
                                        <span>Belum Digaji: {dashboardData.totalKaryawan - dashboardData.penggajianBulanIni}</span>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Charts Section */}
                <Row>
                    <Col lg={8} className="mb-4">
                        <Card className="chart-card">
                            <Card.Header>
                                <div className="chart-header">
                                    <FaChartLine /> Trend Penggajian 6 Bulan Terakhir
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <div className="chart-container" style={{ height: '300px' }}>
                                    <Line data={lineChartData} options={lineChartOptions} />
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col lg={4} className="mb-4">
                        <Card className="chart-card">
                            <Card.Header>
                                <div className="chart-header">
                                    <FaUsers /> Status Penggajian
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <div className="chart-container" style={{ height: '200px' }}>
                                    <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
                                </div>
                                <div className="chart-legend">
                                    <div className="legend-item">
                                        <span className="legend-dot dot-success"></span>
                                        <span>Sudah Digaji: {dashboardData.penggajianBulanIni}</span>
                                    </div>
                                    <div className="legend-item">
                                        <span className="legend-dot dot-danger"></span>
                                        <span>Belum Digaji: {dashboardData.totalKaryawan - dashboardData.penggajianBulanIni}</span>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Row>
                    <Col lg={6} className="mb-4">
                        <Card className="chart-card">
                            <Card.Header>
                                <div className="chart-header">
                                    <FaUsers /> Distribusi Karyawan per Divisi
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <div className="chart-container" style={{ height: '250px' }}>
                                    <Bar data={barChartData} options={barChartOptions} />
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col lg={6} className="mb-4">
                        <Card className="chart-card activity-card">
                            <Card.Header>
                                <div className="chart-header">
                                    <FaClock /> Aktivitas Terakhir
                                </div>
                                <Button 
                                    variant="link" 
                                    className="view-all-btn"
                                    onClick={() => navigate('/penggajian')}
                                >
                                    Lihat Semua
                                </Button>
                            </Card.Header>
                            <Card.Body>
                                <div className="activity-list">
                                    {dashboardData.recentActivities.length > 0 ? (
                                        dashboardData.recentActivities.map((activity, index) => (
                                            <div key={index} className="activity-item">
                                                <div className="activity-icon">
                                                    <FaMoneyBillWave />
                                                </div>
                                                <div className="activity-content">
                                                    <h6 className="activity-title">{activity.title}</h6>
                                                    <p className="activity-date">{activity.date}</p>
                                                </div>
                                                <div className="activity-amount">
                                                    {formatRupiah(activity.amount)}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="empty-activity">
                                            <p>Belum ada aktivitas penggajian</p>
                                        </div>
                                    )}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Quick Actions */}
                <Card className="quick-actions-card">
                    <Card.Header>
                        <div className="chart-header">
                            ⚡ Aksi Cepat
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <Row>
                            <Col md={3} sm={6} className="mb-3">
                                <Button 
                                    className="quick-action-btn"
                                    onClick={() => navigate('/karyawan/add')}
                                >
                                    <FaUserPlus />
                                    <span>Tambah Karyawan</span>
                                </Button>
                            </Col>
                            <Col md={3} sm={6} className="mb-3">
                                <Button 
                                    className="quick-action-btn"
                                    onClick={() => navigate('/penggajian/input')}
                                >
                                    <FaMoneyBillWave />
                                    <span>Input Penggajian</span>
                                </Button>
                            </Col>
                            <Col md={3} sm={6} className="mb-3">
                                <Button 
                                    className="quick-action-btn"
                                    onClick={() => navigate('/laporan')}
                                >
                                    <FaFileAlt />
                                    <span>Lihat Laporan</span>
                                </Button>
                            </Col>
                            <Col md={3} sm={6} className="mb-3">
                                <Button 
                                    className="quick-action-btn"
                                    onClick={() => navigate('/penggajian')}
                                >
                                    <FaChartLine />
                                    <span>Riwayat Gaji</span>
                                </Button>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </div>
        </NavigationWidget>
    );
};

export default Dashboard;
