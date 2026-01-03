// Room management logic
import type { Room, Player } from "./roomTypes";


class RoomManager {
    private rooms: Map<string, Room> = new Map();

    // יצירת חדר או הצטרפות לחדר קיים
    joinRoom(roomId: string, player: Omit<Player, "score">): Room {
        let room = this.rooms.get(roomId);
        
        // אם החדר לא קיים - יצירת חדר חדש
        if (!room) {
            room = {
                id: roomId,
                gameId: roomId,
                createdAt: new Date(),
                updatedAt: new Date(),
                players: [],
                status: "waiting",
                currentQuestionIndex: 0,
            };
            this.rooms.set(roomId, room);
            console.log(`📦 Created new room: ${roomId}`);
        }

        // בדיקה אם השחקן כבר בחדר
        const existingPlayer = room.players.find(p => p.socketId === player.socketId);
        if (existingPlayer) {
            console.log(`⚠️ Player ${player.name} already in room ${roomId}`);
            return room;
        }

        // הוספת השחקן לחדר
        room.players.push({ ...player, score: 0 });
        room.updatedAt = new Date();
        
        console.log(`👤 Player ${player.name} joined room ${roomId}. Total: ${room.players.length}`);
        return room;
    }

    leaveRoom(roomId: string, socketId: string): Room | null {
        const room = this.rooms.get(roomId);
        if (!room) return null;

        const playerName = room.players.find(p => p.socketId === socketId)?.name;
        room.players = room.players.filter((player) => player.socketId !== socketId);
        room.updatedAt = new Date();

        console.log(`👋 Player ${playerName} left room ${roomId}. Remaining: ${room.players.length}`);

        // אם החדר ריק - מחיקתו
        if (room.players.length === 0) {
            this.rooms.delete(roomId);
            console.log(`🗑️ Room ${roomId} deleted (empty)`);
            return null;
        }
        
        return room;
    }

    getRoom(roomId: string): Room | null {
        return this.rooms.get(roomId) || null;
    }

    // מציאת כל החדרים שהשחקן נמצא בהם והסרתו
    removePlayerFromAllRooms(socketId: string): { roomId: string; room: Room | null }[] {
        const results: { roomId: string; room: Room | null }[] = [];
        
        for (const [roomId, room] of this.rooms) {
            const playerInRoom = room.players.find(p => p.socketId === socketId);
            if (playerInRoom) {
                const updatedRoom = this.leaveRoom(roomId, socketId);
                results.push({ roomId, room: updatedRoom });
            }
        }
        
        return results;
    }

    updatePlayerScore(roomId: string, socketId: string, points: number): void {
        const room = this.rooms.get(roomId);
        if (!room) return;
        
        const player = room.players.find((player) => player.socketId === socketId);
        if (!player) return;
        
        player.score += points;
    }
}

export const roomManager = new RoomManager();
