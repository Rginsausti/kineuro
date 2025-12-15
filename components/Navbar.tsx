"use client"

import { Menu, X, Home, Users, Upload, LogOut } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const links = [
    { href: "/", label: "Inicio", icon: Home },
    { href: "/clients", label: "Clientes", icon: Users },
    { href: "/import", label: "Importar", icon: Upload },
  ]

  return (
    <nav 
      className="sticky top-0 z-50"
      style={{ 
        background: 'var(--color-bg-secondary)',
        borderBottom: '1px solid var(--color-border-subtle)',
        display: 'block'
      }}
    >
      {/* Only show on mobile */}
      <div className="md:hidden">
        {/* Header */}
        <div className="px-4 py-3 flex justify-between items-center">
          <div 
            style={{ 
              background: 'white',
              borderRadius: '6px',
              padding: '0.375rem 0.5rem',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Image
              src={logo}
              alt="Kineuro"
              style={{ objectFit: 'contain', width: 'auto', height: '26px' }}
              priority
            />
          </div>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg transition-colors"
            style={{ 
              color: 'var(--color-text-secondary)',
              background: isOpen ? 'rgba(255,255,255,0.06)' : 'transparent'
            }}
            aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <div 
            className="px-3 py-3 space-y-1 animate-slide-up"
            style={{ borderTop: '1px solid var(--color-border-subtle)' }}
          >
            {links.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  {link.label}
                </Link>
              )
            })}
            
            <button
              onClick={() => signOut()}
              className="nav-link w-full"
              style={{ color: 'var(--color-danger)' }}
            >
              <LogOut className="w-5 h-5" />
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>
      
      {/* Hidden on desktop */}
      <style jsx>{`
        @media (min-width: 768px) {
          nav {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  )
}
