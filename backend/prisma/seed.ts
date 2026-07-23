import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  try {
    // Create Outlets
    const outlet1 = await prisma.outlet.create({
      data: {
        name: 'Outlet Pusat',
        address: 'Jalan Merdeka No. 1',
        phone: '081234567890',
        email: 'pusat@thenai.com',
        city: 'Jakarta',
        province: 'DKI Jakarta',
        postalCode: '12345',
        owner: 'TheNAI',
        licenseNumber: 'LIC-001',
      },
    });

    console.log('✅ Outlet created');

    // Create Users
    const admin = await prisma.user.create({
      data: {
        email: 'admin@thenai.com',
        username: 'admin',
        passwordHash: await bcrypt.hash('Admin@123456', 10),
        fullName: 'Administrator',
        role: 'ADMIN',
        outletId: outlet1.id,
      },
    });

    const manajer = await prisma.user.create({
      data: {
        email: 'manajer@thenai.com',
        username: 'manajer',
        passwordHash: await bcrypt.hash('Manajer@123456', 10),
        fullName: 'Manajer Toko',
        role: 'MANAJER',
        outletId: outlet1.id,
      },
    });

    const kasir = await prisma.user.create({
      data: {
        email: 'kasir@thenai.com',
        username: 'kasir',
        passwordHash: await bcrypt.hash('Kasir@123456', 10),
        fullName: 'Kasir 1',
        role: 'KASIR',
        outletId: outlet1.id,
      },
    });

    console.log('✅ Users created');

    // Create Categories
    const categories = await Promise.all([
      prisma.category.create({
        data: {
          name: 'Minuman',
          description: 'Kategori minuman',
        },
      }),
      prisma.category.create({
        data: {
          name: 'Makanan',
          description: 'Kategori makanan',
        },
      }),
      prisma.category.create({
        data: {
          name: 'Snack',
          description: 'Kategori snack',
        },
      }),
    ]);

    console.log('✅ Categories created');

    // Create Products
    const products = await Promise.all([
      prisma.product.create({
        data: {
          barcode: '8992000001234',
          name: 'Kopi Arabika',
          categoryId: categories[0].id,
          cost: '5000',
          price: '15000',
          unit: 'cup',
        },
      }),
      prisma.product.create({
        data: {
          barcode: '8992000001235',
          name: 'Teh Tarik',
          categoryId: categories[0].id,
          cost: '3000',
          price: '10000',
          unit: 'cup',
        },
      }),
      prisma.product.create({
        data: {
          barcode: '8992000001236',
          name: 'Nasi Goreng',
          categoryId: categories[1].id,
          cost: '8000',
          price: '25000',
          unit: 'pcs',
        },
      }),
      prisma.product.create({
        data: {
          barcode: '8992000001237',
          name: 'Roti Bakar',
          categoryId: categories[1].id,
          cost: '4000',
          price: '12000',
          unit: 'pcs',
        },
      }),
    ]);

    console.log('✅ Products created');

    // Create Product Stocks
    await Promise.all(
      products.map((product) =>
        prisma.productStock.create({
          data: {
            productId: product.id,
            outletId: outlet1.id,
            quantity: 100,
            minStock: 10,
          },
        })
      )
    );

    console.log('✅ Product stocks created');

    // Create Supplier
    const supplier = await prisma.supplier.create({
      data: {
        name: 'Supplier Utama',
        phone: '082345678901',
        email: 'supplier@example.com',
        address: 'Jalan Perdagangan No. 10',
        city: 'Bandung',
        contactPerson: 'Budi',
      },
    });

    console.log('✅ Supplier created');

    // Create Tax
    await prisma.tax.create({
      data: {
        name: 'PPN',
        percentage: '10',
      },
    });

    console.log('✅ Tax created');

    console.log('\n✨ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
