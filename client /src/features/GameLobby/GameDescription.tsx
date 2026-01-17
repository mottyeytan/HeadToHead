import { Box, Typography } from "@mui/material";

export interface GameDescriptionProps {
  icon: string;
  title: string;
  longDescription: string;
}

export const GameDescription = ({ icon, title, longDescription }: GameDescriptionProps) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Icon */}
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 80,
          height: 80,
          borderRadius: "20px",
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(255, 255, 255, 0.06)",
          fontSize: "2.5rem",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
        }}
      >
        {icon}
      </Box>

      {/* Title */}
      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: "1.75rem", sm: "2.25rem" },
          fontWeight: 700,
          letterSpacing: "-0.02em",
          color: "#fafafa",
          lineHeight: 1.2,
        }}
      >
        {title}
      </Typography>

      {/* Description */}
      <Typography
        sx={{
          fontSize: { xs: "1rem", sm: "1.1rem" },
          color: "rgba(250, 250, 250, 0.55)",
          lineHeight: 1.7,
          fontWeight: 400,
          letterSpacing: "0.01em",
        }}
      >
        {longDescription}
      </Typography>
    </Box>
  );
};
