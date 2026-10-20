import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const sitesCount = await prisma.tourismSite.count();
    const usersCount = await prisma.user.count();
    const ordersCount = await prisma.order.count();
    const ticketsCount = await prisma.ticket.count();

    return NextResponse.json({
      status: 'OK',
      app: 'SiWita Lamsel',
      version: '1.0.0',
      database: 'SQLite (Prisma)',
      counts: {
        destinations: sitesCount,
        users: usersCount,
        orders: ordersCount,
        tickets: ticketsCount,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'ERROR',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
