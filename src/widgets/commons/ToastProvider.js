import { useState, useCallback, useMemo, createContext, useContext } from "react";
import Toast from "./Toast";
import "./Toast.css";

const ToastContext = createContext(null);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within ToastProvider");
    }
    return context;
};

const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((type, message, duration = 5000) => {
        const id = Date.now() + Math.random();
        console.log(`[Toast] Adding ${type} toast:`, message);
        setToasts((prev) => [...prev, { id, type, message, duration }]);
        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const success = useCallback((message, duration) => addToast('success', message, duration), [addToast]);
    const error = useCallback((message, duration) => addToast('error', message, duration), [addToast]);
    const warning = useCallback((message, duration) => addToast('warning', message, duration), [addToast]);
    const info = useCallback((message, duration) => addToast('info', message, duration), [addToast]);

    // Keep a stable identity across renders so components that put
    // success/error/etc. in a useEffect dependency array don't re-fire
    // on every toast add/remove (which previously caused infinite fetch loops).
    const toast = useMemo(() => ({ success, error, warning, info }), [success, error, warning, info]);

    const contextValue = useMemo(() => ({
        toast,
        success,
        error,
        warning,
        info,
    }), [toast, success, error, warning, info]);

    return (
        <ToastContext.Provider value={contextValue}>
            {children}
            <div className="toast-container">
                {toasts.map((toastData) => (
                    <Toast
                        key={toastData.id}
                        id={toastData.id}
                        type={toastData.type}
                        message={toastData.message}
                        duration={toastData.duration}
                        onClose={removeToast}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export { ToastProvider };
export default ToastProvider;
