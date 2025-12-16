// 2. Importar datos de JSON a Postgres
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

async function main() {
  const prisma = new PrismaClient();
  const data = JSON.parse(fs.readFileSync('data-export.json', 'utf8'));

  console.log('🚀 Importando datos a Postgres...');

  // Importar Clientes
  for (const client of data.clients) {
    try {
      await prisma.client.upsert({
        where: { id: client.id },
        update: { ...client },
        create: { ...client },
      });
      console.log(`  - Cliente importado: ${client.name}`);
    } catch (e) {
      console.error(`  ❌ Error cliente ${client.name}:`, e.message);
    }
  }

  // Importar Pagos
  for (const payment of data.payments) {
    try {
      await prisma.payment.upsert({
        where: { id: payment.id },
        update: { ...payment },
        create: { ...payment },
      });
    } catch (e) {
      console.error(`  ❌ Error pago ${payment.id}:`, e.message);
    }
  }
  console.log(`  ✅ ${data.payments.length} pagos procesados.`);

  // Importar Usuarios (evitando duplicar admin si ya existe)
  for (const user of data.users) {
    if (user.username === 'admin') continue; // Ya lo creamos antes
    try {
      await prisma.user.upsert({
        where: { id: user.id },
        update: { ...user },
        create: { ...user },
      });
      console.log(`  - Usuario importado: ${user.username}`);
    } catch (e) {
      console.error(`  ❌ Error usuario ${user.username}:`, e.message);
    }
  }

  console.log('✨ ¡Importación finalizada!');
}

main()
  .catch(console.error)
  .finally(() => process.exit(0));
