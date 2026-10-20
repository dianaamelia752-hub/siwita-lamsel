import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

function sanitizeCsvField(field: any): string {
  if (field === null || field === undefined) return '""';
  let str = String(field).trim();
  // Cegah Formula Injection Excel / Spreadsheet
  if (str.startsWith('=') || str.startsWith('+') || str.startsWith('-') || str.startsWith('@')) {
    str = "'" + str;
  }
  // Escape quote ganda
  str = str.replace(/"/g, '""');
  return `"${str}"`;
}

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        site: true,
        tickets: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const headers = [
      'Nomor Order',
      'Tanggal Pesan',
      'Tanggal Kunjungan',
      'Nama Wisatawan',
      'Objek Wisata',
      'Subtotal Retribusi (Rp)',
      'Biaya Layanan (Rp)',
      'Total Bayar (Rp)',
      'Metode Bayar',
      'Status Pembayaran',
      'Jumlah Tiket',
      'Status Tiket Masuk',
    ];

    const rows = orders.map((o) => {
      const ticketsStatusSummary = o.tickets.map((t) => t.status).join(', ') || 'Belum Terbit';
      return [
        sanitizeCsvField(o.orderNumber),
        sanitizeCsvField(o.createdAt.toISOString().split('T')[0]),
        sanitizeCsvField(o.visitDate),
        sanitizeCsvField(o.customerName),
        sanitizeCsvField(o.site.name),
        sanitizeCsvField(o.subtotalIdr),
        sanitizeCsvField(o.feeIdr),
        sanitizeCsvField(o.totalIdr),
        sanitizeCsvField(o.paymentMethod),
        sanitizeCsvField(o.status),
        sanitizeCsvField(o.tickets.length),
        sanitizeCsvField(ticketsStatusSummary),
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="laporan-retribusi-siwita-lamsel-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
