'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  User, 
  CheckCircle2, 
  QrCode, 
  Printer, 
  Share2, 
  Copy, 
  Check, 
  ExternalLink,
  ShieldCheck,
  Clock,
  Ticket as TicketIcon
} from 'lucide-react';

interface TicketItem {
  id: string;
  ticketCode: string;
  qrDataUrl: string;
  visitDate: string;
  visitorCategory: string;
  priceIdr: number;
  status: string;
  usedAt?: string | null;
}

interface TicketDetailViewProps {
  order: {
    id: string;
    orderNumber: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    visitDate: string;
    totalIdr: number;
    paymentMethod: string;
    site: {
      id: string;
      name: string;
      address: string;
      openingHours: string;
    };
    tickets: TicketItem[];
  };
}

export default function TicketDetailView({ order }: TicketDetailViewProps) {
  const [selectedTicketIndex, setSelectedTicketIndex] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const currentTicket = order.tickets[selectedTicketIndex] || order.tickets[0];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-6">
      {/* Action Navigation Header */}
      <div className="flex items-center justify-between no-print">
        <Link
          href="/my-tickets"
          className="text-xs font-semibold text-[#1F4E79] hover:underline flex items-center gap-1"
        >
          <span>← Kembali ke Tiket Saya</span>
        </Link>
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Cetak Tiket</span>
        </button>
      </div>

      {/* Multiple Tickets Selector (jika beli lebih dari 1 tiket) */}
      {order.tickets.length > 1 && (
        <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-sm space-y-2 no-print">
          <p className="text-xs font-bold text-slate-700">
            Daftar Tiket Anda ({order.tickets.length} Tiket Masuk):
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {order.tickets.map((t, idx) => (
              <button
                key={t.id}
                onClick={() => setSelectedTicketIndex(idx)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedTicketIndex === idx
                    ? 'bg-[#1F4E79] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <TicketIcon className="w-3.5 h-3.5" />
                <span>Tiket {idx + 1} ({t.visitorCategory})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Electronic Ticket Card (Kupon E-Retribusi Resmi) */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-200 print:shadow-none print:border-slate-800">
        {/* Top Header Ticket */}
        <div className="bg-gradient-to-r from-[#163A5C] via-[#1F4E79] to-[#2980B9] text-white p-5 text-center relative overflow-hidden">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Building2 className="w-4 h-4 text-amber-300" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-100">
              Pemerintah Kabupaten Lampung Selatan
            </span>
          </div>
          <h2 className="text-lg font-black tracking-tight">E-TIKET RETRIBUSI RESMI</h2>
          <p className="text-xs text-blue-200">Badan Pengelola Pajak dan Retribusi Daerah (BAPENDA)</p>
          <div className="mt-2 inline-flex items-center gap-1 bg-white/10 px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-emerald-300 border border-white/20">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Validasi Masuk Sekali Pakai (Single-Use)</span>
          </div>
        </div>

        {/* Status Bar */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-dashed border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">Status Tiket:</span>
          <span
            className={`font-black px-2.5 py-0.5 rounded-full text-[11px] uppercase tracking-wide ${
              currentTicket.status === 'AKTIF'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : currentTicket.status === 'SUDAH_DIGUNAKAN'
                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                : 'bg-rose-100 text-rose-800 border border-rose-300'
            }`}
          >
            {currentTicket.status}
          </span>
        </div>

        {/* QR Code Container */}
        <div className="p-6 text-center space-y-4">
          <div className="inline-block p-3 rounded-2xl bg-white border-2 border-slate-200 shadow-inner">
            {currentTicket.qrDataUrl ? (
              <img
                src={currentTicket.qrDataUrl}
                alt={`QR ${currentTicket.ticketCode}`}
                className="w-56 h-56 mx-auto rounded-lg"
              />
            ) : (
              <div className="w-56 h-56 mx-auto flex items-center justify-center bg-slate-100 text-slate-400">
                <QrCode className="w-16 h-16 animate-pulse" />
              </div>
            )}
          </div>

          {/* Ticket Code Box with Copy */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Nomor Kode Tiket Masuk:
            </span>
            <div className="inline-flex items-center gap-2 bg-slate-100 border border-slate-300 px-3.5 py-1.5 rounded-xl font-mono text-sm font-black text-slate-800">
              <span>{currentTicket.ticketCode}</span>
              <button
                onClick={() => copyToClipboard(currentTicket.ticketCode)}
                className="text-slate-500 hover:text-[#1F4E79]"
                title="Salin Kode Tiket"
              >
                {copiedCode === currentTicket.ticketCode ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            {copiedCode === currentTicket.ticketCode && (
              <p className="text-[10px] text-emerald-600 font-semibold">
                Kode tiket berhasil disalin ke clipboard!
              </p>
            )}
          </div>

          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            Perlihatkan kode QR ini kepada petugas di pintu gerbang masuk destinasi wisata.
          </p>
        </div>

        {/* Ticket Details Body */}
        <div className="border-t border-dashed border-slate-200 p-6 bg-slate-50/50 space-y-3 text-xs">
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">Destinasi Wisata</span>
            <span className="font-bold text-slate-800 text-right">{order.site.name}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">Tanggal Kunjungan</span>
            <span className="font-bold text-slate-800">{currentTicket.visitDate}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">Kategori Pengunjung</span>
            <span className="font-bold text-slate-800">{currentTicket.visitorCategory}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">Nama Pemesan</span>
            <span className="font-bold text-slate-800">{order.customerName}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">Nomor Registrasi Order</span>
            <span className="font-mono font-semibold text-slate-700">{order.orderNumber}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-500">Kanal Pembayaran</span>
            <span className="font-semibold text-emerald-700">{order.paymentMethod} (LUNAS)</span>
          </div>
        </div>

        {/* Security Note Footer */}
        <div className="bg-slate-100 px-6 py-3 text-[11px] text-slate-500 text-center border-t border-slate-200">
          Sistem Verifikasi E-Retribusi SiWita Lamsel • Pemkab Lampung Selatan
        </div>
      </div>

      {/* Quick Testing Shortcut (Untuk Pengujian Gate Scanner) */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 space-y-2 no-print">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="w-4 h-4 text-[#1F4E79]" />
            <h4 className="text-xs font-bold text-blue-900">Uji Validasi Petugas Gate</h4>
          </div>
          <span className="text-[10px] bg-blue-200/80 text-blue-900 px-2 py-0.5 rounded font-semibold">
            Shortcut Penguji
          </span>
        </div>
        <p className="text-xs text-blue-800 leading-relaxed">
          Ingin mencoba memindai tiket ini di halaman pemindai gerbang? Buka halaman Gate Scanner dan masukkan kode tiket di atas.
        </p>
        <Link
          href={`/gate?code=${encodeURIComponent(currentTicket.ticketCode)}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#1F4E79] hover:bg-[#163A5C] px-4 py-2 rounded-xl transition-all shadow-sm"
        >
          <span>Buka Scanner Gate dengan Kode Ini</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
