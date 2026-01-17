import { Box, Typography } from "@mui/material";

interface QuestionCardProps {
    question: string;
    index: number;
    totalQuestions: number;
}

export const QuestionCard = ({ question, index, totalQuestions }: QuestionCardProps) => {
    if (!question) return null;

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2.5,
                animation: "fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                "@keyframes fadeInUp": {
                    from: { opacity: 0, transform: "translateY(12px)" },
                    to: { opacity: 1, transform: "translateY(0)" },
                },
            }}
        >
            {/* Question number */}
            <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Box
                    sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 0.75,
                        px: 1.5,
                        py: 0.5,
                        borderRadius: "8px",
                        backgroundColor: "rgba(16, 185, 129, 0.1)",
                        border: "1px solid rgba(16, 185, 129, 0.15)",
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: "0.8rem",
                            fontWeight: 500,
                            color: "#10b981",
                            letterSpacing: "0.01em",
                        }}
                    >
                        שאלה
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            fontVariantNumeric: "tabular-nums",
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: "0.85rem",
                                fontWeight: 600,
                                color: "#10b981",
                            }}
                        >
                            {index}
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: "0.75rem",
                                color: "rgba(16, 185, 129, 0.6)",
                            }}
                        >
                            /
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: "0.75rem",
                                color: "rgba(16, 185, 129, 0.6)",
                            }}
                        >
                            {totalQuestions}
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {/* Question text */}
            <Typography
                sx={{
                    fontSize: { xs: "1.15rem", sm: "1.3rem" },
                    fontWeight: 500,
                    color: "#fafafa",
                    textAlign: "center",
                    lineHeight: 1.6,
                    letterSpacing: "-0.01em",
                    direction: "rtl",
                }}
            >
                {question}
            </Typography>
        </Box>
    );
};
