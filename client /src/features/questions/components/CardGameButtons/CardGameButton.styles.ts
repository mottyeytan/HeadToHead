import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

export const CardGameButtonStyles = styled(Box)({
  cursor: "pointer",
  borderRadius: "16px",
  padding: "20px 16px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "160px",
  height: "110px",
  backgroundColor: "rgba(30, 60, 30, 0.85)",
  border: "1px solid rgba(46, 204, 113, 0.3)",
  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
  transition: "all 0.3s ease",
  color: "#fff",
  "&:hover": {
    transform: "translateY(-8px) scale(1.02)",
    boxShadow: "0 8px 25px rgba(46, 204, 113, 0.3)",
    backgroundColor: "rgba(40, 80, 40, 0.95)",
    borderColor: "rgba(46, 204, 113, 0.6)",
  },
  "&:active": {
    transform: "translateY(-2px) scale(0.98)",
  },
});
