import { Typography, Box } from "@mui/material";
import { CardGameButtonStyles } from "./CardGameButton.styles";

export interface CardGameButtonProps {
  title: string;
  description: string;
  icon: string;
  color?: string;
  onClick: () => void;
}

export const CardGameButton = ({ title, icon, color = "#10b981", onClick }: CardGameButtonProps) => {
  return (
    <CardGameButtonStyles onClick={onClick}>
      {/* Icon */}
      <Box
        sx={{
          fontSize: "2.2rem",
          mb: 1.5,
          color: color,
          transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
          filter: `drop-shadow(0 2px 8px ${color}40)`,
        }}
      >
        {icon}
      </Box>

      {/* Title */}
      <Typography
        sx={{
          fontSize: "0.85rem",
          fontWeight: 500,
          textAlign: "center",
          color: "rgba(250, 250, 250, 0.85)",
          lineHeight: 1.3,
          letterSpacing: "-0.01em",
          transition: "color 0.35s ease",
        }}
      >
        {title}
      </Typography>
    </CardGameButtonStyles>
  );
};
