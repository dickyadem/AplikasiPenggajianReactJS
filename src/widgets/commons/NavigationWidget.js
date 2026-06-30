import { useState, useEffect } from "react";
import { Container, Navbar, Stack, Button, Dropdown, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaBell, FaUserCircle, FaCog, FaSignOutAlt, FaBars, FaUser } from "react-icons/fa";
import AuthService from "../../services/AuthService";
import "./NavigationWidget.css";

const NavigationWidget = ({ children, buttonCreate, actionTop }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userInfo = AuthService.getUser();
    setUser(userInfo);
  }, []);

  const handleLogout = () => {
    AuthService.logout();
    navigate("/");
  };

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
              <FaBars />
            </Button>
            <div className="navbar-brand-section">
              <span className="brand-icon">💼</span>
              <div className="brand-text">
                <h4 className="brand-title">Sistem Penggajian</h4>
                <p className="brand-subtitle">Payroll Management System</p>
              </div>
            </div>
          </div>

          <div className="navbar-right">
            <Button variant="link" className="nav-action-btn">
              <FaBell />
              <Badge bg="danger" className="notification-badge">3</Badge>
            </Button>

            <div className="navbar-divider"></div>

            <Dropdown className="user-dropdown" align="end">
              <Dropdown.Toggle variant="link" className="user-toggle">
                <FaUserCircle className="user-icon" />
                <div className="user-info">
                  <span className="user-name">{displayName}</span>
                  <span className="user-role">{displayRole}</span>
                </div>
              </Dropdown.Toggle>

              <Dropdown.Menu className="user-menu">
                {/* User Header */}
                <div className="dropdown-user-header">
                  <div className="dropdown-avatar">
                    <FaUserCircle />
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
                  <div className="dropdown-item-icon profile-icon"><FaUser /></div>
                  <span className="dropdown-item-label">Profile</span>
                </Dropdown.Item>

                <Dropdown.Item onClick={() => navigate('/settings')} className="dropdown-menu-item">
                  <div className="dropdown-item-icon settings-icon"><FaCog /></div>
                  <span className="dropdown-item-label">Settings</span>
                </Dropdown.Item>

                <div className="dropdown-menu-divider"></div>

                <Dropdown.Item onClick={handleLogout} className="dropdown-menu-item logout-item">
                  <div className="dropdown-item-icon logout-icon"><FaSignOutAlt /></div>
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
