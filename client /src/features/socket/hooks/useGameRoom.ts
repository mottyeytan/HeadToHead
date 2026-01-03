// Game room hook - join/leave/players
import { useEffect, useState, useCallback, useRef } from "react";
import { useSocket } from "./useSocket";
import { SocketEvents } from "../../../../../shared/events/socketEvents";
import type { Player } from "../../game/types/game.types";

interface UseGameRoomProps {
    roomId: string;
    playerName: string;
}


export const useGameRoom = ({ roomId, playerName }: UseGameRoomProps) => {
    const { socket, isConnected } = useSocket();

    const [players, setPlayers] = useState<Player[]>([]);
    const [isInRoom, setIsInRoom] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const joinedRoomRef = useRef<string | null>(null);

    // Effect להאזנה לאירועים - פעם אחת כשה-socket מוכן
    useEffect(() => {
        if (!socket) return;

        const handlePlayersUpdated = (data: { players: Player[] }) => {
            console.log("👥 Players updated:", data);
            setPlayers(data.players);
        };

        const handleRoomError = ({ message }: { message: string }) => {
            console.error("❌ Room error:", message);
            setError(message);
        };

        socket.on(SocketEvents.PLAYERS_UPDATED, handlePlayersUpdated);
        socket.on(SocketEvents.ROOM_ERROR, handleRoomError);

        return () => {
            socket.off(SocketEvents.PLAYERS_UPDATED, handlePlayersUpdated);
            socket.off(SocketEvents.ROOM_ERROR, handleRoomError);
        };
    }, [socket]);

    // Effect להצטרפות לחדר
    useEffect(() => {
        console.log("🎮 useGameRoom - socket:", !!socket, "connected:", isConnected, "roomId:", roomId, "playerName:", playerName);
        
        if (!socket || !isConnected || !roomId || !playerName) {
            console.log("⏳ Waiting for connection...");
            return;
        }

        // לא מצטרפים שוב אם כבר בחדר הזה
        if (joinedRoomRef.current === roomId) {
            console.log("📍 Already in room:", roomId);
            return;
        }

        console.log("🚀 Joining room:", roomId, "as", playerName);
        socket.emit(SocketEvents.JOIN_ROOM, { roomId, playerName });
        joinedRoomRef.current = roomId;
        setIsInRoom(true);

    }, [socket, isConnected, roomId, playerName]);

    const startGame = useCallback(() => {
        if (!socket || !isConnected) return;
        socket.emit(SocketEvents.START_GAME, { roomId });
    }, [socket, isConnected, roomId]);

    const leaveRoom = useCallback(() => {
        if (!socket || !isConnected) return;
        socket.emit(SocketEvents.LEAVE_ROOM, { roomId });
    }, [socket, isConnected, roomId]);

    return {
        players,
        isInRoom,
        error,
        startGame,
        leaveRoom,
        canStartGame: players.length >= 2,
    };
};