import { Spinner } from "react-bootstrap";

const LoadingOverlay = ({ show }) => {
  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <Spinner animation="border" variant="light" size="lg" />
        <span style={{ color: "white", fontWeight: "bold" }}>Loading...</span>
      </div>
    </div>
  );
};

export default LoadingOverlay;
