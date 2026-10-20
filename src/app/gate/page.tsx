import React from 'react';
import prisma from '@/lib/prisma';
import GateScannerView from '@/components/GateScannerView';

export const dynamic = 'force-dynamic';

export default async function GatePage() {
  const sites = await prisma.tourismSite.findMany({
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      category: true,
    },
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <GateScannerView sites={sites} />
    </div>
  );
}
