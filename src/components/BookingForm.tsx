'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  Plus, 
  Minus, 
  Ticket, 
  ShieldCheck, 
  AlertCircle,
  Loader2,
  Receipt
} from 'lucide-react';

interface TicketTypeItem {
  id: string;
  name: string;
  visitorCategory: string;
  priceIdr: number;
}

interface BookingFormProps {
  site: {
    id: string;
    name: string;
    slug: string;
    address: string;
    openingHours: string;
    imageUrl: string;
    ticketTypes: TicketTypeItem[];
  };
}

export default function BookingForm({ site }: BookingFormProps) {
  const router = useRouter();
  const { user } = useAuth();

  // Tanggal kunjungan default: hari ini (YYYY-MM-DD)
  const todayStr = new Date().toISOString().split('T')[0];

  const [visitDate, setVisitDate] = useState(todayStr);
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState('081234567890');
  const [customerEmail, setCustomerEmail] = useState(user?.email || 'wisatawan@siwita.id');

  // Quantities per ticketTypeId (default 1 untuk tiket dewasa pertama jika ada)
  const [quantities, setQuantities] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    site.ticketTypes.forEach((t, idx) => {
      initial[t.id] = idx === 0 ? 1 : 0;
    });
    return initial;
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Update form jika user session berubah
  useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(user.name);
      if (!customerEmail) setCustomerEmail(user.email);
    }
  }, [user]);

  const updateQuantity = (id: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [id]: next };
    });
  };

  // Hitung total tiket & biaya
  const totalTickets = Object.values(quantities).reduce((acc, q) => acc + q, 0);

  const subtotalIdr = site.ticketTypes.reduce((acc, t) => {
    return acc + (quantities[t.id] || 0) * t.priceIdr;
  }, 0);

  const feeIdr = totalTickets > 0 ? 2000 : 0;
  const totalIdr = subtotalIdr + feeIdr;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (totalTickets <= 0) {
      setErrorMsg('Silakan pilih minimal 1 lembar tiket untuk melanjutkan.');
      return;
    }

    if (!customerName.trim() || !customerPhone.trim() || !customerEmail.trim()) {
      setErrorMsg('Mohon lengkapi seluruh data identitas pemesan.');
      return;
    }

    setSubmitting(true);

    try {
      const items = Object.entries(quantities)
        .filter(([_, qty]) => qty > 0)
        .map(([ticketTypeId, quantity]) => ({
          ticketTypeId,
          quantity,
        }));

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteId: site.id,
          customerName,
          customerPhone,
          customerEmail,
          visitDate,
          items,
          userId: user?.id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Gagal memproses pemesanan.');
      }

      // Redirect ke halaman pembayaran
      router.push(`/payment/${data.orderId}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi gangguan jaringan. Coba lagi.');
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Back button */}
      <div>
        <Link
          href={`/destinasi/${site.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#1F4E79] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Detail Destinasi</span>
        </Link>
      </div>

      {/* Header Info Destinasi Ringkas */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex items-center gap-4">
        <img
          src={site.imageUrl}
          alt={site.name}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 border border-slate-100"
        />
        <div className="space-y-1">
          <span className="text-[10px] font-bold tracking-wider text-blue-700 uppercase bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            Formulir E-Retribusi Resmi
          </span>
          <h1 className="text-base sm:text-lg font-bold text-slate-800 leading-tight">
            {site.name}
          </h1>
          <p className="text-xs text-slate-500 line-clamp-1">{site.address}</p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Pilih Tanggal Kunjungan */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
            <div className="w-6 h-6 rounded-full bg-[#1F4E79] text-white flex items-center justify-center text-xs">
              1
            </div>
            <h2>Pilih Tanggal Kunjungan</h2>
          </div>

          <div className="relative">
            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="date"
              min={todayStr}
              value={visitDate}
              onChange={(e) => setVisitDate(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1F4E79] focus:bg-white"
            />
          </div>
          <p className="text-[11px] text-slate-500">
            Tiket hanya berlaku pada tanggal yang dipilih sesuai jam operasional objek wisata ({site.openingHours}).
          </p>
        </div>

        {/* Step 2: Pilih Jenis & Jumlah Tiket */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
              <div className="w-6 h-6 rounded-full bg-[#1F4E79] text-white flex items-center justify-center text-xs">
                2
              </div>
              <h2>Pilih Jumlah Tiket</h2>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Total: <strong className="text-slate-800">{totalTickets} Tiket</strong>
            </span>
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
            {site.ticketTypes.map((ticket) => {
              const qty = quantities[ticket.id] || 0;
              return (
                <div
                  key={ticket.id}
                  className="p-4 flex items-center justify-between gap-3 bg-white"
                >
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-slate-800">{ticket.name}</p>
                    <p className="text-xs font-extrabold text-[#1F4E79]">
                      Rp {ticket.priceIdr.toLocaleString('id-ID')}
                      <span className="text-[10px] text-slate-400 font-normal"> / orang</span>
                    </p>
                  </div>

                  {/* Stepper controls */}
                  <div className="flex items-center gap-2.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => updateQuantity(ticket.id, -1)}
                      disabled={qty <= 0}
                      className="w-8 h-8 rounded-lg bg-white text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 shadow-sm flex items-center justify-center transition-all"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center text-sm font-bold text-slate-800">
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(ticket.id, 1)}
                      className="w-8 h-8 rounded-lg bg-[#1F4E79] text-white hover:bg-[#163A5C] shadow-sm flex items-center justify-center transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 3: Data Pemesan */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
            <div className="w-6 h-6 rounded-full bg-[#1F4E79] text-white flex items-center justify-center text-xs">
              3
            </div>
            <h2>Data Kontak Pemesan</h2>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Lengkap
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1F4E79] focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nomor WhatsApp
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    placeholder="081234567890"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1F4E79] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alamat Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="nama@email.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1F4E79] focus:bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 4: Rincian Pembayaran */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
            <Receipt className="w-4 h-4 text-[#1F4E79]" />
            <h2>Rincian Biaya Retribusi</h2>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal Retribusi Wisata ({totalTickets} orang)</span>
              <span className="font-semibold text-slate-800">
                Rp {subtotalIdr.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span className="flex items-center gap-1">
                <span>Biaya Layanan Sistem E-Retribusi</span>
              </span>
              <span className="font-semibold text-slate-800">
                Rp {feeIdr.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-extrabold text-slate-900">
              <span>Total Pembayaran</span>
              <span className="text-base text-[#1F4E79]">
                Rp {totalIdr.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting || totalTickets <= 0}
            className="w-full py-3.5 px-6 rounded-xl bg-[#1F4E79] hover:bg-[#163A5C] disabled:opacity-50 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memproses Pesanan...</span>
              </>
            ) : (
              <>
                <Ticket className="w-4 h-4" />
                <span>Lanjut ke Pembayaran (Rp {totalIdr.toLocaleString('id-ID')})</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
