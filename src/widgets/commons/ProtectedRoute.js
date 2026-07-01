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
    // 'ok' | 'unauthenticated' (no/expired session -> login) | 'forbidden' (logged in, wrong role -> unauthorized page)
    const [status, setStatus] = useState('checking');

    useEffect(() => {
        checkAccess();
    }, [requiredRole, requiredRoles]);

    const checkAccess = async () => {
        try {
            // Not logged in at all -> send to login
            if (!AuthService.isLoggedIn()) {
                setStatus('unauthenticated');
                setIsChecking(false);
                return;
            }

            // If no role requirement, allow access
            if (!requiredRole && requiredRoles.length === 0) {
                setStatus('ok');
                setIsChecking(false);
                return;
            }

            // Check single role
            if (requiredRole && AuthService.hasRole(requiredRole)) {
                setStatus('ok');
                setIsChecking(false);
                return;
            }

            // Check multiple roles
            if (requiredRoles.length > 0 && AuthService.hasAnyRole(requiredRoles)) {
                setStatus('ok');
                setIsChecking(false);
                return;
            }

            // Logged in, but role isn't allowed for this route
            setStatus('forbidden');
        } catch (error) {
            console.error("ProtectedRoute error:", error);
            setStatus('forbidden');
        } finally {
            setIsChecking(false);
        }
    };

    // Show loading or nothing while checking
    if (isChecking) {
        return null; // or <Spinner /> if you want
    }

    if (status === 'unauthenticated') {
        return <Navigate to={redirectPath} replace />;
    }

    if (status === 'forbidden') {
        return <Navigate to="/unauthorized" replace state={{ from: location }} />;
    }

    return children;
};

export default ProtectedRoute;
