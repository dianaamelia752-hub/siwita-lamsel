import React from 'react';
import prisma from '@/lib/prisma';
import DestinationCatalog from '@/components/DestinationCatalog';
import { DestinationWithPrices } from '@/lib/types';

// Selalu render dengan data terbaru
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const sites = await prisma.tourismSite.findMany({
    include: {
      ticketTypes: true,
    },
    orderBy: {
      name: 'asc',
    },
  });

  const formattedDestinations: DestinationWithPrices[] = sites.map((site) => {
    let facilities: string[] = [];
    try {
      facilities = JSON.parse(site.facilities);
    } catch (e) {
      facilities = ['Parkir', 'Toilet', 'Mushola'];
    }

    const minPrice = site.ticketTypes.length > 0
      ? Math.min(...site.ticketTypes.map((t) => t.priceIdr))
      : 10000;

    return {
      id: site.id,
      name: site.name,
      slug: site.slug,
      description: site.description,
      address: site.address,
      category: site.category,
      openingHours: site.openingHours,
      imageUrl: site.imageUrl,
      facilities,
      status: site.status,
      manager: site.manager,
      minPrice,
      ticketTypes: site.ticketTypes.map((t) => ({
        id: t.id,
        name: t.name,
        visitorCategory: t.visitorCategory,
        priceIdr: t.priceIdr,
      })),
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <DestinationCatalog initialDestinations={formattedDestinations} />
    </div>
  );
}
