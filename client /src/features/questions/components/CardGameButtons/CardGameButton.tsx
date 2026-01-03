import { Typography, Box } from "@mui/material";
import { CardGameButtonStyles } from "./CardGameButton.styles";

export interface CardGameButtonProps {
  title: string;
  description: string;
  icon: string;
  onClick: () => void;
}

export const CardGameButton = ({ title, icon, onClick }: CardGameButtonProps) => {
  return (
    <CardGameButtonStyles onClick={onClick}>
      <Box sx={{ fontSize: "2.5rem", mb: 1 }}>{icon}</Box>
      <Typography variant="subtitle1" sx={{ fontWeight: "bold", textAlign: "center", color: "#fff" }}>
        {title}
      </Typography>
    </CardGameButtonStyles>
  );
};
