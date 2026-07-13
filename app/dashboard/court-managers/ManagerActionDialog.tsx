"use client";

import React, { useState } from 'react';
import { AlertOctagon, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/elements/card';
import { suspendManagerAction, activateManagerAction } from '@/actions/court-manager.action';
import type { CourtManagerResult } from '@/types/CourtManager.type';

interface ManagerActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'suspend' | 'activate';
  manager: CourtManagerResult | null;
  onComplete: () => void;
}

export default function ManagerActionDialog({
  open,
  onOpenChange,
  type,
  manager,
  onComplete,
}: ManagerActionDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open || !manager) return null;

  const isSuspend = type === 'suspend';

  const handleAction = async () => {
    setLoading(true);
    setError(null);

    const action = isSuspend 
      ? suspendManagerAction(manager.id) 
      : activateManagerAction(manager.id);

    const res = await action;

    if (res.success) {
      onComplete();
      onOpenChange(false);
    } else {
      setError(res.message);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <Card className="w-full max-w-sm rounded-[24px] border-none shadow-2xl p-6 relative overflow-hidden bg-surface">
        <div className="flex items-center gap-3 mb-4">
          <div className={`h-10 w-10 flex items-center justify-center rounded-full ${
            isSuspend ? 'bg-red-100 text-[#ef4444]' : 'bg-green-100 text-[#10b981]'
          }`}>
            {isSuspend ? (
              <AlertOctagon className="h-6 w-6" />
            ) : (
              <UserCheck className="h-6 w-6" />
            )}
          </div>
          <h3 className="text-lg font-bold text-text">
            {isSuspend ? 'Suspend Manager' : 'Activate Manager'}
          </h3>
        </div>
        
        <p className="text-sm text-text-muted mb-8 leading-relaxed">
          {isSuspend 
            ? `Are you sure you want to suspend ${manager.full_name}? They will not be able to manage their courts.`
            : `Are you sure you want to activate ${manager.full_name}? They will regain full access to manage their courts.`
          }
        </p>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700 mb-4">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="flex-1 border-border shadow-none" 
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            className={`flex-1 shadow-none ${
              isSuspend 
                ? 'bg-[#ef4444] hover:bg-[#dc2626]' 
                : 'bg-[#10b981] hover:bg-[#059669]'
            }`}
            onClick={handleAction}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Processing...
              </div>
            ) : (
              isSuspend ? 'Suspend' : 'Activate'
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}