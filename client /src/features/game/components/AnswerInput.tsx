import { Box, Button, InputBase } from "@mui/material";
import { useState } from "react";
import SendIcon from "@mui/icons-material/Send";

interface AnswerInputProps {
    onSubmit: (answer: string) => void;
    disabled?: boolean;
}

export const AnswerInput = ({ onSubmit, disabled = false }: AnswerInputProps) => {
    const [answer, setAnswer] = useState<string>("");
    const [isFocused, setIsFocused] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (disabled) return;

        const trimmedAnswer = answer.trim();
        if (!trimmedAnswer || trimmedAnswer.length === 0) return;

        onSubmit(trimmedAnswer);
        setAnswer("");
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            {/* Input Form */}
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: "flex",
                    borderRadius: "14px",
                    overflow: "hidden",
                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                    border: `1px solid ${isFocused && !disabled ? "rgba(16, 185, 129, 0.4)" : "rgba(255, 255, 255, 0.08)"}`,
                    boxShadow: isFocused && !disabled
                        ? "0 0 0 4px rgba(16, 185, 129, 0.1)"
                        : "none",
                    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                    opacity: disabled ? 0.5 : 1,
                }}
            >
                <InputBase
                    placeholder="הקלד את תשובתך..."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    disabled={disabled}
                    sx={{
                        flex: 1,
                        py: 1.5,
                        px: 2,
                        fontSize: "1rem",
                        color: "#fafafa",
                        direction: "rtl",
                        "& input::placeholder": {
                            color: "rgba(250, 250, 250, 0.35)",
                            opacity: 1,
                        },
                    }}
                />
                <Button
                    type="submit"
                    disabled={disabled || !answer.trim()}
                    sx={{
                        px: 2.5,
                        borderRadius: 0,
                        background: answer.trim() && !disabled
                            ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                            : "transparent",
                        color: answer.trim() && !disabled ? "#fff" : "rgba(250, 250, 250, 0.3)",
                        minWidth: "auto",
                        transition: "all 0.3s ease",
                        "&:hover": {
                            background: answer.trim() && !disabled
                                ? "linear-gradient(135deg, #059669 0%, #047857 100%)"
                                : "transparent",
                        },
                        "&.Mui-disabled": {
                            color: "rgba(250, 250, 250, 0.2)",
                        },
                    }}
                >
                    <SendIcon sx={{ fontSize: "1.1rem", transform: "rotate(180deg)" }} />
                </Button>
            </Box>

            {/* Skip Option */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, justifyContent: "center" }}>
                <Box sx={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.06), transparent)" }} />
                <Button
                    onClick={() => !disabled && onSubmit("לא יודע")}
                    disabled={disabled}
                    sx={{
                        color: "rgba(250, 250, 250, 0.4)",
                        fontSize: "0.8rem",
                        textTransform: "none",
                        fontWeight: 400,
                        px: 2,
                        py: 0.5,
                        borderRadius: "8px",
                        transition: "all 0.25s ease",
                        "&:hover": {
                            color: "rgba(250, 250, 250, 0.6)",
                            backgroundColor: "rgba(255, 255, 255, 0.03)",
                        },
                        "&.Mui-disabled": {
                            color: "rgba(250, 250, 250, 0.2)",
                        },
                    }}
                >
                    דלג
                </Button>
                <Box sx={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.06), transparent)" }} />
            </Box>
        </Box>
    );
};
