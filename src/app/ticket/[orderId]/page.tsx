import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import TicketDetailView from '@/components/TicketDetailView';
import { generateQrDataUrl } from '@/lib/qr';

export const dynamic = 'force-dynamic';

interface Props {
  params: {
    orderId: string;
  };
}

export default async function OrderTicketPage({ params }: Props) {
  const order = await prisma.order.findUnique({
    where: { id: params.orderId },
    include: {
      site: true,
      tickets: true,
    },
  });

  if (!order || order.tickets.length === 0) {
    notFound();
  }

  // Generate QR data url untuk setiap tiket
  const ticketsWithQr = await Promise.all(
    order.tickets.map(async (t) => {
      // QR memuat kode tiket unik
      const qrDataUrl = await generateQrDataUrl(t.ticketCode);
      return {
        id: t.id,
        ticketCode: t.ticketCode,
        qrDataUrl,
        visitDate: t.visitDate,
        visitorCategory: t.visitorCategory,
        priceIdr: t.priceIdr,
        status: t.status,
        usedAt: t.usedAt ? t.usedAt.toISOString() : null,
      };
    })
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <TicketDetailView
        order={{
          id: order.id,
          orderNumber: order.orderNumber,
          customerName: order.customerName,
          customerPhone: order.customerPhone,
          customerEmail: order.customerEmail,
          visitDate: order.visitDate,
          totalIdr: order.totalIdr,
          paymentMethod: order.paymentMethod,
          site: {
            id: order.site.id,
            name: order.site.name,
            address: order.site.address,
            openingHours: order.site.openingHours,
          },
          tickets: ticketsWithQr,
        }}
      />
    </div>
  );
}
