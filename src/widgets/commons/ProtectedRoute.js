import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import AuthService from "../../services/AuthService";

const ProtectedRoute = ({ 
    children, 
    requiredRole = null,
    requiredRoles = [],
    redirectPath = "/" 
}) => {
    const location = useLocation();
    const [isChecking, setIsChecking] = useState(true);
    const [isAllowed, setIsAllowed] = useState(false);

    useEffect(() => {
        checkAccess();
    }, [requiredRole, requiredRoles]);

    const checkAccess = async () => {
        try {
            // Check if logged in
            if (!AuthService.isLoggedIn()) {
                setIsAllowed(false);
                setIsChecking(false);
                return;
            }

            // If no role requirement, allow access
            if (!requiredRole && requiredRoles.length === 0) {
                setIsAllowed(true);
                setIsChecking(false);
                return;
            }

            // Check single role
            if (requiredRole && AuthService.hasRole(requiredRole)) {
                setIsAllowed(true);
                setIsChecking(false);
                return;
            }

            // Check multiple roles
            if (requiredRoles.length > 0 && AuthService.hasAnyRole(requiredRoles)) {
                setIsAllowed(true);
                setIsChecking(false);
                return;
            }

            // Access denied
            setIsAllowed(false);
        } catch (error) {
            console.error("ProtectedRoute error:", error);
            setIsAllowed(false);
        } finally {
            setIsChecking(false);
        }
    };

    // Show loading or nothing while checking
    if (isChecking) {
        return null; // or <Spinner /> if you want
    }

    // Redirect if not allowed
    if (!isAllowed) {
        return <Navigate to={redirectPath} replace />;
    }

    return children;
};

export default ProtectedRoute;
