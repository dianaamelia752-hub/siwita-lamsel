import React from 'react';
import prisma from '@/lib/prisma';
import MyTicketsView from '@/components/MyTicketsView';

export const dynamic = 'force-dynamic';

export default async function MyTicketsPage() {
  const tickets = await prisma.ticket.findMany({
    include: {
      site: true,
      order: true,
    },
    orderBy: {
      issuedAt: 'desc',
    },
  });

  const formattedTickets = tickets.map((t) => ({
    id: t.id,
    ticketCode: t.ticketCode,
    visitDate: t.visitDate,
    visitorCategory: t.visitorCategory,
    priceIdr: t.priceIdr,
    status: t.status,
    orderId: t.orderId,
    orderNumber: t.order.orderNumber,
    customerName: t.order.customerName,
    siteName: t.site.name,
    siteAddress: t.site.address,
  }));

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <MyTicketsView initialTickets={formattedTickets} />
    </div>
  );
}
