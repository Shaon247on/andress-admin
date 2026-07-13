"use client";

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/elements/card';
import { 
  ArrowLeft, CalendarDays, Clock, MapPin, CheckCircle2, 
  Trophy, AlertTriangle, UserPlus, Users, Shield, 
  Crown, Star, Wallet, XCircle
} from 'lucide-react';
import type { BookingDetail, BookingPlayer } from '@/types/Booking.type';

interface BookingDetailsProps {
  booking: BookingDetail;
}

const PositionBadge = ({ position }: { position?: string }) => {
  if (!position) return null;
  const positionMap: Record<string, { label: string; color: string }> = {
    att: { label: 'ATT', color: 'bg-red-50 text-red-600' },
    mid: { label: 'MID', color: 'bg-blue-50 text-blue-600' },
    def: { label: 'DEF', color: 'bg-green-50 text-green-600' },
    gk: { label: 'GK', color: 'bg-yellow-50 text-yellow-600' },
  };
  const pos = positionMap[position.toLowerCase()] || { label: position.toUpperCase(), color: 'bg-gray-50 text-gray-600' };
  return (
    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${pos.color}`}>
      {pos.label}
    </span>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const isCompleted = status === 'completed';
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${
        isCompleted ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
      }`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default function BookingDetails({ booking }: BookingDetailsProps) {
  const gameDetails = {
    name: booking?.title || booking?.court,
    type: booking?.match_type || 'Competitive',
    visibility: booking?.visibility || 'Public',
    format: booking?.game_format || '5v5',
    price: `$${booking?.price}`,
    date: new Date(booking?.date).toLocaleDateString('en-US', { 
      weekday: 'short', 
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }),
    time: booking?.time || booking?.start_time?.slice(0, 5),
    court: booking?.court,
    paymentStatus: booking?.payment_completed ? 'Payment Completed' : 'Payment Pending',
    score: booking?.score || { team_a: 0, team_b: 0 },
  };

  const renderPlayerSlot = (player: BookingPlayer, teamName: string) => {
    if (player.open) {
      return (
        <Card key={`${teamName}-slot-${player.slot}`} className="p-4 bg-background/50 rounded-2xl border-2 border-dashed border-border/60 flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-surface border border-border flex items-center justify-center text-text-muted/50 flex-shrink-0">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-text-muted text-sm">Slot {player.slot}</div>
            <div className="text-[11px] font-black uppercase tracking-widest text-text-muted/50 mt-1">Open Slot</div>
          </div>
        </Card>
      );
    }

    return (
      <Card key={`${teamName}-player-${player.slot}`} className="p-4 bg-surface rounded-2xl shadow-sm border border-border/50 flex items-center gap-4 hover:shadow-md transition-shadow">
        <div className={`h-14 w-14 rounded-full bg-gradient-to-br ${
          player.is_captain 
            ? 'from-amber-100 to-amber-200 border-amber-400' 
            : 'from-indigo-100 to-purple-100'
        } border-2 border-white shadow-sm flex-shrink-0 flex items-center justify-center relative`}>
          <span className="text-lg font-bold text-indigo-600">
            {player.name?.charAt(0) || 'P'}
          </span>
          {player.is_captain && (
            <div className="absolute -top-1 -right-1">
              <Crown className="w-4 h-4 text-amber-500 fill-amber-400" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-bold text-text text-base">{player.name}</span>
            {player.is_captain && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-wider">
                Captain
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs font-bold">
            <PositionBadge position={player.position} />
            {player.ovr && (
              <span className="text-amber-500 flex items-center bg-amber-50 px-2 py-1 rounded-md">
                <Star className="w-3 h-3 mr-0.5 fill-amber-400 text-amber-400" />
                <span className="text-[10px]">{player.ovr} OVR</span>
              </span>
            )}
          </div>
        </div>
        <div className="text-right">
          <span className={`text-xs font-black px-3 py-1.5 rounded-xl flex items-center gap-1.5 ${
            player.is_paid 
              ? 'text-emerald-600 bg-emerald-50' 
              : 'text-red-500 bg-red-50'
          }`}>
            {player.is_paid ? (
              <>
                <Wallet className="w-4 h-4" /> Paid
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4" /> Unpaid
              </>
            )}
          </span>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6 pb-10 max-w-5xl mx-auto">
      <Link href="/dashboard/bookings" className="inline-flex items-center text-sm font-bold text-text-muted hover:text-text transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Bookings
      </Link>

      {/* Main Game Info Card */}
      <Card className="bg-gradient-to-br from-[#10b981] to-[#059669] text-white p-8 rounded-[2rem] shadow-lg border-none relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/10 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>

        <div className="relative z-10 flex flex-wrap gap-3 mb-6">
          <span className="inline-flex items-center px-4 py-2 rounded-2xl bg-white/20 text-white text-xs font-black tracking-widest backdrop-blur-md shadow-sm border border-white/10">
            <Trophy className="w-4 h-4 mr-1.5" /> {gameDetails.type.charAt(0).toUpperCase() + gameDetails.type.slice(1)}
          </span>
          <span className="inline-flex items-center px-4 py-2 rounded-2xl bg-white/20 text-white text-xs font-black tracking-widest backdrop-blur-md shadow-sm border border-white/10">
            {gameDetails.visibility.charAt(0).toUpperCase() + gameDetails.visibility.slice(1)}
          </span>
          <span className="inline-flex items-center px-4 py-2 rounded-2xl bg-white/20 text-white text-xs font-black tracking-widest backdrop-blur-md shadow-sm border border-white/10">
            {gameDetails.format}
          </span>
          <span className="inline-flex items-center px-5 py-2 rounded-2xl bg-white text-[#059669] text-sm font-black ml-auto sm:ml-0 shadow-lg border border-white/20">
            Price {gameDetails.price}
          </span>
        </div>

        <div className="relative z-10">
          <h1 className="text-5xl font-black mb-6 tracking-tight drop-shadow-sm">{gameDetails.name}</h1>

          <div className="flex flex-wrap items-center gap-6 text-base font-bold opacity-90 mb-8 bg-black/10 w-fit px-6 py-3 rounded-2xl backdrop-blur-sm border border-white/10">
            <div className="flex items-center gap-2"><CalendarDays className="w-5 h-5" /> {gameDetails.date}</div>
            <div className="w-1.5 h-1.5 rounded-full bg-white/50"></div>
            <div className="flex items-center gap-2"><Clock className="w-5 h-5" /> {gameDetails.time}</div>
            <div className="w-1.5 h-1.5 rounded-full bg-white/50"></div>
            <div className="flex items-center gap-2"><MapPin className="w-5 h-5" /> {gameDetails.court}</div>
          </div>

          <div className="inline-flex items-center px-5 py-2.5 rounded-2xl bg-white/20 text-white text-sm font-black tracking-wide backdrop-blur-md border border-white/20 shadow-sm">
            <CheckCircle2 className="w-5 h-5 mr-2 text-emerald-100" /> {gameDetails.paymentStatus}
          </div>
        </div>
      </Card>

      {/* Score Card */}
      <Card className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-900 text-white rounded-3xl shadow-lg border-none p-6 flex items-center justify-between px-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="text-xl font-black tracking-[0.2em] text-blue-200 relative z-10">{booking?.team_a?.name}</div>
        <div className="bg-white/10 px-10 py-3 rounded-2xl text-5xl font-black tracking-widest shadow-inner border border-white/10 relative z-10 backdrop-blur-sm">
          {gameDetails.score.team_a} - {gameDetails.score.team_b}
        </div>
        <div className="text-xl font-black tracking-[0.2em] text-blue-200 relative z-10">{booking?.team_b?.name}</div>
      </Card>

      {/* Teams Lineup */}
      <div className="grid md:grid-cols-2 gap-8 mt-4">
        {/* Team A */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pl-2 mb-2">
            <h3 className="text-sm font-black text-text-muted uppercase tracking-widest">
              {booking?.team_a?.name} ({booking?.team_a?.filled}/{booking?.team_a?.capacity})
            </h3>
            <div className="flex items-center gap-2">
              {booking?.team_a?.paid > 0 && (
                <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2.5 py-1 rounded-full">
                  {booking?.team_a?.paid} Paid
                </span>
              )}
              {booking?.team_a?.unpaid > 0 && (
                <span className="text-xs font-bold text-red-500 bg-red-50 px-2.5 py-1 rounded-full">
                  {booking?.team_a?.unpaid} Unpaid
                </span>
              )}
            </div>
          </div>
          {booking?.team_a?.players.map((player) => renderPlayerSlot(player, 'team-a'))}
        </div>

        {/* Team B */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pl-2 mb-2">
            <h3 className="text-sm font-black text-text-muted uppercase tracking-widest">
              {booking?.team_b?.name} ({booking?.team_b?.filled}/{booking?.team_b?.capacity})
            </h3>
            <div className="flex items-center gap-2">
              {booking?.team_b?.paid > 0 && (
                <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2.5 py-1 rounded-full">
                  {booking?.team_b?.paid} Paid
                </span>
              )}
              {booking?.team_b?.unpaid > 0 && (
                <span className="text-xs font-bold text-red-500 bg-red-50 px-2.5 py-1 rounded-full">
                  {booking?.team_b?.unpaid} Unpaid
                </span>
              )}
            </div>
          </div>
          {booking?.team_b?.players.map((player) => renderPlayerSlot(player, 'team-b'))}
        </div>
      </div>

      {/* Booking Info Footer */}
      <Card className="border-none shadow-sm rounded-2xl bg-surface p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-text-muted font-medium">Booking Code</p>
            <p className="text-sm font-bold text-text mt-1">{booking?.code}</p>
          </div>
          <div>
            <p className="text-xs text-text-muted font-medium">Source</p>
            <p className="text-sm font-bold text-text mt-1 capitalize">{booking?.source?.replace('_', ' ')}</p>
          </div>
          <div>
            <p className="text-xs text-text-muted font-medium">Match Type</p>
            <p className="text-sm font-bold text-text mt-1 capitalize">{booking?.match_type}</p>
          </div>
          <div>
            <p className="text-xs text-text-muted font-medium">Status</p>
            <div className="mt-1">
              <StatusBadge status={booking?.payment_completed ? 'completed' : 'pending'} />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}