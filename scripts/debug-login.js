// Script para debuggear login
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

async function main() {
  const prisma = new PrismaClient()

  console.log('Conectando a DB...')
  
  const user = await prisma.user.findUnique({
    where: { username: 'admin' }
  })

  if (!user) {
    console.log('❌ Usuario admin NO encontrado')
    return
  }

  console.log('✅ Usuario admin encontrado:', user.id)
  console.log('Hash en DB:', user.password)

  const isValid = await bcrypt.compare('admin123', user.password)
  console.log('¿Password "admin123" es válido?:', isValid ? '✅ SÍ' : '❌ NO')

  if (!isValid) {
    console.log('🔄 Actualizando password...')
    const newHash = await bcrypt.hash('admin123', 10)
    await prisma.user.update({
      where: { username: 'admin' },
      data: { password: newHash }
    })
    console.log('✅ Password actualizado a "admin123"')
    
    // Verificar de nuevo
    const userUpdated = await prisma.user.findUnique({ where: { username: 'admin' } })
    const isNowValid = await bcrypt.compare('admin123', userUpdated.password)
    console.log('¿Password válido ahora?:', isNowValid ? '✅ SÍ' : '❌ NO')
  }
}

main()
  .catch(console.error)
  .finally(() => process.exit(0))
