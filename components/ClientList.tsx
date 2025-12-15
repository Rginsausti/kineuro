"use client"

import { useState } from "react"
import { ClientWithPayments, getClientStatus } from "@/lib/status"
import { CheckCircle, AlertCircle, Clock, User, Plus, Minus } from "lucide-react"
import PaymentModal from "./PaymentModal"
import Toast from "./Toast"
import { useRouter } from "next/navigation"

interface ClientListProps {
  clients: ClientWithPayments[]
}

export default function ClientList({ clients }: ClientListProps) {
  const router = useRouter()
  const [selectedClient, setSelectedClient] = useState<ClientWithPayments | null>(null)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [toast, setToast] = useState<{ message: string; paymentId?: string; action: 'added' | 'removed' } | null>(null)

  const handleCardClick = (client: ClientWithPayments) => {
    setSelectedClient(client)
    setIsPaymentModalOpen(true)
  }

  const handlePaymentAdded = (paymentId: string) => {
    router.refresh()
    setToast({
      message: `Pago registrado para ${selectedClient?.name}`,
      paymentId,
      action: 'added'
    })
  }

  const handlePaymentRemoved = () => {
    router.refresh()
    setToast({
      message: `Deuda marcada para ${selectedClient?.name}`,
      action: 'removed'
    })
  }

  const handleUndo = async () => {
    if (!toast) return

    try {
      if (toast.action === 'added' && toast.paymentId) {
        // Undo payment: delete it
        await fetch(`/api/payments/${toast.paymentId}`, { method: "DELETE" })
      } else if (toast.action === 'removed' && selectedClient) {
        // Undo removal: re-add the payment (we'd need more info, skip for simplicity)
        // For now, just refresh
      }
      router.refresh()
    } catch (error) {
      console.error("Error undoing:", error)
    }
    setToast(null)
  }

  const getLastPayment = (client: ClientWithPayments) => {
    if (!client.payments || client.payments.length === 0) return { id: undefined, amount: undefined }
    const sorted = [...client.payments].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    return { id: sorted[0].id, amount: sorted[0].amount }
  }

  if (clients.length === 0) {
    return (
      <div className="glass-card animate-fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
        <div 
          style={{ 
            width: '4rem', 
            height: '4rem', 
            margin: '0 auto 1rem',
            borderRadius: '50%',
            background: 'var(--color-bg-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <User style={{ width: '2rem', height: '2rem', color: 'var(--color-text-tertiary)' }} />
        </div>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>
          No se encontraron clientes
        </h3>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
          Agregá clientes o ajustá tu búsqueda
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid-clients">
        {clients.map((client, index) => {
          const { status, dueDate, daysOverdue } = getClientStatus(client)
          const isActive = status === "Active"
          const isNew = status === "New"
          const lastPayment = getLastPayment(client)
          
          return (
            <div
              key={client.id}
              onClick={() => handleCardClick(client)}
              className={`glass-card glass-card-hover stagger-item ${
                isNew ? '' : isActive ? 'status-active' : 'status-expired'
              }`}
              style={{ 
                padding: '1.25rem',
                animationDelay: `${index * 50}ms`,
                position: 'relative',
                cursor: 'pointer'
              }}
            >
              {/* Action Button */}
              <div
                style={{
                  position: 'absolute',
                  top: '0.75rem',
                  right: '0.75rem',
                  padding: '0.375rem',
                  background: isActive ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                  border: `1px solid ${isActive ? 'rgba(239, 68, 68, 0.3)' : 'rgba(34, 197, 94, 0.3)'}`,
                  borderRadius: '8px',
                  color: isActive ? 'var(--color-danger)' : 'var(--color-success)',
                  transition: 'all 0.15s'
                }}
                title={isActive ? "Marcar deuda" : "Registrar pago"}
              >
                {isActive ? (
                  <Minus style={{ width: '1rem', height: '1rem' }} />
                ) : (
                  <Plus style={{ width: '1rem', height: '1rem' }} />
                )}
              </div>

              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'start', marginBottom: '1rem', paddingRight: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div 
                    style={{
                      width: '2.5rem',
                      height: '2.5rem',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      background: isNew 
                        ? 'rgba(99, 102, 241, 0.1)'
                        : isActive 
                        ? 'rgba(34, 197, 94, 0.1)' 
                        : 'rgba(239, 68, 68, 0.1)',
                      color: isNew
                        ? 'var(--color-accent)'
                        : isActive 
                        ? 'var(--color-success)' 
                        : 'var(--color-danger)',
                      border: `1px solid ${isNew 
                        ? 'rgba(99, 102, 241, 0.3)'
                        : isActive ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                    }}
                  >
                    {client.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 600, color: 'var(--color-text-primary)', lineHeight: 1.3 }}>
                      {client.name}
                    </h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
                      DNI: {client.documentNumber || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span 
                  className="badge"
                  style={{
                    background: isNew 
                      ? 'rgba(99, 102, 241, 0.1)'
                      : isActive 
                      ? 'rgba(34, 197, 94, 0.1)' 
                      : 'rgba(239, 68, 68, 0.1)',
                    color: isNew
                      ? 'var(--color-accent)'
                      : isActive 
                      ? 'var(--color-success)' 
                      : 'var(--color-danger)',
                    border: `1px solid ${isNew
                      ? 'rgba(99, 102, 241, 0.3)'
                      : isActive ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                  }}
                >
                  <span 
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: isNew 
                        ? 'var(--color-accent)'
                        : isActive ? 'var(--color-success)' : 'var(--color-danger)'
                    }}
                  />
                  {isNew ? "Nuevo" : isActive ? "Al día" : "Vencido"}
                </span>
                
                {dueDate && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                    <Clock style={{ width: '0.75rem', height: '0.75rem' }} />
                    <span>{dueDate.toLocaleDateString('es-AR')}</span>
                  </div>
                )}
              </div>

              {/* Days Overdue */}
              {!isActive && !isNew && daysOverdue > 0 && (
                <div 
                  style={{ 
                    marginTop: '0.75rem',
                    paddingTop: '0.75rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    borderTop: '1px solid var(--color-border-subtle)',
                    color: 'var(--color-danger)'
                  }}
                >
                  <AlertCircle style={{ width: '1rem', height: '1rem' }} />
                  {daysOverdue} días de atraso
                </div>
              )}

              {/* Last Payment */}
              {lastPayment.amount && (
                <div 
                  style={{ 
                    marginTop: '0.75rem',
                    paddingTop: '0.75rem',
                    fontSize: '0.75rem',
                    color: 'var(--color-text-tertiary)',
                    borderTop: '1px solid var(--color-border-subtle)'
                  }}
                >
                  Último pago: ${lastPayment.amount?.toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Payment Modal */}
      {selectedClient && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false)
            setSelectedClient(null)
          }}
          clientName={selectedClient.name}
          clientId={selectedClient.id}
          clientStatus={getClientStatus(selectedClient).status as "Active" | "Expired" | "New"}
          lastPaymentId={getLastPayment(selectedClient).id}
          lastAmount={getLastPayment(selectedClient).amount}
          onPaymentAdded={handlePaymentAdded}
          onPaymentRemoved={handlePaymentRemoved}
        />
      )}

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          onUndo={toast.action === 'added' ? handleUndo : undefined}
          onClose={() => setToast(null)}
          duration={5000}
        />
      )}
    </>
  )
}
