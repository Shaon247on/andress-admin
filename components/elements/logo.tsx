import React from 'react';
import { cn } from '@/lib/utils';
import { Activity } from 'lucide-react';
import Image from 'next/image';

export function Logo({ className }: { className?: string }) {
  return (
    <div className="w-full">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full border-2 border-primary flex items-center justify-center shrink-0">
          <Image
            src="/assets/athlon_avatar.png"
            alt="AthlonGo Logo"
            width={100}
            height={100}
            className="object-cover"
          />
        </div>
        <div>
          <h2 className="font-bold text-lg leading-tight text-slate-800">AthlonGo</h2>
          <p className="text-xs text-slate-500">Admin Panel</p>
        </div>
      </div>
    </div>
  );
}
