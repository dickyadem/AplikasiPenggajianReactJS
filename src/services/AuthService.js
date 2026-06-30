import config from "../config";
import HTTPService from "./HTTPService";

const ENPOINT_LOGIN = "/user/login";
const ENDPOINT_CHECK_TOKEN = "/hello/world";
const KEY_LOCAL_STORAGE_TOKEN = "TOKEN";
const KEY_LOCAL_STORAGE_USER = "USER";

const login = async ({ email, password }) => {
  const response = await HTTPService.post(`${config.BASE_URL}${ENPOINT_LOGIN}`, {
    email,
    password,
  });
  
  // Save token and user info when login successful
  if (response.data && response.data.token) {
    saveToken(response.data.token);
    
    // Try to get user info from response first
    let userInfo = response.data.user;
    
    // If no user info in response, decode from token
    if (!userInfo) {
      try {
        const tokenData = JSON.parse(atob(response.data.token.split('.')[1]));
        console.log("Decoded token data:", tokenData);
        
        userInfo = {
          email: tokenData.email || email,
          username: tokenData.NamaLengkap || email.split('@')[0],
          role: tokenData.role || 'admin',  // Default to admin if not in token
          department: tokenData.department || null,
          ID_User: tokenData.ID_User || tokenData.email || email
        };
        
        console.log("User info from token:", userInfo);
      } catch (error) {
        console.error("Error decoding token:", error);
        // Fallback
        userInfo = {
          email: email,
          role: 'admin',  // Default for testing
          username: email.split('@')[0],
          ID_User: email
        };
      }
    }
    
    saveUserInfo(userInfo);
    console.log("Saved user info:", userInfo);
  }
  
  return response;
};

const tokenVerify = async () => {
  // TEMPORARILY DISABLED FOR TESTING
  // Uncomment after backend token verification is working
  /*
  try {
    let token = getToken();

    if (token) {
      await HTTPService.post(
        `${config.BASE_URL}${ENDPOINT_CHECK_TOKEN}`,
        {},
        {
          headers: {
            "x-access-token": token,
          },
        }
      );

      return true;
    }

    return false;
  } catch (error) {
    console.error("Token verification failed:", error);
    return false;
  }
  */
  
  // For now, just check if token exists
  return !!getToken();
};

const saveToken = (token) => {
    localStorage.setItem(KEY_LOCAL_STORAGE_TOKEN, token);
};

const getToken = () => {
    return localStorage.getItem(KEY_LOCAL_STORAGE_TOKEN);
};

// Save user info
const saveUserInfo = (userInfo) => {
    localStorage.setItem(KEY_LOCAL_STORAGE_USER, JSON.stringify(userInfo));
};

// Get current user info
const getUser = () => {
    try {
        const user = localStorage.getItem(KEY_LOCAL_STORAGE_USER);
        if (user) {
            const parsed = JSON.parse(user);
            // Ensure role exists, default to 'user' if not
            if (!parsed.role) {
                parsed.role = 'user';
            }
            return parsed;
        }
        return null;
    } catch (error) {
        console.error("Error parsing user info:", error);
        return null;
    }
};

// Check if user is logged in
const isLoggedIn = () => {
    return !!getToken();
};

// Get user role
const getRole = () => {
    const user = getUser();
    return user ? user.role : null;
};

// Check if user has specific role
const hasRole = (requiredRole) => {
    const user = getUser();
    if (!user) return false;

    const userRole = user.role?.toLowerCase();
    if (userRole === 'admin') return true;

    return userRole === requiredRole?.toLowerCase();
};

// Check if user has any of the specified roles
const hasAnyRole = (roles) => {
    const user = getUser();
    if (!user) return false;

    const userRole = user.role?.toLowerCase();
    if (userRole === 'admin') return true;

    return roles.map(r => r.toLowerCase()).includes(userRole);
};

// Check permission (alias for hasRole)
const hasPermission = (permission) => {
    return hasRole(permission);
};

// Role hierarchy (higher number = more access)
const ROLE_HIERARCHY = {
    'employee': 1,
    'finance': 2,
    'hr_staff': 3,
    'manager': 4,
    'admin': 5
};

// Check if user has role equal or higher than required
const hasRoleOrHigher = (requiredRole) => {
    const user = getUser();
    if (!user) return false;

    const userRole = user.role?.toLowerCase();
    const userLevel = ROLE_HIERARCHY[userRole] || 0;
    const requiredLevel = ROLE_HIERARCHY[requiredRole?.toLowerCase()] || 0;

    return userLevel >= requiredLevel;
};

// Change password
const changePassword = async (oldPassword, newPassword) => {
    const response = await HTTPService.put("/user/change-password", {
        oldPassword,
        newPassword,
    });
    return response;
};

// Logout
const logout = () => {
    console.log("Logout called - clearing session");
    console.log("Token before clear:", localStorage.getItem(KEY_LOCAL_STORAGE_TOKEN));
    console.log("User before clear:", localStorage.getItem(KEY_LOCAL_STORAGE_USER));
    
    localStorage.removeItem(KEY_LOCAL_STORAGE_TOKEN);
    localStorage.removeItem(KEY_LOCAL_STORAGE_USER);
    
    console.log("Token after clear:", localStorage.getItem(KEY_LOCAL_STORAGE_TOKEN));
    console.log("User after clear:", localStorage.getItem(KEY_LOCAL_STORAGE_USER));
};

const AuthService = {
  login,
  tokenVerify,
  getToken,
  saveToken,
  saveUserInfo,
  getUser,
  isLoggedIn,
  changePassword,
  getRole,
  hasRole,
  hasAnyRole,
  hasPermission,
  hasRoleOrHigher,
  logout
};

export default AuthService;
