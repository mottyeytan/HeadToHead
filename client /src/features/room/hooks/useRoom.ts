import { useState, useEffect, useCallback, useRef } from "react";
import { useSocket } from "../../socket/hooks/useSocket";
import { SocketEvents } from "../../../../../shared/events/socketEvents";
import type { Player, UseRoomProps } from "../types/room.types";


export const useRoom = ({ roomId, playerName,  }: UseRoomProps) => {
    const { socket, isConnected } = useSocket();
    const [players, setPlayers] = useState<Player[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isInRoom, setIsInRoom] = useState(false);
    const hasJoinedRef = useRef(false);
    const skipLeaveRoomOnUnmountRef = useRef(false);

    // Effect to listen to events - once when the socket is ready
    useEffect(() => {
        if (!socket) return;

        const handlePlayersUpdated = (data: { players: Player[] }) => {
            console.log("👥 Players updated:", data);
            setPlayers(data.players);
        };

        const handleRoomError = ({ message }: { message: string }) => {
            console.error("❌ Room error:", message);
            setError(message);
            // If join failed, make sure we don't treat as joined
            hasJoinedRef.current = false;
            setIsInRoom(false);
        };

        const handleGameStarted = () => {
            console.log("🎮 useRoom: Game started, setting skip flag");
            skipLeaveRoomOnUnmountRef.current = true;
        };

        socket.on(SocketEvents.GAME_STARTED, handleGameStarted);

        socket.on(SocketEvents.PLAYERS_UPDATED, handlePlayersUpdated);
        socket.on(SocketEvents.ROOM_ERROR, handleRoomError);

        return () => {
            socket.off(SocketEvents.PLAYERS_UPDATED, handlePlayersUpdated);
            socket.off(SocketEvents.ROOM_ERROR, handleRoomError);
            socket.off(SocketEvents.GAME_STARTED, handleGameStarted);
        };
    }, [socket, roomId]);


    // Effect to join the room
    useEffect(() => {
        if (!socket || !isConnected || !roomId || !playerName) return;

        if (hasJoinedRef.current) return;

        socket.emit(SocketEvents.JOIN_ROOM, { roomId, playerName });
        hasJoinedRef.current = true;
        setIsInRoom(true);

        return () => {
            console.log("🧹 useRoom cleanup - skip:", skipLeaveRoomOnUnmountRef.current, "joined:", hasJoinedRef.current);
            if (!skipLeaveRoomOnUnmountRef.current && hasJoinedRef.current){
                console.log("🚪 useRoom: Emitting LEAVE_ROOM");
                socket.emit(SocketEvents.LEAVE_ROOM, { roomId });
                hasJoinedRef.current = false;
            } else {
                console.log("✅ useRoom: Skipping LEAVE_ROOM (game in progress)");
            }
        };
    }, [socket, isConnected, roomId, playerName]);


    const leaveRoom = useCallback(()=>{
        if (!socket || !isConnected || !roomId) return;

        if (!hasJoinedRef.current) return;

        socket.emit(SocketEvents.LEAVE_ROOM, { roomId });
        hasJoinedRef.current = false;
        setIsInRoom(false);
    }, [socket, isConnected, roomId]);

    return {
        players,
        error,
        isInRoom,
        canStartGame: players.length >= 2,
        leaveRoom,
    };
}