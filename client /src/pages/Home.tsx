import { CardGameButton } from "../features/questions/components/CardGameButtons/CardGameButton";
import { categorySections } from "../features/questions/data/categories";
import type { GameCard } from "../features/questions/types/CradGameButtons/CradGameButtons";
import { useNavigate } from "react-router-dom";
import routes from "../global/router/model/routes.model";
import { Box, Typography } from "@mui/material";

export const Home = () => {
  const navigate = useNavigate();

  const handleSelectGame = (game: GameCard) => {
    console.log("Selected:", game.id);
    navigate(routes.gameLobby.replace(":gameId", game.id));
  };

  return (
    <Box sx={{ padding: "24px", maxWidth: "920px", margin: "0 auto" }}>
      <Typography
        variant="h3"
        sx={{
          mb: 4,
          fontWeight: "bold",
          textAlign: "center",
          color: "#fff",
          textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
        }}
      >
         טריוויה ראש בראש 
      </Typography>

      {categorySections.map((category) => (
        <Box key={category.id} sx={{ mb: 4 }}>
          <Typography
            variant="h5"
            sx={{
              mb: 2,
              fontWeight: "600",
              color: "#fff",
              pb: 1,
              borderBottom: "2px solid rgba(46, 204, 113, 0.4)",
              textAlign: "start",
              justifyContent: "center",
            }}
          >
            {category.name}
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box sx={{ width: "100%", display: "flex", flexWrap: "wrap", gap: 2, justifyContent: category.games.length >= 5 ? "space-between" : "flex-start", alignItems: "center" }}>
            {category.games.map((game) => (
              <CardGameButton 
                key={game.id}
                title={game.title}
                description={game.description}
                icon={game.icon}
                onClick={() => handleSelectGame(game)}
              />
            ))}
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
};
