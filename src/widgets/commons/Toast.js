import { useEffect } from "react";
import { 
    FaCheckCircle, FaExclamationCircle, FaExclamationTriangle, 
    FaInfoCircle, FaTimes 
} from "react-icons/fa";
import "./Toast.css";

const Toast = ({ id, type, message, duration = 5000, onClose }) => {
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                onClose(id);
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [id, duration, onClose]);

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <FaCheckCircle className="toast-icon success" />;
            case 'error':
                return <FaExclamationCircle className="toast-icon error" />;
            case 'warning':
                return <FaExclamationTriangle className="toast-icon warning" />;
            case 'info':
                return <FaInfoCircle className="toast-icon info" />;
            default:
                return <FaInfoCircle className="toast-icon info" />;
        }
    };

    const getTypeClass = () => {
        return `toast-${type}`;
    };

    return (
        <div className={`toast ${getTypeClass()} toast-animate`}>
            <div className="toast-content">
                <div className="toast-icon-wrapper">
                    {getIcon()}
                </div>
                <div className="toast-message">
                    {message}
                </div>
                <button className="toast-close" onClick={() => onClose(id)}>
                    <FaTimes />
                </button>
            </div>
            <div className="toast-progress">
                <div 
                    className="toast-progress-bar" 
                    style={{ 
                        animation: `progress ${duration}ms linear`,
                        animationFillMode: 'forwards'
                    }}
                />
            </div>
        </div>
    );
};

export default Toast;
