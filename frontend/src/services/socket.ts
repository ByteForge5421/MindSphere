import { io, Socket } from "socket.io-client";

/**
 * Socket.IO client service
 * Manages the connection to the backend WebSocket server
 */

let socket: Socket | null = null;

/**
 * Connect to the Socket.IO server
 * @param token JWT authentication token
 * @returns Socket instance
 */
export function connectSocket(token: string): Socket {
  if (socket?.connected) {
    console.log("[Socket] Already connected");
    return socket;
  }

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  socket = io(backendUrl, {
    auth: {
      token
    },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5
  });

  socket.on("connect", () => {
    console.log("[Socket] Connected to server");
    // Register user presence on connection
    socket!.emit("user:connect");
  });

  socket.on("connect_error", (error) => {
    console.error("[Socket] Connection error:", error);
  });

  socket.on("disconnect", (reason) => {
    console.log("[Socket] Disconnected:", reason);
  });

  return socket;
}

/**
 * Get the current socket instance
 * @returns Socket instance or null if not connected
 */
export function getSocket(): Socket | null {
  return socket;
}

/**
 * Disconnect from the Socket.IO server
 */
export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("[Socket] Disconnected");
  }
}

/**
 * Check if socket is connected
 * @returns true if socket is connected, false otherwise
 */
export function isSocketConnected(): boolean {
  return socket?.connected ?? false;
}
