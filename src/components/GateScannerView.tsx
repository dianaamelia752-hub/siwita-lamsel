'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { playScanSound } from '@/lib/audio-cue';
import { 
  Camera, 
  CameraOff, 
  MapPin, 
  QrCode, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  ShieldAlert, 
  Loader2, 
  UserCheck, 
  RefreshCw,
  Search,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface TourismSiteOption {
  id: string;
  name: string;
  category: string;
}

interface ScanResultData {
  result: 'VALID' | 'SUDAH_DIGUNAKAN' | 'KEDALUWARSA' | 'SALAH_LOKASI' | 'TIDAK_DIKENAL';
  title: string;
  message: string;
  statusClass: string;
  ticket?: {
    code?: string;
    visitorCategory?: string;
    customerName?: string;
    orderNumber?: string;
    registeredSite?: string;
    visitDate?: string;
    usedAt?: string;
    priceIdr?: number;
  };
  scannedCode?: string;
  gateName: string;
  timestamp: string;
}

interface SessionLogItem {
  id: string;
  code: string;
  result: string;
  time: string;
  details: string;
}

interface GateScannerViewProps {
  sites: TourismSiteOption[];
}

export default function GateScannerView({ sites }: GateScannerViewProps) {
  const searchParams = useSearchParams();
  const { user } = useAuth();

  // Lokasi gerbang aktif (default ke destinasi penugasan petugas atau site pertama)
  const [selectedSiteId, setSelectedSiteId] = useState<string>(() => {
    return user?.siteId || (sites[0]?.id || 'site-pasir-putih');
  });

  const [inputCode, setInputCode] = useState(searchParams.get('code') || '');
  const [isScanning, setIsScanning] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [currentResult, setCurrentResult] = useState<ScanResultData | null>(null);
  const [history, setHistory] = useState<SessionLogItem[]>([]);

  const html5QrCodeRef = useRef<any>(null);

  // Ambil nama destinasi terpilih
  const currentSiteName = sites.find((s) => s.id === selectedSiteId)?.name || 'Gate Lampung Selatan';

  // Validasi kode tiket ke server
  const validateTicketCode = async (code: string) => {
    if (!code || !code.trim() || isScanning) return;
    setIsScanning(true);

    try {
      const res = await fetch('/api/gate/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketCode: code.trim(),
          siteId: selectedSiteId,
          gateUserId: user?.id || 'user-petugas-1',
        }),
      });

      const data: ScanResultData = await res.json();
      setCurrentResult(data);

      // Mainkan efek suara audio
      playScanSound(data.result);

      // Tambahkan ke log riwayat sesi
      const newHistoryItem: SessionLogItem = {
        id: `${Date.now()}-${Math.random()}`,
        code: code.trim(),
        result: data.result,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        details: data.title + (data.ticket?.visitorCategory ? ` • ${data.ticket.visitorCategory}` : ''),
      };
      setHistory((prev) => [newHistoryItem, ...prev.slice(0, 19)]); // Simpan 20 riwayat terakhir
    } catch (err: any) {
      alert('Gagal memvalidasi ke server. Periksa koneksi internet.');
    } finally {
      setIsScanning(false);
    }
  };

  // Mulai kamera dengan Html5Qrcode
  const startCamera = async () => {
    setCameraError(null);
    try {
      const { Html5Qrcode } = await import('html5-qrcode');

      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode('qr-reader-viewport');
      }

      await html5QrCodeRef.current.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        (decodedText: string) => {
          // Callback saat QR terdeteksi
          validateTicketCode(decodedText);
        },
        () => {
          // frame scan miss - noop
        }
      );
      setCameraActive(true);
    } catch (err: any) {
      console.warn('Camera start error:', err);
      setCameraError('Kamera tidak dapat diakses atau izin belum diberikan. Gunakan fitur "Input Manual Kode Tiket" di bawah.');
      setCameraActive(false);
    }
  };

  // Hentikan kamera
  const stopCamera = async () => {
    if (html5QrCodeRef.current && cameraActive) {
      try {
        await html5QrCodeRef.current.stop();
      } catch (e) {
        console.warn(e);
      }
      setCameraActive(false);
    }
  };

  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current && cameraActive) {
        html5QrCodeRef.current.stop().catch(() => {});
      }
    };
  }, [cameraActive]);

  // Handle auto-validate jika ada param ?code=...
  useEffect(() => {
    const codeParam = searchParams.get('code');
    if (codeParam) {
      setInputCode(codeParam);
      validateTicketCode(codeParam);
    }
  }, [searchParams]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim()) {
      validateTicketCode(inputCode);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header Info Petugas & Pos Gerbang */}
      <div className="bg-gradient-to-r from-[#163A5C] to-[#1F4E79] text-white rounded-2xl p-4 sm:p-6 shadow-md border border-blue-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-900 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider">
            <QrCode className="w-3.5 h-3.5" />
            <span>SiWita Gate Scanner</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            Pemindai Validasi Retribusi Gerbang
          </h1>
          <p className="text-xs text-blue-200">
            Petugas Aktif: <strong className="text-white">{user?.name || 'Ahmad Yani (Petugas Gate)'}</strong>
          </p>
        </div>

        {/* Selektor Lokasi Pos Gerbang */}
        <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20 space-y-1">
          <label className="text-[10px] uppercase font-bold text-blue-200 tracking-wider block">
            Pos Gerbang Lokasi:
          </label>
          <div className="relative">
            <select
              value={selectedSiteId}
              onChange={(e) => {
                setSelectedSiteId(e.target.value);
                setCurrentResult(null);
              }}
              className="bg-white text-slate-800 text-xs font-bold py-2 px-3 pr-8 rounded-lg border-0 shadow-sm focus:ring-2 focus:ring-amber-400 w-full"
            >
              {sites.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Kolom Kiri: Scanner Kamera & Input Manual (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Box Scanner Kamera */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#1F4E79]" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Pemindai Kamera QR
                </h3>
              </div>
              <button
                type="button"
                onClick={cameraActive ? stopCamera : startCamera}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                  cameraActive
                    ? 'bg-rose-600 text-white hover:bg-rose-700'
                    : 'bg-[#1F4E79] text-white hover:bg-[#163A5C]'
                }`}
              >
                {cameraActive ? (
                  <>
                    <CameraOff className="w-3.5 h-3.5" />
                    <span>Matikan Kamera</span>
                  </>
                ) : (
                  <>
                    <Camera className="w-3.5 h-3.5" />
                    <span>Aktifkan Kamera</span>
                  </>
                )}
              </button>
            </div>

            {/* Viewport Kamera */}
            <div className="relative bg-slate-950 min-h-[280px] sm:min-h-[340px] flex items-center justify-center p-4">
              <div
                id="qr-reader-viewport"
                className="w-full max-w-[320px] rounded-xl overflow-hidden"
              ></div>

              {!cameraActive && (
                <div className="text-center text-slate-400 space-y-3 p-6">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 mx-auto flex items-center justify-center">
                    <QrCode className="w-8 h-8 text-slate-500" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-300">Kamera Belum Aktif</p>
                    <p className="text-[11px] text-slate-400 max-w-xs">
                      Klik tombol &quot;Aktifkan Kamera&quot; di atas untuk mulai memindai QR e-tiket pengunjung, atau gunakan input manual di bawah.
                    </p>
                  </div>
                </div>
              )}

              {/* Animasi Scanline jika kamera aktif */}
              {cameraActive && (
                <div className="absolute inset-x-8 top-12 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34d399] animate-bounce pointer-events-none"></div>
              )}
            </div>

            {cameraError && (
              <div className="p-3 bg-amber-50 border-t border-amber-200 text-amber-800 text-xs">
                {cameraError}
              </div>
            )}
          </div>

          {/* Form Input Manual Kode Tiket */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Search className="w-4 h-4 text-[#1F4E79]" />
                <span>Input Manual Kode Tiket</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-medium">Ketik atau Salin-Tempel</span>
            </div>

            <form onSubmit={handleManualSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="Contoh: SWT-TKT-20261020-9A8B7C"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                className="flex-1 px-3.5 py-2.5 text-xs font-mono font-bold bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1F4E79] focus:bg-white"
              />
              <button
                type="submit"
                disabled={isScanning || !inputCode.trim()}
                className="px-5 py-2.5 bg-[#1F4E79] hover:bg-[#163A5C] disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center gap-1.5 shrink-0"
              >
                {isScanning ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span>Validasi</span>
                )}
              </button>
            </form>

            {/* Quick Test Presets (Sangat mempermudah peninjau menguji seluruh 5 status!) */}
            <div className="pt-2 border-t border-slate-100">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Uji 5 Status Langsung (1-Klik):
              </p>
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => {
                    setInputCode('SWT-TKT-20261020-9A8B7C');
                    validateTicketCode('SWT-TKT-20261020-9A8B7C');
                  }}
                  className="px-2.5 py-1 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300 rounded-lg font-bold"
                >
                  1. Tiket Valid
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInputCode('SWT-TKT-20261020-1D2E3F');
                    validateTicketCode('SWT-TKT-20261020-1D2E3F');
                  }}
                  className="px-2.5 py-1 bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-300 rounded-lg font-bold"
                >
                  2. Sudah Dipakai
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInputCode('SWT-TKT-20261019-EXPIRE');
                    validateTicketCode('SWT-TKT-20261019-EXPIRE');
                  }}
                  className="px-2.5 py-1 bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-300 rounded-lg font-bold"
                >
                  3. Kedaluwarsa
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInputCode('SWT-TKT-20261020-SIGER1');
                    validateTicketCode('SWT-TKT-20261020-SIGER1');
                  }}
                  className="px-2.5 py-1 bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-300 rounded-lg font-bold"
                >
                  4. Salah Lokasi
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInputCode('SWT-TKT-PALSU-999999');
                    validateTicketCode('SWT-TKT-PALSU-999999');
                  }}
                  className="px-2.5 py-1 bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300 rounded-lg font-bold"
                >
                  5. Tidak Dikenal
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Tampilan Hasil Validasi & Riwayat Sesi (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Kartu Hasil Validasi (< 5 Detik) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-3 bg-slate-100 border-b border-slate-200 text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
              <span>Hasil Pemindaian Gate</span>
              {currentResult && (
                <button
                  onClick={() => setCurrentResult(null)}
                  className="text-slate-400 hover:text-slate-600 text-[10px]"
                >
                  Reset
                </button>
              )}
            </div>

            {currentResult ? (
              <div className="p-5 space-y-4 animate-in fade-in duration-200">
                {/* Big Result Badge Header */}
                <div
                  className={`p-6 rounded-2xl text-center space-y-2 shadow-sm ${
                    currentResult.result === 'VALID'
                      ? 'bg-emerald-600 text-white'
                      : currentResult.result === 'SUDAH_DIGUNAKAN'
                      ? 'bg-[#F9A825] text-slate-900'
                      : currentResult.result === 'KEDALUWARSA'
                      ? 'bg-[#C62828] text-white'
                      : currentResult.result === 'SALAH_LOKASI'
                      ? 'bg-purple-700 text-white'
                      : 'bg-slate-800 text-white'
                  }`}
                >
                  <div className="flex justify-center">
                    {currentResult.result === 'VALID' ? (
                      <CheckCircle2 className="w-14 h-14" />
                    ) : currentResult.result === 'SUDAH_DIGUNAKAN' ? (
                      <Clock className="w-14 h-14" />
                    ) : currentResult.result === 'KEDALUWARSA' ? (
                      <XCircle className="w-14 h-14" />
                    ) : currentResult.result === 'SALAH_LOKASI' ? (
                      <AlertTriangle className="w-14 h-14" />
                    ) : (
                      <ShieldAlert className="w-14 h-14" />
                    )}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-wider uppercase">
                    {currentResult.title}
                  </h2>
                  <p className="text-xs font-medium opacity-90 max-w-xs mx-auto leading-relaxed">
                    {currentResult.message}
                  </p>
                </div>

                {/* Detail Data Tiket jika ada */}
                {currentResult.ticket && (
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200 pb-1">
                      Rincian E-Tiket
                    </p>
                    {currentResult.ticket.code && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Kode Tiket:</span>
                        <span className="font-mono font-bold text-slate-800">
                          {currentResult.ticket.code}
                        </span>
                      </div>
                    )}
                    {currentResult.ticket.customerName && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Nama Wisatawan:</span>
                        <span className="font-semibold text-slate-800">
                          {currentResult.ticket.customerName}
                        </span>
                      </div>
                    )}
                    {currentResult.ticket.visitorCategory && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Kategori:</span>
                        <span className="font-bold text-[#1F4E79]">
                          {currentResult.ticket.visitorCategory}
                        </span>
                      </div>
                    )}
                    {currentResult.ticket.registeredSite && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Objek Terdaftar:</span>
                        <span className="font-bold text-purple-700">
                          {currentResult.ticket.registeredSite}
                        </span>
                      </div>
                    )}
                    {currentResult.ticket.visitDate && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Tanggal Kunjungan:</span>
                        <span className="font-semibold text-slate-800">
                          {currentResult.ticket.visitDate}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div className="text-[11px] text-slate-400 text-center">
                  Pos: {currentSiteName} • Pukul{' '}
                  {new Date(currentResult.timestamp).toLocaleTimeString('id-ID')}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 space-y-2">
                <QrCode className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="text-xs font-semibold text-slate-600">Menunggu Pemindaian</p>
                <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                  Arahkan kamera ke QR tiket atau ketik kode tiket untuk memverifikasi keabsahan retribusi.
                </p>
              </div>
            )}
          </div>

          {/* Riwayat Pemindaian Sesi Ini */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Riwayat Sesi Ini ({history.length})
              </h3>
              {history.length > 0 && (
                <button
                  onClick={() => setHistory([])}
                  className="text-[10px] text-slate-400 hover:text-slate-600"
                >
                  Bersihkan
                </button>
              )}
            </div>

            {history.length > 0 ? (
              <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto space-y-1">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="py-2 flex items-center justify-between text-xs"
                  >
                    <div className="space-y-0.5">
                      <p className="font-mono font-bold text-slate-800">{item.code}</p>
                      <p className="text-[10px] text-slate-400">{item.time}</p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        item.result === 'VALID'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.result === 'SUDAH_DIGUNAKAN'
                          ? 'bg-amber-100 text-amber-800'
                          : item.result === 'KEDALUWARSA'
                          ? 'bg-rose-100 text-rose-800'
                          : item.result === 'SALAH_LOKASI'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-slate-200 text-slate-800'
                      }`}
                    >
                      {item.result}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">
                Belum ada aktivitas scan pada sesi ini.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
