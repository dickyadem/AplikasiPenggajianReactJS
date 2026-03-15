import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    FaHome, FaUsers, FaBuilding, FaUserTie, FaBriefcase,
    FaLayerGroup, FaMoneyBillWave, FaFileInvoice,
    FaChartLine, FaHospital, FaFileAlt, FaCog, FaSignOutAlt,
    FaChevronDown, FaChevronUp, FaBars, FaTimes, FaUserCircle
} from "react-icons/fa";
import { Button, Badge } from "react-bootstrap";
import AuthService from "../../services/AuthService";
import "./Sidebar.css";

const menuItems = {
    dashboard: {
        path: "/dashboard",
        label: "Dashboard",
        icon: <FaHome />
    },
    master: {
        label: "Master Data",
        icon: <FaBuilding />,
        items: [
            { path: "/user", label: "User", icon: <FaUsers /> },
            { path: "/profil", label: "Profil", icon: <FaUserTie /> },
            { path: "/karyawan", label: "Karyawan", icon: <FaBriefcase /> },
            { path: "/jabatan", label: "Jabatan", icon: <FaLayerGroup /> },
            { path: "/golongan", label: "Golongan", icon: <FaLayerGroup /> },
            { path: "/pendapatan", label: "Pendapatan", icon: <FaMoneyBillWave /> },
            { path: "/potongan", label: "Potongan", icon: <FaMoneyBillWave /> }
        ]
    },
    transaksi: {
        label: "Transaksi",
        icon: <FaFileInvoice />,
        items: [
            { path: "/penggajian", label: "List Penggajian", icon: <FaChartLine /> },
            { path: "/penggajian/input", label: "Input Penggajian", icon: <FaFileInvoice /> }
        ]
    },
    laporan: {
        label: "Laporan",
        icon: <FaFileAlt />,
        items: [
            { path: "/laporan", label: "Laporan Gaji", icon: <FaFileAlt /> },
            { path: "/laporan", label: "Laporan BPJS", icon: <FaHospital />, query: "bpjs" },
            { path: "/laporan", label: "Laporan PPh", icon: <FaFileAlt />, query: "pph" }
        ]
    }
};

