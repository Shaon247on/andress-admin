// app/requests/RequestDetailModal.tsx

"use client";

import React, { useEffect, useState } from 'react';
import { X, MapPin, Phone, Globe, Building2, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/elements/card';
import { getRequestDetailAction } from '@/actions/request.action';
import type { RequestDetail, RequestResult } from '@/types/Request.type';

const StatusBadge = ({ status }: { status: string }) => {
  let colors = '';
  switch (status) {
    case 'pending':
      colors = 'bg-[#fef3c7] text-[#92400e]';
      break;
    case 'approved':
      colors = 'bg-green-100 text-green-800';
      break;
    case 'rejected':
      colors = 'bg-red-100 text-red-800';
      break;
    default:
      colors = 'bg-gray-100 text-gray-800';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${colors}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

interface RequestDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requestId: string | null;
  onAction?: (type: 'approve' | 'decline', request: RequestResult) => void;
}

export default function RequestDetailModal({
  open,
  onOpenChange,
  requestId,
  onAction,
}: RequestDetailModalProps) {
  const [detail, setDetail] = useState<RequestDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !requestId) return;

    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      const res = await getRequestDetailAction(requestId);
      if (res.success) {
        setDetail(res.data);
      } else {
        setError(res.message);
      }
      setLoading(false);
    };

    fetchDetail();
  }, [open, requestId]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-all overflow-hidden font-sans">
      <div className="bg-surface w-full max-w-[500px] h-full shadow-2xl flex flex-col overflow-y-auto animate-in slide-in-from-right relative z-10 border-l border-border">
        
        {/* Header */}
        <div className="sticky top-0 bg-surface z-10 flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-bold text-text">Application Details</h2>
          <button 
            onClick={() => onOpenChange(false)} 
            className="text-text-muted hover:text-text rounded-full p-1 hover:bg-background transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 flex-1 space-y-8">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : detail ? (
            <>
              {/* Top Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background rounded-xl p-4">
                  <p className="text-xs font-medium text-text-muted mb-1">Full Name</p>
                  <p className="text-sm font-semibold text-text">{detail.full_name}</p>
                </div>
                <div className="bg-background rounded-xl p-4">
                  <p className="text-xs font-medium text-text-muted mb-1">Request ID</p>
                  <p className="text-sm font-semibold text-text">{detail.id.slice(0, 8)}</p>
                </div>
                
                <div className="bg-background rounded-xl p-4">
                  <p className="text-xs font-medium text-text-muted mb-1">Email</p>
                  <p className="text-sm font-semibold text-text break-all">{detail.email}</p>
                </div>
                <div className="bg-background rounded-xl p-4">
                  <p className="text-xs font-medium text-text-muted mb-1">Phone</p>
                  <p className="text-sm font-semibold text-text flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 shrink-0 text-text-muted" /> 
                    {detail.phone_number}
                  </p>
                </div>

                <div className="bg-background rounded-xl p-4">
                  <p className="text-xs font-medium text-text-muted mb-1">Court Facility</p>
                  <p className="text-sm font-semibold text-text">{detail.facility_name}</p>
                </div>
                <div className="bg-background rounded-xl p-4">
                  <p className="text-xs font-medium text-text-muted mb-1">Location</p>
                  <p className="text-sm font-semibold text-text flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-text-muted" /> 
                    {detail.city}, {detail.state_province}
                  </p>
                </div>

                <div className="bg-background rounded-xl p-4">
                  <p className="text-xs font-medium text-text-muted mb-1">Number of Courts</p>
                  <p className="text-sm font-semibold text-text">{detail.number_of_courts}</p>
                </div>
                <div className="bg-background rounded-xl p-4">
                  <p className="text-xs font-medium text-text-muted mb-1">Status</p>
                  <StatusBadge status={detail.status} />
                </div>
              </div>

              {/* Address Section */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-text">Full Address</p>
                <div className="border border-border bg-background/50 rounded-xl p-4">
                  <p className="text-sm text-text-muted flex items-start gap-2">
                    <Home className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{detail.full_address}</span>
                  </p>
                </div>
              </div>

              {/* Additional Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background rounded-xl p-4">
                  <p className="text-xs font-medium text-text-muted mb-1">Court Type</p>
                  <p className="text-sm font-semibold text-text capitalize">{detail.court_type}</p>
                </div>
                <div className="bg-background rounded-xl p-4">
                  <p className="text-xs font-medium text-text-muted mb-1">Sport</p>
                  <p className="text-sm font-semibold text-text capitalize">{detail.sport}</p>
                </div>
                
                <div className="bg-background rounded-xl p-4">
                  <p className="text-xs font-medium text-text-muted mb-1">Club Name</p>
                  <p className="text-sm font-semibold text-text">{detail.club_name || 'N/A'}</p>
                </div>
                <div className="bg-background rounded-xl p-4">
                  <p className="text-xs font-medium text-text-muted mb-1">Club Status</p>
                  <p className="text-sm font-semibold text-text capitalize">{detail.club_status}</p>
                </div>

                {detail.website && (
                  <div className="bg-background rounded-xl p-4 col-span-2">
                    <p className="text-xs font-medium text-text-muted mb-1">Website</p>
                    <p className="text-sm font-semibold text-text flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5 shrink-0 text-text-muted" />
                      <a href={detail.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {detail.website}
                      </a>
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>

        {/* Bottom Actions if pending */}
        {detail?.status === 'pending' && onAction && (
          <div className="sticky bottom-0 bg-surface border-t border-border p-4 flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1 shadow-none bg-surface" 
              onClick={() => {
                onOpenChange(false);
                if (detail) {
                  onAction('decline', {
                    id: detail.id,
                    applicant_name: detail.full_name,
                    applicant_email: detail.email,
                    facility_name: detail.facility_name,
                    location: `${detail.city}, ${detail.state_province}`,
                    number_of_courts: detail.number_of_courts,
                    status: detail.status,
                    date: detail.created_at.split('T')[0],
                  });
                }
              }}
            >
              Decline Application
            </Button>
            <Button 
              className="flex-1 shadow-none bg-[#10b981] hover:bg-[#059669]" 
              onClick={() => {
                onOpenChange(false);
                if (detail) {
                  onAction('approve', {
                    id: detail.id,
                    applicant_name: detail.full_name,
                    applicant_email: detail.email,
                    facility_name: detail.facility_name,
                    location: `${detail.city}, ${detail.state_province}`,
                    number_of_courts: detail.number_of_courts,
                    status: detail.status,
                    date: detail.created_at.split('T')[0],
                  });
                }
              }}
            >
              Approve Application
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}