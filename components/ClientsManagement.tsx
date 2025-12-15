"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { Client } from "@prisma/client"
import { Plus, Edit, Trash2, X, Users } from "lucide-react"
import ClientForm from "@/components/ClientForm"
import { useRouter } from "next/navigation"

interface ClientsPageProps {
  clients: Client[]
}

// Modal component using Portal
function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children 
}: { 
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode 
}) {
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

export default function ClientsManagement({ clients }: ClientsPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | undefined>(undefined)
  const router = useRouter()

  const handleEdit = (client: Client) => {
    setEditingClient(client)
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setEditingClient(undefined)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este cliente?")) {
      await fetch(`/api/clients/${id}`, { method: "DELETE" })
      router.refresh()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-slide-up">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>
              Gestión de Clientes
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
              {clients.length} clientes registrados
            </p>
          </div>
          <button onClick={handleAdd} className="btn-primary">
            <Plus style={{ width: '1.25rem', height: '1.25rem' }} />
            Nuevo Cliente
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card animate-slide-up" style={{ overflow: 'hidden' }}>
        {clients.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
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
              <Users style={{ width: '2rem', height: '2rem', color: 'var(--color-text-tertiary)' }} />
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>
              Sin clientes
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
              Agregá tu primer cliente para comenzar
            </p>
            <button onClick={handleAdd} className="btn-primary">
              <Plus style={{ width: '1.25rem', height: '1.25rem' }} />
              Agregar Cliente
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Nombre
                  </th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    DNI
                  </th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Teléfono
                  </th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client, index) => (
                  <tr 
                    key={client.id}
                    className="stagger-item"
                    style={{ 
                      borderBottom: '1px solid var(--color-border-subtle)',
                      animationDelay: `${index * 30}ms`,
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div 
                          style={{
                            width: '2rem',
                            height: '2rem',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            background: 'rgba(99, 102, 241, 0.1)',
                            color: 'var(--color-accent)'
                          }}
                        >
                          {client.name.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>
                          {client.name}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                      {client.documentNumber || "-"}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                      {client.phone || "-"}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button 
                          onClick={() => handleEdit(client)} 
                          style={{
                            padding: '0.5rem',
                            borderRadius: '8px',
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--color-text-secondary)',
                            cursor: 'pointer',
                            transition: 'all 0.15s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = 'var(--color-accent)'
                            e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = 'var(--color-text-secondary)'
                            e.currentTarget.style.background = 'transparent'
                          }}
                          title="Editar"
                        >
                          <Edit style={{ width: '1rem', height: '1rem' }} />
                        </button>
                        <button 
                          onClick={() => handleDelete(client.id)} 
                          style={{
                            padding: '0.5rem',
                            borderRadius: '8px',
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--color-text-secondary)',
                            cursor: 'pointer',
                            transition: 'all 0.15s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = 'var(--color-danger)'
                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = 'var(--color-text-secondary)'
                            e.currentTarget.style.background = 'transparent'
                          }}
                          title="Eliminar"
                        >
                          <Trash2 style={{ width: '1rem', height: '1rem' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal with Portal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingClient ? "Editar Cliente" : "Nuevo Cliente"}
      >
        <ClientForm
          client={editingClient}
          onSuccess={() => setIsModalOpen(false)}
        />
        <button
          onClick={() => setIsModalOpen(false)}
          className="btn-secondary"
          style={{ width: '100%', marginTop: '0.75rem' }}
        >
          Cancelar
        </button>
      </Modal>
    </div>
  )
}
