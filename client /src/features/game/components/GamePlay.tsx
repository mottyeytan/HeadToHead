import { Box, Button, Typography, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useGame } from "../hooks/useGame";
import { ScoreBoard } from "./ScoreBoard";
import { Timer } from "./Timer";
import { RevealAnswer } from "./RevealAnswer";
import { AnswerInput } from "./AnswerInput";
import { QuestionCard } from "./QuestionCard";
import type { PlayerResult } from "../types/game.types";
import routes from "../../../global/router/model/routes.model";

export const GamePlay = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [showExitDialog, setShowExitDialog] = useState(false);

    const {
        phase,
        remainingTime,
        scores,
        currentQuestion,
        questionIndex,
        totalQuestions,
        hasAnswered,
        revealAnswer,
        winner,
        lastQuestionAnswer,
        GameMessage,
        submitAnswer,
        readyForNextQuestion,
        leaveGame,
        setGameMessage,
    } = useGame(roomId as string);

    const handleExitClick = () => {
        setShowExitDialog(true);
    };

    const handleExitConfirm = () => {
        leaveGame();
        navigate(routes.home);
    };

    const handleExitCancel = () => {
        setShowExitDialog(false);
    };

    const handleSubmitAnswer = (answer: string) => {
        submitAnswer(answer);
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                py: { xs: 2, sm: 3 },
                px: 2,
                animation: "fadeIn 0.5s ease-out",
                "@keyframes fadeIn": {
                    from: { opacity: 0 },
                    to: { opacity: 1 },
                },
            }}
        >
            {/* Exit Button */}
            <Box
                sx={{
                    position: "fixed",
                    top: 16,
                    right: 16,
                    zIndex: 1000,
                }}
            >
                <IconButton
                    onClick={handleExitClick}
                    sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "10px",
                        backgroundColor: "rgba(255, 255, 255, 0.03)",
                        border: "1px solid rgba(255, 255, 255, 0.06)",
                        color: "rgba(250, 250, 250, 0.5)",
                        transition: "all 0.25s ease",
                        "&:hover": {
                            backgroundColor: "rgba(239, 68, 68, 0.1)",
                            borderColor: "rgba(239, 68, 68, 0.3)",
                            color: "#ef4444",
                        },
                    }}
                >
                    <CloseIcon sx={{ fontSize: "1.1rem" }} />
                </IconButton>
            </Box>

            {/* Game Message Snackbar */}
            <Snackbar
                open={!!GameMessage && phase !== "finished"}
                autoHideDuration={4000}
                onClose={() => setGameMessage("")}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    severity="info"
                    variant="filled"
                    sx={{
                        backgroundColor: 'rgba(20, 20, 20, 0.95)',
                        backdropFilter: "blur(10px)",
                        color: '#fafafa',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: "10px",
                    }}
                >
                    {GameMessage}
                </Alert>
            </Snackbar>

            {/* Exit Confirmation Dialog */}
            <Dialog
                open={showExitDialog}
                onClose={handleExitCancel}
                PaperProps={{
                    sx: {
                        backgroundColor: "rgba(20, 20, 20, 0.98)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        borderRadius: "16px",
                        minWidth: 320,
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        color: "#fafafa",
                        textAlign: "center",
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        pt: 3,
                    }}
                >
                    יציאה מהמשחק
                </DialogTitle>
                <DialogContent>
                    <Typography
                        sx={{
                            color: "rgba(250, 250, 250, 0.6)",
                            textAlign: "center",
                            fontSize: "0.95rem",
                        }}
                    >
                        האם אתה בטוח שברצונך לצאת?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center", gap: 1.5, pb: 3, px: 3 }}>
                    <Button
                        onClick={handleExitCancel}
                        sx={{
                            flex: 1,
                            py: 1.25,
                            borderRadius: "10px",
                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            color: "rgba(250, 250, 250, 0.7)",
                            textTransform: "none",
                            fontWeight: 500,
                            "&:hover": {
                                backgroundColor: "rgba(255, 255, 255, 0.08)",
                            },
                        }}
                    >
                        ביטול
                    </Button>
                    <Button
                        onClick={handleExitConfirm}
                        sx={{
                            flex: 1,
                            py: 1.25,
                            borderRadius: "10px",
                            backgroundColor: "rgba(239, 68, 68, 0.15)",
                            border: "1px solid rgba(239, 68, 68, 0.3)",
                            color: "#ef4444",
                            textTransform: "none",
                            fontWeight: 500,
                            "&:hover": {
                                backgroundColor: "rgba(239, 68, 68, 0.25)",
                            },
                        }}
                    >
                        יציאה
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Header with Timer and Score */}
            <Box
                sx={{
                    width: "100%",
                    maxWidth: 560,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 2,
                    mb: 3,
                }}
            >
                {/* Timer */}
                {phase === "question" ? (
                    <Timer remainingTime={remainingTime} maxTime={15} />
                ) : (
                    <Box sx={{ width: 100 }} />
                )}

                {/* Score Board */}
                <Box sx={{ flex: 1 }}>
                    <ScoreBoard scores={scores} />
                </Box>
            </Box>

            {/* Main Game Content */}
            <Paper
                elevation={0}
                sx={{
                    width: "100%",
                    maxWidth: 560,
                    backgroundColor: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                    borderRadius: "20px",
                    p: { xs: 2.5, sm: 3 },
                    animation: "scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                    "@keyframes scaleIn": {
                        from: { opacity: 0, transform: "scale(0.96)" },
                        to: { opacity: 1, transform: "scale(1)" },
                    },
                }}
            >
                {/* Question Phase */}
                {phase === "question" && (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <QuestionCard
                            question={currentQuestion?.text || ""}
                            index={questionIndex}
                            totalQuestions={totalQuestions}
                        />

                        <AnswerInput onSubmit={handleSubmitAnswer} disabled={hasAnswered} />

                        {hasAnswered && (
                            <Box
                                sx={{
                                    textAlign: "center",
                                    animation: "fadeIn 0.4s ease-out",
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 1,
                                        px: 2,
                                        py: 1,
                                        borderRadius: "8px",
                                        backgroundColor: "rgba(255, 255, 255, 0.03)",
                                        mb: 2,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            gap: 0.5,
                                        }}
                                    >
                                        {[0, 1, 2].map((i) => (
                                            <Box
                                                key={i}
                                                sx={{
                                                    width: 4,
                                                    height: 4,
                                                    borderRadius: "50%",
                                                    backgroundColor: "rgba(250, 250, 250, 0.4)",
                                                    animation: `bounce 1.4s ease-in-out ${i * 0.16}s infinite`,
                                                    "@keyframes bounce": {
                                                        "0%, 80%, 100%": { transform: "scale(1)" },
                                                        "40%": { transform: "scale(1.5)" },
                                                    },
                                                }}
                                            />
                                        ))}
                                    </Box>
                                    <Typography
                                        sx={{
                                            color: "rgba(250, 250, 250, 0.5)",
                                            fontSize: "0.85rem",
                                        }}
                                    >
                                        ממתין לשאר השחקנים
                                    </Typography>
                                </Box>

                                <Button
                                    onClick={readyForNextQuestion}
                                    sx={{
                                        px: 4,
                                        py: 1,
                                        borderRadius: "10px",
                                        backgroundColor: "rgba(16, 185, 129, 0.1)",
                                        border: "1px solid rgba(16, 185, 129, 0.2)",
                                        color: "#10b981",
                                        textTransform: "none",
                                        fontWeight: 500,
                                        transition: "all 0.25s ease",
                                        "&:hover": {
                                            backgroundColor: "rgba(16, 185, 129, 0.15)",
                                        },
                                    }}
                                >
                                    הבא
                                </Button>
                            </Box>
                        )}
                    </Box>
                )}

                {/* Answer Reveal Phase */}
                {phase === "answer" && (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 3,
                            animation: "fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                            "@keyframes fadeInUp": {
                                from: { opacity: 0, transform: "translateY(16px)" },
                                to: { opacity: 1, transform: "translateY(0)" },
                            },
                        }}
                    >
                        <RevealAnswer
                            correctAnswer={revealAnswer?.correctAnswer as string}
                            explanation={revealAnswer?.explanation as string}
                            results={revealAnswer?.results as PlayerResult[]}
                        />
                        <Button
                            onClick={readyForNextQuestion}
                            sx={{
                                px: 4,
                                py: 1.25,
                                borderRadius: "12px",
                                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                color: "#fff",
                                textTransform: "none",
                                fontWeight: 600,
                                boxShadow: "0 4px 20px rgba(16, 185, 129, 0.25)",
                                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                                "&:hover": {
                                    transform: "translateY(-2px)",
                                    boxShadow: "0 8px 30px rgba(16, 185, 129, 0.35)",
                                },
                            }}
                        >
                            מוכן לשאלה הבאה
                        </Button>
                    </Box>
                )}

                {/* Game Over Phase */}
                {phase === "finished" && (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 4,
                            py: 2,
                            animation: "fadeIn 0.6s ease-out",
                        }}
                    >
                        {/* Last Question Answer */}
                        {lastQuestionAnswer && (
                            <RevealAnswer
                                correctAnswer={lastQuestionAnswer.correctAnswer}
                                explanation={lastQuestionAnswer.explanation}
                                results={lastQuestionAnswer.results}
                            />
                        )}

                        {/* Game Message */}
                        <Snackbar
                            open={!!GameMessage}
                            autoHideDuration={4000}
                            onClose={() => setGameMessage("")}
                            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                        >
                            <Alert
                                severity="info"
                                variant="filled"
                                sx={{
                                    backgroundColor: 'rgba(20, 20, 20, 0.95)',
                                    color: '#fafafa',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: "10px",
                                }}
                            >
                                {GameMessage}
                            </Alert>
                        </Snackbar>

                        {/* Winner Section */}
                        <Box
                            sx={{
                                textAlign: "center",
                                animation: "scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both",
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: "1.5rem",
                                    fontWeight: 700,
                                    background: "linear-gradient(135deg, #10b981, #34d399)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    backgroundClip: "text",
                                    mb: 2,
                                }}
                            >
                                המשחק הסתיים!
                            </Typography>

                            <Box
                                sx={{
                                    display: "inline-flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: 1.5,
                                    px: 4,
                                    py: 3,
                                    borderRadius: "16px",
                                    background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))",
                                    border: "1px solid rgba(16, 185, 129, 0.2)",
                                    boxShadow: "0 0 40px rgba(16, 185, 129, 0.1)",
                                }}
                            >
                                <Typography
                                    sx={{
                                        color: "rgba(250, 250, 250, 0.6)",
                                        fontSize: "0.85rem",
                                    }}
                                >
                                    המנצח
                                </Typography>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <Box
                                        sx={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: "8px",
                                            background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: "1rem",
                                        }}
                                    >
                                        1
                                    </Box>
                                    <Typography
                                        sx={{
                                            fontSize: "1.35rem",
                                            fontWeight: 600,
                                            color: "#fafafa",
                                        }}
                                    >
                                        {winner}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                        {/* Final Scoreboard */}
                        <Box sx={{ width: "100%" }}>
                            <ScoreBoard scores={scores} />
                        </Box>

                        {/* Back to Home Button */}
                        <Button
                            onClick={() => navigate(routes.home)}
                            startIcon={<HomeIcon />}
                            sx={{
                                mt: 2,
                                px: 4,
                                py: 1.25,
                                borderRadius: "12px",
                                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                color: "#fff",
                                textTransform: "none",
                                fontWeight: 600,
                                boxShadow: "0 4px 20px rgba(16, 185, 129, 0.25)",
                                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                                "&:hover": {
                                    transform: "translateY(-2px)",
                                    boxShadow: "0 8px 30px rgba(16, 185, 129, 0.35)",
                                },
                            }}
                        >
                            חזרה לדף הבית
                        </Button>
                    </Box>
                )}

                {/* Waiting Phase */}
                {phase === "waiting" && (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 2,
                            py: 6,
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                gap: 0.75,
                            }}
                        >
                            {[0, 1, 2].map((i) => (
                                <Box
                                    key={i}
                                    sx={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: "50%",
                                        backgroundColor: "#10b981",
                                        animation: `pulse 1.4s ease-in-out ${i * 0.16}s infinite`,
                                        "@keyframes pulse": {
                                            "0%, 80%, 100%": { transform: "scale(0.6)", opacity: 0.4 },
                                            "40%": { transform: "scale(1)", opacity: 1 },
                                        },
                                    }}
                                />
                            ))}
                        </Box>
                        <Typography
                            sx={{
                                color: "rgba(250, 250, 250, 0.5)",
                                fontSize: "0.95rem",
                            }}
                        >
                            ממתין לתחילת המשחק...
                        </Typography>
                    </Box>
                )}
            </Paper>
        </Box>
    );
};
