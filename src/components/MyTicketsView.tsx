'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Ticket, 
  Calendar, 
  MapPin, 
  ChevronRight, 
  Search, 
  QrCode, 
  CheckCircle2, 
  Clock, 
  Filter,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface TicketItem {
  id: string;
  ticketCode: string;
  visitDate: string;
  visitorCategory: string;
  priceIdr: number;
  status: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  siteName: string;
  siteAddress: string;
}

interface MyTicketsViewProps {
  initialTickets: TicketItem[];
}

export default function MyTicketsView({ initialTickets }: MyTicketsViewProps) {
  const { user } = useAuth();
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = initialTickets.filter((t) => {
    const matchStatus = filterStatus === 'ALL' || t.status === filterStatus;
    const matchSearch =
      t.ticketCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.siteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
            Tiket Digital Saya
          </h1>
          <p className="text-xs text-slate-500">
            Daftar seluruh e-retribusi resmi yang telah Anda pesan untuk objek wisata Lampung Selatan.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#1F4E79] hover:bg-[#163A5C] px-4 py-2 rounded-xl transition-all shadow-sm"
        >
          <Ticket className="w-4 h-4" />
          <span>Beli Tiket Baru</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search box */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari kode tiket / destinasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1F4E79] focus:bg-white"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {[
              { id: 'ALL', label: 'Semua' },
              { id: 'AKTIF', label: 'Aktif' },
              { id: 'SUDAH_DIGUNAKAN', label: 'Terpakai' },
              { id: 'KEDALUWARSA', label: 'Kedaluwarsa' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  filterStatus === tab.id
                    ? 'bg-[#1F4E79] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Ticket List */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
            >
              <div className="p-5 space-y-3">
                {/* Top site & status */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {ticket.visitorCategory}
                    </span>
                    <h3 className="font-bold text-base text-slate-800 mt-1">
                      {ticket.siteName}
                    </h3>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      ticket.status === 'AKTIF'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : ticket.status === 'SUDAH_DIGUNAKAN'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-rose-100 text-rose-800 border border-rose-300'
                    }`}
                  >
                    {ticket.status}
                  </span>
                </div>

                <div className="space-y-1 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Kunjungan: <strong className="text-slate-700">{ticket.visitDate}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-600">
                    <QrCode className="w-3.5 h-3.5 text-slate-400" />
                    <span>{ticket.ticketCode}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Card Action */}
              <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-bold text-[#1F4E79]">
                  Rp {ticket.priceIdr.toLocaleString('id-ID')}
                </span>
                <Link
                  href={`/ticket/${ticket.orderId}`}
                  className="font-bold text-[#1F4E79] hover:text-[#163A5C] flex items-center gap-1"
                >
                  <span>Buka E-Tiket QR</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 space-y-3">
          <Ticket className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">Belum ada tiket ditemukan</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Tiket yang berhasil dibayar akan muncul di sini dan dapat Anda tunjukkan di gerbang masuk.
          </p>
          <Link
            href="/"
            className="inline-block text-xs font-semibold text-white bg-[#1F4E79] px-4 py-2 rounded-xl"
          >
            Pesan Tiket Retribusi
          </Link>
        </div>
      )}
    </div>
  );
}
