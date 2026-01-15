import { Box, Button, Typography, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert } from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
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
    const { roomId, gameId } = useParams();
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
                p: 2,
                gap: 3,
            }}
        >
            {/* Exit Button - Top Right */}
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
                        backgroundColor: "rgba(239, 68, 68, 0.1)",
                        border: "1px solid rgba(239, 68, 68, 0.3)",
                        color: "#ef4444",
                        "&:hover": {
                            backgroundColor: "rgba(239, 68, 68, 0.2)",
                        },
                    }}
                >
                    <ExitToAppIcon />
                </IconButton>
            </Box>

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
                            backgroundColor: 'rgba(30, 30, 30, 0.95)',
                            color: '#fff',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
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
                        backgroundColor: "rgba(30, 30, 30, 0.95)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: 3,
                        minWidth: 300,
                    },
                }}
            >
                <DialogTitle sx={{ color: "#fff", textAlign: "center" }}>
                    יציאה מהמשחק
                </DialogTitle>
                <DialogContent>
                    <Typography color="rgba(255, 255, 255, 0.7)" textAlign="center">
                        האם אתה בטוח שברצונך לצאת מהמשחק?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center", gap: 2, pb: 3 }}>
                    <Button
                        onClick={handleExitCancel}
                        variant="outlined"
                        sx={{
                            borderColor: "rgba(255, 255, 255, 0.3)",
                            color: "rgba(255, 255, 255, 0.7)",
                            "&:hover": {
                                borderColor: "rgba(255, 255, 255, 0.5)",
                                backgroundColor: "rgba(255, 255, 255, 0.05)",
                            },
                        }}
                    >
                        ביטול
                    </Button>
                    <Button
                        onClick={handleExitConfirm}
                        variant="contained"
                        sx={{
                            backgroundColor: "#ef4444",
                            "&:hover": {
                                backgroundColor: "#dc2626",
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
                    maxWidth: 600,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 2,
                }}
            >
                {/* Timer - only show during question phase */}
                {phase === "question" ? (
                    <Timer remainingTime={remainingTime} maxTime={15} />
                ) : (
                    <Box sx={{ width: 100 }} /> // Placeholder to maintain layout
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
                    maxWidth: 600,
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(10px)",
                    borderRadius: 4,
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    p: 3,
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
                            <Box sx={{ textAlign: "center" }}>
                                <Typography 
                                    color="rgba(255, 255, 255, 0.6)" 
                                    variant="body2"
                                    sx={{ mb: 1 }}
                                >
                                    ממתין לשאר השחקנים...
                                </Typography>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={readyForNextQuestion}
                                    sx={{
                                        borderRadius: 2,
                                        px: 4,
                                        borderColor: "rgba(34, 197, 94, 0.5)",
                                        color: "#22c55e",
                                        "&:hover": {
                                            borderColor: "#22c55e",
                                            backgroundColor: "rgba(34, 197, 94, 0.1)",
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
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                        <RevealAnswer
                            correctAnswer={revealAnswer?.correctAnswer as string}
                            explanation={revealAnswer?.explanation as string}
                            results={revealAnswer?.results as PlayerResult[]}
                        />
                        <Button
                            variant="contained"
                            onClick={readyForNextQuestion}
                            sx={{
                                borderRadius: 2,
                                px: 4,
                                py: 1.5,
                                backgroundColor: "#22c55e",
                                "&:hover": {
                                    backgroundColor: "#16a34a",
                                },
                            }}
                        >
                            אני מוכן לשאלה הבאה
                        </Button>
                    </Box>
                )}

                {/* Game Over Phase */}
                {phase === "finished" && (
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, py: 2 }}>
                        
                        {/* Show last question answer if available */}
                        {lastQuestionAnswer && (
                            <>
                                <RevealAnswer
                                    correctAnswer={lastQuestionAnswer.correctAnswer}
                                    explanation={lastQuestionAnswer.explanation}
                                    results={lastQuestionAnswer.results}
                                />
                            </>
                        )}

                        <Snackbar
                            open={!!GameMessage }
                            autoHideDuration={4000}
                            onClose={() => setGameMessage("")}
                            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                        >
                            <Alert 
                                severity="info" 
                                variant="filled"
                                sx={{ 
                                    backgroundColor: 'rgba(30, 30, 30, 0.95)',
                                    color: '#fff',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                }}
                            >
                                {GameMessage}
                            </Alert>
                        </Snackbar>

                        <Typography
                            variant="h4"
                            sx={{
                                color: "#22c55e",
                                fontWeight: "bold",
                                textAlign: "center",
                                mt: 2,
                            }}
                        >
                            🎉 המשחק הסתיים!
                        </Typography>
                        
                        <Box
                            sx={{
                                backgroundColor: "rgba(34, 197, 94, 0.1)",
                                borderRadius: 3,
                                p: 3,
                                textAlign: "center",
                                border: "1px solid rgba(34, 197, 94, 0.3)",
                            }}
                        >
                            <Typography color="rgba(255, 255, 255, 0.7)" variant="body1" sx={{ mb: 1 }}>
                                המנצח:
                            </Typography>
                            <Typography
                                variant="h5"
                                sx={{
                                    color: "#fbbf24",
                                    fontWeight: "bold",
                                }}
                            >
                                🏆 {winner}
                            </Typography>
                        </Box>

                        <ScoreBoard scores={scores} />

                        <Button
                            variant="contained"
                            onClick={() => navigate(routes.home)}
                            sx={{
                                mt: 2,
                                borderRadius: 2,
                                px: 4,
                                py: 1.5,
                                backgroundColor: "#22c55e",
                                "&:hover": {
                                    backgroundColor: "#16a34a",
                                },
                            }}
                        >
                            חזרה לדף הבית
                        </Button>
                    </Box>
                )}
                
                

                {/* Waiting Phase */}
                {phase === "waiting" && (
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, py: 4 }}>
                        <Typography color="rgba(255, 255, 255, 0.7)" variant="h6">
                            ממתין לתחילת המשחק...
                        </Typography>
                    </Box>
                )}
            </Paper>
        </Box>
    );
};
