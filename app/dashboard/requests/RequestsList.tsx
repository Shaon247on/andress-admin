// app/dashboard/requests/RequestsList.tsx

"use client";

import React, { useState } from 'react';
import { Card } from '@/components/elements/card';
import { Button } from '@/components/ui/button';
import SearchInput from '@/components/common/SearchInput';
import Pagination from '@/components/common/Pagination';
import SelectFilter from '@/components/common/SelectFilter';
import RequestDetailModal from './RequestDetailModal';
import RequestActionDialog from './RequestActionDialog';
import type { RequestResult, RequestStats } from '@/types/Request.type';

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

const StatusOptions = [
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
];

interface RequestsListProps {
  requests: RequestResult[];
  total: number;
  stats: RequestStats | null;
  errorMessage?: string;
  statsError?: string;
}

export default function RequestsList({
  requests = [],
  total = 0,
  stats = null,
  errorMessage,
  statsError,
}: RequestsListProps) {
  const [selectedRequest, setSelectedRequest] = useState<RequestResult | null>(null);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'decline' | null>(null);
  const [actionRequest, setActionRequest] = useState<RequestResult | null>(null);

  const handlePreview = (request: RequestResult) => {
    setSelectedRequest(request);
    setViewDetailsOpen(true);
  };

  const handleAction = (type: 'approve' | 'decline', request: RequestResult) => {
    setActionRequest(request);
    setActionType(type);
  };

  const handleActionComplete = () => {
    setActionType(null);
    setActionRequest(null);
    // Just close the dialog, page will re-fetch when URL changes
  };

  return (
    <>
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="flex flex-col p-6 gap-2 border-none shadow-sm rounded-2xl bg-surface justify-center">
          <p className="text-3xl font-bold text-text">{stats?.total ?? 0}</p>
          <p className="text-sm font-medium text-text-muted">Total Requests</p>
        </Card>

        <Card className="flex flex-col p-6 gap-2 border-none shadow-sm rounded-2xl bg-surface justify-center">
          <p className="text-3xl font-bold text-text">{stats?.pending ?? 0}</p>
          <p className="text-sm font-medium text-text-muted">Pending</p>
        </Card>

        <Card className="flex flex-col p-6 gap-2 border-none shadow-sm rounded-2xl bg-surface justify-center">
          <p className="text-3xl font-bold text-text">{stats?.approved ?? 0}</p>
          <p className="text-sm font-medium text-text-muted">Approved</p>
        </Card>

        <Card className="flex flex-col p-6 gap-2 border-none shadow-sm rounded-2xl bg-surface justify-center">
          <p className="text-3xl font-bold text-text">{stats?.rejected ?? 0}</p>
          <p className="text-sm font-medium text-text-muted">Declined</p>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1 w-full">
          <SearchInput name="search" placeholder="Search requests..." />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <SelectFilter
            name="status"
            placeholder="All Status"
            options={StatusOptions}
          />
        </div>
      </div>

      {/* Error */}
      {errorMessage && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {/* Table */}
      <Card className="border-none shadow-sm rounded-2xl bg-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-background text-text font-medium border-b border-border">
              <tr>
                <th scope="col" className="px-6 py-4 w-[100px]">ID</th>
                <th scope="col" className="px-6 py-4">Applicant</th>
                <th scope="col" className="px-6 py-4">Court Facility</th>
                <th scope="col" className="px-6 py-4">Location</th>
                <th scope="col" className="px-6 py-4 text-center">Courts</th>
                <th scope="col" className="px-6 py-4">Status</th>
                <th scope="col" className="px-6 py-4">Date</th>
                <th scope="col" className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-text-muted">
                    No requests found.
                  </td>
                </tr>
              ) : (
                requests.map((request) => (
                  <tr key={request.id} className="bg-surface hover:bg-background/50 transition-colors">
                    <td className="px-6 py-4 text-text font-medium text-xs">
                      {request.id.slice(0, 8)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-text">{request.applicant_name}</div>
                      <div className="text-text-muted mt-0.5 text-xs">{request.applicant_email}</div>
                    </td>
                    <td className="px-6 py-4 text-text max-w-[150px] leading-tight break-words">
                      {request.facility_name}
                    </td>
                    <td className="px-6 py-4 text-text-muted text-xs">{request.location}</td>
                    <td className="px-6 py-4 text-text font-medium text-center">
                      {request.number_of_courts}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={request.status} />
                    </td>
                    <td className="px-6 py-4 text-text-muted text-xs whitespace-nowrap">
                      {new Date(request.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 shadow-none bg-background hover:bg-border text-text text-xs" 
                          onClick={() => handlePreview(request)}
                        >
                          Preview
                        </Button>
                        {request.status === 'pending' && (
                          <>
                            <Button 
                              size="sm" 
                              className="h-8 bg-[#10b981] hover:bg-[#059669] text-white text-xs border-none shadow-none" 
                              onClick={() => handleAction('approve', request)}
                            >
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              className="h-8 bg-[#ef4444] hover:bg-[#dc2626] text-white text-xs border-none shadow-none" 
                              onClick={() => handleAction('decline', request)}
                            >
                              Decline
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Pagination total={total} pageSize={10} />

      {/* Detail Modal */}
      <RequestDetailModal
        open={viewDetailsOpen}
        onOpenChange={setViewDetailsOpen}
        requestId={selectedRequest?.id || null}
        onAction={handleAction}
      />

      {/* Action Dialogs */}
      <RequestActionDialog
        open={actionType === 'approve'}
        onOpenChange={() => setActionType(null)}
        type="approve"
        request={actionRequest}
        onComplete={handleActionComplete}
      />

      <RequestActionDialog
        open={actionType === 'decline'}
        onOpenChange={() => setActionType(null)}
        type="decline"
        request={actionRequest}
        onComplete={handleActionComplete}
      />
    </>
  );
}