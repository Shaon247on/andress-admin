"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/elements/card";
import Pagination from "@/components/common/Pagination";
import { Loader2 } from "lucide-react";
import { getCourtsTabAction } from "@/actions/court-manager.action";
import type { CourtItem, PaginationInfo } from "@/types/CourtManager.type";
import { toast } from "sonner";

interface CourtsTabProps {
  managerId: string;
}

export default function CourtsTab({ managerId }: CourtsTabProps) {
  const [loading, setLoading] = useState(true);
  const [courts, setCourts] = useState<CourtItem[]>([]);
  const [cards, setCards] = useState({ total: 0, available: 0, maintenance: 0 });
  const [pagination, setPagination] = useState<PaginationInfo>({
    count: 0,
    page: 1,
    page_size: 20,
    total_pages: 1,
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch data directly in useEffect
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const res = await getCourtsTabAction(managerId, currentPage);
      if (res.success) {
        setCourts(res.data.courts);
        setCards(res.data.cards);
        setPagination(res.data.pagination);
      } else {
        toast.error(res.message);
      }
      setLoading(false);
    };

    loadData();
  }, [managerId, currentPage]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 border-none shadow-sm rounded-2xl bg-surface">
          <p className="text-sm text-text-muted font-medium">Total Courts</p>
          <p className="text-3xl font-bold text-text mt-2">{cards.total}</p>
        </Card>
        <Card className="p-6 border-none shadow-sm rounded-2xl bg-surface">
          <p className="text-sm text-text-muted font-medium">Available</p>
          <p className="text-3xl font-bold text-[#10b981] mt-2">{cards.available}</p>
        </Card>
        <Card className="p-6 border-none shadow-sm rounded-2xl bg-surface">
          <p className="text-sm text-text-muted font-medium">Under Maintenance</p>
          <p className="text-3xl font-bold text-[#f59e0b] mt-2">{cards.maintenance}</p>
        </Card>
      </div>

      <Card className="border-none shadow-sm rounded-2xl bg-surface overflow-hidden">
        <div className="p-6 pb-2 border-b border-border text-base font-semibold text-text">
          All Courts
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-text-muted uppercase bg-background/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Court</th>
                <th className="px-6 py-4 font-medium">Type / Surface</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Price/Hr</th>
                <th className="px-6 py-4 font-medium">Format</th>
                <th className="px-6 py-4 font-medium">Bookings</th>
                <th className="px-6 py-4 font-medium">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {courts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-text-muted">
                    No courts found.
                  </td>
                </tr>
              ) : (
                courts.map((court) => (
                  <tr
                    key={court.id}
                    className="hover:bg-background/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-text">{court.name}</p>
                      <p className="text-xs text-text-muted">{court.location}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-text capitalize">
                        {court.court_type}
                      </p>
                      <p className="text-xs text-text-muted capitalize">
                        {court.surface.replace("_", " ")}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium w-max ${
                          court.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {court.status.charAt(0).toUpperCase() + court.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-text">
                      €{court.price_per_hour}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                        {court.game_format}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-text">{court.bookings}</td>
                    <td className="px-6 py-4 font-medium text-[#10b981]">
                      €{parseFloat(court.revenue).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {pagination.total_pages > 1 && (
          <div className="px-6 py-4 border-t border-border">
            <Pagination total={pagination.count} pageSize={pagination.page_size} />
          </div>
        )}
      </Card>
    </div>
  );
}