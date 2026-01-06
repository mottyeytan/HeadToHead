import { io, Socket } from "socket.io-client";

const getSocketUrl = () => {
    // if there is an environment variable - use it
    if (import.meta.env.VITE_SOCKET_URL) {
        return import.meta.env.VITE_SOCKET_URL;
    }
    // otherwise - use the same host as the page
    const host = window.location.hostname;
    return `http://${host}:3001`;
};

const SOCKET_URL = getSocketUrl();

class SocketService {

    private socket: Socket | null = null;

    connect(): Socket {
        if (!this.socket) {
            this.socket = io(SOCKET_URL, {
                autoConnect: true,
                transports: ["websocket", "polling"],
                reconnection: true,
                reconnectionAttempts: 10,
                reconnectionDelay: 1000,
                timeout: 10000,
            });
        }
        return this.socket;
    }

    disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
        }
    }

    getSocket(): Socket | null {
        return this.socket;
    }
}

export const socketService = new SocketService();