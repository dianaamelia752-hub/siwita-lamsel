import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

function generateOrderNumber(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `SWT-${yyyy}${mm}${dd}-${rand}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { siteId, customerName, customerPhone, customerEmail, visitDate, items, userId } = body;

    if (!siteId || !customerName || !customerPhone || !customerEmail || !visitDate || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Mohon lengkapi seluruh data pemesanan.' },
        { status: 400 }
      );
    }

    // Ambil destinasi dari DB
    const site = await prisma.tourismSite.findUnique({
      where: { id: siteId },
      include: { ticketTypes: true },
    });

    if (!site) {
      return NextResponse.json({ error: 'Destinasi wisata tidak ditemukan.' }, { status: 404 });
    }

    if (site.status === 'TUTUP') {
      return NextResponse.json({ error: 'Destinasi sedang tutup dan tidak menerima pesanan.' }, { status: 400 });
    }

    // Validasi & hitung harga di SERVER (mencegah manipulasi harga dari client)
    let subtotalIdr = 0;
    const orderItemsToCreate: {
      ticketTypeId: string;
      visitorCategory: string;
      unitPriceIdr: number;
      quantity: number;
      subtotalIdr: number;
    }[] = [];

    for (const item of items) {
      const qty = parseInt(item.quantity, 10);
      if (isNaN(qty) || qty <= 0) continue;

      const ticketType = site.ticketTypes.find((t) => t.id === item.ticketTypeId);
      if (!ticketType) {
        return NextResponse.json({ error: `Jenis tiket tidak sah: ${item.ticketTypeId}` }, { status: 400 });
      }

      const itemSubtotal = ticketType.priceIdr * qty;
      subtotalIdr += itemSubtotal;

      orderItemsToCreate.push({
        ticketTypeId: ticketType.id,
        visitorCategory: ticketType.visitorCategory,
        unitPriceIdr: ticketType.priceIdr,
        quantity: qty,
        subtotalIdr: itemSubtotal,
      });
    }

    if (orderItemsToCreate.length === 0) {
      return NextResponse.json({ error: 'Pilih minimal 1 lembar tiket untuk melanjutkan.' }, { status: 400 });
    }

    const feeIdr = 2000; // Biaya layanan sistem retribusi elektronik
    const totalIdr = subtotalIdr + feeIdr;
    const orderNumber = generateOrderNumber();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 menit batas bayar

    // Buat order dalam database
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: userId || null,
        siteId: site.id,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim().toLowerCase(),
        visitDate,
        subtotalIdr,
        feeIdr,
        totalIdr,
        status: 'MENUNGGU_PEMBAYARAN',
        paymentMethod: 'QRIS',
        expiresAt,
        orderItems: {
          create: orderItemsToCreate,
        },
      },
    });

    // Catat Audit Log
    await prisma.auditLog.create({
      data: {
        userId: userId || null,
        userName: customerName,
        action: 'CREATE_ORDER',
        entityType: 'ORDER',
        entityId: order.id,
        details: `Pesanan ${order.orderNumber} dibuat untuk ${site.name}. Total: Rp ${totalIdr.toLocaleString('id-ID')}`,
      },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      totalIdr: order.totalIdr,
    });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: error.message || 'Terjadi kesalahan sistem saat membuat pesanan.' },
      { status: 500 }
    );
  }
}
