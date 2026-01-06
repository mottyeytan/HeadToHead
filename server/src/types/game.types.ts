import type { Question } from "./question.types";

export type GamePhase = "waiting" | "question" | "answer" | "results" | "finished";

export interface PlayerAnswer {
    questionId: string;
    answer: string;
    isCorrect: boolean;
    timeTaken: number;
    timestamp: Date;
}

export interface PlayerState {
    id: string;
    name: string;
    score: number;
    isConnected: boolean;
    currentAnswer?: PlayerAnswer;
    answers: PlayerAnswer[];
    isReadyForNextQuestion: boolean;
}

export interface GameState {
    id: string;
    phase: GamePhase;
    currentQuestionIndex: number; 
    questions: Question[];
    players: PlayerState[];
    currentQuestion: Question;
    remainingTime: number;
}