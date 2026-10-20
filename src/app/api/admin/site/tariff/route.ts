import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { ticketTypeId, newPriceIdr, legalReference, approvedBy, adminUserId } = await req.json();

    const price = parseInt(newPriceIdr, 10);
    if (!ticketTypeId || isNaN(price) || price < 0) {
      return NextResponse.json({ error: 'Data tarif tidak valid.' }, { status: 400 });
    }

    const ticketType = await prisma.ticketType.findUnique({
      where: { id: ticketTypeId },
      include: { site: true },
    });

    if (!ticketType) {
      return NextResponse.json({ error: 'Jenis tiket tidak ditemukan.' }, { status: 404 });
    }

    const oldPrice = ticketType.priceIdr;

    // Lakukan update dalam database transaction
    await prisma.$transaction(async (tx) => {
      // 1. Update harga saat ini pada jenis tiket
      await tx.ticketType.update({
        where: { id: ticketTypeId },
        data: { priceIdr: price },
      });

      // 2. Catat versi tarif baru (riwayat tidak ditimpa)
      await tx.tariffVersion.create({
        data: {
          ticketTypeId,
          amountIdr: price,
          legalReference: legalReference || 'Perda Kab. Lampung Selatan No. 1/2024 (Penyesuaian Tarif)',
          approvedBy: approvedBy || 'Kepala BAPENDA Lampung Selatan',
          validFrom: new Date(),
        },
      });

      // 3. Catat ke Audit Log
      await tx.auditLog.create({
        data: {
          userId: adminUserId || 'user-admin-1',
          userName: 'Siti Rahma (Admin BAPENDA)',
          action: 'UPDATE_TARIFF',
          entityType: 'TARIFF',
          entityId: ticketTypeId,
          details: `Tarif ${ticketType.name} (${ticketType.site.name}) disesuaikan dari Rp ${oldPrice.toLocaleString('id-ID')} menjadi Rp ${price.toLocaleString('id-ID')}. Ref: ${legalReference || 'Perda No. 1/2024'}`,
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: `Tarif ${ticketType.name} berhasil diperbarui menjadi Rp ${price.toLocaleString('id-ID')}.`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
