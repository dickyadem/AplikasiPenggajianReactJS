import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Form, Button, Row, Col, Badge, Avatar } from "react-bootstrap";
import NavigationWidget from "../../widgets/commons/NavigationWidget";
import { useToast } from "../../widgets/commons/ToastProvider";
import {
    User, EnvelopeSimple, Phone, Buildings, CalendarBlank,
    MapPin, PencilSimple, FloppyDisk, Camera, Lock, Key
} from "@phosphor-icons/react";
import AuthService from "../../services/AuthService";
import "./Profile.css";

const Profile = () => {
    const navigate = useNavigate();
    const { success, error } = useToast();
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [user, setUser] = useState({
        username: "Admin",
        email: "admin@perusahaan.com",
        phone: "0812-3456-7890",
        department: "IT",
        position: "System Administrator",
        joinDate: "2023-01-15",
        address: "Jl. Sudirman No. 123, Jakarta",
        avatar: null
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    useEffect(() => {
        // Load user profile from API
        // For demo, using static data
    }, []);

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => {
            success("Profil berhasil diupdate!");
            setEditing(false);
            setSaving(false);
        }, 1000);
    };

    const handleChangePassword = async () => {
        if (!passwordData.currentPassword) {
            error("Password lama wajib diisi!");
            return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            error("Password baru tidak sama!");
            return;
        }
        if (passwordData.newPassword.length < 8) {
            error("Password minimal 8 karakter!");
            return;
        }

        setSaving(true);
        try {
            await AuthService.changePassword(passwordData.currentPassword, passwordData.newPassword);
            success("Password berhasil diubah!");
            setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err) {
            const msg = err?.response?.data?.message || "Gagal mengubah password.";
            error(msg);
        } finally {
            setSaving(false);
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUser(prev => ({ ...prev, avatar: reader.result }));
                success("Foto profil berhasil diupdate!");
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <NavigationWidget>
            <div className="profile-page">
                {/* Profile Header */}
                <Card className="profile-header-card">
                    <Card.Body>
                        <div className="profile-header-content">
                            <div className="profile-avatar-section">
                                <div className="avatar-wrapper">
                                    {user.avatar ? (
                                        <img src={user.avatar} alt="Profile" className="profile-avatar" />
                                    ) : (
                                        <div className="profile-avatar-placeholder">
                                            <User />
                                        </div>
                                    )}
                                    <label htmlFor="avatar-upload" className="avatar-edit-btn">
                                        <Camera />
                                        <input
                                            type="file"
                                            id="avatar-upload"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                            hidden
                                        />
                                    </label>
                                </div>
                                <div className="profile-info">
                                    <h1>{user.username}</h1>
                                    <p className="profile-position">{user.position}</p>
                                    <div className="profile-badges">
                                        <Badge bg="primary">{user.department}</Badge>
                                        <Badge bg="success">Active</Badge>
                                    </div>
                                </div>
                            </div>
                            <div className="profile-actions">
                                {!editing ? (
                                    <Button
                                        variant="primary"
                                        onClick={() => setEditing(true)}
                                    >
                                        <PencilSimple /> Edit Profil
                                    </Button>
                                ) : (
                                    <>
                                        <Button
                                            variant="success"
                                            onClick={handleSave}
                                            disabled={saving}
                                        >
                                            {saving ? (
                                                <>
                                                    <span className="spinner-sm me-2"></span>
                                                    Menyimpan...
                                                </>
                                            ) : (
                                                <>
                                                    <FloppyDisk /> Simpan
                                                </>
                                            )}
                                        </Button>
                                        <Button
                                            variant="outline-secondary"
                                            onClick={() => setEditing(false)}
                                        >
                                            Batal
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </Card.Body>
                </Card>

                <Row>
                    {/* Profile Information */}
                    <Col lg={8} className="mb-4">
                        <Card className="profile-card">
                            <Card.Header>
                                <div className="card-header-content">
                                    <User /> Informasi Pribadi
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Username</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={user.username}
                                                onChange={(e) => setUser(prev => ({ ...prev, username: e.target.value }))}
                                                disabled={!editing}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control
                                                type="email"
                                                value={user.email}
                                                onChange={(e) => setUser(prev => ({ ...prev, email: e.target.value }))}
                                                disabled={!editing}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Telepon</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={user.phone}
                                                onChange={(e) => setUser(prev => ({ ...prev, phone: e.target.value }))}
                                                disabled={!editing}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Departemen</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={user.department}
                                                onChange={(e) => setUser(prev => ({ ...prev, department: e.target.value }))}
                                                disabled={!editing}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Posisi</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={user.position}
                                                onChange={(e) => setUser(prev => ({ ...prev, position: e.target.value }))}
                                                disabled={!editing}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Tanggal Bergabung</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={user.joinDate}
                                                disabled
                                                className="bg-light"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Form.Group className="mb-3">
                                    <Form.Label>Alamat</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={user.address}
                                        onChange={(e) => setUser(prev => ({ ...prev, address: e.target.value }))}
                                        disabled={!editing}
                                    />
                                </Form.Group>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Change Password */}
                    <Col lg={4} className="mb-4">
                        <Card className="profile-card">
                            <Card.Header>
                                <div className="card-header-content">
                                    <Lock /> Ubah Password
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <Form.Group className="mb-3">
                                    <Form.Label>Password Saat Ini</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                                        placeholder="Masukkan password saat ini"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Password Baru</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                        placeholder="Masukkan password baru"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Konfirmasi Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                        placeholder="Konfirmasi password baru"
                                    />
                                </Form.Group>
                                <Button
                                    variant="primary"
                                    onClick={handleChangePassword}
                                    className="w-100"
                                    disabled={saving}
                                >
                                    <Key /> Ubah Password
                                </Button>
                            </Card.Body>
                        </Card>

                        {/* Account Stats */}
                        <Card className="profile-card mt-4">
                            <Card.Header>
                                <div className="card-header-content">
                                    <CalendarBlank /> Statistik Akun
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <div className="stats-grid">
                                    <div className="stat-item">
                                        <div className="stat-value text-primary">12</div>
                                        <div className="stat-label">Login Bulan Ini</div>
                                    </div>
                                    <div className="stat-item">
                                        <div className="stat-value text-success">45</div>
                                        <div className="stat-label">Aksi Terakhir</div>
                                    </div>
                                    <div className="stat-item">
                                        <div className="stat-value text-info">2</div>
                                        <div className="stat-label">Perangkat Aktif</div>
                                    </div>
                                    <div className="stat-item">
                                        <div className="stat-value text-warning">365</div>
                                        <div className="stat-label">Hari Bergabung</div>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        </NavigationWidget>
    );
};

export default Profile;
