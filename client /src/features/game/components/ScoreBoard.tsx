import { Box, Typography } from "@mui/material";
import type { Score } from "../types/game.types";

interface ScoreBoardProps {
    scores: Score[];
}

export const ScoreBoard = ({ scores }: ScoreBoardProps) => {
    if (!scores || scores.length === 0) return null;

    // Sort by score descending
    const sortedScores = [...scores].sort((a, b) => b.score - a.score);

    return (
        <Box
            sx={{
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: 2,
                p: 2,
            }}
        >
            <Typography
                color="rgba(255, 255, 255, 0.6)"
                variant="caption"
                sx={{ mb: 1, display: "block", textAlign: "center" }}
            >
                ניקוד
            </Typography>
            
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {sortedScores.map((score, index) => (
                    <Box
                        key={score.id}
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 2,
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            backgroundColor: index === 0 ? "rgba(34, 197, 94, 0.1)" : "transparent",
                        }}
                    >
                        <Typography
                            color={index === 0 ? "#22c55e" : "rgba(255, 255, 255, 0.8)"}
                            variant="body2"
                            sx={{ fontWeight: index === 0 ? 600 : 400 }}
                        >
                            {index === 0 && "👑 "}{score.name}
                        </Typography>
                        <Typography
                            color={index === 0 ? "#22c55e" : "rgba(255, 255, 255, 0.6)"}
                            variant="body2"
                            sx={{ fontWeight: 600 }}
                        >
                            {score.score}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};
