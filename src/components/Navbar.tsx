'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { UserRole } from '@/lib/types';
import { 
  Compass, 
  QrCode, 
  ShieldCheck, 
  Ticket, 
  Menu, 
  X, 
  UserCheck, 
  ChevronDown,
  Building2
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, loginAs } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Katalog Wisata', icon: Compass },
    { href: '/my-tickets', label: 'Tiket Saya', icon: Ticket },
    { href: '/gate', label: 'Gate Scanner', icon: QrCode, badge: 'Petugas' },
    { href: '/admin', label: 'Admin BAPENDA', icon: ShieldCheck, badge: 'Admin' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#163A5C] text-white shadow-md">
      {/* Top Bar Informasi Pemerintah */}
      <div className="bg-[#10273d] text-xs py-1 px-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300 font-medium">Portal E-Retribusi Resmi Pemkab Lampung Selatan</span>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-slate-400">
            <span>BAPENDA & Dinas Pariwisata</span>
            <span>•</span>
            <span>Perda No. 1/2024</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo Branding */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-[#1F4E79] p-2 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white">SiWita</span>
                <span className="font-bold text-lg sm:text-xl tracking-tight text-amber-400">Lamsel</span>
              </div>
              <p className="text-[10px] text-blue-200 uppercase tracking-wider font-semibold -mt-1">
                Kabupaten Lampung Selatan
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#1F4E79] text-white shadow-sm ring-1 ring-white/20'
                      : 'text-slate-200 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/30 text-blue-200 font-semibold border border-blue-400/20">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Section: Role Switcher Demo */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-lg border border-white/20 text-xs text-white transition-colors"
                title="Ganti Peran Demo"
              >
                <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-medium text-slate-300">Peran:</span>
                <span className="font-bold text-amber-300">
                  {user?.role === 'ADMIN' ? 'Admin BAPENDA' : user?.role === 'PETUGAS' ? 'Petugas Gate' : 'Wisatawan'}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {roleMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-white text-slate-800 rounded-xl shadow-2xl py-1.5 border border-slate-200 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setRoleMenuOpen(false)}
                >
                  <div className="px-3 py-1.5 border-b border-slate-100 font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
                    Pilih Akun Demo (1-Click)
                  </div>
                  <button
                    onClick={() => { loginAs('WISATAWAN'); setRoleMenuOpen(false); }}
                    className={`w-full text-left px-3 py-2 hover:bg-blue-50 flex flex-col ${user?.role === 'WISATAWAN' ? 'bg-blue-50/80 font-bold text-[#1F4E79]' : ''}`}
                  >
                    <span>Wisatawan: Budi Santoso</span>
                    <span className="text-[10px] text-slate-500 font-normal">Membeli & melihat tiket QR</span>
                  </button>
                  <button
                    onClick={() => { loginAs('PETUGAS'); setRoleMenuOpen(false); }}
                    className={`w-full text-left px-3 py-2 hover:bg-emerald-50 flex flex-col ${user?.role === 'PETUGAS' ? 'bg-emerald-50/80 font-bold text-emerald-800' : ''}`}
                  >
                    <span>Petugas: Ahmad Yani</span>
                    <span className="text-[10px] text-slate-500 font-normal">Scanner Gate Pantai Pasir Putih</span>
                  </button>
                  <button
                    onClick={() => { loginAs('ADMIN'); setRoleMenuOpen(false); }}
                    className={`w-full text-left px-3 py-2 hover:bg-amber-50 flex flex-col ${user?.role === 'ADMIN' ? 'bg-amber-50/80 font-bold text-amber-900' : ''}`}
                  >
                    <span>Admin: Siti Rahma (BAPENDA)</span>
                    <span className="text-[10px] text-slate-500 font-normal">Dashboard PAD & Kelola Tarif</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#10273d] border-t border-white/10 px-4 pt-3 pb-5 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium ${
                  isActive ? 'bg-[#1F4E79] text-white' : 'text-slate-200 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/30 text-blue-200 font-semibold">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-white/10">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Ganti Akun Demo:
            </p>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              <button
                onClick={() => { loginAs('WISATAWAN'); setMobileMenuOpen(false); }}
                className={`py-1.5 px-2 rounded text-center border ${user?.role === 'WISATAWAN' ? 'bg-blue-600 text-white border-blue-400 font-bold' : 'bg-white/5 text-slate-300 border-white/10'}`}
              >
                Wisatawan
              </button>
              <button
                onClick={() => { loginAs('PETUGAS'); setMobileMenuOpen(false); }}
                className={`py-1.5 px-2 rounded text-center border ${user?.role === 'PETUGAS' ? 'bg-emerald-600 text-white border-emerald-400 font-bold' : 'bg-white/5 text-slate-300 border-white/10'}`}
              >
                Petugas
              </button>
              <button
                onClick={() => { loginAs('ADMIN'); setMobileMenuOpen(false); }}
                className={`py-1.5 px-2 rounded text-center border ${user?.role === 'ADMIN' ? 'bg-amber-600 text-white border-amber-400 font-bold' : 'bg-white/5 text-slate-300 border-white/10'}`}
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
