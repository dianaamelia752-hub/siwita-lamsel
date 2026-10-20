import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { siteId, status, adminUserId } = await req.json();

    if (!siteId || !status) {
      return NextResponse.json({ error: 'Parameter siteId dan status wajib diisi.' }, { status: 400 });
    }

    const updated = await prisma.tourismSite.update({
      where: { id: siteId },
      data: { status },
    });

    // Catat ke audit log
    await prisma.auditLog.create({
      data: {
        userId: adminUserId || 'user-admin-1',
        userName: 'Siti Rahma (Admin BAPENDA)',
        action: 'TOGGLE_SITE_STATUS',
        entityType: 'TOURISM_SITE',
        entityId: siteId,
        details: `Status operasional ${updated.name} diubah menjadi ${status}.`,
      },
    });

    return NextResponse.json({ success: true, site: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
