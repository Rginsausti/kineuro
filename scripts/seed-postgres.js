// Script para crear usuario admin en PostgreSQL
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

async function main() {
  const prisma = new PrismaClient()

  console.log('Conectando a PostgreSQL...')

  // Crear usuario admin
  console.log('Creando usuario admin...')
  const hashedPassword = await bcrypt.hash('admin123', 10)

  try {
    const user = await prisma.user.upsert({
      where: { username: 'admin' },
      update: { password: hashedPassword },
      create: {
        username: 'admin',
        password: hashedPassword,
      },
    })
    console.log('Usuario admin creado/actualizado:', user.id)
  } catch (e) {
    console.error('Error:', e)
  }

  await prisma.$disconnect()
  console.log('¡Base de datos lista!')
}

main().catch(console.error)
