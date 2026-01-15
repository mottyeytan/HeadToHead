// Room join/leave handler
import { Server, Socket } from "socket.io";
import { roomManager } from "../rooms/roomManager";
import { SocketEvents } from "../../../../shared/events/socketEvents";
import { JoinRoomProps } from "../../../../shared/types/roomTypes";

export const roomHandler = (io: Server, socket: Socket) => {

    // join room
    socket.on(SocketEvents.JOIN_ROOM, ({ roomId, playerName }: JoinRoomProps) => {
        console.log(`🎮 JOIN_ROOM: ${playerName} -> ${roomId} - ${socket.id}`);

        const normalizedName = (playerName || "").trim().toLowerCase();
        if (!roomId || !normalizedName) {
            socket.emit(SocketEvents.ROOM_ERROR, { message: "שם שחקן לא תקין" });
            return;
        }

        // Prevent duplicate names inside the same room
        const existingRoom = roomManager.getRoom(roomId);
        if (existingRoom) {
            const nameTaken = existingRoom.players.some(
                (p) => (p.name || "").trim().toLowerCase() === normalizedName
            );
            if (nameTaken) {
                socket.emit(SocketEvents.ROOM_ERROR, { message: "שם השחקן כבר בשימוש" });
                return;
            }
        }

        const room = roomManager.joinRoom(roomId, {
            id: socket.id,
            name: playerName.trim(),
            socketId: socket.id,
        });

        socket.join(roomId);

        // update players in room
        io.to(roomId).emit(SocketEvents.PLAYERS_UPDATED, {
            players: room.players,
            roomId: room.id,
        });
    });

    // leave room
    socket.on(SocketEvents.LEAVE_ROOM, ({ roomId }: { roomId: string }) => {
        console.log(`🚪 LEAVE_ROOM: ${socket.id} <- ${roomId}`);
        
        const room = roomManager.leaveRoom(roomId, socket.id);
        socket.leave(roomId);

        if (room) {
            io.to(roomId).emit(SocketEvents.PLAYERS_UPDATED, {
                players: room.players,
                roomId: room.id,
            });
        }
    });

    // disconnect - remove player from all rooms
    socket.on("disconnect", () => {
        console.log(`🔌 Socket disconnected: ${socket.id}`);
        
        // remove player from all rooms
        const results = roomManager.removePlayerFromAllRooms(socket.id);
        
        // send update to all rooms the player was in
        for (const { roomId, room } of results) {
            if (room) {
                io.to(roomId).emit(SocketEvents.PLAYERS_UPDATED, {
                    players: room.players,
                    roomId: room.id,
                });
            }
        }
    });
};
