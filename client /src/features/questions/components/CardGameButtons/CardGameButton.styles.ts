import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

export const CardGameButtonStyles = styled(Box)({
  cursor: "pointer",
  position: "relative",
  borderRadius: "18px",
  padding: "20px 16px 18px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "140px",
  background: "rgba(255, 255, 255, 0.02)",
  border: "1px solid rgba(255, 255, 255, 0.06)",
  transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
  overflow: "hidden",

  "&:hover": {
    transform: "translateY(-6px)",
    background: "rgba(255, 255, 255, 0.04)",
    borderColor: "rgba(255, 255, 255, 0.12)",
    boxShadow: "0 16px 48px rgba(0, 0, 0, 0.35)",

    "& > div:first-of-type": {
      transform: "scale(1.08)",
    },
  },

  "&:active": {
    transform: "translateY(-2px) scale(0.98)",
    transition: "all 0.15s ease",
  },
});
