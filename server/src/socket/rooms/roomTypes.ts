// Room and Player types

export interface Room {
    id: string;
    gameId: string;
    createdAt: Date;
    updatedAt: Date;
    players: Player[];
    hostSocketId: string;
    status: "waiting" | "started" | "finished";
    currentQuestionIndex: number;
}

export interface Player {
    id: string;
    name: string;
    score: number;
    socketId: string;
}
