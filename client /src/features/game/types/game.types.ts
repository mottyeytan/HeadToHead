export interface Player {
    id: string;
    name: string;
    score?: number;
}

export interface Question {
    id: string;
    text: string;
    correctAnswer: string;
    explanation: string;
    category: string;
    difficulty: string;
    acceptableAnswers?: string[];
}

export interface RevealAnswer {
    correctAnswer: string;
    explanation: string;
    results: PlayerResult[];
}

export interface PlayerResult {
    id: string;
    name: string;
    answer?: string;
    isCorrect?: boolean;
    timeTaken?: number;
}

export interface Score {
    id: string;
    name: string;
    score: number;
}

export type GamePhase = "waiting" | "question" | "answer" | "results" | "finished";

