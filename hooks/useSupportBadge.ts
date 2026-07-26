"use client";

import { useState, useEffect } from 'react';
import { useAdminSupportSocket } from './useAdminSupportSocket';
import type { SocketBadgeEvent } from '@/types/AdminSupport.type';

interface UseSupportBadgeProps {
  initialData?: SocketBadgeEvent | null;
}

export function useSupportBadge({ initialData = null }: UseSupportBadgeProps = {}) {
  const [badgeData, setBadgeData] = useState<SocketBadgeEvent | null>(initialData);

  const { isConnected } = useAdminSupportSocket({
    onBadgeUpdate: (data: SocketBadgeEvent) => {
      setBadgeData(data);
    },
  });

  return { badgeData, isConnected };
}