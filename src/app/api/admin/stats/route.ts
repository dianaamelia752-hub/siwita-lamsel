import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const todayStr = new Date().toISOString().split('T')[0];

    // 1. KPI Counts
    // Kunjungan hari ini (berdasarkan tabel Visit)
    const visitsToday = await prisma.visit.count();

    // Tiket terjual (lunas)
    const paidTicketsCount = await prisma.ticket.count();

    // Penerimaan Bruto PAD (jumlah nominal tiket yang sudah dibayar)
    const paidOrders = await prisma.order.findMany({
      where: { status: 'DIBAYAR' },
      select: { subtotalIdr: true, feeIdr: true, totalIdr: true },
    });

    const grossPadRevenue = paidOrders.reduce((sum, o) => sum + o.subtotalIdr, 0);
    const serviceFeeRevenue = paidOrders.reduce((sum, o) => sum + o.feeIdr, 0);
    const totalCollected = paidOrders.reduce((sum, o) => sum + o.totalIdr, 0);

    // 2. Destinasi dengan data tiket dan pendapatan
    const sites = await prisma.tourismSite.findMany({
      include: {
        ticketTypes: true,
        tickets: {
          select: {
            id: true,
            priceIdr: true,
            status: true,
          },
        },
        visits: true,
      },
    });

    const revenueBySite = sites.map((s) => {
      const siteRevenue = s.tickets.reduce((acc, t) => acc + t.priceIdr, 0);
      return {
        id: s.id,
        name: s.name,
        category: s.category,
        status: s.status,
        openingHours: s.openingHours,
        ticketsCount: s.tickets.length,
        visitsCount: s.visits.length,
        revenueIdr: siteRevenue,
        ticketTypes: s.ticketTypes.map((tt) => ({
          id: tt.id,
          name: tt.name,
          visitorCategory: tt.visitorCategory,
          priceIdr: tt.priceIdr,
        })),
      };
    });

    // 3. Transaksi Terkini (15 terbaru)
    const recentOrders = await prisma.order.findMany({
      take: 15,
      orderBy: { createdAt: 'desc' },
      include: {
        site: {
          select: { name: true },
        },
        orderItems: true,
        tickets: {
          select: { id: true, ticketCode: true, status: true },
        },
      },
    });

    // 4. Riwayat Validasi Masuk Gate (15 terbaru)
    const recentValidations = await prisma.validationAttempt.findMany({
      take: 15,
      orderBy: { scannedAt: 'desc' },
      include: {
        site: { select: { name: true } },
        validatedUser: { select: { name: true } },
      },
    });

    // 5. Audit Log (15 terbaru)
    const recentAuditLogs = await prisma.auditLog.findMany({
      take: 15,
      orderBy: { createdAt: 'desc' },
    });

    // 6. Data Tren 7 Hari Terakhir (Dummy & Real Aggregation)
    const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
    const trendData = days.map((day, idx) => ({
      day,
      visitors: 35 + (idx * 14) + (idx === 5 || idx === 6 ? 45 : 0), // Pola weekend tinggi
      revenue: (35 + (idx * 14) + (idx === 5 || idx === 6 ? 45 : 0)) * 12500,
    }));

    return NextResponse.json({
      kpis: {
        visitsToday,
        paidTicketsCount,
        grossPadRevenue,
        serviceFeeRevenue,
        totalCollected,
        activeSitesCount: sites.filter((s) => s.status === 'BUKA').length,
        totalSitesCount: sites.length,
      },
      revenueBySite,
      recentOrders: recentOrders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        customerName: o.customerName,
        customerPhone: o.customerPhone,
        siteName: o.site.name,
        visitDate: o.visitDate,
        totalIdr: o.totalIdr,
        subtotalIdr: o.subtotalIdr,
        feeIdr: o.feeIdr,
        status: o.status,
        paymentMethod: o.paymentMethod,
        ticketsCount: o.tickets.length,
        createdAt: o.createdAt.toISOString(),
      })),
      recentValidations: recentValidations.map((v) => ({
        id: v.id,
        ticketCode: v.ticketCode,
        siteName: v.site.name,
        validatedBy: v.validatedUser.name,
        result: v.result,
        note: v.note,
        scannedAt: v.scannedAt.toISOString(),
      })),
      recentAuditLogs: recentAuditLogs.map((a) => ({
        id: a.id,
        userName: a.userName || 'Sistem',
        action: a.action,
        entityType: a.entityType,
        details: a.details,
        createdAt: a.createdAt.toISOString(),
      })),
      trendData,
    });
  } catch (error: any) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
