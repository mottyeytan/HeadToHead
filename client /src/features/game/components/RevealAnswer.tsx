import { Box, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import type { PlayerResult } from "../types/game.types";

interface RevealAnswerProps {
    correctAnswer: string;
    explanation: string;
    results: PlayerResult[];
}

export const RevealAnswer = ({ correctAnswer, explanation, results }: RevealAnswerProps) => {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, width: "100%" }}>
            {/* Correct Answer Card */}
            <Box
                sx={{
                    textAlign: "center",
                    py: 3,
                    px: 3,
                    borderRadius: "16px",
                    background: "linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(16, 185, 129, 0.06))",
                    border: "1px solid rgba(16, 185, 129, 0.25)",
                    animation: "scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    "@keyframes scaleIn": {
                        from: { opacity: 0, transform: "scale(0.9)" },
                        to: { opacity: 1, transform: "scale(1)" },
                    },
                }}
            >
                <Typography
                    sx={{
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        color: "rgba(16, 185, 129, 0.7)",
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                        mb: 1,
                    }}
                >
                    התשובה הנכונה
                </Typography>
                <Typography
                    sx={{
                        fontSize: { xs: "1.5rem", sm: "1.75rem" },
                        fontWeight: 700,
                        color: "#10b981",
                        lineHeight: 1.3,
                    }}
                >
                    {correctAnswer}
                </Typography>

                {explanation && (
                    <Typography
                        sx={{
                            mt: 2,
                            fontSize: "0.9rem",
                            color: "rgba(250, 250, 250, 0.6)",
                            lineHeight: 1.6,
                            fontStyle: "italic",
                        }}
                    >
                        {explanation}
                    </Typography>
                )}
            </Box>

            {/* Player Results */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Typography
                    sx={{
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        color: "rgba(250, 250, 250, 0.4)",
                        textAlign: "center",
                        letterSpacing: "0.02em",
                    }}
                >
                    תשובות השחקנים
                </Typography>

                {results?.map((result, index) => (
                    <Box
                        key={result.id}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 2,
                            px: 2,
                            py: 1.25,
                            borderRadius: "12px",
                            backgroundColor: result.isCorrect
                                ? "rgba(16, 185, 129, 0.08)"
                                : "rgba(239, 68, 68, 0.08)",
                            border: `1px solid ${result.isCorrect
                                ? "rgba(16, 185, 129, 0.2)"
                                : "rgba(239, 68, 68, 0.2)"}`,
                            animation: `slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s both`,
                            "@keyframes slideIn": {
                                from: { opacity: 0, transform: "translateX(-12px)" },
                                to: { opacity: 1, transform: "translateX(0)" },
                            },
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            {/* Status Icon */}
                            <Box
                                sx={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: "8px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: result.isCorrect
                                        ? "rgba(16, 185, 129, 0.2)"
                                        : "rgba(239, 68, 68, 0.2)",
                                }}
                            >
                                {result.isCorrect ? (
                                    <CheckIcon sx={{ color: "#10b981", fontSize: "0.9rem" }} />
                                ) : (
                                    <CloseIcon sx={{ color: "#ef4444", fontSize: "0.9rem" }} />
                                )}
                            </Box>

                            {/* Player Name */}
                            <Typography
                                sx={{
                                    fontSize: "0.95rem",
                                    fontWeight: 500,
                                    color: result.isCorrect ? "#10b981" : "#ef4444",
                                }}
                            >
                                {result.name}
                            </Typography>
                        </Box>

                        {/* Player's Answer */}
                        <Box
                            sx={{
                                px: 1.5,
                                py: 0.5,
                                borderRadius: "8px",
                                backgroundColor: "rgba(255, 255, 255, 0.05)",
                                maxWidth: "40%",
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: "0.8rem",
                                    color: "rgba(250, 250, 250, 0.7)",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {result.answer || "לא ענה"}
                            </Typography>
                        </Box>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};
