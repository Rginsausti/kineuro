"use client"

import Link from "next/link"
import logo from '../public/logo.png'
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Home, Users, Upload, LogOut } from "lucide-react"
import { signOut } from "next-auth/react"

export default function Sidebar() {
  const pathname = usePathname()

  const links = [
    { href: "/", label: "Inicio", icon: Home },
    { href: "/clients", label: "Clientes", icon: Users },
    { href: "/import", label: "Importar", icon: Upload },
  ]

  return (
    <aside className="layout-sidebar">
      {/* Logo Section */}
      <div 
        style={{ 
          padding: '1rem',
          borderBottom: '1px solid var(--color-border-subtle)'
        }}
      >
        <div 
          style={{ 
            background: 'white',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Image
            src={logo}
            alt="Kineuro"
            style={{ objectFit: 'contain', width: '100%', height: 'auto' }}
            priority
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3">
        <div className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${isActive ? 'active' : ''}`}
              >
                <Icon className="w-5 h-5" />
                {link.label}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Logout Section */}
      <div className="p-4 border-t">
        <button
          onClick={() => signOut()}
          className="btn-danger w-full flex items-center justify-start gap-3"
        >
          <LogOut className="w-5 h-5" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  )
}
