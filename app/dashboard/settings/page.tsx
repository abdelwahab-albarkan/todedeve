'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  User,
  Shield,
  Palette,
  CreditCard,
  Bell,
  Sliders,
  Check,
  Upload,
  Trash2,
  ChevronRight,
  Sun,
  Moon,
  Laptop,
} from 'lucide-react';
import { useTheme } from 'next-themes';

export default function SettingsCustomizationPage() {
  const { theme: rawTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const theme = mounted ? rawTheme : undefined;

  const [activeTab, setActiveTab] = useState<'General' | 'Team' | 'Roles' | 'Integrations' | 'Billing' | 'Appearance' | 'Notifications'>('General');

  // Form states
  const [workspaceName, setWorkspaceName] = useState('TODEDEV Studio');
  const [workspaceUrl, setWorkspaceUrl] = useState('todedev');
  const [description, setDescription] = useState(
    'A modern workspace to manage projects, clients, and team collaboration.'
  );

  // Appearance states
  const [selectedBrandColor, setSelectedBrandColor] = useState('orange');
  const [accentStyle, setAccentStyle] = useState('Modern (Gradient)');

  // Security toggles
  const [twoFactor, setTwoFactor] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [savedNotification, setSavedNotification] = useState(false);

  const brandColors = [
    { id: 'orange', hex: '#F97316' },
    { id: 'purple', hex: '#A855F7' },
    { id: 'blue', hex: '#38BDF8' },
    { id: 'green', hex: '#22C55E' },
    { id: 'red', hex: '#EF4444' },
    { id: 'pink', hex: '#EC4899' },
    { id: 'cyan', hex: '#06B6D4' },
  ];

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-amber-500" />
          <span>Settings</span>
        </h1>
        <p className="text-sm text-zinc-400 mt-0.5">
          Manage your account, team, security, and system preferences.
        </p>
      </div>

      {/* 2. Settings Category Tabs */}
      <div className="flex items-center gap-2 pb-2 border-b border-[#1E293B] overflow-x-auto">
        {[
          { id: 'General', label: 'General', icon: Sliders },
          { id: 'Team', label: 'Team', icon: User },
          { id: 'Roles', label: 'Roles & Permissions', icon: Shield },
          { id: 'Integrations', label: 'Integrations', icon: Sliders },
          { id: 'Billing', label: 'Billing & Plan', icon: CreditCard },
          { id: 'Appearance', label: 'Appearance', icon: Palette },
          { id: 'Notifications', label: 'Notifications', icon: Bell },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-white bg-[#10172A]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Main 2-Column Settings Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: General Settings Form (6 Cols) */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-[#0D1424] border border-[#1E293B] shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">General Settings</h2>
              <p className="text-xs text-zinc-400">Basic information about your workspace.</p>
            </div>
          </div>

          <form onSubmit={handleSaveChanges} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Workspace Name
              </label>
              <input
                type="text"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#10172A] border border-[#1E293B] text-white text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Workspace URL
              </label>
              <div className="flex rounded-xl overflow-hidden border border-[#1E293B] bg-[#10172A]">
                <input
                  type="text"
                  value={workspaceUrl}
                  onChange={(e) => setWorkspaceUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-transparent text-white text-sm focus:outline-none"
                />
                <span className="px-3.5 py-2.5 bg-[#151F32] text-xs font-mono text-zinc-400 select-none flex items-center">
                  .app
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#10172A] border border-[#1E293B] text-white text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Company Logo Upload Box */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Company Logo
              </label>
              <div className="p-4 rounded-xl border border-dashed border-[#1E293B] bg-[#10172A] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#151F32] flex items-center justify-center p-2 border border-zinc-700">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center font-black text-white text-xs">
                      T
                    </div>
                  </div>
                  <div>
                    <span className="font-bold text-white text-xs block">TODEDEV Brand Icon</span>
                    <span className="text-[10px] text-zinc-500 font-mono">Recommended: 512 × 512 (PNG, JPG, SVG)</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => alert('Logo upload triggered')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#151F32] hover:bg-[#1E293B] text-xs text-zinc-300 font-medium"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload New</span>
                  </button>
                  <button
                    type="button"
                    className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-zinc-950 font-bold text-xs shadow-glow-orange transition-all active:scale-95"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Save Changes</span>
              </button>

              {savedNotification && (
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 animate-pulse">
                  <Check className="w-3.5 h-3.5" />
                  <span>Workspace updated successfully!</span>
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Right Column: Appearance & Security (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Appearance Card */}
          <div className="p-6 rounded-2xl bg-[#0D1424] border border-[#1E293B] shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Appearance</h2>
                <p className="text-xs text-zinc-400">Customize the look and feel of your dashboard.</p>
              </div>
            </div>

            {/* Theme Selectors */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {/* Dark */}
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all relative ${
                  theme === 'dark' || !theme
                    ? 'bg-[#10172A] border-amber-500 shadow-glow-orange/30'
                    : 'bg-[#10172A]/40 border-[#1E293B] hover:border-zinc-700'
                }`}
              >
                {theme === 'dark' && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-amber-500 text-zinc-950 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                )}
                <div className="w-8 h-5 rounded bg-zinc-900 border border-zinc-700 flex items-center px-1">
                  <div className="w-2.5 h-1 rounded-full bg-amber-500" />
                </div>
                <span className="text-xs font-bold text-white">Dark (Default)</span>
              </button>

              {/* Light */}
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all relative ${
                  theme === 'light'
                    ? 'bg-[#10172A] border-amber-500 shadow-glow-orange/30'
                    : 'bg-[#10172A]/40 border-[#1E293B] hover:border-zinc-700'
                }`}
              >
                {theme === 'light' && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-amber-500 text-zinc-950 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                )}
                <div className="w-8 h-5 rounded bg-zinc-200 border border-zinc-300 flex items-center px-1">
                  <div className="w-2.5 h-1 rounded-full bg-blue-500" />
                </div>
                <span className="text-xs font-bold text-white">Light</span>
              </button>

              {/* System */}
              <button
                type="button"
                onClick={() => setTheme('system')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all relative ${
                  theme === 'system'
                    ? 'bg-[#10172A] border-amber-500 shadow-glow-orange/30'
                    : 'bg-[#10172A]/40 border-[#1E293B] hover:border-zinc-700'
                }`}
              >
                <Laptop className="w-5 h-5 text-zinc-400" />
                <span className="text-xs font-bold text-white">System</span>
              </button>
            </div>

            {/* Brand Color Swatches */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-zinc-300 mb-2">
                Brand Color
              </label>
              <div className="flex items-center gap-2.5 flex-wrap">
                {brandColors.map((color) => (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => setSelectedBrandColor(color.id)}
                    className="w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-110 relative"
                    style={{ backgroundColor: color.hex }}
                  >
                    {selectedBrandColor === color.id && (
                      <Check className="w-4 h-4 text-white stroke-[3]" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Accent Style dropdown */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Accent Style
              </label>
              <select
                value={accentStyle}
                onChange={(e) => setAccentStyle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#10172A] border border-[#1E293B] text-white text-xs font-mono focus:outline-none focus:border-amber-500"
              >
                <option value="Modern (Gradient)">Modern (Gradient)</option>
                <option value="Minimal (Flat)">Minimal (Flat)</option>
                <option value="Neon High Contrast">Neon High Contrast</option>
              </select>
            </div>
          </div>

          {/* Security Card */}
          <div className="p-6 rounded-2xl bg-[#0D1424] border border-[#1E293B] shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Security</h2>
                <p className="text-xs text-zinc-400">Keep your workspace safe and secure.</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* 2FA Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#10172A] border border-[#151F32]">
                <div>
                  <h4 className="text-xs font-bold text-white">Two-Factor Authentication (2FA)</h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Add an extra layer of security to your account.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setTwoFactor(!twoFactor)}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                    twoFactor ? 'bg-orange-500' : 'bg-zinc-700'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white transition-transform ${
                      twoFactor ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Login Alerts Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#10172A] border border-[#151F32]">
                <div>
                  <h4 className="text-xs font-bold text-white">Login Alerts</h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Get notified when a new device logs in.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setLoginAlerts(!loginAlerts)}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                    loginAlerts ? 'bg-orange-500' : 'bg-zinc-700'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white transition-transform ${
                      loginAlerts ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Session Management */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#10172A] border border-[#151F32] cursor-pointer hover:border-amber-500/40 transition-colors">
                <div>
                  <h4 className="text-xs font-bold text-white">Session Management</h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">View and manage your active sessions.</p>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-400" />
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

