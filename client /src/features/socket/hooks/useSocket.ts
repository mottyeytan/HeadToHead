// Basic socket hook
import { useEffect, useState, useRef } from "react";
import { socketService } from "../services/socketService";
import { Socket } from "socket.io-client";

export const useSocket = () => {
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [socket, setSocket] = useState<Socket | null>(null);
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (!socketRef.current) {
            socketRef.current = socketService.connect();
        }

        const sock = socketRef.current;
        setSocket(sock);

        const handleConnect = () => setIsConnected(true);
        const handleDisconnect = () => setIsConnected(false);

        sock.on("connect", handleConnect);
        sock.on("disconnect", handleDisconnect);

        // בדיקה מיידית אם כבר מחובר
        if (sock.connected) {
            setIsConnected(true);
        }

        // בדיקה נוספת אחרי delay קטן (לטיפול ב-race condition)
        const timeoutId = setTimeout(() => {
            if (sock.connected) setIsConnected(true);
        }, 100);

        return () => {
            clearTimeout(timeoutId);
            sock.off("connect", handleConnect);
            sock.off("disconnect", handleDisconnect);
        };
    }, []);

    // בדיקה מחזורית של מצב החיבור
    useEffect(() => {
        const intervalId = setInterval(() => {
            if (socketRef.current?.connected && !isConnected) {
                setIsConnected(true);
            }
        }, 500);

        return () => clearInterval(intervalId);
    }, [isConnected]);

    return { isConnected, socket };
};