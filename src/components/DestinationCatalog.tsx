'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, 
  MapPin, 
  Clock, 
  Tag, 
  ArrowRight, 
  Ticket, 
  Building2, 
  Sparkles,
  ShieldCheck,
  CheckCircle,
  FilterX
} from 'lucide-react';
import { DestinationWithPrices } from '@/lib/types';

interface DestinationCatalogProps {
  initialDestinations: DestinationWithPrices[];
}

const CATEGORIES = ['Semua', 'Pantai', 'Alam', 'Budaya', 'Keluarga'];

export default function DestinationCatalog({ initialDestinations }: DestinationCatalogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const filteredDestinations = useMemo(() => {
    return initialDestinations.filter((dest) => {
      const matchCategory =
        selectedCategory === 'Semua' ||
        dest.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchSearch =
        dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [initialDestinations, searchQuery, selectedCategory]);

  return (
    <div className="space-y-8">
      {/* GovTech Official Banner & Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#163A5C] via-[#1F4E79] to-[#2980B9] text-white p-6 sm:p-10 shadow-lg border border-blue-900/40">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-blue-100 border border-white/20">
            <Building2 className="w-3.5 h-3.5 text-amber-300" />
            <span>Pemerintah Kabupaten Lampung Selatan — E-Retribusi Terpadu</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Wisata Resmi, Retribusi Mudah, Dukung Kemajuan Lampung Selatan
          </h1>
          <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
            Pesan tiket retribusi objek wisata daerah secara digital dan praktis. Transaksi langsung masuk kas daerah (PAD), tiket QR instan, dan masuk gerbang tanpa antre loket.
          </p>

          {/* Quick Value Pillars */}
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-sm rounded-xl p-2.5 border border-white/10 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Tarif Resmi Perda No. 1/2024</span>
            </div>
            <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-sm rounded-xl p-2.5 border border-white/10 text-xs">
              <CheckCircle className="w-4 h-4 text-amber-300 shrink-0" />
              <span>Multi Pembayaran (QRIS/VA)</span>
            </div>
            <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-sm rounded-xl p-2.5 border border-white/10 text-xs">
              <Ticket className="w-4 h-4 text-blue-300 shrink-0" />
              <span>Tiket QR Online & Cepat</span>
            </div>
          </div>
        </div>

        {/* Decorative Graphic Effect */}
        <div className="absolute right-0 top-0 -bottom-10 w-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
      </section>

      {/* Filter & Search Bar */}
      <section className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200/80 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Box */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari pantai, air terjun, landmark, atau lokasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1F4E79] focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Hapus
              </button>
            )}
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    active
                      ? 'bg-[#1F4E79] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Status result summary */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <span>
            Menampilkan <strong className="text-slate-700">{filteredDestinations.length}</strong> dari{' '}
            {initialDestinations.length} objek wisata binaan Pemkab Lampung Selatan
          </span>
          {(searchQuery || selectedCategory !== 'Semua') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Semua');
              }}
              className="inline-flex items-center gap-1 text-[#1F4E79] hover:underline font-medium"
            >
              <FilterX className="w-3.5 h-3.5" />
              Reset Filter
            </button>
          )}
        </div>
      </section>

      {/* Destination Grid */}
      {initialDestinations.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-blue-200 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#1F4E79] mx-auto flex items-center justify-center">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-800">Database Belum Memiliki Data</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Koneksi database PostgreSQL Neon.tech Anda telah terhubung! Klik tombol di bawah untuk mengisi otomatis 5 destinasi wisata Lampung Selatan dan akun demo.
            </p>
          </div>
          <button
            onClick={async () => {
              const res = await fetch('/api/seed');
              const json = await res.json();
              if (json.success || json.sitesCount) {
                window.location.reload();
              } else {
                alert('Gagal memuat data: ' + (json.error || json.message));
              }
            }}
            className="px-6 py-3 bg-[#1F4E79] hover:bg-[#163A5C] text-white text-xs font-bold rounded-xl shadow-md transition-all inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Inisialisasi Data Demo (1-Click Seed)</span>
          </button>
        </div>
      ) : filteredDestinations.length > 0 ? (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDestinations.map((dest) => (
            <div
              key={dest.id}
              className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col"
            >
              {/* Thumbnail Container */}
              <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
                <img
                  src={dest.imageUrl}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                {/* Status Badge */}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase shadow-sm ${
                      dest.status === 'BUKA'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-rose-600 text-white'
                    }`}
                  >
                    {dest.status}
                  </span>
                  <span className="bg-black/60 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-1 rounded-full">
                    {dest.category}
                  </span>
                </div>

                {/* Min Price Overlay */}
                <div className="absolute bottom-3 right-3 bg-[#163A5C]/90 backdrop-blur-md text-white text-xs px-2.5 py-1.5 rounded-lg shadow-sm">
                  <span className="text-[10px] text-blue-200 block">Tarif Mulai</span>
                  <span className="font-extrabold text-amber-300">
                    Rp {dest.minPrice.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Content Card */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-bold text-lg text-slate-800 group-hover:text-[#1F4E79] transition-colors leading-snug">
                    {dest.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="line-clamp-1">{dest.address}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{dest.openingHours}</span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 pt-1 leading-relaxed">
                    {dest.description}
                  </p>

                  {/* Facilities mini tags */}
                  <div className="flex flex-wrap gap-1 pt-2">
                    {dest.facilities.slice(0, 3).map((f, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium"
                      >
                        {f}
                      </span>
                    ))}
                    {dest.facilities.length > 3 && (
                      <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md">
                        +{dest.facilities.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <Link
                    href={`/destinasi/${dest.slug}`}
                    className="flex-1 text-center py-2 px-3 text-xs font-semibold text-[#1F4E79] bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                  >
                    Lihat Detail
                  </Link>
                  <Link
                    href={`/booking/${dest.slug}`}
                    className="flex-1 text-center py-2 px-3 text-xs font-semibold text-white bg-[#1F4E79] hover:bg-[#163A5C] rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-1"
                  >
                    <span>Beli Tiket</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </section>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 space-y-3">
          <FilterX className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-semibold text-slate-700">Tidak ada destinasi yang cocok</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Coba ubah kata kunci pencarian atau pilih kategori &quot;Semua&quot; untuk menampilkan seluruh destinasi.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('Semua');
            }}
            className="mt-2 text-xs font-semibold text-white bg-[#1F4E79] px-4 py-2 rounded-xl"
          >
            Tampilkan Semua Destinasi
          </button>
        </div>
      )}
    </div>
  );
}
