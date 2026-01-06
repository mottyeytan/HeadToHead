import {Server as httpServer} from "http";
import { Server } from "socket.io";
import { roomHandler } from "./handlers/roomHandler";
import { gameHandler } from "./handlers/gameHandler";

export const initSocket = (httpServer: httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: "*", 
            methods: ["GET", "POST"],
            credentials: false, 
        },
        transports: ["websocket", "polling"],
    });

    io.on("connection", (socket) => {
        console.log("👤 New connection:", socket.id);
        
        roomHandler(io, socket);
        gameHandler(io, socket);

        socket.on("disconnect", () => {
            console.log("👋 Disconnected:", socket.id);
        });
    });

    console.log("Socket manager initialized");
    return io;
};