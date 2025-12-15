# 🏋️ Kineuro

Sistema de gestión de cuotas para gimnasios y centros de fitness.

![Kineuro Dashboard](https://via.placeholder.com/800x450?text=Kineuro+Dashboard)

## ✨ Features

- 📊 **Dashboard** con estadísticas en tiempo real
- 👥 **Gestión de clientes** con búsqueda fuzzy
- 💰 **Control de pagos** con un click
- 📁 **Importación masiva** desde Excel
- 🔐 **Autenticación** segura con NextAuth

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 + React 19 + TypeScript
- **Styling**: Tailwind CSS v4 + Custom Design System
- **Database**: SQLite (dev) / PostgreSQL (prod)
- **Auth**: NextAuth.js
- **ORM**: Prisma

## 🚀 Getting Started

```bash
# Clonar repo
git clone https://github.com/tu-usuario/kineuro.git
cd kineuro

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env

# Inicializar base de datos
npx prisma generate
npx prisma db push
npx prisma db seed

# Iniciar desarrollo
pnpm dev
```

## 📝 Credenciales por defecto

- **Usuario**: `admin`
- **Contraseña**: `admin123`

## 🌐 Deploy

Ver [guía de deploy en Vercel](./docs/vercel-deploy.md)

## 📄 License

MIT
