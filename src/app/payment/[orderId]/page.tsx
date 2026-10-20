import React from 'react';
import { notFound, redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import PaymentView from '@/components/PaymentView';

export const dynamic = 'force-dynamic';

interface Props {
  params: {
    orderId: string;
  };
}

export default async function OrderPaymentPage({ params }: Props) {
  const order = await prisma.order.findUnique({
    where: { id: params.orderId },
    include: {
      site: true,
      orderItems: true,
      tickets: true,
    },
  });

  if (!order) {
    notFound();
  }

  // Jika pesanan sudah dibayar, langsung arahkan ke tiket digital
  if (order.status === 'DIBAYAR' && order.tickets.length > 0) {
    redirect(`/ticket/${order.id}`);
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <PaymentView
        order={{
          id: order.id,
          orderNumber: order.orderNumber,
          customerName: order.customerName,
          customerPhone: order.customerPhone,
          customerEmail: order.customerEmail,
          visitDate: order.visitDate,
          subtotalIdr: order.subtotalIdr,
          feeIdr: order.feeIdr,
          totalIdr: order.totalIdr,
          status: order.status,
          paymentMethod: order.paymentMethod,
          expiresAt: order.expiresAt.toISOString(),
          site: {
            id: order.site.id,
            name: order.site.name,
            address: order.site.address,
          },
          orderItems: order.orderItems.map((item) => ({
            id: item.id,
            visitorCategory: item.visitorCategory,
            unitPriceIdr: item.unitPriceIdr,
            quantity: item.quantity,
            subtotalIdr: item.subtotalIdr,
          })),
        }}
      />
    </div>
  );
}
