import { Box, Typography, Chip } from "@mui/material";

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
                gap: 2,
            }}
        >
            {/* Question number badge */}
            <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Chip
                    label={`שאלה ${index} מתוך ${totalQuestions}`}
                    size="small"
                    sx={{
                        backgroundColor: "rgba(34, 197, 94, 0.2)",
                        color: "#22c55e",
                        fontWeight: 500,
                        border: "1px solid rgba(34, 197, 94, 0.3)",
                    }}
                />
            </Box>

            {/* Question text */}
            <Typography
                variant="h5"
                sx={{
                    color: "#fff",
                    textAlign: "center",
                    fontWeight: 500,
                    lineHeight: 1.6,
                    direction: "rtl",
                }}
            >
                {question}
            </Typography>
        </Box>
    );
};
