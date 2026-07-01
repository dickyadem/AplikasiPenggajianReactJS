import { useState, useEffect } from "react";
import { Container, Navbar, Stack, Button, Dropdown, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Bell, UserCircle, GearSix, SignOut, List, User, Briefcase, CheckCircle, Warning, Info, Checks } from "@phosphor-icons/react";
import AuthService from "../../services/AuthService";
import NotificationService from "../../services/NotificationService";
import "./NavigationWidget.css";

const NOTIFICATION_ICON = {
  success: <CheckCircle weight="fill" />,
  warning: <Warning weight="fill" />,
  info: <Info weight="fill" />,
};

const formatNotificationTime = (isoString) => {
  if (!isoString) return "";
  return new Date(isoString).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const NavigationWidget = ({ children, buttonCreate, actionTop }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const userInfo = AuthService.getUser();
    setUser(userInfo);
  }, []);

  useEffect(() => {
    NotificationService.list()
      .then((response) => {
        const results = response.data.results || response.data || [];
        setNotifications(
          results.map((n) => ({
            id: n.id,
            type: n.type,
            title: n.title,
            message: n.message,
            time: formatNotificationTime(n.created_at),
            read: !!n.is_read,
          }))
        );
      })
      .catch((err) => console.error("Error loading notifications:", err));
  }, []);

  const handleLogout = () => {
    AuthService.logout();
    navigate("/");
  };

  const markAsRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    NotificationService.markAsRead(id).catch((err) => console.error("Error marking notification as read:", err));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    NotificationService.markAllAsRead().catch((err) => console.error("Error marking all notifications as read:", err));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const displayName = user?.username || user?.NamaLengkap || "User";
  const displayRole = (user?.role || "user").toUpperCase();
  const displayEmail = user?.email || "";

  return (
    <>
      <Navbar className="top-navbar" expand="lg">
        <Container fluid>
          <div className="navbar-left">
            <Button
              variant="link"
              className="mobile-toggle d-lg-none"
              onClick={() => window.dispatchEvent(new CustomEvent('toggleSidebar'))}
            >
              <List />
            </Button>
            <div className="navbar-brand-section">
              <span className="brand-icon"><Briefcase weight="fill" /></span>
              <div className="brand-text">
                <h4 className="brand-title">Sistem Penggajian</h4>
                <p className="brand-subtitle">Payroll Management System</p>
              </div>
            </div>
          </div>

          <div className="navbar-right">
            <Dropdown className="notification-dropdown" align="end">
              <Dropdown.Toggle variant="link" className="nav-action-btn">
                <Bell />
                {unreadCount > 0 && (
                  <Badge bg="danger" className="notification-badge">{unreadCount}</Badge>
                )}
              </Dropdown.Toggle>

              <Dropdown.Menu className="notification-menu">
                <div className="notification-menu-header">
                  <span className="notification-menu-title">Notifikasi</span>
                  {unreadCount > 0 && (
                    <button type="button" className="notification-mark-all" onClick={markAllAsRead}>
                      <Checks /> Tandai semua dibaca
                    </button>
                  )}
                </div>

                <div className="dropdown-menu-divider"></div>

                {notifications.length > 0 ? (
                  <div className="notification-list">
                    {notifications.map((notif) => (
                      <button
                        type="button"
                        key={notif.id}
                        className={`notification-item ${notif.read ? '' : 'unread'}`}
                        onClick={() => markAsRead(notif.id)}
                      >
                        <div className={`notification-item-icon ${notif.type}`}>
                          {NOTIFICATION_ICON[notif.type]}
                        </div>
                        <div className="notification-item-body">
                          <span className="notification-item-title">{notif.title}</span>
                          <span className="notification-item-message">{notif.message}</span>
                          <span className="notification-item-time">{notif.time}</span>
                        </div>
                        {!notif.read && <span className="notification-item-dot"></span>}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="notification-empty">
                    <Bell />
                    <span>Belum ada notifikasi</span>
                  </div>
                )}
              </Dropdown.Menu>
            </Dropdown>

            <div className="navbar-divider"></div>

            <Dropdown className="user-dropdown" align="end">
              <Dropdown.Toggle variant="link" className="user-toggle">
                <UserCircle className="user-icon" />
                <div className="user-info">
                  <span className="user-name">{displayName}</span>
                  <span className="user-role">{displayRole}</span>
                </div>
              </Dropdown.Toggle>

              <Dropdown.Menu className="user-menu">
                {/* User Header */}
                <div className="dropdown-user-header">
                  <div className="dropdown-avatar">
                    <UserCircle />
                  </div>
                  <div className="dropdown-user-detail">
                    <span className="dropdown-user-name">{displayName}</span>
                    <span className="dropdown-user-email">{displayEmail}</span>
                    <Badge className="dropdown-role-badge">{displayRole}</Badge>
                  </div>
                </div>

                <div className="dropdown-menu-divider"></div>

                {/* Menu Items */}
                <Dropdown.Item onClick={() => navigate('/profile')} className="dropdown-menu-item">
                  <div className="dropdown-item-icon profile-icon"><User /></div>
                  <span className="dropdown-item-label">Profile</span>
                </Dropdown.Item>

                <Dropdown.Item onClick={() => navigate('/settings')} className="dropdown-menu-item">
                  <div className="dropdown-item-icon settings-icon"><GearSix /></div>
                  <span className="dropdown-item-label">Settings</span>
                </Dropdown.Item>

                <div className="dropdown-menu-divider"></div>

                <Dropdown.Item onClick={handleLogout} className="dropdown-menu-item logout-item">
                  <div className="dropdown-item-icon logout-icon"><SignOut /></div>
                  <span className="dropdown-item-label">Logout</span>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            {buttonCreate && (
              <div className="create-button-wrapper">
                {buttonCreate}
              </div>
            )}
          </div>
        </Container>
      </Navbar>

      {actionTop && (
        <div className="action-bar">
          <Container fluid>
            <Stack direction="horizontal" gap={3} className="justify-content-end">
              {actionTop}
            </Stack>
          </Container>
        </div>
      )}

      <Container fluid className="page-content">
        {children}
      </Container>
    </>
  );
};

export default NavigationWidget;
