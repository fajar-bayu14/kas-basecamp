import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing data...');
  await prisma.cashTransaction.deleteMany();
  await prisma.member.deleteMany();

  console.log('Seeding members...');
  const memberNames = [
    'Budi Santoso',
    'Siti Aminah',
    'Rizky Pratama',
    'Dewi Lestari',
    'Ahmad Fauzi',
    'Putri Wulandari',
    'Hendra Wijaya',
    'Rina Marlina',
    'Dian Sastro',
    'Fajar Nugraha',
    'Bayu Saputra',
    'Anisa Rahma',
  ];

  const members = [];
  for (const name of memberNames) {
    const member = await prisma.member.create({
      data: {
        name,
        phone: '08' + Math.floor(1000000000 + Math.random() * 9000000000).toString().substring(0, 10),
        isActive: true,
      },
    });
    members.push(member);
  }

  console.log(`Seeded ${members.length} members.`);

  // Seed transactions for September 2026
  console.log('Seeding initial transactions for September 2026...');
  const year = 2026;
  const month = 9; // September

  // Week 1 (5 Sept 2026)
  for (let i = 0; i < 10; i++) {
    await prisma.cashTransaction.create({
      data: {
        memberId: members[i].id,
        paymentDate: new Date(2026, 8, 5),
        weekNumber: 1,
        month,
        year,
        amount: 5000,
        notes: 'Iuran Kas W1',
      },
    });
  }

  // Week 2 (12 Sept 2026)
  for (let i = 0; i < 8; i++) {
    await prisma.cashTransaction.create({
      data: {
        memberId: members[i].id,
        paymentDate: new Date(2026, 8, 12),
        weekNumber: 2,
        month,
        year,
        amount: 5000,
        notes: 'Iuran Kas W2',
      },
    });
  }

  // Week 3 (19 Sept 2026)
  for (let i = 0; i < 7; i++) {
    await prisma.cashTransaction.create({
      data: {
        memberId: members[i].id,
        paymentDate: new Date(2026, 8, 19),
        weekNumber: 3,
        month,
        year,
        amount: 5000,
        notes: 'Iuran Kas W3',
      },
    });
  }

  // Week 4 (26 Sept 2026)
  for (let i = 0; i < 5; i++) {
    await prisma.cashTransaction.create({
      data: {
        memberId: members[i].id,
        paymentDate: new Date(2026, 8, 26),
        weekNumber: 4,
        month,
        year,
        amount: 5000,
        notes: 'Iuran Kas W4',
      },
    });
  }

  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
