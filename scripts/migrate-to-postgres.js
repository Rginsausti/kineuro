const Database = require('better-sqlite3');
const { PrismaClient } = require('@prisma/client');
const path = require('path');

const prisma = new PrismaClient();
const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
const db = new Database(dbPath);

async function main() {
  console.log('🔄 Iniciando migración de datos...');
  console.log('📖 Leyendo base de datos local (SQLite)...');

  // Leer Clientes
  const clients = db.prepare('SELECT * FROM Client').all();
  console.log(`✅ Encontrados ${clients.length} clientes.`);

  // Leer Pagos
  const payments = db.prepare('SELECT * FROM Payment').all();
  console.log(`✅ Encontrados ${payments.length} pagos.`);

  // Leer Usuarios (opcional, pero puede ser útil si creó otros users)
  const users = db.prepare('SELECT * FROM User WHERE username != "admin"').all();
  if (users.length > 0) {
    console.log(`✅ Encontrados ${users.length} usuarios adicionales.`);
  }

  console.log('\n🚀 Escribiendo en base de datos remota (Postgres)...');

  // Migrar Clientes
  for (const client of clients) {
    try {
      await prisma.client.upsert({
        where: { id: client.id },
        update: {
          name: client.name,
          documentNumber: client.documentNumber,
          phone: client.phone,
          notes: client.notes,
          isActive: client.isActive === 1, // SQLite guarda boolean como 1/0
          createdAt: new Date(client.createdAt),
          updatedAt: new Date(client.updatedAt),
        },
        create: {
          id: client.id,
          name: client.name,
          documentNumber: client.documentNumber,
          phone: client.phone,
          notes: client.notes,
          isActive: client.isActive === 1,
          createdAt: new Date(client.createdAt),
          updatedAt: new Date(client.updatedAt),
        },
      });
      console.log(`  - Cliente migrado: ${client.name}`);
    } catch (e) {
      console.error(`  ❌ Error migrando cliente ${client.name}:`, e.message);
    }
  }

  // Migrar Pagos
  for (const payment of payments) {
    try {
      await prisma.payment.upsert({
        where: { id: payment.id },
        update: {
          amount: payment.amount,
          date: new Date(payment.date),
          notes: payment.notes,
          clientId: payment.clientId,
          createdAt: new Date(payment.createdAt),
          updatedAt: new Date(payment.updatedAt),
        },
        create: {
          id: payment.id,
          amount: payment.amount,
          date: new Date(payment.date),
          notes: payment.notes,
          clientId: payment.clientId,
          createdAt: new Date(payment.createdAt),
          updatedAt: new Date(payment.updatedAt),
        },
      });
    } catch (e) {
      console.error(`  ❌ Error migrando pago ${payment.id}:`, e.message);
    }
  }
  console.log(`  ✅ ${payments.length} pagos procesados.`);

  // Migrar Usuarios adicionales (si hay)
  for (const user of users) {
    try {
      await prisma.user.upsert({
        where: { id: user.id },
        update: {
          username: user.username,
          password: user.password,
          createdAt: new Date(user.createdAt),
          updatedAt: new Date(user.updatedAt),
        },
        create: {
          id: user.id,
          username: user.username,
          password: user.password,
          createdAt: new Date(user.createdAt),
          updatedAt: new Date(user.updatedAt),
        },
      });
      console.log(`  - Usuario migrado: ${user.username}`);
    } catch (e) {
      console.error(`  ❌ Error migrando usuario ${user.username}:`, e.message);
    }
  }

  console.log('\n✨ ¡Migración completada exitosamente!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    db.close();
  });
