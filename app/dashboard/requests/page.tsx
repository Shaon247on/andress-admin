"use client";

import React, { useState } from 'react';
import { Card } from '@/components/elements/card';
import { Button } from '@/components/elements/button';
import { Input } from '@/components/elements/input';
import { Search, Filter, ChevronDown, CheckCircle2, XCircle, FileText, X, MapPin, Phone } from 'lucide-react';

const requestsData = [
  { id: 'R001', applicant: 'Robert Taylor', email: 'robert@newcourts.com', facility: 'Taylor Sports Arena', location: 'Boston, MA', courts: 6, status: 'Pending', date: '2026-04-07' },
  { id: 'R002', applicant: 'Jennifer Martinez', email: 'jennifer@primetennis.com', facility: 'Prime Tennis Club', location: 'Seattle, WA', courts: 4, status: 'Pending', date: '2026-04-06' },
  { id: 'R003', applicant: 'Kevin White', email: 'kevin@citysportshub.com', facility: 'City Sports Hub', location: 'Portland, OR', courts: 8, status: 'Approved', date: '2026-04-05' },
  { id: 'R004', applicant: 'Maria Garcia', email: 'maria@sportscenter.com', facility: 'Garcia Sports Center', location: 'Denver, CO', courts: 5, status: 'Declined', date: '2026-04-04' },
];

