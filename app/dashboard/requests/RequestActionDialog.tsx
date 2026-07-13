// app/requests/RequestActionDialog.tsx

"use client";

import React, { useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/elements/card';
import { approveRequestAction, declineRequestAction } from '@/actions/request.action';
import type { RequestResult } from '@/types/Request.type';

interface RequestActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'approve' | 'decline';
  request: RequestResult | null;
  onComplete: () => void;
}

export default function RequestActionDialog({
  open,
  onOpenChange,
  type,
  request,
  onComplete,
}: RequestActionDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open || !request) return null;

  const handleAction = async () => {
    setLoading(true);
    setError(null);

    const action = type === 'approve' 
      ? approveRequestAction(request.id) 
      : declineRequestAction(request.id);

    const res = await action;

    if (res.success) {
      onComplete();
    } else {
      setError(res.message);
    }
    setLoading(false);
  };

  const isApprove = type === 'approve';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <Card className="w-full max-w-sm rounded-[24px] border-none shadow-2xl p-6 relative overflow-hidden bg-surface">
        <div className="flex items-center gap-3 mb-4">
          <div className={`h-10 w-10 flex items-center justify-center rounded-full ${
            isApprove ? 'bg-green-100 text-[#10b981]' : 'bg-red-100 text-[#ef4444]'
          }`}>
            {isApprove ? (
              <CheckCircle2 className="h-6 w-6" />
            ) : (
              <XCircle className="h-6 w-6" />
            )}
          </div>
          <h3 className="text-lg font-bold text-text">
            {isApprove ? 'Approve Application' : 'Decline Application'}
          </h3>
        </div>
        
        <p className="text-sm text-text-muted mb-8 leading-relaxed">
          {isApprove 
            ? `Are you sure you want to approve ${request.applicant_name}'s application? They will be granted access to the manager dashboard.`
            : `Are you sure you want to decline ${request.applicant_name}'s application? They will be notified of the decision.`
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
              isApprove 
                ? 'bg-[#10b981] hover:bg-[#059669]' 
                : 'bg-[#ef4444] hover:bg-[#dc2626]'
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
              isApprove ? 'Approve' : 'Decline'
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}