const Sidebar = ({ onCollapse }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [openMenus, setOpenMenus] = useState({
        master: false,
        transaksi: false,
        laporan: false
    });
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [user, setUser] = useState(null);

    // Load user info on mount
    useEffect(() => {
        const userInfo = AuthService.getUser();
        setUser(userInfo);
    }, []);

    // Notify parent when sidebar collapses
    const handleCollapse = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        if (onCollapse) {
            onCollapse(newState);
        }
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    const isActiveParent = (items) => {
        return items.some(item => location.pathname === item.path);
    };

    const toggleMenu = (menu) => {
        setOpenMenus(prev => ({
            ...prev,
            [menu]: !prev[menu]
        }));
    };

    const handleNavigate = (path, query) => {
        if (query) {
            // For Laporan with filter
            navigate(`${path}?filter=${query}`);
            // Auto-open the corresponding report by storing in sessionStorage
            sessionStorage.setItem('autoOpenReport', query);
        } else {
            navigate(path);
        }
        setIsMobileOpen(false);
    };

    const handleLogout = () => {
        AuthService.logout();
        navigate("/");
    };

    return (
        <>
            {/* Mobile Toggle */}
            <Button 
                className="mobile-sidebar-toggle"
                onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
                {isMobileOpen ? <FaTimes /> : <FaBars />}
            </Button>

            {/* Sidebar Overlay for Mobile */}
            {isMobileOpen && (
                <div 
                    className="sidebar-overlay"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}>
                {/* Logo */}
                <div className="sidebar-header">
                    <div className="logo-section">
                        <span className="logo-icon">💼</span>
                        {!isCollapsed && (
                            <div className="logo-text">
                                <h4>PAYROLL</h4>
                                <small>Sistem Penggajian</small>
                            </div>
                        )}
                    </div>
                    <Button 
                        variant="link" 
                        className="collapse-btn"
                        onClick={handleCollapse}
                    >
                        {isCollapsed ? <FaBars /> : <FaTimes />}
                    </Button>
                </div>

                {/* Menu Items */}
                <nav className="sidebar-nav">
                    {/* Dashboard */}
                    <div 
                        className={`menu-item ${isActive('/dashboard') ? 'active' : ''}`}
                        onClick={() => handleNavigate('/dashboard')}
                    >
                        <span className="menu-icon">{menuItems.dashboard.icon}</span>
                        {!isCollapsed && <span className="menu-label">{menuItems.dashboard.label}</span>}
                    </div>

                    {/* Master Data */}
                    <div className="menu-section">
                        <div 
                            className={`menu-item menu-parent ${isActiveParent(menuItems.master.items) ? 'active' : ''}`}
                            onClick={() => toggleMenu('master')}
                        >
                            <span className="menu-icon">{menuItems.master.icon}</span>
                            {!isCollapsed && (
                                <>
                                    <span className="menu-label">{menuItems.master.label}</span>
                                    <span className="menu-arrow">
                                        {openMenus.master ? <FaChevronUp /> : <FaChevronDown />}
                                    </span>
                                </>
                            )}
                        </div>
                        {openMenus.master && !isCollapsed && (
                            <div className="submenu">
                                {menuItems.master.items.map((item, index) => (
                                    <div
                                        key={index}
                                        className={`submenu-item ${isActive(item.path) ? 'active' : ''}`}
                                        onClick={() => handleNavigate(item.path)}
                                    >
                                        <span className="submenu-icon">{item.icon}</span>
                                        <span className="submenu-label">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Transaksi */}
                    <div className="menu-section">
                        <div 
                            className={`menu-item menu-parent ${isActiveParent(menuItems.transaksi.items) ? 'active' : ''}`}
                            onClick={() => toggleMenu('transaksi')}
                        >
                            <span className="menu-icon">{menuItems.transaksi.icon}</span>
                            {!isCollapsed && (
                                <>
                                    <span className="menu-label">{menuItems.transaksi.label}</span>
                                    <span className="menu-arrow">
                                        {openMenus.transaksi ? <FaChevronUp /> : <FaChevronDown />}
                                    </span>
                                </>
                            )}
                        </div>
                        {openMenus.transaksi && !isCollapsed && (
                            <div className="submenu">
                                {menuItems.transaksi.items.map((item, index) => (
                                    <div
                                        key={index}
                                        className={`submenu-item ${isActive(item.path) ? 'active' : ''}`}
                                        onClick={() => handleNavigate(item.path)}
                                    >
                                        <span className="submenu-icon">{item.icon}</span>
                                        <span className="submenu-label">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Laporan */}
                    <div className="menu-section">
                        <div 
                            className={`menu-item menu-parent ${isActiveParent(menuItems.laporan.items) ? 'active' : ''}`}
                            onClick={() => toggleMenu('laporan')}
                        >
                            <span className="menu-icon">{menuItems.laporan.icon}</span>
                            {!isCollapsed && (
                                <>
                                    <span className="menu-label">{menuItems.laporan.label}</span>
                                    <span className="menu-arrow">
                                        {openMenus.laporan ? <FaChevronUp /> : <FaChevronDown />}
                                    </span>
                                </>
                            )}
                        </div>
                        {openMenus.laporan && !isCollapsed && (
                            <div className="submenu">
                                {menuItems.laporan.items.map((item, index) => (
                                    <div
                                        key={index}
                                        className={`submenu-item ${isActive(item.path) && (!item.query || new URLSearchParams(location.search).get('filter') === item.query) ? 'active' : ''}`}
                                        onClick={() => handleNavigate(item.path, item.query)}
                                    >
                                        <span className="submenu-icon">{item.icon}</span>
                                        <span className="submenu-label">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </nav>

                {/* Bottom Actions */}
                <div className="sidebar-bottom">
                    {/* User Info */}
                    {!isCollapsed && (
                        <div className="sidebar-user-info">
                            <FaUserCircle className="user-avatar" />
                            <div className="user-details">
                                <div className="user-name">{user?.username || 'User'}</div>
                                <div className="user-role">
                                    <Badge bg="secondary">
                                        {(user?.role || 'user').toUpperCase()}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div
                        className="menu-item"
                        onClick={() => navigate('/profile')}
                    >
                        <span className="menu-icon"><FaUserCircle /></span>
                        {!isCollapsed && <span className="menu-label">Profile</span>}
                    </div>
                    <div
                        className="menu-item"
                        onClick={() => navigate('/settings')}
                    >
                        <span className="menu-icon"><FaCog /></span>
                        {!isCollapsed && <span className="menu-label">Settings</span>}
                    </div>
                    <div
                        className="menu-item logout"
                        onClick={handleLogout}
                    >
                        <span className="menu-icon"><FaSignOutAlt /></span>
                        {!isCollapsed && <span className="menu-label">Logout</span>}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
