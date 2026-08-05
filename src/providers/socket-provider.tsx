'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { auth } from '@/firebase/auth';
import { toast } from 'sonner';

interface SocketContextType {
  socket: Socket | null;
  unreadCount: number;
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
  fetchNotifications: () => Promise<void>;
  notifications: any[];
}

const SocketContext = createContext<SocketContextType | null>(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);

  const fetchNotifications = async () => {
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) return;

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/notifications`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  useEffect(() => {
    let currentSocket: Socket | null = null;

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // User logged in, connect socket
        const token = await user.getIdToken();
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL?.replace('/v1', '') || 'http://localhost:8080';
        
        currentSocket = io(backendUrl, {
          auth: { token },
        });

        currentSocket.on('connect', () => {
          console.log('Connected to WebSocket server');
        });

        currentSocket.on('notification', (payload) => {
          setNotifications((prev) => {
            // Avoid duplicate notifications in StrictMode
            if (prev.some(n => n.id === payload.notification.id)) return prev;
            
            // Only show toast if it's actually new
            toast.success(payload.notification.title, {
              description: payload.notification.message,
            });
            return [payload.notification, ...prev];
          });
          setUnreadCount(payload.unreadCount);
        });

        setSocket(currentSocket);
        fetchNotifications();
      } else {
        // User logged out, disconnect socket
        if (currentSocket) {
          currentSocket.disconnect();
          currentSocket = null;
        }
        setSocket(null);
        setUnreadCount(0);
        setNotifications([]);
      }
    });

    return () => {
      unsubscribe();
      if (currentSocket) {
        currentSocket.disconnect();
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, unreadCount, setUnreadCount, fetchNotifications, notifications }}>
      {children}
    </SocketContext.Provider>
  );
};
