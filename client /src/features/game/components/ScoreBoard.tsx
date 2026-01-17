import { Box, Typography } from "@mui/material";
import type { Score } from "../types/game.types";

interface ScoreBoardProps {
    scores: Score[];
}

export const ScoreBoard = ({ scores }: ScoreBoardProps) => {
    if (!scores || scores.length === 0) return null;

    const sortedScores = [...scores].sort((a, b) => b.score - a.score);

    return (
        <Box
            sx={{
                borderRadius: "12px",
                backgroundColor: "rgba(255, 255, 255, 0.02)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                overflow: "hidden",
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    px: 2,
                    py: 1,
                    borderBottom: "1px solid rgba(255, 255, 255, 0.04)",
                }}
            >
                <Typography
                    sx={{
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        color: "rgba(250, 250, 250, 0.45)",
                        textAlign: "center",
                        letterSpacing: "0.02em",
                    }}
                >
                    ניקוד
                </Typography>
            </Box>

            {/* Scores */}
            <Box sx={{ p: 1 }}>
                {sortedScores.map((score, index) => (
                    <Box
                        key={score.id}
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 1.5,
                            px: 1.5,
                            py: 0.75,
                            borderRadius: "8px",
                            backgroundColor: index === 0 ? "rgba(16, 185, 129, 0.08)" : "transparent",
                            transition: "background-color 0.25s ease",
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            {/* Rank indicator */}
                            <Box
                                sx={{
                                    width: 20,
                                    height: 20,
                                    borderRadius: "6px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "0.7rem",
                                    fontWeight: 600,
                                    background: index === 0
                                        ? "linear-gradient(135deg, #fbbf24, #f59e0b)"
                                        : "rgba(255, 255, 255, 0.05)",
                                    color: index === 0 ? "#0d0d0d" : "rgba(250, 250, 250, 0.4)",
                                }}
                            >
                                {index + 1}
                            </Box>

                            {/* Name */}
                            <Typography
                                sx={{
                                    fontSize: "0.85rem",
                                    fontWeight: index === 0 ? 600 : 400,
                                    color: index === 0 ? "#10b981" : "rgba(250, 250, 250, 0.8)",
                                }}
                            >
                                {score.name}
                            </Typography>
                        </Box>

                        {/* Score */}
                        <Typography
                            sx={{
                                fontSize: "0.85rem",
                                fontWeight: 600,
                                color: index === 0 ? "#10b981" : "rgba(250, 250, 250, 0.5)",
                                fontVariantNumeric: "tabular-nums",
                            }}
                        >
                            {score.score}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};
