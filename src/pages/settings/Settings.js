import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Form, Button, Row, Col, Tabs, Tab, Badge, FormCheck } from "react-bootstrap";
import NavigationWidget from "../../widgets/commons/NavigationWidget";
import { useToast } from "../../widgets/commons/ToastProvider";
import {
    FaCog, FaBuilding, FaMoneyBillWave, FaBell, FaLock,
    FaPalette, FaGlobe, FaDatabase, FaSave, FaUndo
} from "react-icons/fa";
import "./Settings.css";

const Settings = () => {
    const navigate = useNavigate();
    const { success, error } = useToast();
    const [activeTab, setActiveTab] = useState("general");
    const [saving, setSaving] = useState(false);

    // Settings state
    const [settings, setSettings] = useState({
        // General
        companyName: "PT. Perusahaan Contoh",
        companyEmail: "info@perusahaan.com",
        companyPhone: "021-12345678",
        currency: "IDR",
        timezone: "Asia/Jakarta",
        language: "id",

        // Payroll
        payrollDay: 25,
        autoCalculate: true,
        requireApproval: true,
        allowBackdate: false,

        // Tax
        usePPh21: true,
        ptkpStatus: "TK/0",
        autoUpdateTax: true,

        // BPJS
        useBPJS: true,
        bpjsHealth: true,
        bpjsEmployment: true,
        bpjsHealthPercent: 1,
        bpjsEmploymentPercent: 2,

        // Notifications
        emailNotifications: true,
        payrollReminder: true,
        reportGenerated: true,
        systemUpdates: false,

        // System
        autoBackup: true,
        backupFrequency: "daily",
        dataRetention: 365,
        debugMode: false
    });

    const handleSave = () => {
        setSaving(true);
        // Simulate save
        setTimeout(() => {
            success("Pengaturan berhasil disimpan!");
            setSaving(false);
        }, 1000);
    };

    const handleReset = () => {
        if (window.confirm("Reset semua pengaturan ke default?")) {
            success("Pengaturan berhasil direset!");
        }
    };

    const handleChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    return (
        <NavigationWidget>
            <div className="settings-page">
                <div className="settings-header">
                    <h1><FaCog  /> Pengaturan Sistem</h1>
                    <p>Konfigurasi dan preferensi sistem penggajian</p>
                </div>

                <Row>
                    <Col lg={3} className="mb-4">
                        <Card className="settings-nav-card">
                            <Card.Body>
                                <Tabs
                                    activeKey={activeTab}
                                    onSelect={(k) => setActiveTab(k)}
                                    orientation="vertical"
                                    className="settings-tabs"
                                >
                                    <Tab eventKey="general" title={<><FaCog  /> Umum< />}>
                                        <div className="tab-description">Pengaturan dasar sistem</div>
                                    </Tab>
                                    <Tab eventKey="company" title={<><FaBuilding  /> Perusahaan< />}>
                                        <div className="tab-description">Informasi perusahaan</div>
                                    </Tab>
                                    <Tab eventKey="payroll" title={<><FaMoneyBillWave  /> Penggajian< />}>
                                        <div className="tab-description">Konfigurasi penggajian</div>
                                    </Tab>
                                    <Tab eventKey="tax" title={<><FaLock  /> Pajak & BPJS< />}>
                                        <div className="tab-description">Pengaturan pajak dan BPJS</div>
                                    </Tab>
                                    <Tab eventKey="notifications" title={<><FaBell  /> Notifikasi< />}>
                                        <div className="tab-description">Preferensi notifikasi</div>
                                    </Tab>
                                    <Tab eventKey="system" title={<><FaDatabase  /> Sistem< />}>
                                        <div className="tab-description">Pengaturan sistem</div>
                                    </Tab>
                                </Tabs>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col lg={9} className="mb-4">
                        <Card className="settings-content-card">
                            <Card.Header>
                                <div className="settings-card-header">
                                    <h4>
                                        {activeTab === "general" && <><FaCog  /> Pengaturan Umum< />}
                                        {activeTab === "company" && <><FaBuilding  /> Informasi Perusahaan< />}
                                        {activeTab === "payroll" && <><FaMoneyBillWave  /> Pengaturan Penggajian< />}
                                        {activeTab === "tax" && <><FaLock  /> Pajak & BPJS< />}
                                        {activeTab === "notifications" && <><FaBell  /> Notifikasi< />}
                                        {activeTab === "system" && <><FaDatabase  /> Pengaturan Sistem< />}
                                    </h4>
                                </div>
                            </Card.Header>
                            <Card.Body>
                                {/* General Settings */}
                                {activeTab === "general" && (
                                    <div className="settings-section">
                                        <Form.Group className="mb-3">
                                            <Form.Label>Nama Perusahaan</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={settings.companyName}
                                                onChange={(e) => handleChange("companyName", e.target.value)}
                                             />
                                        </Form.Group>
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Mata Uang</Form.Label>
                                                    <Form.Select
                                                        value={settings.currency}
                                                        onChange={(e) => handleChange("currency", e.target.value)}
                                                    >
                                                        <option value="IDR">IDR - Rupiah</option>
                                                        <option value="USD">USD - US Dollar</option>
                                                        <option value="EUR">EUR - Euro</option>
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Zona Waktu</Form.Label>
                                                    <Form.Select
                                                        value={settings.timezone}
                                                        onChange={(e) => handleChange("timezone", e.target.value)}
                                                    >
                                                        <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
                                                        <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
                                                        <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Bahasa</Form.Label>
                                            <Form.Select
                                                value={settings.language}
                                                onChange={(e) => handleChange("language", e.target.value)}
                                            >
                                                <option value="id">Bahasa Indonesia</option>
                                                <option value="en">English</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </div>
                                )}

                                {/* Company Settings */}
                                {activeTab === "company" && (
                                    <div className="settings-section">
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Email Perusahaan</Form.Label>
                                                    <Form.Control
                                                        type="email"
                                                        value={settings.companyEmail}
                                                        onChange={(e) => handleChange("companyEmail", e.target.value)}
                                                     />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Telepon</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        value={settings.companyPhone}
                                                        onChange={(e) => handleChange("companyPhone", e.target.value)}
                                                     />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Alamat</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                placeholder="Masukkan alamat lengkap perusahaan"
                                             />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>NPWP</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="00.000.000.0-000.000"
                                             />
                                        </Form.Group>
                                    </div>
                                )}

                                {/* Payroll Settings */}
                                {activeTab === "payroll" && (
                                    <div className="settings-section">
                                        <Form.Group className="mb-3">
                                            <Form.Label>Tanggal Gajian (setiap bulan)</Form.Label>
                                            <Form.Control
                                                type="number"
                                                min="1"
                                                max="31"
                                                value={settings.payrollDay}
                                                onChange={(e) => handleChange("payrollDay", parseInt(e.target.value))}
                                             />
                                            <Form.Text className="text-muted">
                                                Penggajian akan dilakukan setiap tanggal {settings.payrollDay}
                                            </Form.Text>
                                        </Form.Group>
                                        <div className="settings-switch-group">
                                            <Form.Group className="mb-3">
                                                <div className="switch-item">
                                                    <div className="switch-content">
                                                        <Form.Label className="mb-0">Auto Calculate</Form.Label>
                                                        <small className="text-muted">Hitung gaji secara otomatis</small>
                                                    </div>
                                                    <FormCheck type="switch"
                                                        checked={settings.autoCalculate}
                                                        onChange={(e) => handleChange("autoCalculate", e.target.checked)}
                                                     />
                                                </div>
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <div className="switch-item">
                                                    <div className="switch-content">
                                                        <Form.Label className="mb-0">Require Approval</Form.Label>
                                                        <small className="text-muted">Butuh persetujuan sebelum dibayar</small>
                                                    </div>
                                                    <FormCheck type="switch"
                                                        checked={settings.requireApproval}
                                                        onChange={(e) => handleChange("requireApproval", e.target.checked)}
                                                     />
                                                </div>
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <div className="switch-item">
                                                    <div className="switch-content">
                                                        <Form.Label className="mb-0">Allow Backdate</Form.Label>
                                                        <small className="text-muted">Izinkan input tanggal mundur</small>
                                                    </div>
                                                    <FormCheck type="switch"
                                                        checked={settings.allowBackdate}
                                                        onChange={(e) => handleChange("allowBackdate", e.target.checked)}
                                                     />
                                                </div>
                                            </Form.Group>
                                        </div>
                                    </div>
                                )}

                                {/* Tax & BPJS Settings */}
                                {activeTab === "tax" && (
                                    <div className="settings-section">
                                        <h6 className="section-title">Pengaturan PPh 21</h6>
                                        <div className="settings-switch-group">
                                            <Form.Group className="mb-3">
                                                <div className="switch-item">
                                                    <div className="switch-content">
                                                        <Form.Label className="mb-0">Gunakan PPh 21</Form.Label>
                                                        <small className="text-muted">Hitung PPh 21 otomatis</small>
                                                    </div>
                                                    <FormCheck type="switch"
                                                        checked={settings.usePPh21}
                                                        onChange={(e) => handleChange("usePPh21", e.target.checked)}
                                                     />
                                                </div>
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <div className="switch-item">
                                                    <div className="switch-content">
                                                        <Form.Label className="mb-0">Auto Update Tax</Form.Label>
                                                        <small className="text-muted">Update tarif pajak otomatis</small>
                                                    </div>
                                                    <FormCheck type="switch"
                                                        checked={settings.autoUpdateTax}
                                                        onChange={(e) => handleChange("autoUpdateTax", e.target.checked)}
                                                     />
                                                </div>
                                            </Form.Group>
                                        </div>

                                        <hr className="my-4"  />

                                        <h6 className="section-title">Pengaturan BPJS</h6>
                                        <div className="settings-switch-group">
                                            <Form.Group className="mb-3">
                                                <div className="switch-item">
                                                    <div className="switch-content">
                                                        <Form.Label className="mb-0">Gunakan BPJS</Form.Label>
                                                        <small className="text-muted">Hitung BPJS otomatis</small>
                                                    </div>
                                                    <FormCheck type="switch"
                                                        checked={settings.useBPJS}
                                                        onChange={(e) => handleChange("useBPJS", e.target.checked)}
                                                     />
                                                </div>
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <div className="switch-item">
                                                    <div className="switch-content">
                                                        <Form.Label className="mb-0">BPJS Kesehatan</Form.Label>
                                                        <small className="text-muted">1% dari gaji</small>
                                                    </div>
                                                    <FormCheck type="switch"
                                                        checked={settings.bpjsHealth}
                                                        onChange={(e) => handleChange("bpjsHealth", e.target.checked)}
                                                     />
                                                </div>
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <div className="switch-item">
                                                    <div className="switch-content">
                                                        <Form.Label className="mb-0">BPJS Ketenagakerjaan</Form.Label>
                                                        <small className="text-muted">2% dari gaji</small>
                                                    </div>
                                                    <FormCheck type="switch"
                                                        checked={settings.bpjsEmployment}
                                                        onChange={(e) => handleChange("bpjsEmployment", e.target.checked)}
                                                     />
                                                </div>
                                            </Form.Group>
                                        </div>
                                    </div>
                                )}

                                {/* Notifications Settings */}
                                {activeTab === "notifications" && (
                                    <div className="settings-section">
                                        <h6 className="section-title">Preferensi Notifikasi</h6>
                                        <div className="settings-switch-group">
                                            <Form.Group className="mb-3">
                                                <div className="switch-item">
                                                    <div className="switch-content">
                                                        <Form.Label className="mb-0">Email Notifications</Form.Label>
                                                        <small className="text-muted">Terima notifikasi via email</small>
                                                    </div>
                                                    <FormCheck type="switch"
                                                        checked={settings.emailNotifications}
                                                        onChange={(e) => handleChange("emailNotifications", e.target.checked)}
                                                     />
                                                </div>
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <div className="switch-item">
                                                    <div className="switch-content">
                                                        <Form.Label className="mb-0">Payroll Reminder</Form.Label>
                                                        <small className="text-muted">Ingatkan jadwal penggajian</small>
                                                    </div>
                                                    <FormCheck type="switch"
                                                        checked={settings.payrollReminder}
                                                        onChange={(e) => handleChange("payrollReminder", e.target.checked)}
                                                     />
                                                </div>
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <div className="switch-item">
                                                    <div className="switch-content">
                                                        <Form.Label className="mb-0">Report Generated</Form.Label>
                                                        <small className="text-muted">Notifikasi saat laporan selesai</small>
                                                    </div>
                                                    <FormCheck type="switch"
                                                        checked={settings.reportGenerated}
                                                        onChange={(e) => handleChange("reportGenerated", e.target.checked)}
                                                     />
                                                </div>
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <div className="switch-item">
                                                    <div className="switch-content">
                                                        <Form.Label className="mb-0">System Updates</Form.Label>
                                                        <small className="text-muted">Update sistem dan fitur baru</small>
                                                    </div>
                                                    <FormCheck type="switch"
                                                        checked={settings.systemUpdates}
                                                        onChange={(e) => handleChange("systemUpdates", e.target.checked)}
                                                     />
                                                </div>
                                            </Form.Group>
                                        </div>
                                    </div>
                                )}

                                {/* System Settings */}
                                {activeTab === "system" && (
                                    <div className="settings-section">
                                        <h6 className="section-title">Backup & Data</h6>
                                        <div className="settings-switch-group">
                                            <Form.Group className="mb-3">
                                                <div className="switch-item">
                                                    <div className="switch-content">
                                                        <Form.Label className="mb-0">Auto Backup</Form.Label>
                                                        <small className="text-muted">Backup data otomatis</small>
                                                    </div>
                                                    <FormCheck type="switch"
                                                        checked={settings.autoBackup}
                                                        onChange={(e) => handleChange("autoBackup", e.target.checked)}
                                                     />
                                                </div>
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Frekuensi Backup</Form.Label>
                                                <Form.Select
                                                    value={settings.backupFrequency}
                                                    onChange={(e) => handleChange("backupFrequency", e.target.value)}
                                                >
                                                    <option value="daily">Harian</option>
                                                    <option value="weekly">Mingguan</option>
                                                    <option value="monthly">Bulanan</option>
                                                </Form.Select>
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Retensi Data (hari)</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    value={settings.dataRetention}
                                                    onChange={(e) => handleChange("dataRetention", parseInt(e.target.value))}
                                                 />
                                            </Form.Group>
                                        </div>

                                        <hr className="my-4"  />

                                        <h6 className="section-title">Developer</h6>
                                        <div className="settings-switch-group">
                                            <Form.Group className="mb-3">
                                                <div className="switch-item">
                                                    <div className="switch-content">
                                                        <Form.Label className="mb-0">Debug Mode</Form.Label>
                                                        <small className="text-muted">Mode debugging untuk developer</small>
                                                    </div>
                                                    <FormCheck type="switch"
                                                        checked={settings.debugMode}
                                                        onChange={(e) => handleChange("debugMode", e.target.checked)}
                                                     />
                                                </div>
                                            </Form.Group>
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="settings-actions">
                                    <Button
                                        variant="primary"
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="me-2"
                                    >
                                        {saving ? (
                                            <>
                                                <span className="spinner-sm me-2"></span>
                                                Menyimpan...
                                            < />
                                        ) : (
                                            <>
                                                <FaSave  /> Simpan Pengaturan
                                            < />
                                        )}
                                    </Button>
                                    <Button
                                        variant="outline-secondary"
                                        onClick={handleReset}
                                    >
                                        <FaUndo  /> Reset Default
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        </NavigationWidget>
    );
};

export default Settings;
