import { useEffect, useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";

const ToastWidget = ({ message, type = "info", show, onClose, duration = 3000 }) => {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    setVisible(show);
    if (show) {
      const timer = setTimeout(() => {
        setVisible(false);
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  const getStyle = () => {
    switch (type) {
      case "success":
        return {
          bg: "#ecfdf5",
          border: "1px solid #a7f3d0",
          borderLeft: "5px solid #059669",
          headerBg: "#059669",
          headerColor: "#ffffff",
          bodyColor: "#064e3b",
          icon: "\u2713"
        };
      case "error":
        return {
          bg: "#fef2f2",
          border: "1px solid #fecaca",
          borderLeft: "5px solid #dc2626",
          headerBg: "#dc2626",
          headerColor: "#ffffff",
          bodyColor: "#7f1d1d",
          icon: "\u2715"
        };
      case "warning":
        return {
          bg: "#fffbeb",
          border: "1px solid #fde68a",
          borderLeft: "5px solid #d97706",
          headerBg: "#d97706",
          headerColor: "#ffffff",
          bodyColor: "#78350f",
          icon: "\u26A0"
        };
      default:
        return {
          bg: "#eff6ff",
          border: "1px solid #bfdbfe",
          borderLeft: "5px solid #2563eb",
          headerBg: "#2563eb",
          headerColor: "#ffffff",
          bodyColor: "#1e3a5f",
          icon: "\u2139"
        };
    }
  };

  const style = getStyle();
  const label = type.charAt(0).toUpperCase() + type.slice(1);

  return (
    <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
      <Toast
        show={visible}
        onClose={onClose}
        delay={duration}
        autohide
        style={{
          background: style.bg,
          border: style.border,
          borderLeft: style.borderLeft,
          borderRadius: "12px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.12)"
        }}
      >
        <Toast.Header
          style={{
            background: style.headerBg,
            color: style.headerColor,
            borderRadius: "7px 7px 0 0"
          }}
          closeVariant="white"
        >
          <strong className="me-auto">
            {style.icon} {label}
          </strong>
        </Toast.Header>
        <Toast.Body style={{ color: style.bodyColor, fontWeight: 500 }}>
          {message}
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default ToastWidget;
