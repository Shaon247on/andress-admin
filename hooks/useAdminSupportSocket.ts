"use client";

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { getDecryptedAccessToken } from '@/actions/token.action';
import type { 
  SocketReplyEvent, 
  SocketStatusEvent, 
  SocketTicketEvent,
  SocketBadgeEvent  // ← Import the new type
} from '@/types/AdminSupport.type';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL ||'https://api.athlongoapp.com';

interface AdminSupportSocketProps {
  onReply?: (data: SocketReplyEvent) => void;
  onStatus?: (data: SocketStatusEvent) => void;
  onNewTicket?: (ticket: SocketTicketEvent) => void;
  onBadgeUpdate?: (data: SocketBadgeEvent) => void;  // ← Add this
}

export function useAdminSupportSocket({
  onReply,
  onStatus,
  onNewTicket,
  onBadgeUpdate,  // ← Add this
}: AdminSupportSocketProps = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const initSocket = async () => {
      try {
        const token = await getDecryptedAccessToken();
        
        if (!token) {
          console.warn('No access token found for socket connection');
          return;
        }

        const socket = io(SOCKET_URL, {
          transports: ['websocket'],
          auth: { token },
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        });

        socket.on('connect', () => {
          console.log('Admin support socket connected successfully');
          setIsConnected(true);
        });

        socket.on('disconnect', (reason) => {
          console.log('Admin support socket disconnected:', reason);
          setIsConnected(false);
        });

        socket.on('connect_error', (err) => {
          console.error('Socket connection error:', err.message);
          setIsConnected(false);
        });

        // ── Admin Support Events ──
        socket.on('support_reply', (data: SocketReplyEvent) => {
          console.log('Support reply received:', data);
          if (onReply) onReply(data);
        });

        socket.on('support_status', (data: SocketStatusEvent) => {
          console.log('Support status updated:', data);
          if (onStatus) onStatus(data);
        });

        socket.on('support_ticket', (ticket: SocketTicketEvent) => {
          console.log('New support ticket:', ticket);
          if (onNewTicket) onNewTicket(ticket);
        });

        // ── NEW: Support Badge Event ──
        socket.on('support_badge', (data: SocketBadgeEvent) => {
          console.log('Support badge update received:', data);
          if (onBadgeUpdate) onBadgeUpdate(data);
        });

        socketRef.current = socket;

      } catch (error) {
        console.error('Error initializing socket:', error);
      }
    };

    initSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [onReply, onStatus, onNewTicket, onBadgeUpdate]);  // ← Add onBadgeUpdate to dependencies

  return { socket: socketRef.current, isConnected };
}