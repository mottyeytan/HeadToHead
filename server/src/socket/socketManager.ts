import {Server as httpServer} from "http";
import { Server } from "socket.io";
import { roomHandler } from "./handlers/roomHandler";


export const initSocket = (httpServer: httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: "*", // מאפשר גישה מכל מקום (לפיתוח)
            methods: ["GET", "POST"],
            credentials: false, // חייב להיות false עם origin: "*"
        },
        transports: ["websocket", "polling"],
    });

    io.on("connection", (socket) => {
        console.log("👤 New connection:", socket.id);
        roomHandler(io, socket);
        
        socket.on("disconnect", () => {
            console.log("👋 Disconnected:", socket.id);
        });
    });

    console.log("Socket manager initialized");
    return io;
};