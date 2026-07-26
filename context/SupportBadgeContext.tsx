"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { SocketBadgeEvent } from '@/types/AdminSupport.type';
import { getSupportOverviewAction } from '@/actions/admin-support.action';
import { useAdminSupportSocket } from '@/hooks/useAdminSupportSocket';

interface SupportBadgeContextType {
  badgeData: SocketBadgeEvent | null;
  isConnected: boolean;
  userUnread: number;
  managerUnread: number;
  totalUnread: number;
}

const SupportBadgeContext = createContext<SupportBadgeContextType | undefined>(undefined);

export function SupportBadgeProvider({ children }: { children: React.ReactNode }) {
  const [badgeData, setBadgeData] = useState<SocketBadgeEvent | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // ── Fetch initial badge data on mount ──
  useEffect(() => {
    const fetchInitialBadges = async () => {
      try {
        const response = await getSupportOverviewAction();
        if (response.success) {
          setBadgeData(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch initial badge data:', error);
      }
    };
    
    fetchInitialBadges();
  }, []);

  // ── Socket connection for live updates ──
  const { isConnected: socketConnected } = useAdminSupportSocket({
    onBadgeUpdate: (data: SocketBadgeEvent) => {
      setBadgeData(data);
    },
  });

  // Update connection status
  useEffect(() => {
    setIsConnected(socketConnected);
  }, [socketConnected]);

  const value = {
    badgeData,
    isConnected,
    userUnread: badgeData?.users?.unread ?? 0,
    managerUnread: badgeData?.managers?.unread ?? 0,
    totalUnread: badgeData?.total_unread ?? 0,
  };

  return (
    <SupportBadgeContext.Provider value={value}>
      {children}
    </SupportBadgeContext.Provider>
  );
}

export function useSupportBadge() {
  const context = useContext(SupportBadgeContext);
  if (context === undefined) {
    throw new Error('useSupportBadge must be used within a SupportBadgeProvider');
  }
  return context;
}