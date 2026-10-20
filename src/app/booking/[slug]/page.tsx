import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import BookingForm from '@/components/BookingForm';

export const dynamic = 'force-dynamic';

interface Props {
  params: {
    slug: string;
  };
}

export default async function BookingPage({ params }: Props) {
  const site = await prisma.tourismSite.findUnique({
    where: { slug: params.slug },
    include: {
      ticketTypes: {
        orderBy: { priceIdr: 'desc' },
      },
    },
  });

  if (!site) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <BookingForm
        site={{
          id: site.id,
          name: site.name,
          slug: site.slug,
          address: site.address,
          openingHours: site.openingHours,
          imageUrl: site.imageUrl,
          ticketTypes: site.ticketTypes.map((t) => ({
            id: t.id,
            name: t.name,
            visitorCategory: t.visitorCategory,
            priceIdr: t.priceIdr,
          })),
        }}
      />
    </div>
  );
}
