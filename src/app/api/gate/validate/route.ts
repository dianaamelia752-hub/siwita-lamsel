import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { ticketCode, siteId, gateUserId } = await req.json();

    if (!ticketCode || !siteId) {
      return NextResponse.json(
        { error: 'Kode tiket dan ID lokasi gerbang wajib disertakan.' },
        { status: 400 }
      );
    }

    const cleanCode = ticketCode.trim();

    // 1. Dapatkan info lokasi pos gerbang saat ini
    const currentSite = await prisma.tourismSite.findUnique({
      where: { id: siteId },
    });

    if (!currentSite) {
      return NextResponse.json({ error: 'Lokasi gerbang tidak valid.' }, { status: 400 });
    }

    // 2. Cari tiket berdasarkan ticketCode ATAU tokenSecret
    const ticket = await prisma.ticket.findFirst({
      where: {
        OR: [
          { ticketCode: cleanCode },
          { tokenSecret: cleanCode },
        ],
      },
      include: {
        site: true,
        order: true,
      },
    });

    // Validasi UserId petugas
    const effectiveUserId = gateUserId || 'user-petugas-1';

    // HASIL 1: TIDAK DIKENAL
    if (!ticket) {
      await prisma.validationAttempt.create({
        data: {
          ticketCode: cleanCode,
          siteId,
          validatedByUserId: effectiveUserId,
          result: 'TIDAK_DIKENAL',
          note: 'Kode QR tidak ditemukan di database.',
        },
      });

      return NextResponse.json({
        result: 'TIDAK_DIKENAL',
        statusClass: 'bg-slate-700 text-white',
        title: 'TIDAK DIKENAL',
        message: 'Kode QR tidak terdaftar dalam database retribusi resmi SiWita Lamsel.',
        scannedCode: cleanCode,
        gateName: currentSite.name,
        timestamp: new Date().toISOString(),
      });
    }

    // HASIL 2: SALAH LOKASI (Tiket untuk destinasi wisata lain)
    if (ticket.siteId !== siteId) {
      await prisma.validationAttempt.create({
        data: {
          ticketId: ticket.id,
          ticketCode: ticket.ticketCode,
          siteId,
          validatedByUserId: effectiveUserId,
          result: 'SALAH_LOKASI',
          note: `Tiket dibeli untuk ${ticket.site.name}, discan di ${currentSite.name}.`,
        },
      });

      return NextResponse.json({
        result: 'SALAH_LOKASI',
        statusClass: 'bg-purple-800 text-white',
        title: 'SALAH LOKASI',
        message: `Tiket ini sah untuk "${ticket.site.name}", BUKAN untuk gerbang "${currentSite.name}".`,
        ticket: {
          code: ticket.ticketCode,
          visitorCategory: ticket.visitorCategory,
          customerName: ticket.order.customerName,
          registeredSite: ticket.site.name,
          visitDate: ticket.visitDate,
        },
        gateName: currentSite.name,
        timestamp: new Date().toISOString(),
      });
    }

    // Tanggal hari ini
    const todayStr = new Date().toISOString().split('T')[0];

    // HASIL 3: KEDALUWARSA (Tanggal kunjungan telah lewat)
    if (ticket.visitDate < todayStr || ticket.status === 'KEDALUWARSA') {
      await prisma.validationAttempt.create({
        data: {
          ticketId: ticket.id,
          ticketCode: ticket.ticketCode,
          siteId,
          validatedByUserId: effectiveUserId,
          result: 'KEDALUWARSA',
          note: `Tanggal kunjungan tiket (${ticket.visitDate}) sudah lewat.`,
        },
      });

      // Update status tiket jadi KEDALUWARSA jika belum
      if (ticket.status !== 'KEDALUWARSA') {
        await prisma.ticket.update({
          where: { id: ticket.id },
          data: { status: 'KEDALUWARSA' },
        });
      }

      return NextResponse.json({
        result: 'KEDALUWARSA',
        statusClass: 'bg-rose-700 text-white',
        title: 'KEDALUWARSA',
        message: `Masa berlaku tiket telah berakhir. Tanggal kunjungan terdaftar: ${ticket.visitDate}.`,
        ticket: {
          code: ticket.ticketCode,
          visitorCategory: ticket.visitorCategory,
          customerName: ticket.order.customerName,
          visitDate: ticket.visitDate,
        },
        gateName: currentSite.name,
        timestamp: new Date().toISOString(),
      });
    }

    // HASIL 4: SUDAH DIGUNAKAN (Pernah discan sebelumnya)
    if (ticket.status === 'SUDAH_DIGUNAKAN') {
      const formattedUsedTime = ticket.usedAt
        ? new Date(ticket.usedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        : 'Waktu tidak tercatat';

      await prisma.validationAttempt.create({
        data: {
          ticketId: ticket.id,
          ticketCode: ticket.ticketCode,
          siteId,
          validatedByUserId: effectiveUserId,
          result: 'SUDAH_DIGUNAKAN',
          note: `Tiket pernah digunakan sebelumnya pada ${ticket.usedAt}.`,
        },
      });

      return NextResponse.json({
        result: 'SUDAH_DIGUNAKAN',
        statusClass: 'bg-amber-600 text-white',
        title: 'SUDAH DIGUNAKAN',
        message: `Tiket ini pernah dipindai dan digunakan sebelumnya pukul ${formattedUsedTime} WIB. Tiket tidak dapat dipakai ulang!`,
        ticket: {
          code: ticket.ticketCode,
          visitorCategory: ticket.visitorCategory,
          customerName: ticket.order.customerName,
          usedAt: ticket.usedAt,
        },
        gateName: currentSite.name,
        timestamp: new Date().toISOString(),
      });
    }

    // HASIL 5: VALID (Akses Diberikan - Transaksi Atomik)
    try {
      await prisma.$transaction(async (tx) => {
        // Atomic update status: hanya jika masih AKTIF
        const updated = await tx.ticket.updateMany({
          where: {
            id: ticket.id,
            status: 'AKTIF',
          },
          data: {
            status: 'SUDAH_DIGUNAKAN',
            usedAt: new Date(),
            usedAtSiteId: siteId,
            validatedByUserId: effectiveUserId,
          },
        });

        if (updated.count === 0) {
          throw new Error('CONCURRENCY_ERROR');
        }

        // Catat kunjungan ke tabel Visit
        await tx.visit.create({
          data: {
            ticketId: ticket.id,
            siteId,
            validatedByUserId: effectiveUserId,
            enteredAt: new Date(),
          },
        });

        // Catat ke tabel ValidationAttempt
        await tx.validationAttempt.create({
          data: {
            ticketId: ticket.id,
            ticketCode: ticket.ticketCode,
            siteId,
            validatedByUserId: effectiveUserId,
            result: 'VALID',
            note: 'Tiket berhasil dipindai dan akses masuk diberikan.',
          },
        });

        // Audit log
        await tx.auditLog.create({
          data: {
            userId: effectiveUserId,
            action: 'GATE_SCAN_VALID',
            entityType: 'TICKET',
            entityId: ticket.id,
            details: `Tiket ${ticket.ticketCode} (${ticket.visitorCategory}) diverifikasi VALID di ${currentSite.name}.`,
          },
        });
      });

      return NextResponse.json({
        result: 'VALID',
        statusClass: 'bg-emerald-700 text-white',
        title: 'VALID',
        message: 'Akses Diberikan! Tiket resmi terverifikasi dan retribusi sah.',
        ticket: {
          code: ticket.ticketCode,
          visitorCategory: ticket.visitorCategory,
          customerName: ticket.order.customerName,
          orderNumber: ticket.order.orderNumber,
          priceIdr: ticket.priceIdr,
          visitDate: ticket.visitDate,
        },
        gateName: currentSite.name,
        timestamp: new Date().toISOString(),
      });
    } catch (txError: any) {
      if (txError.message === 'CONCURRENCY_ERROR') {
        return NextResponse.json({
          result: 'SUDAH_DIGUNAKAN',
          statusClass: 'bg-amber-600 text-white',
          title: 'SUDAH DIGUNAKAN',
          message: 'Tiket baru saja digunakan oleh pemindai lain. Tiket tidak dapat dipakai ulang.',
          scannedCode: cleanCode,
          gateName: currentSite.name,
        });
      }
      throw txError;
    }
  } catch (error: any) {
    console.error('Error validating ticket:', error);
    return NextResponse.json(
      { error: error.message || 'Terjadi kesalahan sistem saat memvalidasi tiket.' },
      { status: 500 }
    );
  }
}
