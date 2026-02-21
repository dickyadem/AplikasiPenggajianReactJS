import { useState, useCallback } from "react";

const useToast = () => {
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "info",
  });

  const showToast = useCallback((message, type = "info", duration = 3000) => {
    setToast({ show: true, message, type });
    return () => setToast((prev) => ({ ...prev, show: false }));
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, show: false }));
  }, []);

  const success = useCallback((message, duration) => {
    showToast(message, "success", duration);
  }, [showToast]);

  const error = useCallback((message, duration) => {
    showToast(message, "error", duration);
  }, [showToast]);

  const warning = useCallback((message, duration) => {
    showToast(message, "warning", duration);
  }, [showToast]);

  const info = useCallback((message, duration) => {
    showToast(message, "info", duration);
  }, [showToast]);

  return {
    toast,
    showToast,
    hideToast,
    success,
    error,
    warning,
    info,
  };
};

export default useToast;
