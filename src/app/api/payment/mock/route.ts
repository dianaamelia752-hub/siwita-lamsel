import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

function generateTicketCode(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  // 6 digit alphanumeric unik tidak berurutan
  const randomChars = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `SWT-TKT-${yyyy}${mm}${dd}-${randomChars}`;
}

export async function POST(req: Request) {
  try {
    const { orderId, action, paymentMethod } = await req.json();

    if (!orderId || !action) {
      return NextResponse.json({ error: 'Data pembayaran tidak lengkap.' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        site: true,
        orderItems: {
          include: { ticketType: true },
        },
        tickets: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Pesanan tidak ditemukan.' }, { status: 404 });
    }

    if (order.status === 'DIBAYAR') {
      return NextResponse.json({
        success: true,
        message: 'Pesanan sudah berstatus DIBAYAR.',
        orderId: order.id,
      });
    }

    if (action === 'FAIL') {
      // Simulasi Pembayaran Gagal
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'GAGAL',
          paymentMethod: paymentMethod || order.paymentMethod,
        },
      });

      await prisma.auditLog.create({
        data: {
          userId: order.userId,
          userName: order.customerName,
          action: 'PAYMENT_FAILED_SIMULATION',
          entityType: 'ORDER',
          entityId: order.id,
          details: `Pembayaran pesanan ${order.orderNumber} disimulasikan GAGAL.`,
        },
      });

      return NextResponse.json({
        success: false,
        status: 'GAGAL',
        message: 'Pembayaran gagal disimulasikan.',
      });
    }

    if (action === 'SUCCESS') {
      // Pembayaran Berhasil: Buat tiket individual di dalam transaksi
      const ticketsToCreate: {
        ticketCode: string;
        tokenSecret: string;
        siteId: string;
        visitDate: string;
        visitorCategory: string;
        priceIdr: number;
        status: string;
      }[] = [];

      for (const item of order.orderItems) {
        for (let i = 0; i < item.quantity; i++) {
          ticketsToCreate.push({
            ticketCode: generateTicketCode(),
            tokenSecret: `tok_${crypto.randomBytes(16).toString('hex')}`,
            siteId: order.siteId,
            visitDate: order.visitDate,
            visitorCategory: item.visitorCategory,
            priceIdr: item.unitPriceIdr,
            status: 'AKTIF',
          });
        }
      }

      const paymentReference = `${paymentMethod || 'QRIS'}-REF-${Date.now()}`;

      // Database transaction
      await prisma.$transaction(async (tx) => {
        // 1. Update status pesanan
        await tx.order.update({
          where: { id: orderId },
          data: {
            status: 'DIBAYAR',
            paymentMethod: paymentMethod || 'QRIS',
            paymentReference,
            paidAt: new Date(),
          },
        });

        // 2. Terbitkan tiket individual
        for (const t of ticketsToCreate) {
          await tx.ticket.create({
            data: {
              orderId: order.id,
              ticketCode: t.ticketCode,
              tokenSecret: t.tokenSecret,
              siteId: t.siteId,
              visitDate: t.visitDate,
              visitorCategory: t.visitorCategory,
              priceIdr: t.priceIdr,
              status: 'AKTIF',
            },
          });
        }

        // 3. Catat jejak audit
        await tx.auditLog.create({
          data: {
            userId: order.userId,
            userName: order.customerName,
            action: 'PAYMENT_CONFIRMED',
            entityType: 'ORDER',
            entityId: order.id,
            details: `Pembayaran pesanan ${order.orderNumber} terkonfirmasi via ${paymentMethod || 'QRIS'}. ${ticketsToCreate.length} tiket diterbitkan.`,
          },
        });
      });

      return NextResponse.json({
        success: true,
        status: 'DIBAYAR',
        orderId: order.id,
        ticketCount: ticketsToCreate.length,
      });
    }

    return NextResponse.json({ error: 'Aksi pembayaran tidak dikenal.' }, { status: 400 });
  } catch (error: any) {
    console.error('Error simulating payment:', error);
    return NextResponse.json({ error: error.message || 'Gagal memproses simulasi pembayaran.' }, { status: 500 });
  }
}
