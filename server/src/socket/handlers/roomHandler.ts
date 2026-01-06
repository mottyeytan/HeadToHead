// Room join/leave handler
import { Server, Socket } from "socket.io";
import { roomManager } from "../rooms/roomManager";
import { SocketEvents } from "../../../../shared/events/socketEvents";
import { JoinRoomProps } from "../../../../shared/types/roomTypes";

export const roomHandler = (io: Server, socket: Socket) => {

    // join room
    socket.on(SocketEvents.JOIN_ROOM, ({ roomId, playerName }: JoinRoomProps) => {
        console.log(`🎮 JOIN_ROOM: ${playerName} -> ${roomId}`);
        
        const room = roomManager.joinRoom(roomId, {
            name: playerName,
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
