import { Box, Button, Container, InputBase, IconButton } from "@mui/material";
import { useState, useMemo } from "react";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { GameDescription } from "../features/GameLobby/GameDescription";
import { games } from "../features/questions/data/categories";
import { useParams, useNavigate } from "react-router-dom";
import routes from "../global/router/model/routes.model";

// Blend game color with base green
const blendColors = (gameColor: string, baseColor: string = "#10b981", ratio: number = 0.3) => {
  const hex2rgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };

  const game = hex2rgb(gameColor);
  const base = hex2rgb(baseColor);

  const r = Math.round(base.r * (1 - ratio) + game.r * ratio);
  const g = Math.round(base.g * (1 - ratio) + game.g * ratio);
  const b = Math.round(base.b * (1 - ratio) + game.b * ratio);

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

export const GameLobby = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const game = games[gameId as keyof typeof games] || null;

  const accentColor = useMemo(() => {
    return game?.color ? blendColors(game.color, "#10b981", 0.35) : "#10b981";
  }, [game?.color]);

  const [playerName, setPlayerName] = useState(() =>
    localStorage.getItem("playerName") || ""
  );
  const [isFocused, setIsFocused] = useState(false);

  const handleBack = () => {
    navigate(routes.home);
  };

  const handlePlay = () => {
    if (playerName.trim()) {
      localStorage.setItem("playerName", playerName);
    }

    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    navigate(routes.gameRoom.replace(":gameId", gameId || "").replace(":roomId", roomId));
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (playerName.trim()) {
      localStorage.setItem("playerName", playerName);
    }
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && playerName.trim()) {
      handlePlay();
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        animation: "fadeIn 0.5s ease-out",
        "@keyframes fadeIn": {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          maxWidth: "560px",
          py: { xs: 3, sm: 4 },
          px: { xs: 2, sm: 3 },
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        {/* Back Button */}
        <IconButton
          onClick={handleBack}
          sx={{
            alignSelf: "flex-start",
            width: 44,
            height: 44,
            borderRadius: "12px",
            backgroundColor: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            color: "rgba(250, 250, 250, 0.6)",
            mb: 4,
            transition: "all 0.25s ease",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.06)",
              color: "#fafafa",
              borderColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          <ArrowForwardIcon sx={{ fontSize: "1.25rem" }} />
        </IconButton>

        {/* Game Description */}
        <Box
          sx={{
            animation: "fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both",
            "@keyframes fadeInUp": {
              from: { opacity: 0, transform: "translateY(20px)" },
              to: { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          <GameDescription
            icon={game?.icon || ""}
            title={game?.title || ""}
            longDescription={game?.longDescription || ""}
            color={game?.color}
          />
        </Box>

        {/* Spacer */}
        <Box sx={{ flex: 1, minHeight: 48 }} />

        {/* Input Section */}
        <Box
          sx={{
            animation: "fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both",
            "@keyframes fadeInUp": {
              from: { opacity: 0, transform: "translateY(20px)" },
              to: { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          {/* Input Container */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              borderRadius: "16px",
              overflow: "hidden",
              backgroundColor: "rgba(255, 255, 255, 0.03)",
              border: `1px solid ${isFocused ? `${accentColor}60` : "rgba(255, 255, 255, 0.08)"}`,
              boxShadow: isFocused
                ? `0 0 0 4px ${accentColor}15, 0 8px 32px rgba(0, 0, 0, 0.3)`
                : "0 4px 24px rgba(0, 0, 0, 0.2)",
              transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <InputBase
              placeholder="השם שלך..."
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={handleBlur}
              onKeyDown={handleEnter}
              sx={{
                flex: 1,
                py: 2,
                px: 2.5,
                fontSize: "1.05rem",
                color: "#fafafa",
                direction: "rtl",
                "& input::placeholder": {
                  color: "rgba(250, 250, 250, 0.35)",
                  opacity: 1,
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handlePlay}
              disabled={!playerName.trim()}
              sx={{
                px: 4,
                fontSize: "1rem",
                fontWeight: 600,
                borderRadius: 0,
                background: playerName.trim()
                  ? `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}dd 100%)`
                  : "rgba(255, 255, 255, 0.05)",
                color: playerName.trim() ? "#fff" : "rgba(250, 250, 250, 0.3)",
                textTransform: "none",
                minWidth: "100px",
                boxShadow: "none",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: playerName.trim()
                    ? `linear-gradient(135deg, ${accentColor}dd 0%, ${accentColor}bb 100%)`
                    : "rgba(255, 255, 255, 0.05)",
                  boxShadow: playerName.trim() ? `0 0 20px ${accentColor}50` : "none",
                },
                "&.Mui-disabled": {
                  background: "rgba(255, 255, 255, 0.05)",
                  color: "rgba(250, 250, 250, 0.25)",
                },
              }}
            >
              המשך
            </Button>
          </Box>

          {/* Helper Text */}
          <Box
            sx={{
              mt: 2,
              textAlign: "center",
              opacity: 0.5,
              fontSize: "0.85rem",
              color: "rgba(250, 250, 250, 0.5)",
            }}
          >
            הזינו את שמכם כדי להתחיל
          </Box>
        </Box>

        {/* Bottom Spacing */}
        <Box sx={{ height: { xs: 24, sm: 48 } }} />
      </Container>
    </Box>
  );
};
