import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'SiWita Lamsel - Sistem Tiket Wisata & Retribusi Digital Lampung Selatan',
  description: 'Portal e-Retribusi dan Tiket Digital Resmi untuk Destinasi Wisata Pemerintah Kabupaten Lampung Selatan. Transparan, Cepat, dan Akuntabel.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
