import { Box, Typography } from "@mui/material";

export interface GameDescriptionProps {
  icon: string;
  title: string;
  longDescription: string;
}

export const GameDescription = ({ icon, title, longDescription }: GameDescriptionProps) => {

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "18px", fontFamily: "Arial, sans-serif" }}>
      <Typography variant="inherit" sx={{ fontSize: "2.5rem" }}>{icon}</Typography>
      <Typography variant="inherit" sx={{ fontSize: "2.5rem", fontWeight: "bold", color: "#fff" }}>{ `טריוויה ראש בראש ${title}`}</Typography>
      <Typography variant="inherit" sx={{ fontSize: "1.3rem", color: "rgba(255,255,255,0.7)" }}>{longDescription}</Typography>
    </Box>
  );
};