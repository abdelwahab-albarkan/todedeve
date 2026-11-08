'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Menu,
  ChevronDown,
  LogOut,
  User,
  ExternalLink,
  Check,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { CURRENT_USER } from '@/lib/dashboard-data';

interface DashboardHeaderProps {
  onToggleMobileMenu: () => void;
  searchPlaceholder?: string;
}

export function DashboardHeader({
  onToggleMobileMenu,
  searchPlaceholder = 'Search projects, tasks, or members...',
}: DashboardHeaderProps) {
  const { theme, setTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifications = [
    { id: 1, text: 'Sarah updated project Mobile App', time: '5m ago', unread: true },
    { id: 2, text: 'Ahmed completed task Design UI', time: '20m ago', unread: true },
    { id: 3, text: 'Invoice INV-0042 marked as Paid ($6,500)', time: '1h ago', unread: false },
    { id: 4, text: 'New comment on E-Commerce sprint', time: '3h ago', unread: false },
  ];

  return (
    <header className="sticky top-0 z-20 w-full h-16 bg-[#080C14]/90 dark:bg-[#080C14]/90 backdrop-blur-md border-b border-[#151F32] px-3 sm:px-8 flex items-center justify-between gap-2 sm:gap-4">
      
      {/* Left: Mobile Menu Toggle + Search Bar */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 max-w-xl">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-[#10172A] transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Input Pill */}
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-3 sm:pr-20 py-2 rounded-full text-xs sm:text-sm bg-[#0E1526] border border-[#1E293B] text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/70 transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-[#162136] border border-zinc-700/50 text-[10px] font-mono font-medium text-zinc-400 select-none">
            <span>Ctrl + K</span>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex shrink-0 items-center gap-1 sm:gap-3.5">
        
        {/* Return to Sales / Landing Page Link */}
        <Link
          href="/"
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-amber-400 hover:bg-[#10172A] transition-colors"
        >
          <span>Landing Page</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        {/* Notification Bell with Badge */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-[#10172A] relative transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500 shadow-glow-orange" />
          </button>

          {showNotifications && (
            <div className="absolute -right-16 sm:right-0 mt-2 w-[min(20rem,calc(100vw-1.5rem))] rounded-2xl bg-[#0D1424] border border-[#1E293B] shadow-2xl py-2 z-50 text-xs">
              <div className="px-4 py-2 border-b border-[#1E293B] flex items-center justify-between">
                <span className="font-bold text-white text-sm">Notifications</span>
                <span className="text-[10px] font-mono text-amber-500">2 new</span>
              </div>
              <div className="divide-y divide-[#151F32] max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`px-4 py-2.5 hover:bg-[#141C32] transition-colors ${
                      n.unread ? 'bg-[#10192E]' : ''
                    }`}
                  >
                    <p className="text-zinc-200 font-medium">{n.text}</p>
                    <span className="text-[10px] text-zinc-500 block mt-1">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dark / Light Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-[#10172A] transition-colors"
          aria-label="Toggle dark mode"
        >
          {theme === 'light' ? (
            <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
          ) : (
            <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
          )}
        </button>

        {/* User Avatar & Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-amber-500/50 transition-all"
            aria-label="User account"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center border border-purple-400/40 shadow-glow-purple">
              JD
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0D1424] border border-[#1E293B] shadow-2xl py-2 z-50 text-xs">
              <div className="px-4 py-2 border-b border-[#1E293B]">
                <p className="font-bold text-white text-sm">{CURRENT_USER.name}</p>
                <p className="text-zinc-400 font-mono text-[11px] truncate">{CURRENT_USER.email}</p>
              </div>
              <div className="py-1">
                <Link
                  href="/dashboard/settings"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-zinc-300 hover:text-white hover:bg-[#141C32]"
                >
                  <User className="w-3.5 h-3.5 text-amber-500" />
                  <span>Profile Settings</span>
                </Link>
                <Link
                  href="/#pricing"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-zinc-300 hover:text-white hover:bg-[#141C32]"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Upgrade License</span>
                </Link>
              </div>
              <div className="border-t border-[#1E293B] pt-1">
                <Link
                  href="/"
                  className="flex items-center gap-2.5 px-4 py-2 text-red-400 hover:bg-[#141C32]"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign out</span>
                </Link>
              </div>
            </div>
          )}
        </div>

      </div>

    </header>
  );
}

