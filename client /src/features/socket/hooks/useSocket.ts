// Basic socket hook
import { useEffect, useState, useRef } from "react";
import { socketService } from "../services/socketService";
import { Socket } from "socket.io-client";

export const useSocket = () => {
    const socketRef = useRef<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!socketRef.current) {
            socketRef.current = socketService.connect();
        }

        const socket = socketRef.current;

        const onConnect = () => setIsConnected(true);
        const onDisconnect = () => setIsConnected(false);

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);

        // אם כבר מחובר בזמן ההרשמה
        if (socket.connected) {
            setIsConnected(true);
        }

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
        };
    }, []);

    return {
        socket: socketRef.current,
        isConnected,
    };
};