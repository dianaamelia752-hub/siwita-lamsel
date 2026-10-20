import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const existingSitesCount = await prisma.tourismSite.count();

    if (existingSitesCount > 0) {
      return NextResponse.json({
        message: 'Database sudah memiliki data destinasi.',
        sitesCount: existingSitesCount,
      });
    }

    // 1. Buat 5 Destinasi Wisata di Lampung Selatan
    const site1 = await prisma.tourismSite.create({
      data: {
        id: 'site-pasir-putih',
        name: 'Pantai Pasir Putih Lampung',
        slug: 'pantai-pasir-putih',
        description: 'Pantai ikonik Lampung Selatan dengan pasir putih lembut, air laut jernih kebiruan, dan panorama gugusan Pulau Condong serta Pulau Tarahan. Lokasi favorit untuk wisata keluarga, watersport kano, dan berperahu.',
        address: 'Jl. Raya Trans Sumatera KM 45, Desa Tarahan, Kec. Katibung, Kabupaten Lampung Selatan',
        category: 'Pantai',
        openingHours: '07:00 - 18:00 WIB',
        imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
        facilities: JSON.stringify(['Parkir Luas', 'Toilet & Kamar Bilas', 'Mushola', 'Gazebo Pantai', 'Kantin / Resto Seafood', 'Sewa Perahu']),
        status: 'BUKA',
        manager: 'Dinas Pariwisata Pemkab Lampung Selatan',
        salesVerified: true,
        ticketTypes: {
          create: [
            {
              id: 'tt-pp-dewasa',
              name: 'Tiket Dewasa / Umum',
              visitorCategory: 'DEWASA',
              priceIdr: 15000,
              tariffVersions: {
                create: {
                  amountIdr: 15000,
                  legalReference: 'Perda Kab. Lampung Selatan No. 1 Tahun 2024 tentang Retribusi Pariwisata',
                  approvedBy: 'BAPENDA Kab. Lampung Selatan',
                },
              },
            },
            {
              id: 'tt-pp-anak',
              name: 'Tiket Anak-anak (3 - 10 Tahun)',
              visitorCategory: 'ANAK',
              priceIdr: 10000,
              tariffVersions: {
                create: {
                  amountIdr: 10000,
                  legalReference: 'Perda Kab. Lampung Selatan No. 1 Tahun 2024',
                  approvedBy: 'BAPENDA Kab. Lampung Selatan',
                },
              },
            },
            {
              id: 'tt-pp-pelajar',
              name: 'Tiket Pelajar / Mahasiswa',
              visitorCategory: 'PELAJAR',
              priceIdr: 12000,
              tariffVersions: {
                create: {
                  amountIdr: 12000,
                  legalReference: 'Perda Kab. Lampung Selatan No. 1 Tahun 2024',
                  approvedBy: 'BAPENDA Kab. Lampung Selatan',
                },
              },
            },
          ],
        },
      },
    });

    const site2 = await prisma.tourismSite.create({
      data: {
        id: 'site-menara-siger',
        name: 'Menara Siger Bakauheni',
        slug: 'menara-siger',
        description: 'Landmark dan mahkota kebanggaan Provinsi Lampung di titik nol ujung selatan Pulau Sumatera. Menawarkan panorama spektakuler Selat Sunda, pelabuhan kapal feri Bakauheni, dan museum budaya tapis Lampung.',
        address: 'Bukit Gamping, Jl. Lintas Timur Sumatera, Bakauheni, Kec. Bakauheni, Kabupaten Lampung Selatan',
        category: 'Budaya',
        openingHours: '06:00 - 20:00 WIB',
        imageUrl: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=1200&q=80',
        facilities: JSON.stringify(['Spot Foto Landmark', 'Museum Budaya', 'Pusat Oleh-oleh', 'Mushola Menara', 'Area Parkir Bus/Mobil', 'Kafe Pemandangan']),
        status: 'BUKA',
        manager: 'Dinas Pariwisata & Kebudayaan Lampung Selatan',
        salesVerified: true,
        ticketTypes: {
          create: [
            {
              id: 'tt-ms-dewasa',
              name: 'Tiket Dewasa / Umum',
              visitorCategory: 'DEWASA',
              priceIdr: 10000,
              tariffVersions: {
                create: {
                  amountIdr: 10000,
                  legalReference: 'Perda Kab. Lampung Selatan No. 1 Tahun 2024',
                  approvedBy: 'BAPENDA Kab. Lampung Selatan',
                },
              },
            },
            {
              id: 'tt-ms-anak',
              name: 'Tiket Anak-anak (3 - 10 Tahun)',
              visitorCategory: 'ANAK',
              priceIdr: 5000,
              tariffVersions: {
                create: {
                  amountIdr: 5000,
                  legalReference: 'Perda Kab. Lampung Selatan No. 1 Tahun 2024',
                  approvedBy: 'BAPENDA Kab. Lampung Selatan',
                },
              },
            },
            {
              id: 'tt-ms-pelajar',
              name: 'Tiket Pelajar / Mahasiswa',
              visitorCategory: 'PELAJAR',
              priceIdr: 7000,
              tariffVersions: {
                create: {
                  amountIdr: 7000,
                  legalReference: 'Perda Kab. Lampung Selatan No. 1 Tahun 2024',
                  approvedBy: 'BAPENDA Kab. Lampung Selatan',
                },
              },
            },
          ],
        },
      },
    });

    const site3 = await prisma.tourismSite.create({
      data: {
        id: 'site-kedu-warna',
        name: 'Pantai Kedu Warna Kalianda',
        slug: 'pantai-kedu-warna',
        description: 'Pantai berpasir putih luas di teluk Kalianda dengan latar Gunung Rajabasa yang megah. Tempat terbaik menikmati pemandangan matahari terbenam (sunset), camping pinggir pantai, dan festival layang-layang.',
        address: 'Jl. Sinar Laut, Desa Way Urang, Kec. Kalianda, Kabupaten Lampung Selatan',
        category: 'Pantai',
        openingHours: '08:00 - 21:00 WIB',
        imageUrl: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1200&q=80',
        facilities: JSON.stringify(['Area Camping Ground', 'Panggung Akustik', 'Jogging Track Pantai', 'Toilet Bersih', 'Kantin Kuliner', 'Spot Sunset']),
        status: 'BUKA',
        manager: 'Dinas Pariwisata Pemkab Lampung Selatan',
        salesVerified: true,
        ticketTypes: {
          create: [
            {
              id: 'tt-kw-dewasa',
              name: 'Tiket Dewasa / Umum',
              visitorCategory: 'DEWASA',
              priceIdr: 12000,
              tariffVersions: {
                create: {
                  amountIdr: 12000,
                  legalReference: 'Perda Kab. Lampung Selatan No. 1 Tahun 2024',
                  approvedBy: 'BAPENDA Kab. Lampung Selatan',
                },
              },
            },
            {
              id: 'tt-kw-anak',
              name: 'Tiket Anak-anak (3 - 10 Tahun)',
              visitorCategory: 'ANAK',
              priceIdr: 8000,
              tariffVersions: {
                create: {
                  amountIdr: 8000,
                  legalReference: 'Perda Kab. Lampung Selatan No. 1 Tahun 2024',
                  approvedBy: 'BAPENDA Kab. Lampung Selatan',
                },
              },
            },
            {
              id: 'tt-kw-pelajar',
              name: 'Tiket Pelajar / Mahasiswa',
              visitorCategory: 'PELAJAR',
              priceIdr: 10000,
              tariffVersions: {
                create: {
                  amountIdr: 10000,
                  legalReference: 'Perda Kab. Lampung Selatan No. 1 Tahun 2024',
                  approvedBy: 'BAPENDA Kab. Lampung Selatan',
                },
              },
            },
          ],
        },
      },
    });

    const site4 = await prisma.tourismSite.create({
      data: {
        id: 'site-way-lalaan',
        name: 'Air Terjun Way Lalaan',
        slug: 'air-terjun-way-lalaan',
        description: 'Objek wisata air terjun alami berhawa sejuk di lereng Gunung Rajabasa peninggalan zaman kolonial Belanda sejak tahun 1937. Memiliki dua tingkatan curug dengan debit air jernih dan kolam alami yang asri.',
        address: 'Desa Kampung Baru, Kec. Penengahan, Kabupaten Lampung Selatan',
        category: 'Alam',
        openingHours: '08:00 - 17:00 WIB',
        imageUrl: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80',
        facilities: JSON.stringify(['Tangga Pengaman', 'Gazebo Teduh', 'Ruang Ganti & Toilet', 'Warung Tradisional', 'Area Parkir Teduh']),
        status: 'BUKA',
        manager: 'Dinas Pariwisata Pemkab Lampung Selatan',
        salesVerified: true,
        ticketTypes: {
          create: [
            {
              id: 'tt-wl-dewasa',
              name: 'Tiket Dewasa / Umum',
              visitorCategory: 'DEWASA',
              priceIdr: 10000,
              tariffVersions: {
                create: {
                  amountIdr: 10000,
                  legalReference: 'Perda Kab. Lampung Selatan No. 1 Tahun 2024',
                  approvedBy: 'BAPENDA Kab. Lampung Selatan',
                },
              },
            },
            {
              id: 'tt-wl-anak',
              name: 'Tiket Anak-anak (3 - 10 Tahun)',
              visitorCategory: 'ANAK',
              priceIdr: 5000,
              tariffVersions: {
                create: {
                  amountIdr: 5000,
                  legalReference: 'Perda Kab. Lampung Selatan No. 1 Tahun 2024',
                  approvedBy: 'BAPENDA Kab. Lampung Selatan',
                },
              },
            },
            {
              id: 'tt-wl-pelajar',
              name: 'Tiket Pelajar / Mahasiswa',
              visitorCategory: 'PELAJAR',
              priceIdr: 7000,
              tariffVersions: {
                create: {
                  amountIdr: 7000,
                  legalReference: 'Perda Kab. Lampung Selatan No. 1 Tahun 2024',
                  approvedBy: 'BAPENDA Kab. Lampung Selatan',
                },
              },
            },
          ],
        },
      },
    });

    const site5 = await prisma.tourismSite.create({
      data: {
        id: 'site-way-belerang',
        name: 'Pemandian Air Panas Way Belerang',
        slug: 'pemandian-way-belerang',
        description: 'Pemandian air panas belerang alami bersumber langsung dari magma Gunung Rajabasa. Sangat populer untuk relaksasi tubuh dan terapi kesehatan kulit alami dengan kolam air hangat dan kolam dingin.',
        address: 'Kelurahan Bumi Agung, Kec. Kalianda, Kabupaten Lampung Selatan',
        category: 'Keluarga',
        openingHours: '07:00 - 22:00 WIB',
        imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
        facilities: JSON.stringify(['Kolam Terapi Belerang', 'Kolam Renang Anak', 'Kamar Mandi Bilas', 'Penyewaan Ban', 'Mushola', 'Kantin Sehat']),
        status: 'BUKA',
        manager: 'Dinas Pariwisata Pemkab Lampung Selatan',
        salesVerified: true,
        ticketTypes: {
          create: [
            {
              id: 'tt-wb-dewasa',
              name: 'Tiket Dewasa / Umum',
              visitorCategory: 'DEWASA',
              priceIdr: 15000,
              tariffVersions: {
                create: {
                  amountIdr: 15000,
                  legalReference: 'Perda Kab. Lampung Selatan No. 1 Tahun 2024',
                  approvedBy: 'BAPENDA Kab. Lampung Selatan',
                },
              },
            },
            {
              id: 'tt-wb-anak',
              name: 'Tiket Anak-anak (3 - 10 Tahun)',
              visitorCategory: 'ANAK',
              priceIdr: 10000,
              tariffVersions: {
                create: {
                  amountIdr: 10000,
                  legalReference: 'Perda Kab. Lampung Selatan No. 1 Tahun 2024',
                  approvedBy: 'BAPENDA Kab. Lampung Selatan',
                },
              },
            },
            {
              id: 'tt-wb-pelajar',
              name: 'Tiket Pelajar / Mahasiswa',
              visitorCategory: 'PELAJAR',
              priceIdr: 12000,
              tariffVersions: {
                create: {
                  amountIdr: 12000,
                  legalReference: 'Perda Kab. Lampung Selatan No. 1 Tahun 2024',
                  approvedBy: 'BAPENDA Kab. Lampung Selatan',
                },
              },
            },
          ],
        },
      },
    });

    // 2. Buat 3 Akun Demo
    const userWisatawan = await prisma.user.create({
      data: {
        id: 'user-wisatawan-1',
        name: 'Budi Santoso',
        email: 'wisatawan@siwita.id',
        role: 'WISATAWAN',
        password: 'password123',
        status: 'ACTIVE',
      },
    });

    const userPetugas = await prisma.user.create({
      data: {
        id: 'user-petugas-1',
        name: 'Ahmad Yani (Petugas Gate)',
        email: 'petugas@siwita.id',
        role: 'PETUGAS',
        password: 'password123',
        siteId: site1.id,
        status: 'ACTIVE',
      },
    });

    const userAdmin = await prisma.user.create({
      data: {
        id: 'user-admin-1',
        name: 'Siti Rahma, S.E. (Admin BAPENDA)',
        email: 'admin@siwita.id',
        role: 'ADMIN',
        password: 'password123',
        status: 'ACTIVE',
      },
    });

    // 3. Buat Transaksi Awal & Tiket
    const todayStr = new Date().toISOString().split('T')[0];

    const order1 = await prisma.order.create({
      data: {
        id: 'order-sample-001',
        orderNumber: 'SWT-20261020-001',
        userId: userWisatawan.id,
        siteId: site1.id,
        customerName: 'Budi Santoso',
        customerPhone: '081234567890',
        customerEmail: 'wisatawan@siwita.id',
        visitDate: todayStr,
        subtotalIdr: 25000,
        feeIdr: 2000,
        totalIdr: 27000,
        status: 'DIBAYAR',
        paymentMethod: 'QRIS',
        paymentReference: 'QRIS-BI-88991201',
        paidAt: new Date(),
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        orderItems: {
          create: [
            {
              ticketTypeId: 'tt-pp-dewasa',
              visitorCategory: 'DEWASA',
              unitPriceIdr: 15000,
              quantity: 1,
              subtotalIdr: 15000,
            },
            {
              ticketTypeId: 'tt-pp-anak',
              visitorCategory: 'ANAK',
              unitPriceIdr: 10000,
              quantity: 1,
              subtotalIdr: 10000,
            },
          ],
        },
      },
    });

    // Tiket 1: AKTIF
    await prisma.ticket.create({
      data: {
        id: 'ticket-sample-001',
        orderId: order1.id,
        ticketCode: 'SWT-TKT-20261020-9A8B7C',
        tokenSecret: 'tok_sec_9a8b7c6d5e4f3a2b1c',
        siteId: site1.id,
        visitDate: todayStr,
        visitorCategory: 'DEWASA',
        priceIdr: 15000,
        status: 'AKTIF',
      },
    });

    // Tiket 2: SUDAH DIGUNAKAN
    const ticket2 = await prisma.ticket.create({
      data: {
        id: 'ticket-sample-002',
        orderId: order1.id,
        ticketCode: 'SWT-TKT-20261020-1D2E3F',
        tokenSecret: 'tok_sec_1d2e3f4a5b6c7d8e9f',
        siteId: site1.id,
        visitDate: todayStr,
        visitorCategory: 'ANAK',
        priceIdr: 10000,
        status: 'SUDAH_DIGUNAKAN',
        usedAt: new Date(Date.now() - 30 * 60 * 1000),
        usedAtSiteId: site1.id,
        validatedByUserId: userPetugas.id,
      },
    });

    await prisma.visit.create({
      data: {
        ticketId: ticket2.id,
        siteId: site1.id,
        validatedByUserId: userPetugas.id,
        enteredAt: new Date(Date.now() - 30 * 60 * 1000),
      },
    });

    await prisma.validationAttempt.create({
      data: {
        ticketId: ticket2.id,
        ticketCode: ticket2.ticketCode,
        siteId: site1.id,
        validatedByUserId: userPetugas.id,
        result: 'VALID',
        note: 'Tiket berhasil divalidasi di Gate Utama Pantai Pasir Putih',
        scannedAt: new Date(Date.now() - 30 * 60 * 1000),
      },
    });

    // Tiket Menara Siger untuk tes Salah Lokasi
    const order2 = await prisma.order.create({
      data: {
        id: 'order-sample-002',
        orderNumber: 'SWT-20261020-002',
        siteId: site2.id,
        customerName: 'Dewi Lestari',
        customerPhone: '085711223344',
        customerEmail: 'dewi@example.com',
        visitDate: todayStr,
        subtotalIdr: 20000,
        feeIdr: 2000,
        totalIdr: 22000,
        status: 'DIBAYAR',
        paymentMethod: 'EWALLET',
        paymentReference: 'DANA-99283711',
        paidAt: new Date(),
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        orderItems: {
          create: [
            {
              ticketTypeId: 'tt-ms-dewasa',
              visitorCategory: 'DEWASA',
              unitPriceIdr: 10000,
              quantity: 2,
              subtotalIdr: 20000,
            },
          ],
        },
      },
    });

    await prisma.ticket.create({
      data: {
        id: 'ticket-sample-003',
        orderId: order2.id,
        ticketCode: 'SWT-TKT-20261020-SIGER1',
        tokenSecret: 'tok_sec_siger_landmark_1122',
        siteId: site2.id,
        visitDate: todayStr,
        visitorCategory: 'DEWASA',
        priceIdr: 10000,
        status: 'AKTIF',
      },
    });

    // Tiket Kedaluwarsa
    const orderExp = await prisma.order.create({
      data: {
        id: 'order-sample-003',
        orderNumber: 'SWT-20261019-099',
        siteId: site1.id,
        customerName: 'Rian Pratama',
        customerPhone: '081987654321',
        customerEmail: 'rian@example.com',
        visitDate: '2026-10-19',
        subtotalIdr: 15000,
        feeIdr: 2000,
        totalIdr: 17000,
        status: 'DIBAYAR',
        paymentMethod: 'VA',
        paymentReference: 'BL-VA-881923001',
        paidAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        expiresAt: new Date(Date.now() - 23 * 60 * 60 * 1000),
        orderItems: {
          create: [
            {
              ticketTypeId: 'tt-pp-dewasa',
              visitorCategory: 'DEWASA',
              unitPriceIdr: 15000,
              quantity: 1,
              subtotalIdr: 15000,
            },
          ],
        },
      },
    });

    await prisma.ticket.create({
      data: {
        id: 'ticket-sample-004',
        orderId: orderExp.id,
        ticketCode: 'SWT-TKT-20261019-EXPIRE',
        tokenSecret: 'tok_sec_expired_yesterday_99',
        siteId: site1.id,
        visitDate: '2026-10-19',
        visitorCategory: 'DEWASA',
        priceIdr: 15000,
        status: 'KEDALUWARSA',
      },
    });

    // Audit Log Awal
    await prisma.auditLog.create({
      data: {
        userId: userAdmin.id,
        userName: userAdmin.name,
        action: 'SYSTEM_INITIALIZATION',
        entityType: 'TOURISM_SITE',
        entityId: 'ALL',
        details: 'Inisialisasi database PostgreSQL (Neon.tech) dan penetapan tarif dasar Perda No. 1/2024.',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Database PostgreSQL Neon.tech berhasil di-seed dengan 5 destinasi, 3 akun demo, dan tiket awal.',
      counts: {
        destinations: 5,
        users: 3,
        orders: 3,
        tickets: 4,
      },
    });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
