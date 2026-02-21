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

  const getBgClass = () => {
    switch (type) {
      case "success":
        return "bg-success";
      case "error":
        return "bg-danger";
      case "warning":
        return "bg-warning";
      default:
        return "bg-primary";
    }
  };

  return (
    <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
      <Toast
        bg={getBgClass()}
        show={visible}
        onClose={onClose}
        delay={duration}
        autohide
      >
        <Toast.Header className="text-white">
          <strong className="me-auto">
            {type === "success" && "✓ "}
            {type === "error" && "✕ "}
            {type === "warning" && "⚠ "}
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </strong>
        </Toast.Header>
        <Toast.Body className="text-white">{message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default ToastWidget;
