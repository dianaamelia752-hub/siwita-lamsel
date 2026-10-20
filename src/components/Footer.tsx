import React from 'react';
import Link from 'next/link';
import { Shield, MapPin, Phone, Mail, Award, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#163A5C] text-slate-300 border-t border-white/10 mt-16 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="font-black text-xl text-white">SiWita</span>
              <span className="font-bold text-xl text-amber-400">Lamsel</span>
              <span className="text-[10px] bg-blue-500/30 text-blue-200 px-2 py-0.5 rounded font-semibold border border-blue-400/20">
                E-Retribusi Resmi
              </span>
            </div>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-lg">
              Sistem Informasi Wisata dan Retribusi Digital terintegrasi Kabupaten Lampung Selatan.
              Mendukung tata kelola pariwisata transparan, modern, dan peningkatan Pendapatan Asli Daerah (PAD).
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded text-xs text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>QRIS BI Terverifikasi</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded text-xs text-slate-300">
                <Shield className="w-3.5 h-3.5 text-blue-400" />
                <span>Anti Double-Entry Validasi</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded text-xs text-slate-300">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>SOP Perda No. 1/2024</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider text-xs">Akses Sistem</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-amber-300 transition-colors">
                  Katalog Destinasi Wisata
                </Link>
              </li>
              <li>
                <Link href="/my-tickets" className="hover:text-amber-300 transition-colors">
                  Cek & Simpan Tiket Saya
                </Link>
              </li>
              <li>
                <Link href="/gate" className="hover:text-amber-300 transition-colors">
                  Gate Scanner Petugas Lapangan
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-amber-300 transition-colors">
                  Dashboard Admin BAPENDA
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact / Office Info */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider text-xs">Pemerintah Pengelola</h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Komplek Perkantoran Pemkab Lampung Selatan, Jl. Mustafa Kemal, Kalianda</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>(0727) 321-001 / Layanan Wisata</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>dispar@lampungselatankab.go.id</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© 2026 Pemerintah Kabupaten Lampung Selatan. Hak Cipta Dilindungi.</p>
          <p className="text-[11px] text-slate-400">
            Dikelola bersama Badan Pengelola Pajak dan Retribusi Daerah (BAPENDA) & Dinas Pariwisata
          </p>
        </div>
      </div>
    </footer>
  );
}
