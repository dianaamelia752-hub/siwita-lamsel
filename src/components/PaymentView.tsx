'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Clock, 
  ArrowLeft, 
  QrCode, 
  Smartphone, 
  CreditCard, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Loader2, 
  Copy, 
  Check,
  Building2,
  Receipt
} from 'lucide-react';

interface PaymentViewProps {
  order: {
    id: string;
    orderNumber: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    visitDate: string;
    subtotalIdr: number;
    feeIdr: number;
    totalIdr: number;
    status: string;
    paymentMethod: string;
    expiresAt: string;
    site: {
      id: string;
      name: string;
      address: string;
    };
    orderItems: {
      id: string;
      visitorCategory: string;
      unitPriceIdr: number;
      quantity: number;
      subtotalIdr: number;
    }[];
  };
}

export default function PaymentView({ order }: PaymentViewProps) {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<'QRIS' | 'EWALLET' | 'VA'>('QRIS');
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 menit dalam detik
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState(order.status);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const copyAmount = () => {
    navigator.clipboard.writeText(order.totalIdr.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulatePayment = async (action: 'SUCCESS' | 'FAIL') => {
    setLoadingAction(action);
    try {
      const res = await fetch('/api/payment/mock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          action,
          paymentMethod: selectedMethod,
        }),
      });

      const data = await res.json();

      if (action === 'SUCCESS' && data.success) {
        setStatus('DIBAYAR');
        // Arahkan langsung ke tiket digital
        router.push(`/ticket/${order.id}`);
      } else {
        setStatus('GAGAL');
      }
    } catch (err) {
      alert('Gagal menghubungi server pembayaran simulasi.');
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Header navigasi */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#1F4E79]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>
        <div className="text-right">
          <span className="text-[10px] text-slate-400 block">No. Registrasi Retribusi</span>
          <span className="font-mono text-xs font-bold text-slate-800">{order.orderNumber}</span>
        </div>
      </div>

      {/* Countdown Timer Banner */}
      <div className="bg-gradient-to-r from-[#163A5C] to-[#1F4E79] text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-blue-900 flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-amber-300 text-xs font-semibold">
            <Clock className="w-4 h-4" />
            <span>Selesaikan Pembayaran Dalam:</span>
          </div>
          <p className="text-2xl font-black font-mono tracking-wider">{timeFormatted}</p>
        </div>
        <div className="text-right">
          <span className="text-[11px] text-blue-200 block">Total Tagihan</span>
          <span className="text-xl font-extrabold text-amber-300">
            Rp {order.totalIdr.toLocaleString('id-ID')}
          </span>
        </div>
      </div>

      {/* Status Notifikasi jika gagal */}
      {status === 'GAGAL' && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Status: Pembayaran Gagal / Dibatalkan. Silakan coba kembali di bawah.</span>
          </div>
          <button
            onClick={() => setStatus('MENUNGGU_PEMBAYARAN')}
            className="text-xs font-bold text-rose-700 underline"
          >
            Ulangi
          </button>
        </div>
      )}

      {/* Ringkasan Pesanan Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="space-y-0.5">
            <h2 className="text-sm font-bold text-slate-800">{order.site.name}</h2>
            <p className="text-xs text-slate-500">
              Kunjungan: <strong>{order.visitDate}</strong> • Pemesan: {order.customerName}
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            {status}
          </span>
        </div>

        <div className="space-y-1.5 text-xs text-slate-600 pt-1">
          {order.orderItems.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span>{item.visitorCategory} × {item.quantity}</span>
              <span className="font-semibold text-slate-800">
                Rp {item.subtotalIdr.toLocaleString('id-ID')}
              </span>
            </div>
          ))}
          <div className="flex justify-between text-slate-500">
            <span>Biaya Layanan Sistem</span>
            <span className="font-semibold text-slate-700">
              Rp {order.feeIdr.toLocaleString('id-ID')}
            </span>
          </div>
          <div className="flex justify-between pt-2 border-t border-slate-100 text-sm font-black text-slate-900">
            <span>Total Bayar</span>
            <span className="text-[#1F4E79] flex items-center gap-2">
              Rp {order.totalIdr.toLocaleString('id-ID')}
              <button
                type="button"
                onClick={copyAmount}
                className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100"
                title="Salin Nominal"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </span>
          </div>
        </div>
      </div>

      {/* Pilihan Kanal Pembayaran */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Pilih Metode Pembayaran
        </h3>

        {/* Tab Metode */}
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setSelectedMethod('QRIS')}
            className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
              selectedMethod === 'QRIS'
                ? 'bg-blue-50/80 border-[#1F4E79] text-[#1F4E79] shadow-sm font-bold'
                : 'border-slate-200 hover:bg-slate-50 text-slate-600'
            }`}
          >
            <QrCode className="w-5 h-5" />
            <span className="text-xs">QRIS Dinamis</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedMethod('EWALLET')}
            className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
              selectedMethod === 'EWALLET'
                ? 'bg-blue-50/80 border-[#1F4E79] text-[#1F4E79] shadow-sm font-bold'
                : 'border-slate-200 hover:bg-slate-50 text-slate-600'
            }`}
          >
            <Smartphone className="w-5 h-5" />
            <span className="text-xs">E-Wallet</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedMethod('VA')}
            className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
              selectedMethod === 'VA'
                ? 'bg-blue-50/80 border-[#1F4E79] text-[#1F4E79] shadow-sm font-bold'
                : 'border-slate-200 hover:bg-slate-50 text-slate-600'
            }`}
          >
            <CreditCard className="w-5 h-5" />
            <span className="text-xs">VA Bank Lampung</span>
          </button>
        </div>

        {/* Tampilan Konten Metode Terpilih */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-center space-y-3">
          {selectedMethod === 'QRIS' && (
            <div className="space-y-3">
              <div className="inline-block p-4 bg-white rounded-2xl shadow-sm border border-slate-200">
                {/* Visual Mock QRIS */}
                <div className="w-48 h-48 mx-auto flex flex-col items-center justify-center border-4 border-slate-900 rounded-lg p-2 bg-white relative">
                  <div className="w-full h-full bg-slate-900 flex items-center justify-center p-3 rounded">
                    <QrCode className="w-36 h-36 text-white" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="bg-red-600 text-white font-black text-[9px] px-2 py-0.5 rounded shadow">
                      QRIS RESMI
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-center">
                  <span className="text-[10px] font-bold text-slate-700 tracking-wider">
                    NMID: ID102026190011 (BAPENDA LAMSEL)
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Buka aplikasi BCA, Mandiri, BRI, BSI, GoPay, OVO, atau DANA Anda, lalu pindai kode QRIS di atas.
              </p>
            </div>
          )}

          {selectedMethod === 'EWALLET' && (
            <div className="space-y-3 py-4 text-xs text-slate-600">
              <p className="font-semibold text-slate-800">
                Pilih Aplikasi E-Wallet Anda:
              </p>
              <div className="flex justify-center gap-3">
                <span className="px-3 py-1.5 rounded-lg bg-blue-100 text-blue-800 font-bold">DANA</span>
                <span className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 font-bold">GoPay</span>
                <span className="px-3 py-1.5 rounded-lg bg-purple-100 text-purple-800 font-bold">OVO</span>
              </div>
              <p className="text-slate-500">
                Notifikasi konfirmasi pembayaran akan dikirimkan ke nomor {order.customerPhone}.
              </p>
            </div>
          )}

          {selectedMethod === 'VA' && (
            <div className="space-y-3 py-2 text-xs">
              <p className="text-slate-500">Nomor Virtual Account Bank Lampung:</p>
              <div className="p-3 bg-white rounded-xl border border-slate-300 font-mono text-base font-extrabold text-[#1F4E79]">
                8899 1200 4492 8812
              </div>
              <p className="text-slate-500 text-[11px]">
                Dapat dibayar dari ATM Bank Lampung atau Transfer Antar Bank (Kode Bank 114).
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Panel Pengujian & Simulasi Pembayaran */}
      <div className="bg-amber-50/80 border-2 border-amber-300 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
              Simulasi Gateway Pembayaran (Sandbox Demo)
            </h4>
            <p className="text-[11px] text-amber-700">
              Uji coba perubahan status pembayaran untuk melanjutkan alur penerbitan tiket QR.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            disabled={loadingAction !== null || status === 'DIBAYAR'}
            onClick={() => handleSimulatePayment('SUCCESS')}
            className="py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs shadow transition-all flex items-center justify-center gap-2"
          >
            {loadingAction === 'SUCCESS' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            <span>Simulasi Bayar Berhasil (Lunas)</span>
          </button>

          <button
            type="button"
            disabled={loadingAction !== null}
            onClick={() => handleSimulatePayment('FAIL')}
            className="py-3 px-4 rounded-xl bg-rose-700 hover:bg-rose-800 disabled:opacity-50 text-white font-bold text-xs shadow transition-all flex items-center justify-center gap-2"
          >
            {loadingAction === 'FAIL' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <XCircle className="w-4 h-4" />
            )}
            <span>Simulasi Pembayaran Gagal</span>
          </button>
        </div>
      </div>
    </div>
  );
}
