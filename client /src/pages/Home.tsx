import { CardGameButton } from "../features/questions/components/CardGameButtons/CardGameButton";
import { categorySections } from "../features/questions/data/categories";
import type { GameCard } from "../features/questions/types/CradGameButtons/CradGameButtons";
import { useNavigate } from "react-router-dom";
import routes from "../global/router/model/routes.model";
import { Box, Typography } from "@mui/material";

export const Home = () => {
  const navigate = useNavigate();

  const handleSelectGame = (game: GameCard) => {
    navigate(routes.gameLobby.replace(":gameId", game.id));
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: { xs: 4, sm: 6 },
        px: { xs: 2, sm: 3 },
      }}
    >
      {/* Container */}
      <Box
        sx={{
          maxWidth: "1000px",
          margin: "0 auto",
          animation: "fadeIn 0.6s ease-out",
          "@keyframes fadeIn": {
            from: { opacity: 0 },
            to: { opacity: 1 },
          },
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            textAlign: "center",
            mb: { xs: 6, sm: 8 },
            animation: "fadeInDown 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
            "@keyframes fadeInDown": {
              from: { opacity: 0, transform: "translateY(-24px)" },
              to: { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          {/* Logo/Brand Mark */}
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 72,
              height: 72,
              borderRadius: "20px",
              background: "linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05))",
              border: "1px solid rgba(16, 185, 129, 0.2)",
              mb: 3,
              boxShadow: "0 0 40px rgba(16, 185, 129, 0.15)",
            }}
          >
            <Typography sx={{ fontSize: "2rem" }}>?</Typography>
          </Box>

          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "2rem", sm: "2.75rem" },
              fontWeight: 700,
              letterSpacing: "-0.02em",
              mb: 1.5,
              background: "linear-gradient(135deg, #fafafa 0%, rgba(250, 250, 250, 0.8) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            טריוויה ראש בראש
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: "1rem", sm: "1.1rem" },
              color: "rgba(250, 250, 250, 0.5)",
              fontWeight: 400,
              letterSpacing: "0.01em",
            }}
          >
            בחרו קטגוריה והזמינו חברים למשחק
          </Typography>
        </Box>

        {/* Categories */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 5, sm: 6 } }}>
          {categorySections.map((category, categoryIndex) => (
            <Box
              key={category.id}
              sx={{
                animation: `fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${categoryIndex * 0.1}s both`,
                "@keyframes fadeInUp": {
                  from: { opacity: 0, transform: "translateY(24px)" },
                  to: { opacity: 1, transform: "translateY(0)" },
                },
              }}
            >
              {/* Category Header */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  mb: 2.5,
                  px: 0.5,
                }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: "1.1rem", sm: "1.2rem" },
                    fontWeight: 600,
                    color: "rgba(250, 250, 250, 0.9)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {category.name}
                </Typography>
                <Box
                  sx={{
                    flex: 1,
                    height: "1px",
                    background: "linear-gradient(90deg, rgba(255, 255, 255, 0.1), transparent)",
                  }}
                />
              </Box>

              {/* Games Grid */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "repeat(2, 1fr)",
                    sm: "repeat(3, 1fr)",
                    md: "repeat(4, 1fr)",
                    lg: "repeat(5, 1fr)",
                  },
                  gap: { xs: 1.5, sm: 2 },
                }}
              >
                {category.games.map((game, gameIndex) => (
                  <Box
                    key={game.id}
                    sx={{
                      animation: `scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${categoryIndex * 0.1 + gameIndex * 0.05}s both`,
                      "@keyframes scaleIn": {
                        from: { opacity: 0, transform: "scale(0.9)" },
                        to: { opacity: 1, transform: "scale(1)" },
                      },
                    }}
                  >
                    <CardGameButton
                      title={game.title}
                      description={game.description}
                      icon={game.icon}
                      color={game.color}
                      onClick={() => handleSelectGame(game)}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </Box>

        {/* Footer */}
        <Box
          sx={{
            mt: { xs: 8, sm: 10 },
            pt: 4,
            borderTop: "1px solid rgba(255, 255, 255, 0.06)",
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: "0.8rem",
              color: "rgba(250, 250, 250, 0.25)",
              letterSpacing: "0.02em",
            }}
          >
            Head to Head
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
