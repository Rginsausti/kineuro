"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children 
}: ModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!isOpen || !mounted) return null

  return createPortal(
    <div 
      style={{ 
        position: 'fixed', 
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '1rem',
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)'
      }}
    >
      {/* Backdrop */}
      <div 
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div 
        className="animate-scale-in"
        style={{ 
          position: 'relative',
          background: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border-subtle)',
          borderRadius: '16px',
          padding: '1.5rem',
          width: '100%',
          maxWidth: '28rem',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              padding: '0.5rem',
              borderRadius: '8px',
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text-tertiary)',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--color-text-primary)'
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--color-text-tertiary)'
              e.currentTarget.style.background = 'transparent'
            }}
          >
            <X style={{ width: '1.25rem', height: '1.25rem' }} />
          </button>
        </div>

        {children}
      </div>
    </div>,
    document.body
  )
}
