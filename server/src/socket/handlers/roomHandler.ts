// Room join/leave handler
import { Server, Socket } from "socket.io";
import { roomManager } from "../../rooms/roomManager";
import { SocketEvents } from "../../../../shared/events/socketEvents";

export const roomHandler = (io: Server, socket: Socket) => {

    // הצטרפות לחדר
    socket.on(SocketEvents.JOIN_ROOM, ({ roomId, playerName }: { roomId: string, playerName: string }) => {
        console.log(`🎮 JOIN_ROOM: ${playerName} -> ${roomId}`);
        
        const room = roomManager.joinRoom(roomId, {
            id: socket.id,
            name: playerName,
            socketId: socket.id,
        });

        socket.join(roomId);

        // שליחת עדכון לכל השחקנים בחדר
        io.to(roomId).emit(SocketEvents.PLAYERS_UPDATED, {
            players: room.players,
            roomId: room.id,
        });
    });

    // יציאה מחדר
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

    // התחלת משחק
    socket.on(SocketEvents.START_GAME, ({ roomId }: { roomId: string }) => {
        console.log(`🎯 START_GAME: ${roomId}`);
        
        const room = roomManager.getRoom(roomId);
        if (!room) {
            socket.emit(SocketEvents.ROOM_ERROR, { message: "החדר לא נמצא" });
            return;
        }

        if (room.players.length < 2) {
            socket.emit(SocketEvents.ROOM_ERROR, { message: "צריך לפחות 2 שחקנים להתחיל" });
            return;
        }

        room.status = "started";
        room.currentQuestionIndex = 0;

        io.to(roomId).emit(SocketEvents.GAME_STARTED, {
            roomId: room.id,
            players: room.players,
        });

        console.log(`🎮 Game started in room ${roomId} with ${room.players.length} players`);
    });

    // ניתוק - ניקוי השחקן מכל החדרים
    socket.on("disconnect", () => {
        console.log(`🔌 Socket disconnected: ${socket.id}`);
        
        // הסרת השחקן מכל החדרים שהוא נמצא בהם
        const results = roomManager.removePlayerFromAllRooms(socket.id);
        
        // שליחת עדכון לכל החדרים שהשחקן היה בהם
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
