import { Box, TextField, Button } from "@mui/material";
import { useState } from "react";

interface AnswerInputProps {
    onSubmit: (answer: string) => void;
    disabled?: boolean;
}

export const AnswerInput = ({ onSubmit, disabled = false }: AnswerInputProps) => {
    const [answer, setAnswer] = useState<string>("");
    
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (disabled) return;

        const trimmedAnswer = answer.trim();
        if (!trimmedAnswer || trimmedAnswer.length === 0) return;

        onSubmit(trimmedAnswer);
        setAnswer("");
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box 
                component="form" 
                onSubmit={handleSubmit}
                sx={{ 
                    display: "flex", 
                    gap: 2,
                    alignItems: "center",
                }}
            >
                <TextField
                    label="התשובה שלך"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    disabled={disabled}
                    fullWidth
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                            "& fieldset": {
                                borderColor: "rgba(255, 255, 255, 0.2)",
                            },
                            "&:hover fieldset": {
                                borderColor: "rgba(34, 197, 94, 0.5)",
                            },
                            "&.Mui-focused fieldset": {
                                borderColor: "#22c55e",
                            },
                        },
                        "& .MuiInputLabel-root": {
                            color: "rgba(255, 255, 255, 0.5)",
                        },
                        "& .MuiInputBase-input": {
                            color: "#fff",
                        },
                    }}
                />
                <Button
                    type="submit"
                    variant="contained"
                    disabled={disabled}
                    sx={{
                        borderRadius: 2,
                        px: 3,
                        py: 1.5,
                        backgroundColor: "#22c55e",
                        "&:hover": {
                            backgroundColor: "#16a34a",
                        },
                        "&.Mui-disabled": {
                            backgroundColor: "rgba(34, 197, 94, 0.3)",
                        },
                    }}
                >
                    שלח
                </Button>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, justifyContent: "center" }}>
                <Box sx={{ flex: 1, height: "1px", backgroundColor: "rgba(255, 255, 255, 0.1)" }} />
                <Button
                    variant="text"
                    onClick={() => !disabled && onSubmit("אני לא יודע")}
                    disabled={disabled}
                    sx={{
                        color: "rgba(255, 255, 255, 0.5)",
                        fontSize: "0.875rem",
                        "&:hover": {
                            color: "rgba(255, 255, 255, 0.7)",
                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                        },
                    }}
                >
                    אני לא יודע
                </Button>
                <Box sx={{ flex: 1, height: "1px", backgroundColor: "rgba(255, 255, 255, 0.1)" }} />
            </Box>
        </Box>
    );
};
