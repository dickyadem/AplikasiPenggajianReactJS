import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    House, Users, Buildings, IdentificationBadge, Briefcase,
    Stack, Money, Receipt,
    ChartLineUp, FirstAidKit, FileText, GearSix, SignOut,
    CaretDown, CaretUp, List, X, UserCircle
} from "@phosphor-icons/react";
import { Button, Badge } from "react-bootstrap";
import AuthService from "../../services/AuthService";
import "./Sidebar.css";

const menuItems = {
    dashboard: {
        path: "/dashboard",
        label: "Dashboard",
        icon: <House />
    },
    master: {
        label: "Master Data",
        icon: <Buildings />,
        items: [
            { path: "/user", label: "User", icon: <Users />, roles: ['admin'] },
            { path: "/profil", label: "Profil", icon: <IdentificationBadge />, roles: ['admin', 'hr_staff', 'manager'] },
            { path: "/karyawan", label: "Karyawan", icon: <Briefcase />, roles: ['admin', 'hr_staff', 'manager'] },
            { path: "/jabatan", label: "Jabatan", icon: <Stack />, roles: ['admin', 'hr_staff', 'manager'] },
            { path: "/golongan", label: "Golongan", icon: <Stack />, roles: ['admin', 'hr_staff', 'manager'] },
            { path: "/pendapatan", label: "Pendapatan", icon: <Money />, roles: ['admin', 'finance', 'hr_staff', 'manager'] },
            { path: "/potongan", label: "Potongan", icon: <Money />, roles: ['admin', 'finance', 'hr_staff', 'manager'] }
        ]
    },
    transaksi: {
        label: "Transaksi",
        icon: <Receipt />,
        items: [
            { path: "/penggajian", label: "List Penggajian", icon: <ChartLineUp />, roles: ['admin', 'finance', 'hr_staff', 'manager'] },
            { path: "/penggajian/input", label: "Input Penggajian", icon: <Receipt />, roles: ['admin', 'finance', 'hr_staff'] }
        ]
    },
    laporan: {
        label: "Laporan",
        icon: <FileText />,
        items: [
            { path: "/laporan", label: "Laporan Gaji", icon: <FileText />, roles: ['admin', 'finance', 'hr_staff', 'manager'] },
            { path: "/laporan", label: "Laporan BPJS", icon: <FirstAidKit />, query: "bpjs", roles: ['admin', 'finance', 'hr_staff', 'manager'] },
            { path: "/laporan", label: "Laporan PPh", icon: <FileText />, query: "pph", roles: ['admin', 'finance', 'hr_staff', 'manager'] }
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

    // Listen for toggle event from NavigationWidget
    useEffect(() => {
        const handler = () => setIsMobileOpen(prev => !prev);
        window.addEventListener('toggleSidebar', handler);
        return () => window.removeEventListener('toggleSidebar', handler);
    }, []);

    // Notify parent when sidebar collapses
    const handleCollapse = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        if (onCollapse) {
            onCollapse(newState);
        }
    };

    // Only show menu items the logged-in user's role is actually allowed to open
    const visibleMasterItems = menuItems.master.items.filter(item => AuthService.hasAnyRole(item.roles));
    const visibleTransaksiItems = menuItems.transaksi.items.filter(item => AuthService.hasAnyRole(item.roles));
    const visibleLaporanItems = menuItems.laporan.items.filter(item => AuthService.hasAnyRole(item.roles));

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
                        <span className="logo-icon"><Briefcase weight="fill" /></span>
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
                        {isCollapsed ? <List /> : <X />}
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
                    {visibleMasterItems.length > 0 && (
                        <div className="menu-section">
                            <div
                                className={`menu-item menu-parent ${isActiveParent(visibleMasterItems) ? 'active' : ''}`}
                                onClick={() => toggleMenu('master')}
                            >
                                <span className="menu-icon">{menuItems.master.icon}</span>
                                {!isCollapsed && (
                                    <>
                                        <span className="menu-label">{menuItems.master.label}</span>
                                        <span className="menu-arrow">
                                            {openMenus.master ? <CaretUp /> : <CaretDown />}
                                        </span>
                                    </>
                                )}
                            </div>
                            {openMenus.master && !isCollapsed && (
                                <div className="submenu">
                                    {visibleMasterItems.map((item, index) => (
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
                    )}

                    {/* Transaksi */}
                    {visibleTransaksiItems.length > 0 && (
                        <div className="menu-section">
                            <div
                                className={`menu-item menu-parent ${isActiveParent(visibleTransaksiItems) ? 'active' : ''}`}
                                onClick={() => toggleMenu('transaksi')}
                            >
                                <span className="menu-icon">{menuItems.transaksi.icon}</span>
                                {!isCollapsed && (
                                    <>
                                        <span className="menu-label">{menuItems.transaksi.label}</span>
                                        <span className="menu-arrow">
                                            {openMenus.transaksi ? <CaretUp /> : <CaretDown />}
                                        </span>
                                    </>
                                )}
                            </div>
                            {openMenus.transaksi && !isCollapsed && (
                                <div className="submenu">
                                    {visibleTransaksiItems.map((item, index) => (
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
                    )}

                    {/* Laporan */}
                    {visibleLaporanItems.length > 0 && (
                        <div className="menu-section">
                            <div
                                className={`menu-item menu-parent ${isActiveParent(visibleLaporanItems) ? 'active' : ''}`}
                                onClick={() => toggleMenu('laporan')}
                            >
                                <span className="menu-icon">{menuItems.laporan.icon}</span>
                                {!isCollapsed && (
                                    <>
                                        <span className="menu-label">{menuItems.laporan.label}</span>
                                        <span className="menu-arrow">
                                            {openMenus.laporan ? <CaretUp /> : <CaretDown />}
                                        </span>
                                    </>
                                )}
                            </div>
                            {openMenus.laporan && !isCollapsed && (
                                <div className="submenu">
                                    {visibleLaporanItems.map((item, index) => (
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
                    )}
                </nav>

                {/* Bottom Actions */}
                <div className="sidebar-bottom">
                    {/* User Info */}
                    {!isCollapsed && (
                        <div className="sidebar-user-info">
                            <UserCircle className="user-avatar" />
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
                        <span className="menu-icon"><UserCircle /></span>
                        {!isCollapsed && <span className="menu-label">Profile</span>}
                    </div>
                    {AuthService.hasRole('admin') && (
                        <div
                            className="menu-item"
                            onClick={() => navigate('/settings')}
                        >
                            <span className="menu-icon"><GearSix /></span>
                            {!isCollapsed && <span className="menu-label">Settings</span>}
                        </div>
                    )}
                    <div
                        className="menu-item logout"
                        onClick={handleLogout}
                    >
                        <span className="menu-icon"><SignOut /></span>
                        {!isCollapsed && <span className="menu-label">Logout</span>}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
