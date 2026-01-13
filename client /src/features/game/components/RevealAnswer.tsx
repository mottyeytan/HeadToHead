import { Box, Typography, Chip } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import type { PlayerResult } from "../types/game.types";

interface RevealAnswerProps {
    correctAnswer: string;
    explanation: string;
    results: PlayerResult[];
}

export const RevealAnswer = ({ correctAnswer, explanation, results }: RevealAnswerProps) => {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, width: "100%" }}>
            {/* Correct Answer */}
            <Box
                sx={{
                    backgroundColor: "rgba(34, 197, 94, 0.1)",
                    border: "1px solid rgba(34, 197, 94, 0.3)",
                    borderRadius: 3,
                    p: 3,
                    textAlign: "center",
                }}
            >
                <Typography
                    color="rgba(255, 255, 255, 0.6)"
                    variant="caption"
                    sx={{ mb: 1, display: "block" }}
                >
                    התשובה הנכונה
                </Typography>
                <Typography
                    variant="h4"
                    sx={{
                        color: "#22c55e",
                        fontWeight: "bold",
                    }}
                >
                    {correctAnswer}
                </Typography>
                
                {explanation && (
                    <Typography
                        color="rgba(255, 255, 255, 0.7)"
                        variant="body2"
                        sx={{ mt: 2, fontStyle: "italic" }}
                    >
                        {explanation}
                    </Typography>
                )}
            </Box>

            {/* Player Results */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Typography
                    color="rgba(255, 255, 255, 0.6)"
                    variant="caption"
                    sx={{ textAlign: "center" }}
                >
                    תשובות השחקנים
                </Typography>
                
                {results?.map((result) => (
                    <Box
                        key={result.id}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            backgroundColor: result.isCorrect
                                ? "rgba(34, 197, 94, 0.1)"
                                : "rgba(239, 68, 68, 0.1)",
                            border: `1px solid ${result.isCorrect ? "rgba(34, 197, 94, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
                            borderRadius: 2,
                            px: 2,
                            py: 1.5,
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            {result.isCorrect ? (
                                <CheckCircleIcon sx={{ color: "#22c55e", fontSize: 20 }} />
                            ) : (
                                <CancelIcon sx={{ color: "#ef4444", fontSize: 20 }} />
                            )}
                            <Typography
                                color={result.isCorrect ? "#22c55e" : "#ef4444"}
                                variant="body1"
                                sx={{ fontWeight: 500 }}
                            >
                                {result.name}
                            </Typography>
                        </Box>
                        
                        <Chip
                            label={result.answer || "לא ענה"}
                            size="small"
                            sx={{
                                backgroundColor: "rgba(255, 255, 255, 0.1)",
                                color: "rgba(255, 255, 255, 0.8)",
                                fontSize: "0.75rem",
                            }}
                        />
                    </Box>
                ))}
            </Box>
        </Box>
    );
};
