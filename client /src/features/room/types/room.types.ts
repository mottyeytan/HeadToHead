export interface UseRoomProps {
    roomId: string;
    playerName: string;
}

export interface Player {
    id: string;
    name: string;
    score?: number;
}