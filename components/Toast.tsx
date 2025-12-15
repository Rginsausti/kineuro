"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { CheckCircle, X, Undo2 } from "lucide-react"

interface ToastProps {
  message: string
  onUndo?: () => void
  duration?: number
  onClose: () => void
}

export default function Toast({ message, onUndo, duration = 5000, onClose }: ToastProps) {
  const [mounted, setMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    setMounted(true)
    // Trigger animation
    setTimeout(() => setIsVisible(true), 10)
    
    // Progress bar
    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100)
      setProgress(remaining)
      
      if (remaining <= 0) {
        clearInterval(interval)
        handleClose()
      }
    }, 50)

    return () => clearInterval(interval)
  }, [duration])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 200)
  }

  const handleUndo = () => {
    if (onUndo) onUndo()
    handleClose()
  }

  if (!mounted) return null

  return createPortal(
    <div
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 99999,
        transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
        opacity: isVisible ? 1 : 0,
        transition: 'all 0.2s ease-out'
      }}
    >
      <div
        style={{
          background: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border-subtle)',
          borderRadius: '12px',
          padding: '1rem',
          minWidth: '300px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Success Icon */}
          <div
            style={{
              width: '2rem',
              height: '2rem',
              borderRadius: '50%',
              background: 'rgba(34, 197, 94, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <CheckCircle style={{ width: '1.25rem', height: '1.25rem', color: 'var(--color-success)' }} />
          </div>

          {/* Message */}
          <div style={{ flex: 1 }}>
            <p style={{ color: 'var(--color-text-primary)', fontSize: '0.875rem', fontWeight: 500 }}>
              {message}
            </p>
          </div>

          {/* Undo Button */}
          {onUndo && (
            <button
              onClick={handleUndo}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                padding: '0.5rem 0.75rem',
                background: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                borderRadius: '8px',
                color: 'var(--color-accent)',
                fontSize: '0.8125rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)'
              }}
            >
              <Undo2 style={{ width: '0.875rem', height: '0.875rem' }} />
              Deshacer
            </button>
          )}

          {/* Close Button */}
          <button
            onClick={handleClose}
            style={{
              padding: '0.25rem',
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text-tertiary)',
              cursor: 'pointer',
              borderRadius: '4px',
              transition: 'color 0.15s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-text-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-tertiary)'}
          >
            <X style={{ width: '1rem', height: '1rem' }} />
          </button>
        </div>

        {/* Progress Bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'var(--color-border-subtle)'
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: 'var(--color-success)',
              transition: 'width 0.05s linear'
            }}
          />
        </div>
      </div>
    </div>,
    document.body
  )
}
