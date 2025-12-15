// Script para crear tablas y usuario admin en Turso
const { createClient } = require('@libsql/client')
const bcrypt = require('bcryptjs')

async function main() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  })

  console.log('Conectando a Turso...')

  // Crear tablas
  console.log('Creando tablas...')
  
  await client.execute(`
    CREATE TABLE IF NOT EXISTS User (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `)

  await client.execute(`
    CREATE TABLE IF NOT EXISTS Client (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      documentNumber TEXT,
      phone TEXT,
      notes TEXT,
      isActive INTEGER DEFAULT 1,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `)

  await client.execute(`
    CREATE TABLE IF NOT EXISTS Payment (
      id TEXT PRIMARY KEY,
      amount REAL NOT NULL,
      date TEXT NOT NULL,
      notes TEXT,
      clientId TEXT NOT NULL,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (clientId) REFERENCES Client(id) ON DELETE CASCADE
    )
  `)

  console.log('Tablas creadas!')

  // Crear usuario admin
  console.log('Creando usuario admin...')
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const id = 'admin-' + Date.now()

  try {
    await client.execute({
      sql: `INSERT INTO User (id, username, password) VALUES (?, ?, ?)`,
      args: [id, 'admin', hashedPassword]
    })
    console.log('Usuario admin creado!')
  } catch (e) {
    if (e.message && e.message.includes('UNIQUE')) {
      console.log('Usuario admin ya existe, actualizando password...')
      await client.execute({
        sql: `UPDATE User SET password = ? WHERE username = ?`,
        args: [hashedPassword, 'admin']
      })
      console.log('Password actualizado!')
    } else {
      throw e
    }
  }

  console.log('¡Base de datos lista!')
}

main().catch(console.error)
