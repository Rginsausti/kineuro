"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { X, DollarSign, Loader2, AlertTriangle, CheckCircle } from "lucide-react"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  clientName: string
  clientId: string
  clientStatus: "Active" | "Expired" | "New"
  lastPaymentId?: string
  lastAmount?: number
  onPaymentAdded: (paymentId: string) => void
  onPaymentRemoved: () => void
}

export default function PaymentModal({ 
  isOpen, 
  onClose, 
  clientName, 
  clientId,
  clientStatus,
  lastPaymentId,
  lastAmount,
  onPaymentAdded,
  onPaymentRemoved
}: PaymentModalProps) {
  const [mounted, setMounted] = useState(false)
  const [amount, setAmount] = useState(lastAmount?.toString() || "")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen && lastAmount) {
      setAmount(lastAmount.toString())
    }
  }, [isOpen, lastAmount])

  // Si el cliente está "Al día", mostramos opción de eliminar último pago
  const isActiveClient = clientStatus === "Active"

  const handleAddPayment = async () => {
    if (!amount || parseFloat(amount) <= 0) return

    setLoading(true)
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          amount: parseFloat(amount),
          date: new Date().toISOString(),
        }),
      })

      if (res.ok) {
        const payment = await res.json()
        onPaymentAdded(payment.id)
        onClose()
        setAmount("")
      } else {
        alert("Error al registrar pago")
      }
    } catch (error) {
      console.error(error)
      alert("Error al registrar pago")
    } finally {
      setLoading(false)
    }
  }

  const handleRemovePayment = async () => {
    if (!lastPaymentId) return

    setLoading(true)
    try {
      const res = await fetch(`/api/payments/${lastPaymentId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        onPaymentRemoved()
        onClose()
      } else {
        alert("Error al eliminar pago")
      }
    } catch (error) {
      console.error(error)
      alert("Error al eliminar pago")
    } finally {
      setLoading(false)
    }
  }

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

      {/* Modal */}
      <div
        className="animate-scale-in"
        style={{
          position: 'relative',
          background: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border-subtle)',
          borderRadius: '16px',
          padding: '1.5rem',
          width: '100%',
          maxWidth: '24rem'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
            {isActiveClient ? "Marcar Deuda" : "Registrar Pago"}
          </h2>
          <button
            onClick={onClose}
            style={{
              padding: '0.5rem',
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text-tertiary)',
              cursor: 'pointer',
              borderRadius: '8px',
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

        {/* Client Info */}
        <div 
          style={{ 
            padding: '1rem', 
            borderRadius: '12px',
            marginBottom: '1.5rem',
            background: isActiveClient ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            border: `1px solid ${isActiveClient ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isActiveClient ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'
              }}
            >
              {isActiveClient ? (
                <CheckCircle style={{ width: '1.25rem', height: '1.25rem', color: 'var(--color-success)' }} />
              ) : (
                <AlertTriangle style={{ width: '1.25rem', height: '1.25rem', color: 'var(--color-danger)' }} />
              )}
            </div>
            <div>
              <p style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{clientName}</p>
              <p style={{ fontSize: '0.75rem', color: isActiveClient ? 'var(--color-success)' : 'var(--color-danger)' }}>
                {isActiveClient ? "Al día" : clientStatus === "New" ? "Nuevo cliente" : "Cuota vencida"}
              </p>
            </div>
          </div>
        </div>

        {isActiveClient ? (
          // Remove payment UI
          <>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              ¿Querés eliminar el último pago de <strong style={{ color: 'var(--color-text-primary)' }}>${lastAmount?.toLocaleString('es-AR', { maximumFractionDigits: 0 })}</strong> y marcar al cliente como deudor?
            </p>
            
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
                style={{ flex: 1 }}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleRemovePayment}
                disabled={loading || !lastPaymentId}
                style={{
                  flex: 1,
                  padding: '0.75rem 1.5rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(239, 68, 68, 0.5)',
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: 'var(--color-danger)',
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.5 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.15s'
                }}
                onMouseEnter={(e) => {
                  if (!loading) e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'
                }}
              >
                {loading ? (
                  <>
                    <Loader2 style={{ width: '1rem', height: '1rem', animation: 'spin 0.8s linear infinite' }} />
                    Eliminando...
                  </>
                ) : (
                  'Marcar Deuda'
                )}
              </button>
            </div>
          </>
        ) : (
          // Add payment UI
          <>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
                Monto del pago
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)' }}>
                  <DollarSign style={{ width: '1.25rem', height: '1.25rem' }} />
                </span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="5000"
                  min="0"
                  step="1"
                  style={{
                    width: '100%',
                    paddingLeft: '3rem',
                    paddingRight: '1rem',
                    paddingTop: '0.875rem',
                    paddingBottom: '0.875rem',
                    background: 'var(--color-bg-primary)',
                    border: '1px solid var(--color-border-subtle)',
                    borderRadius: '12px',
                    color: 'var(--color-text-primary)',
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    outline: 'none',
                    transition: 'border-color 0.15s, box-shadow 0.15s'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--color-accent)'
                    e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.3)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--color-border-subtle)'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
                style={{ flex: 1 }}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleAddPayment}
                disabled={loading || !amount}
                className="btn-primary"
                style={{
                  flex: 1,
                  opacity: loading || !amount ? 0.5 : 1,
                  cursor: loading || !amount ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? (
                  <>
                    <Loader2 style={{ width: '1rem', height: '1rem', animation: 'spin 0.8s linear infinite' }} />
                    Guardando...
                  </>
                ) : (
                  'Confirmar Pago'
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  )
}
