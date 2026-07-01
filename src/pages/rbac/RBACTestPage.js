import { useState, useEffect } from "react";
import { Card, Button, Table, Badge, Form } from "react-bootstrap";
import NavigationWidget from "../../widgets/commons/NavigationWidget";
import { useToast } from "../../widgets/commons/ToastProvider";
import AuthService from "../../services/AuthService";
import RBACService from "../../services/RBACService";
import { Users, Lock, Key, Tag, Lightning, ArrowsClockwise, TestTube, ChartBar, TrendUp } from "@phosphor-icons/react";

const RBACTestPage = () => {
    const { success, error } = useToast();
    const [currentUser, setCurrentUser] = useState(null);
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [userPermissions, setUserPermissions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        setLoading(true);
        try {
            // Get current user
            const user = AuthService.getUser();
            setCurrentUser(user);

            // Load roles
            const rolesRes = await RBACService.getRoles();
            setRoles(rolesRes.data || []);

            // Load permissions
            const permsRes = await RBACService.getPermissions();
            setPermissions(permsRes.data || []);

            // Load user permissions
            if (user && user.ID_User) {
                const userPermsRes = await RBACService.getUserRole(user.ID_User);
                setUserPermissions(userPermsRes.data?.permissions || []);
            }

            success("Data RBAC berhasil dimuat!");
        } catch (err) {
            console.error("RBAC Error:", err);
            error("Gagal memuat data RBAC. Pastikan backend sudah siap.");
        } finally {
            setLoading(false);
        }
    };

    const handleAssignRole = async (roleName) => {
        if (!currentUser || !currentUser.ID_User) {
            error("User tidak ditemukan!");
            return;
        }

        try {
            await RBACService.assignUserRole(currentUser.ID_User, {
                ID_Role: roleName
            });
            success(`Role ${roleName} berhasil ditugaskan!`);
            loadUserData();
        } catch (err) {
            error(err.response?.data?.message || "Gagal menugaskan role");
        }
    };

    return (
        <NavigationWidget>
            <div className="rbac-test-page" style={{ padding: '20px' }}>
                <h2 className="mb-4">
                    <Lock /> RBAC Test Page
                </h2>

                {/* Current User Info */}
                <Card className="mb-4">
                    <Card.Header className="bg-primary text-white">
                        <Tag /> User Information
                    </Card.Header>
                    <Card.Body>
                        {currentUser ? (
                            <Table striped bordered size="sm">
                                <tbody>
                                    <tr>
                                        <th width="30%">ID User:</th>
                                        <td>{currentUser.ID_User || '-'}</td>
                                    </tr>
                                    <tr>
                                        <th>Username:</th>
                                        <td>{currentUser.username || '-'}</td>
                                    </tr>
                                    <tr>
                                        <th>Email:</th>
                                        <td>{currentUser.email || '-'}</td>
                                    </tr>
                                    <tr>
                                        <th>Role:</th>
                                        <td>
                                            <Badge bg="primary">
                                                {currentUser.role || 'user'}
                                            </Badge>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Department:</th>
                                        <td>{currentUser.department || '-'}</td>
                                    </tr>
                                </tbody>
                            </Table>
                        ) : (
                            <p className="text-muted">Tidak ada informasi user</p>
                        )}
                    </Card.Body>
                </Card>

                {/* Available Roles */}
                <Card className="mb-4">
                    <Card.Header className="bg-success text-white">
                        <Users /> Available Roles
                    </Card.Header>
                    <Card.Body>
                        {loading ? (
                            <p>Loading...</p>
                        ) : roles.length > 0 ? (
                            <Table striped bordered hover size="sm">
                                <thead>
                                    <tr>
                                        <th>ID Role</th>
                                        <th>Role Name</th>
                                        <th>Description</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {roles.map((role, index) => (
                                        <tr key={index}>
                                            <td>{role.ID_Role || role.id || '-'}</td>
                                            <td>
                                                <Badge bg="info">
                                                    {role.role_name || role.name || role.role || '-'}
                                                </Badge>
                                            </td>
                                            <td>{role.description || '-'}</td>
                                            <td>
                                                <Button
                                                    size="sm"
                                                    variant="outline-primary"
                                                    onClick={() => handleAssignRole(
                                                        role.ID_Role || role.id || role.role
                                                    )}
                                                >
                                                    Assign to Me
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        ) : (
                            <p className="text-muted">No roles available</p>
                        )}
                    </Card.Body>
                </Card>

                {/* Permissions */}
                <Card className="mb-4">
                    <Card.Header className="bg-warning">
                        <Key /> Available Permissions
                    </Card.Header>
                    <Card.Body>
                        {loading ? (
                            <p>Loading...</p>
                        ) : permissions.length > 0 ? (
                            <Table striped bordered hover size="sm">
                                <thead>
                                    <tr>
                                        <th>ID Permission</th>
                                        <th>Permission Name</th>
                                        <th>Module</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {permissions.map((perm, index) => (
                                        <tr key={index}>
                                            <td>{perm.ID_Permission || perm.id || '-'}</td>
                                            <td>
                                                <Badge bg="secondary">
                                                    {perm.permission_name || perm.name || perm.permission || '-'}
                                                </Badge>
                                            </td>
                                            <td>{perm.module || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        ) : (
                            <p className="text-muted">No permissions available</p>
                        )}
                    </Card.Body>
                </Card>

                {/* My Permissions */}
                <Card className="mb-4">
                    <Card.Header className="bg-danger text-white">
                        <Lock /> My Permissions
                    </Card.Header>
                    <Card.Body>
                        {userPermissions.length > 0 ? (
                            <div>
                                <p className="mb-3">You have <strong>{userPermissions.length}</strong> permissions:</p>
                                <div>
                                    {userPermissions.map((perm, index) => (
                                        <Badge key={index} bg="danger" className="me-2 mb-2">
                                            {perm}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <p className="text-muted">No permissions assigned</p>
                        )}
                    </Card.Body>
                </Card>

                {/* Quick Actions */}
                <Card>
                    <Card.Header className="bg-dark text-white">
<Lightning weight="fill" /> Quick Actions
                    </Card.Header>
                    <Card.Body>
                        <div className="d-flex gap-2 flex-wrap">
                            <Button
                                variant="primary"
                                onClick={loadUserData}
                            >
<ArrowsClockwise /> Refresh Data
                            </Button>
                            <Button
                                variant="success"
                                onClick={() => {
                                    console.log("Current User:", AuthService.getUser());
                                    console.log("Has admin role:", AuthService.hasRole('admin'));
                                    console.log("Has hr_staff role:", AuthService.hasRole('hr_staff'));
                                    success("Check console for details!");
                                }}
                            >
<TestTube /> Test Permissions
                            </Button>
                            <Button
                                variant="info"
                                onClick={() => {
                                    const roles = ['admin', 'hr_staff', 'finance', 'manager', 'employee'];
                                    roles.forEach(role => {
                                        console.log(`Has ${role}:`, AuthService.hasRole(role));
                                    });
                                    success("Check console for role checks!");
                                }}
                            >
<ChartBar /> Check All Roles
                            </Button>
                            <Button
                                variant="warning"
                                onClick={() => {
                                    console.log("Role Hierarchy Test:");
                                    console.log("Admin or higher:", AuthService.hasRoleOrHigher('admin'));
                                    console.log("Manager or higher:", AuthService.hasRoleOrHigher('manager'));
                                    console.log("HR Staff or higher:", AuthService.hasRoleOrHigher('hr_staff'));
                                    success("Check console for hierarchy test!");
                                }}
                            >
<TrendUp /> Test Hierarchy
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </NavigationWidget>
    );
};

export default RBACTestPage;
