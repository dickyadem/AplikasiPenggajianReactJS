import HTTPService from "./HTTPService";
import AuthService from "./AuthService";

const RBACService = {};

// ============================================
// ROLE MANAGEMENT
// ============================================

RBACService.getRoles = () => {
    return HTTPService.get(`/rbac/roles`);
};

RBACService.createRole = (roleData) => {
    return HTTPService.post(`/rbac/roles`, roleData);
};

RBACService.getRole = (ID_Role) => {
    return HTTPService.get(`/rbac/roles/${ID_Role}`);
};

RBACService.updateRole = (ID_Role, roleData) => {
    return HTTPService.put(`/rbac/roles/${ID_Role}`, roleData);
};

RBACService.deleteRole = (ID_Role) => {
    return HTTPService.delete(`/rbac/roles/${ID_Role}`);
};

// ============================================
// PERMISSION MANAGEMENT
// ============================================

RBACService.getPermissions = () => {
    return HTTPService.get(`/rbac/permissions`);
};

RBACService.createPermission = (permissionData) => {
    return HTTPService.post(`/rbac/permissions`, permissionData);
};

RBACService.getRolePermissions = (ID_Role) => {
    return HTTPService.get(`/rbac/roles/${ID_Role}/permissions`);
};

RBACService.assignPermission = (ID_Role, permissionData) => {
    return HTTPService.post(`/rbac/roles/${ID_Role}/permissions`, permissionData);
};

RBACService.removePermission = (ID_Role, ID_Permission) => {
    return HTTPService.delete(`/rbac/roles/${ID_Role}/permissions/${ID_Permission}`);
};

// ============================================
// USER ROLE MANAGEMENT
// ============================================

RBACService.assignUserRole = (ID_User, roleData) => {
    return HTTPService.post(`/rbac/users/${ID_User}/role`, roleData);
};

RBACService.getUserRole = (ID_User) => {
    return HTTPService.get(`/rbac/users/${ID_User}/role`);
};

RBACService.removeUserRole = (ID_User) => {
    return HTTPService.delete(`/rbac/users/${ID_User}/role`);
};

// ============================================
// HELPER FUNCTIONS
// ============================================

RBACService.hasPermission = async (permission) => {
    const user = AuthService.getUser();

    if (user.role === 'admin') {
        return true;
    }

    try {
        const response = await RBACService.getUserRole(user.ID_User);
        const userPermissions = response.data.permissions || [];
        return userPermissions.includes(permission);
    } catch (error) {
        console.error("Error checking permission:", error);
        return false;
    }
};

RBACService.getUserPermissions = async () => {
    const user = AuthService.getUser();

    if (!user.ID_User) {
        return [];
    }

    try {
        const response = await RBACService.getUserRole(user.ID_User);
        return response.data.permissions || [];
    } catch (error) {
        console.error("Error getting user permissions:", error);
        return [];
    }
};

export default RBACService;
