// Room management logic
import type { Room, Player } from "./roomTypes";


class RoomManager {
    private rooms: Map<string, Room> = new Map();

    // create room or join existing room
    joinRoom(roomId: string,  player: Omit<Player, "score">): Room {
        let room = this.rooms.get(roomId);
        
        // if room does not exist - create new room
        if (!room) {
            room = {
                id: roomId,
                gameId: roomId,
                createdAt: new Date(),
                updatedAt: new Date(),
                players: [],
                hostSocketId: player.socketId,
                status: "waiting",
                currentQuestionIndex: 0,
            };
            this.rooms.set(roomId, room);
            console.log(`📦 Created new room: ${roomId}`);
        }

        // check if player is already in room
        const existingPlayer = room.players.find(p => p.socketId === player.socketId && p.name === player.name);
        if (existingPlayer) {
            console.log(`⚠️ Player ${player.name} already in room ${roomId}`);
            return room;
        }

        // add player to room
        room.players.push({ ...player, score: 0 });
        room.updatedAt = new Date();

        // if room somehow had no host (or host missing), make first player host
        if (!room.hostSocketId) {
            room.hostSocketId = room.players[0].socketId;
        }
        
        console.log(`👤 Player ${player.name} joined room ${roomId}. Total: ${room.players.length}`);
        return room;
    }

    leaveRoom(roomId: string, socketId: string): Room | null {
        const room = this.rooms.get(roomId);
        if (!room) return null;

        const playerName = room.players.find(p => p.socketId === socketId)?.name;
        room.players = room.players.filter((player) => player.socketId !== socketId);
        room.updatedAt = new Date();

        // If host left, promote first remaining player to host
        if (room.hostSocketId === socketId) {
            room.hostSocketId = room.players[0]?.socketId || "";
        }

        console.log(`👋 Player ${playerName} left room ${roomId}. Remaining: ${room.players.length}`);

        // if room is empty - delete it
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

    // find all rooms the player is in and remove him from them
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

    getPlayersInRoom(roomId: string): Player[] {
        const room = this.rooms.get(roomId);
        if (!room) return [];
        return room.players;
    }
}

export const roomManager = new RoomManager();