const StatusBadge = ({ status }: { status: string }) => {
  let colors = '';
  switch (status) {
    case 'Pending':
      colors = 'bg-[#fef3c7] text-[#92400e]'; // Yellow
      break;
    case 'Approved':
      colors = 'bg-green-100 text-green-800';
      break;
    case 'Declined':
      colors = 'bg-red-100 text-red-800';
      break;
    default:
      colors = 'bg-gray-100 text-gray-800';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${colors}`}>
      {status}
    </span>
  );
};

export default function RequestsPage() {
  const [isOpen, setIsOpen] = useState(false);
  // Application details modal state
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  
  // Action confirmations state
  const [actionType, setActionType] = useState<'approve' | 'decline' | null>(null);

  const handlePreview = (app: any) => {
    setSelectedApp(app);
    setViewDetailsOpen(true);
  };

  const handleAction = (type: 'approve' | 'decline', app: any) => {
    setSelectedApp(app);
    setActionType(type);
    if (!viewDetailsOpen) {
      setViewDetailsOpen(true);
    }
  };

  const executeAction = () => {
    console.log(`Executing ${actionType} on application ${selectedApp?.id}`);
    // Simulate updating list items
    setActionType(null);
    setViewDetailsOpen(false);
    // Ideally update requestsData state here in a real app
    alert(`${actionType === 'approve' ? 'Approved' : 'Declined'} successfully`);
  };

  return (
    <div className="space-y-6 relative">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text">Requests</h1>
        <p className="text-sm text-text-muted mt-1">Review and manage court manager applications</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="flex flex-col p-6 gap-2 border-none shadow-sm rounded-2xl bg-surface justify-center">
          <p className="text-3xl font-bold text-text">4</p>
          <p className="text-sm font-medium text-text-muted">Total Requests</p>
        </Card>

        <Card className="flex flex-col p-6 gap-2 border-none shadow-sm rounded-2xl bg-surface justify-center">
          <p className="text-3xl font-bold text-text">2</p>
          <p className="text-sm font-medium text-text-muted">Pending</p>
        </Card>

        <Card className="flex flex-col p-6 gap-2 border-none shadow-sm rounded-2xl bg-surface justify-center">
          <p className="text-3xl font-bold text-text">1</p>
          <p className="text-sm font-medium text-text-muted">Approved</p>
        </Card>

        <Card className="flex flex-col p-6 gap-2 border-none shadow-sm rounded-2xl bg-surface justify-center">
          <p className="text-3xl font-bold text-text">1</p>
          <p className="text-sm font-medium text-text-muted">Declined</p>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input 
            placeholder="Search requests..." 
            className="pl-9 bg-surface border-border h-11 w-full rounded-xl"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto relative">
          <Button variant="outline" size="icon" className="h-11 w-11 bg-surface border-border rounded-xl shrink-0">
            <Filter className="h-5 w-5 text-text-muted" />
          </Button>
          <Button 
            variant="outline" 
            className="h-11 px-4 bg-surface border-border rounded-xl shrink-0 justify-between min-w-[140px]"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="text-text font-normal">All Status</span>
            <ChevronDown className="h-4 w-4 text-text-muted ml-2" />
          </Button>

          {/* Simple Dropdown UI Mock */}
          {isOpen && (
            <div className="absolute right-0 top-12 mt-1 w-48 bg-surface rounded-xl shadow-lg border border-border z-10 py-1 flex flex-col">
              <button className="text-left px-4 py-2 hover:bg-background text-sm text-text" onClick={() => setIsOpen(false)}>All Status</button>
              <div className="h-px w-full bg-border" />
              <button className="text-left px-4 py-2 hover:bg-background text-sm text-red-500" onClick={() => setIsOpen(false)}>New</button>
              <button className="text-left px-4 py-2 hover:bg-background text-sm text-yellow-500" onClick={() => setIsOpen(false)}>In Progress</button>
              <button className="text-left px-4 py-2 hover:bg-background text-sm text-green-500" onClick={() => setIsOpen(false)}>Resolved</button>
            </div>
          )}
        </div>
      </div>

      <Card className="border-none shadow-sm rounded-2xl bg-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-background text-text font-medium border-b border-border">
              <tr>
                <th scope="col" className="px-6 py-4 w-[100px]">Request ID</th>
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
              {requestsData.map((request) => (
                <tr key={request.id} className="bg-surface hover:bg-background/50 transition-colors">
                  <td className="px-6 py-4 text-text font-medium text-xs">{request.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-text">{request.applicant}</div>
                    <div className="text-text-muted mt-0.5 text-xs">{request.email}</div>
                  </td>
                  <td className="px-6 py-4 text-text max-w-[150px] leading-tight break-words">
                    {request.facility}
                  </td>
                  <td className="px-6 py-4 text-text-muted text-xs">{request.location}</td>
                  <td className="px-6 py-4 text-text font-medium text-center">{request.courts}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={request.status} />
                  </td>
                  <td className="px-6 py-4 text-text-muted text-xs whitespace-nowrap">{request.date}</td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="sm" className="h-8 shadow-none bg-background hover:bg-border text-text text-xs" onClick={() => handlePreview(request)}>
                        Preview
                      </Button>
                      {request.status === 'Pending' && (
                        <>
                          <Button size="sm" className="h-8 bg-[#10b981] hover:bg-[#059669] text-white text-xs border-none shadow-none" onClick={() => handleAction('approve', request)}>
                            Approve
                          </Button>
                          <Button size="sm" className="h-8 bg-[#ef4444] hover:bg-[#dc2626] text-white text-xs border-none shadow-none" onClick={() => handleAction('decline', request)}>
                            Decline
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Slide-over / Modal for Application Details */}
      {viewDetailsOpen && selectedApp && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-all overflow-hidden font-sans">
          <div className="bg-surface w-full max-w-[500px] h-full shadow-2xl flex flex-col overflow-y-auto animate-in slide-in-from-right relative z-10 border-l border-border">
            
            {/* Header */}
            <div className="sticky top-0 bg-surface z-10 flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-bold text-text">Application Details</h2>
              <button onClick={() => { setViewDetailsOpen(false); setActionType(null); }} className="text-text-muted hover:text-text rounded-full p-1 hover:bg-background transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 flex-1 space-y-8">
              
              {/* Top Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background rounded-xl p-4">
                  <p className="text-xs font-medium text-text-muted mb-1">Full Name</p>
                  <p className="text-sm font-semibold text-text">{selectedApp.applicant}</p>
                </div>
                <div className="bg-background rounded-xl p-4">
                  <p className="text-xs font-medium text-text-muted mb-1">Request ID</p>
                  <p className="text-sm font-semibold text-text">{selectedApp.id}</p>
                </div>
                
                <div className="bg-background rounded-xl p-4">
                  <p className="text-xs font-medium text-text-muted mb-1">Email</p>
                  <p className="text-sm font-semibold text-text flex items-center gap-1.5"><FileText className="h-3.5 w-3.5 shrink-0 text-text-muted" /> {selectedApp.email}</p>
                </div>
                <div className="bg-background rounded-xl p-4">
                   {/* In a real app we'd have phone in data */}
                  <p className="text-xs font-medium text-text-muted mb-1">Phone</p>
                  <p className="text-sm font-semibold text-text flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 shrink-0 text-text-muted" /> +1 (555) 789-0123</p>
                </div>

                <div className="bg-background rounded-xl p-4">
                  <p className="text-xs font-medium text-text-muted mb-1">Court Facility</p>
                  <p className="text-sm font-semibold text-text">{selectedApp.facility}</p>
                </div>
                <div className="bg-background rounded-xl p-4">
                  <p className="text-xs font-medium text-text-muted mb-1">Location</p>
                  <p className="text-sm font-semibold text-text flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 shrink-0 text-text-muted" /> {selectedApp.location}</p>
                </div>

                <div className="bg-background rounded-xl p-4">
                  <p className="text-xs font-medium text-text-muted mb-1">Number of Courts</p>
                  <p className="text-sm font-semibold text-text">{selectedApp.courts}</p>
                </div>
                <div className="bg-background rounded-xl p-4">
                  <p className="text-xs font-medium text-text-muted mb-1">Status</p>
                  <StatusBadge status={selectedApp.status} />
                </div>
              </div>

              {/* Tags Section */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-text">Court Types</p>
                <div className="flex gap-2">
                  <span className="inline-block border border-border bg-background text-text px-3 py-1 text-xs rounded-lg font-medium">Tennis</span>
                  <span className="inline-block border border-border bg-background text-text px-3 py-1 text-xs rounded-lg font-medium">Basketball</span>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold text-text">Experience</p>
                <div className="border border-border bg-background/50 rounded-xl p-4">
                  <p className="text-sm text-text-muted">5 years managing sports facilities</p>
                </div>
              </div>

              {/* Documents Section */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-text">Documents</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between border border-border rounded-xl p-3 bg-surface">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-background rounded-lg border border-border">
                        <FileText className="h-4 w-4 text-text-muted" />
                      </div>
                      <span className="text-sm font-medium text-text">Business License.pdf</span>
                    </div>
                    <Button variant="outline" size="sm" className="h-8 shadow-none bg-background">View</Button>
                  </div>
                  
                  <div className="flex items-center justify-between border border-border rounded-xl p-3 bg-surface">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-background rounded-lg border border-border">
                        <FileText className="h-4 w-4 text-text-muted" />
                      </div>
                      <span className="text-sm font-medium text-text">Facility Photos.pdf</span>
                    </div>
                    <Button variant="outline" size="sm" className="h-8 shadow-none bg-background">View</Button>
                  </div>

                  <div className="flex items-center justify-between border border-border rounded-xl p-3 bg-surface">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-background rounded-lg border border-border">
                        <FileText className="h-4 w-4 text-text-muted" />
                      </div>
                      <span className="text-sm font-medium text-text">Insurance Certificate.pdf</span>
                    </div>
                    <Button variant="outline" size="sm" className="h-8 shadow-none bg-background">View</Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions if pending */}
            {selectedApp.status === 'Pending' && !actionType && (
              <div className="sticky bottom-0 bg-surface border-t border-border p-4 flex gap-3">
                <Button variant="outline" className="flex-1 shadow-none bg-surface" onClick={() => setActionType('decline')}>Decline Application</Button>
                <Button className="flex-1 shadow-none bg-[#10b981] hover:bg-[#059669]" onClick={() => setActionType('approve')}>Approve Application</Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confirmation Overlays - nested to show on top of Slideover implicitly via z-index logic if active */}
      {actionType === 'approve' && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
           <Card className="w-full max-w-sm rounded-[24px] border-none shadow-2xl p-6 relative overflow-hidden bg-surface">
             <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-green-100 text-[#10b981]">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-text">Approve Application</h3>
              </div>
              <p className="text-sm text-text-muted mb-8 leading-relaxed">
                Are you sure you want to approve this application? The applicant will be granted access to the manager dashboard.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 border-border shadow-none" onClick={() => setActionType(null)}>Cancel</Button>
                <Button className="flex-1 bg-[#10b981] shadow-none hover:bg-[#059669]" onClick={executeAction}>Approve</Button>
              </div>
           </Card>
        </div>
      )}

      {actionType === 'decline' && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
           <Card className="w-full max-w-sm rounded-[24px] border-none shadow-2xl p-6 relative overflow-hidden bg-surface">
             <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-red-100 text-[#ef4444]">
                  <XCircle className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-text">Decline Application</h3>
              </div>
              <p className="text-sm text-text-muted mb-8 leading-relaxed">
                Are you sure you want to decline this application? The applicant will be notified of the decision.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 border-border shadow-none" onClick={() => setActionType(null)}>Cancel</Button>
                <Button className="flex-1 bg-[#ef4444] shadow-none hover:bg-[#dc2626]" onClick={executeAction}>Decline</Button>
              </div>
           </Card>
        </div>
      )}

    </div>
  );
}
