'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { 
  Building2, 
  Users, 
  Ticket, 
  TrendingUp, 
  DollarSign, 
  ShieldCheck, 
  Download, 
  RefreshCw, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Layers, 
  Edit3, 
  Power, 
  Eye, 
  Filter, 
  FileText, 
  History,
  Lock,
  ArrowUpRight,
  ChevronRight,
  BarChart3
} from 'lucide-react';

interface AdminDashboardViewProps {
  initialData: any;
}

export default function AdminDashboardView({ initialData }: AdminDashboardViewProps) {
  const { user, loginAs } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'sites' | 'transactions' | 'validations' | 'audit'>('overview');
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  // Search states
  const [transactionSearch, setTransactionSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Edit Tariff Modal State
  const [editingTariff, setEditingTariff] = useState<{
    id: string;
    siteName: string;
    ticketName: string;
    category: string;
    currentPrice: number;
  } | null>(null);
  const [newTariffPrice, setNewTariffPrice] = useState<number>(0);
  const [legalReference, setLegalReference] = useState('Perda Kab. Lampung Selatan No. 1 Tahun 2024');
  const [savingTariff, setSavingTariff] = useState(false);

  // Refresh data from server
  const refreshStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/stats');
      const fresh = await res.json();
      setData(fresh);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Toggle Site Status BUKA/TUTUP
  const toggleSiteStatus = async (siteId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'BUKA' ? 'TUTUP' : 'BUKA';
    try {
      const res = await fetch('/api/admin/site/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteId,
          status: nextStatus,
          adminUserId: user?.id,
        }),
      });
      if (res.ok) {
        refreshStats();
      }
    } catch (e) {
      alert('Gagal memperbarui status objek wisata.');
    }
  };

  // Submit Penyesuaian Tarif
  const handleSaveTariff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTariff) return;

    setSavingTariff(true);
    try {
      const res = await fetch('/api/admin/site/tariff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketTypeId: editingTariff.id,
          newPriceIdr: newTariffPrice,
          legalReference,
          approvedBy: 'Kepala BAPENDA Lampung Selatan',
          adminUserId: user?.id,
        }),
      });
      const resJson = await res.json();
      if (res.ok) {
        alert(resJson.message);
        setEditingTariff(null);
        refreshStats();
      } else {
        alert(resJson.error || 'Gagal menyimpan penyesuaian tarif.');
      }
    } catch (e) {
      alert('Gagal menghubungi server.');
    } finally {
      setSavingTariff(false);
    }
  };

  const filteredOrders = (data.recentOrders || []).filter((o: any) => {
    const matchStatus = statusFilter === 'ALL' || o.status === statusFilter;
    const matchSearch =
      o.orderNumber.toLowerCase().includes(transactionSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(transactionSearch.toLowerCase()) ||
      o.siteName.toLowerCase().includes(transactionSearch.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Admin Header with GovTech Branding */}
      <div className="bg-gradient-to-r from-[#163A5C] via-[#1F4E79] to-[#2980B9] text-white rounded-3xl p-6 sm:p-8 shadow-lg border border-blue-900 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-blue-100 border border-white/20">
            <Building2 className="w-3.5 h-3.5 text-amber-300" />
            <span>Badan Pengelola Pajak & Retribusi Daerah (BAPENDA)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Dashboard Penerimaan Retribusi Daerah (PAD)
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
            Pemantauan *real-time* kunjungan wisatawan, rekonsiliasi kas daerah, manajemen tarif Perda, dan transparansi tiket elektronik Kabupaten Lampung Selatan.
          </p>
        </div>

        {/* Right Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={refreshStats}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Segarkan Data</span>
          </button>

          <a
            href="/api/admin/export"
            download
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor Laporan (CSV)</span>
          </a>
        </div>
      </div>

      {/* Role Verification Banner if not logged as ADMIN */}
      {user?.role !== 'ADMIN' && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
            <span>
              Anda saat ini sedang melihat halaman dengan sesi <strong>{user?.name || 'Tamu'}</strong> ({user?.role}). Klik tombol di samping untuk beralih ke peran resmi <strong>Admin BAPENDA</strong>.
            </span>
          </div>
          <button
            onClick={() => loginAs('ADMIN')}
            className="px-3.5 py-1.5 bg-[#1F4E79] text-white font-bold rounded-lg hover:bg-[#163A5C] shrink-0"
          >
            Aktifkan Mode Admin
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-sm overflow-x-auto scrollbar-none">
        {[
          { id: 'overview', label: 'Ringkasan & KPI', icon: TrendingUp },
          { id: 'sites', label: 'Objek Wisata & Tarif', icon: Building2 },
          { id: 'transactions', label: 'Transaksi Retribusi', icon: DollarSign },
          { id: 'validations', label: 'Log Gate Masuk', icon: ShieldCheck },
          { id: 'audit', label: 'Jejak Audit Sistem', icon: History },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                active
                  ? 'bg-[#1F4E79] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & KPIS */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* KPI Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* KPI 1 */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Pengunjung Masuk Hari Ini
                </span>
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#1F4E79] flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">
                  {data.kpis?.visitsToday || 0}
                </span>
                <span className="text-xs text-slate-500 font-medium">Orang Masuk</span>
              </div>
              <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Terverifikasi di Gate Scanner</span>
              </p>
            </div>

            {/* KPI 2 */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Total Tiket Terjual
                </span>
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Ticket className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">
                  {data.kpis?.paidTicketsCount || 0}
                </span>
                <span className="text-xs text-slate-500 font-medium">Lembar Tiket</span>
              </div>
              <p className="text-[11px] text-slate-400">Status Pembayaran Lunas</p>
            </div>

            {/* KPI 3: Penerimaan Bruto PAD */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Penerimaan Bruto (PAD)
                </span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-black text-emerald-700">
                  Rp {(data.kpis?.grossPadRevenue || 0).toLocaleString('id-ID')}
                </span>
              </div>
              <p className="text-[11px] text-emerald-700 font-semibold">
                Setoran Kas Daerah Lampung Selatan
              </p>
            </div>

            {/* KPI 4: Settlement / Biaya Layanan */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Biaya Layanan Sistem
                </span>
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">
                  Rp {(data.kpis?.serviceFeeRevenue || 0).toLocaleString('id-ID')}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Total Terhimpun: Rp {(data.kpis?.totalCollected || 0).toLocaleString('id-ID')}</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Chart 1: Tren Kunjungan Harian (7 Cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-800">
                    Tren Kunjungan Wisatawan (7 Hari Terakhir)
                  </h3>
                  <p className="text-xs text-slate-500">Jumlah pengunjung masuk per hari</p>
                </div>
                <span className="text-[11px] font-semibold text-[#1F4E79] bg-blue-50 px-2 py-0.5 rounded">
                  Pola Kunjungan
                </span>
              </div>

              {/* Visual Bar Chart SVG */}
              <div className="h-56 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-slate-100">
                {(data.trendData || []).map((t: any, idx: number) => {
                  const maxVisitors = 110;
                  const heightPercent = Math.min(100, Math.round((t.visitors / maxVisitors) * 100));
                  const isWeekend = idx >= 5;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <div className="text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        {t.visitors} org
                      </div>
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t-lg transition-all group-hover:brightness-110 shadow-sm ${
                          isWeekend ? 'bg-amber-500' : 'bg-[#1F4E79]'
                        }`}
                      ></div>
                      <span className={`text-[11px] font-semibold ${isWeekend ? 'text-amber-600' : 'text-slate-600'}`}>
                        {t.day}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-[#1F4E79]"></span> Hari Kerja
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-amber-500"></span> Akhir Pekan (Weekend Peak)
                </span>
              </div>
            </div>

            {/* Chart 2: Kontribusi Pendapatan per Destinasi (5 Cols) */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-800">
                    Kontribusi Retribusi per Objek
                  </h3>
                  <p className="text-xs text-slate-500">Distribusi penerimaan PAD</p>
                </div>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  BAPENDA Lamsel
                </span>
              </div>

              {/* Destination Revenue Progress Bars */}
              <div className="space-y-3.5 pt-2">
                {(data.revenueBySite || []).map((site: any) => {
                  const maxSiteRev = Math.max(1, ...data.revenueBySite.map((s: any) => s.revenueIdr));
                  const pct = Math.max(8, Math.round((site.revenueIdr / maxSiteRev) * 100));
                  return (
                    <div key={site.id} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate-800 truncate max-w-[200px]">
                          {site.name}
                        </span>
                        <span className="font-extrabold text-[#1F4E79]">
                          Rp {site.revenueIdr.toLocaleString('id-ID')}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          style={{ width: `${pct}%` }}
                          className="bg-gradient-to-r from-[#1F4E79] to-[#2980B9] h-full rounded-full transition-all"
                        ></div>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>{site.ticketsCount} tiket terjual</span>
                        <span>{site.visitsCount} kunjungan gate</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: OBJEK WISATA & KELOLA TARIF */}
      {activeTab === 'sites' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-800">
                Manajemen Objek Wisata & Tarif Retribusi
              </h2>
              <p className="text-xs text-slate-500">
                Kelola status operasional (Buka/Tutup) dan lakukan penyesuaian tarif resmi sesuai Peraturan Daerah (Perda).
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-xl">
              Total {data.revenueBySite?.length || 0} Objek Wisata Pemkab
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(data.revenueBySite || []).map((site: any) => (
              <div
                key={site.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Site Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        Kategori: {site.category}
                      </span>
                      <h3 className="font-bold text-base text-slate-800 mt-1">
                        {site.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">Jam Buka: {site.openingHours}</p>
                    </div>

                    {/* Operational Toggle */}
                    <button
                      onClick={() => toggleSiteStatus(site.id, site.status)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 shadow-sm ${
                        site.status === 'BUKA'
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>{site.status}</span>
                    </button>
                  </div>

                  {/* Ticket Types and Tariff versions */}
                  <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden text-xs">
                    {site.ticketTypes.map((tt: any) => (
                      <div
                        key={tt.id}
                        className="p-3 flex items-center justify-between hover:bg-slate-50"
                      >
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-800">{tt.name}</p>
                          <span className="text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded font-medium">
                            {tt.visitorCategory}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-[#1F4E79]">
                            Rp {tt.priceIdr.toLocaleString('id-ID')}
                          </span>
                          <button
                            onClick={() => {
                              setEditingTariff({
                                id: tt.id,
                                siteName: site.name,
                                ticketName: tt.name,
                                category: tt.visitorCategory,
                                currentPrice: tt.priceIdr,
                              });
                              setNewTariffPrice(tt.priceIdr);
                            }}
                            className="p-1 rounded-lg text-slate-400 hover:text-[#1F4E79] hover:bg-slate-100"
                            title="Sesuaikan Tarif"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>PAD Terhimpun: <strong className="text-slate-800">Rp {site.revenueIdr.toLocaleString('id-ID')}</strong></span>
                  <Link
                    href={`/destinasi/${site.id.replace('site-', '')}`}
                    className="text-[#1F4E79] font-bold hover:underline flex items-center gap-1"
                  >
                    <span>Lihat Publik</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: TRANSAKSI RETRIBUSI */}
      {activeTab === 'transactions' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* Filter Bar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari order ID / nama pemesan..."
                value={transactionSearch}
                onChange={(e) => setTransactionSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1F4E79]"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
              {['ALL', 'DIBAYAR', 'MENUNGGU_PEMBAYARAN', 'GAGAL'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    statusFilter === st
                      ? 'bg-[#1F4E79] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st === 'ALL' ? 'Semua Status' : st}
                </button>
              ))}
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-4 py-3">No. Order</th>
                    <th className="px-4 py-3">Wisatawan</th>
                    <th className="px-4 py-3">Destinasi</th>
                    <th className="px-4 py-3">Kunjungan</th>
                    <th className="px-4 py-3">Nominal (Rp)</th>
                    <th className="px-4 py-3">Metode</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Tiket</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((ord: any) => (
                      <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-slate-800">
                          {ord.orderNumber}
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-slate-800">{ord.customerName}</p>
                          <p className="text-[10px] text-slate-400">{ord.customerPhone}</p>
                        </td>
                        <td className="px-4 py-3 text-slate-700 font-medium">{ord.siteName}</td>
                        <td className="px-4 py-3 text-slate-600">{ord.visitDate}</td>
                        <td className="px-4 py-3 font-bold text-slate-900">
                          Rp {ord.totalIdr.toLocaleString('id-ID')}
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                            {ord.paymentMethod}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              ord.status === 'DIBAYAR'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ord.status === 'MENUNGGU_PEMBAYARAN'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {ord.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            href={`/ticket/${ord.id}`}
                            className="text-[#1F4E79] font-bold hover:underline flex items-center gap-1"
                          >
                            <span>{ord.ticketsCount} Tiket</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-400">
                        Tidak ada transaksi yang cocok dengan pencarian filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: LOG VALIDASI GATE MASUK */}
      {activeTab === 'validations' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-800">
                Log Pemindaian Gerbang (Gate Scans)
              </h2>
              <p className="text-xs text-slate-500">
                Pencatatan *real-time* riwayat validasi tiket oleh petugas gate di seluruh objek wisata.
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl">
              Sistem Anti Double-Use Aktif
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-4 py-3">Waktu Pindai</th>
                    <th className="px-4 py-3">Kode Tiket</th>
                    <th className="px-4 py-3">Pos Gerbang</th>
                    <th className="px-4 py-3">Petugas</th>
                    <th className="px-4 py-3">Hasil Validasi</th>
                    <th className="px-4 py-3">Catatan Verifikasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(data.recentValidations || []).map((v: any) => (
                    <tr key={v.id} className="hover:bg-slate-50/80">
                      <td className="px-4 py-3 text-slate-500">
                        {new Date(v.scannedAt).toLocaleTimeString('id-ID')} WIB
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-slate-800">
                        {v.ticketCode}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-700">{v.siteName}</td>
                      <td className="px-4 py-3 text-slate-600">{v.validatedBy}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase ${
                            v.result === 'VALID'
                              ? 'bg-emerald-100 text-emerald-800'
                              : v.result === 'SUDAH_DIGUNAKAN'
                              ? 'bg-amber-100 text-amber-800'
                              : v.result === 'KEDALUWARSA'
                              ? 'bg-rose-100 text-rose-800'
                              : v.result === 'SALAH_LOKASI'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-slate-200 text-slate-800'
                          }`}
                        >
                          {v.result}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 max-w-xs truncate">{v.note || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: AUDIT LOG */}
      {activeTab === 'audit' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-800">
                Jejak Audit Sistem (Audit Trail)
              </h2>
              <p className="text-xs text-slate-500">
                Rekam jejak tidak dapat diubah (append-only) atas seluruh tindakan keuangan, perubahan tarif, dan sistem.
              </p>
            </div>
            <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-xl">
              Akuntabilitas Perda No. 1/2024
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-4 py-3">Waktu</th>
                    <th className="px-4 py-3">Pengguna / Aktor</th>
                    <th className="px-4 py-3">Aksi</th>
                    <th className="px-4 py-3">Entitas</th>
                    <th className="px-4 py-3">Rincian Perubahan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(data.recentAuditLogs || []).map((a: any) => (
                    <tr key={a.id} className="hover:bg-slate-50/80">
                      <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                        {new Date(a.createdAt).toLocaleString('id-ID')}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-800">
                        {a.userName}
                      </td>
                      <td className="px-4 py-3">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono text-[10px]">
                          {a.action}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 font-medium">{a.entityType}</td>
                      <td className="px-4 py-3 text-slate-600 max-w-md">{a.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDIT PENYESUAIAN TARIF */}
      {editingTariff && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="space-y-0.5">
                <h3 className="font-bold text-base text-slate-900">
                  Penyesuaian Tarif Retribusi
                </h3>
                <p className="text-xs text-slate-500">{editingTariff.siteName}</p>
              </div>
              <button
                onClick={() => setEditingTariff(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveTariff} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Jenis Tiket:
                </label>
                <input
                  type="text"
                  disabled
                  value={`${editingTariff.ticketName} (${editingTariff.category})`}
                  className="w-full px-3 py-2 bg-slate-100 rounded-xl border border-slate-200 text-slate-600 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tarif Baru (Rupiah):
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-500">
                    Rp
                  </span>
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    required
                    value={newTariffPrice}
                    onChange={(e) => setNewTariffPrice(parseInt(e.target.value, 10) || 0)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F4E79]"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Tarif saat ini: Rp {editingTariff.currentPrice.toLocaleString('id-ID')}
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Dasar Hukum / Referensi Perda:
                </label>
                <input
                  type="text"
                  required
                  value={legalReference}
                  onChange={(e) => setLegalReference(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-300 text-slate-800"
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-900 leading-relaxed">
                Penyesuaian tarif akan disimpan dengan nomor versi baru dan tercatat pada Jejak Audit. Transaksi yang telah dipesan sebelumnya tidak akan terpengaruh.
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingTariff(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={savingTariff}
                  className="flex-1 py-2.5 rounded-xl bg-[#1F4E79] hover:bg-[#163A5C] text-white font-bold shadow transition-all"
                >
                  {savingTariff ? 'Menyimpan...' : 'Simpan Tarif'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
