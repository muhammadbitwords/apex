"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  isAuthenticated: boolean;
  user: any;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  isAuthenticated: false,
  user: null,
});

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Get JWT token from localStorage
    const jwtToken = localStorage.getItem("jwtToken");
    
    // Initialize socket connection with JWT token
    const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000", {
      transports: ["websocket", "polling"],
      auth: {
        token: jwtToken || undefined,
      },
    });

    socketInstance.on("connect", () => {
      console.log("WebSocket connected:", socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("WebSocket disconnected");
      setIsConnected(false);
    });

    socketInstance.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error);
      setIsConnected(false);
    });

    // Listen for authentication status
    socketInstance.on("auth-status", (data) => {
      console.log("Auth status:", data);
      setIsAuthenticated(data.authenticated);
      setUser(data.user);
    });

    // Listen for bid errors (authentication required)
    socketInstance.on("bid-error", (data) => {
      console.error("Bid error:", data);
      alert(data.message);
    });

    // Listen for bid success
    socketInstance.on("bid-success", (data) => {
      console.log("Bid success:", data);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected, isAuthenticated, user }}>
      {children}
    </SocketContext.Provider>
  );
}
