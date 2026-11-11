'use client';

import React from 'react';
import Link from 'next/link';
import {
  Users,
  MessageSquare,
  UserPlus,
} from 'lucide-react';
import { playBlip } from '@/lib/sound';
import { cn } from '@/lib/utils';

export interface FriendsRailProps {
  className?: string;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function FriendsRail({ className }: FriendsRailProps) {
  return (
    <aside
      className={cn(
        'w-[70px] h-screen sticky top-0 flex-shrink-0 z-30 bg-[#1C0A0A] border-l border-white/[0.07] flex flex-col items-center justify-between py-5 select-none',
        className
      )}
    >
      {/* Top: Syndicate / Party Hub Icon */}
      <div className="flex flex-col items-center gap-3 w-full">
        <Link
          href="/dashboard/friends"
          onClick={() => playBlip()}
          title="Party & Squads"
          className="w-11 h-11 rounded-2xl bg-[#291010] border border-white/10 hover:border-[#E34242] flex items-center justify-center text-[#C7A9A3] hover:text-white transition-colors shadow-sm"
        >
          <Users className="w-5 h-5" />
        </Link>
      </div>

      {/* Center: Clean Add Friend Action */}
      <div className="flex flex-col items-center w-full">
        <Link
          href="/dashboard/friends"
          onClick={() => playBlip()}
          title="Add Contender Friend"
          className="group relative w-11 h-11 rounded-2xl border border-dashed border-[#E34242]/60 hover:border-[#E34242] bg-[#E34242]/10 hover:bg-[#E34242]/20 flex items-center justify-center text-[#E34242] transition-colors cursor-pointer"
        >
          <UserPlus className="w-5 h-5" />

          {/* Hover Tooltip */}
          <div className="absolute right-14 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-[#291010] border border-[#E34242]/35 text-xs text-white opacity-0 translate-x-1.5 group-hover:opacity-100 group-hover:translate-x-0 pointer-events-none transition-all duration-150 whitespace-nowrap shadow-2xl z-50">
            <p className="font-semibold text-white">Add Friends</p>
            <p className="text-[10px] text-[#C7A9A3]">Connect with players</p>
          </div>
        </Link>
      </div>

      {/* Bottom: Chat & Arcadia Station Mark */}
      <div className="flex flex-col items-center gap-3 pt-3 border-t border-white/[0.06] w-full">
        <Link
          href="/community"
          onClick={() => playBlip()}
          title="Guild Messages"
          className="relative w-10 h-10 rounded-2xl bg-[#291010] border border-white/10 flex items-center justify-center text-[#C7A9A3] hover:text-white hover:border-[#E34242] transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
        </Link>

        <div
          title="Arcadia Station Network"
          className="w-10 h-10 rounded-2xl bg-[#E34242]/15 border border-[#E34242]/35 flex items-center justify-center text-[#E34242] font-black text-xs font-mono select-none cursor-default"
        >
          A*
        </div>
      </div>
    </aside>
  );
}

export default FriendsRail;
