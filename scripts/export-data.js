// 1. Exportar datos de SQLite a JSON
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

async function main() {
  const prisma = new PrismaClient();
  console.log('📖 Exportando datos de SQLite...');

  const users = await prisma.user.findMany();
  const clients = await prisma.client.findMany();
  const payments = await prisma.payment.findMany();

  const data = { users, clients, payments };
  fs.writeFileSync('data-export.json', JSON.stringify(data, null, 2));

  console.log(`✅ Exportados: ${users.length} usuarios, ${clients.length} clientes, ${payments.length} pagos.`);
}

main()
  .catch(console.error)
  .finally(() => process.exit(0));
