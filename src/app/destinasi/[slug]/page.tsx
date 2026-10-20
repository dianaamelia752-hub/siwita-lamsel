import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Building2, 
  CheckCircle2, 
  ShieldCheck, 
  Ticket, 
  ChevronRight,
  Info
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Props {
  params: {
    slug: string;
  };
}

export default async function DestinationDetailPage({ params }: Props) {
  const site = await prisma.tourismSite.findUnique({
    where: { slug: params.slug },
    include: {
      ticketTypes: {
        include: {
          tariffVersions: {
            orderBy: { validFrom: 'desc' },
            take: 1,
          },
        },
      },
    },
  });

  if (!site) {
    notFound();
  }

  let facilities: string[] = [];
  try {
    facilities = JSON.parse(site.facilities);
  } catch (e) {
    facilities = ['Area Parkir', 'Toilet Bersih', 'Mushola', 'Kantin Wisata'];
  }

  const minPrice = site.ticketTypes.length > 0
    ? Math.min(...site.ticketTypes.map((t) => t.priceIdr))
    : 10000;

  return (
    <div className="pb-28">
      {/* Top Breadcrumb & Back */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between text-xs">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-slate-600 hover:text-[#1F4E79] font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Katalog</span>
          </Link>
          <div className="flex items-center gap-2 text-slate-400">
            <span>Objek Wisata Resmi</span>
            <span>•</span>
            <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Perda No. 1/2024
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-4 sm:pt-6 space-y-6">
        {/* Hero Image Section */}
        <div className="relative rounded-2xl overflow-hidden shadow-sm border border-slate-200/80 bg-slate-900 h-64 sm:h-80 md:h-96">
          <img
            src={site.imageUrl}
            alt={site.name}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>

          {/* Top Overlays */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm ${
                site.status === 'BUKA' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
              }`}
            >
              {site.status === 'BUKA' ? 'BUKA HARI INI' : 'TUTUP SEMENTARA'}
            </span>
            <span className="bg-white/20 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/30">
              Kategori: {site.category}
            </span>
          </div>

          {/* Bottom Title Overlay */}
          <div className="absolute bottom-4 left-4 right-4 text-white space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {site.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-200">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{site.address}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-300 shrink-0" />
                <span>{site.openingHours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Pengelola GovTech */}
        <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1F4E79] text-white flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-blue-900 uppercase tracking-wider">
                Pengelola Destinasi
              </p>
              <p className="text-sm font-semibold text-slate-800">{site.manager}</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-xs text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-lg font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Retribusi Resmi Masuk Kasda (PAD)</span>
          </div>
        </div>

        {/* Deskripsi Objek Wisata */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-3">
          <h2 className="text-base font-bold text-slate-800">Deskripsi & Daya Tarik</h2>
          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
            {site.description}
          </p>
        </div>

        {/* Fasilitas */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-3">
          <h2 className="text-base font-bold text-slate-800">Fasilitas Umum Tersedia</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {facilities.map((fac, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs font-medium text-slate-700"
              >
                <CheckCircle2 className="w-4 h-4 text-[#1F4E79] shrink-0" />
                <span>{fac}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tabel Tarif Retribusi Resmi */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-800">Tarif Retribusi Resmi Daerah</h2>
            <span className="text-[11px] text-slate-500 font-medium bg-slate-100 px-2.5 py-1 rounded-lg">
              Dasar Hukum: Perda No. 1/2024
            </span>
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
            {site.ticketTypes.map((ticket) => (
              <div
                key={ticket.id}
                className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-slate-800">{ticket.name}</p>
                  <p className="text-xs text-slate-500">
                    Kategori Pengunjung: <span className="font-semibold">{ticket.visitorCategory}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-base font-extrabold text-[#1F4E79]">
                    Rp {ticket.priceIdr.toLocaleString('id-ID')}
                  </p>
                  <p className="text-[10px] text-slate-400">per orang / kunjungan</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2 text-xs text-amber-900">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Tarif retribusi ini berlaku per individu dan disetorkan ke Kas Daerah Lampung Selatan. Biaya pemeliharaan fasilitas & kebersihan sudah termasuk di dalamnya.
            </span>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Booking Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-xl py-3 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div>
            <span className="text-[11px] text-slate-500 block">Tarif Tiket Retribusi</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xs text-slate-600 font-medium">Mulai</span>
              <span className="text-lg sm:text-xl font-black text-[#1F4E79]">
                Rp {minPrice.toLocaleString('id-ID')}
              </span>
              <span className="text-[11px] text-slate-400">/org</span>
            </div>
          </div>

          <Link
            href={`/booking/${site.slug}`}
            className="flex items-center gap-2 bg-[#1F4E79] hover:bg-[#163A5C] text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            <Ticket className="w-4 h-4" />
            <span>Beli Tiket Sekarang</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
