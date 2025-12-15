"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Client } from "@prisma/client"
import { Loader2 } from "lucide-react"

interface ClientFormProps {
  client?: Client
  onSuccess?: () => void
}

export default function ClientForm({ client, onSuccess }: ClientFormProps) {
  const router = useRouter()
  const [name, setName] = useState(client?.name || "")
  const [documentNumber, setDocumentNumber] = useState(client?.documentNumber || "")
  const [phone, setPhone] = useState(client?.phone || "")
  const [notes, setNotes] = useState(client?.notes || "")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const url = client ? `/api/clients/${client.id}` : "/api/clients"
    const method = client ? "PUT" : "POST"

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, documentNumber, phone, notes }),
      })

      if (res.ok) {
        router.refresh()
        if (onSuccess) onSuccess()
      } else {
        alert("Error al guardar cliente")
      }
    } catch (error) {
      console.error(error)
      alert("Error al guardar cliente")
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    background: 'var(--color-bg-primary)',
    border: '1px solid var(--color-border-subtle)',
    borderRadius: '12px',
    color: 'var(--color-text-primary)',
    padding: '0.875rem 1rem',
    width: '100%',
    fontSize: '1rem',
    transition: 'border-color 0.15s, box-shadow 0.15s',
    outline: 'none'
  }

  const labelStyle = {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: 500,
    color: 'var(--color-text-secondary)',
    marginBottom: '0.5rem'
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name Field */}
      <div>
        <label style={labelStyle}>
          Nombre Completo
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
          placeholder="Juan Pérez"
          required
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

      {/* DNI Field */}
      <div>
        <label style={labelStyle}>
          DNI <span style={{ color: 'var(--color-text-tertiary)' }}>(Opcional)</span>
        </label>
        <input
          type="text"
          value={documentNumber}
          onChange={(e) => setDocumentNumber(e.target.value)}
          style={inputStyle}
          placeholder="12345678"
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

      {/* Phone Field */}
      <div>
        <label style={labelStyle}>
          Teléfono <span style={{ color: 'var(--color-text-tertiary)' }}>(Opcional)</span>
        </label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={inputStyle}
          placeholder="+54 11 1234-5678"
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

      {/* Notes Field */}
      <div>
        <label style={labelStyle}>
          Notas <span style={{ color: 'var(--color-text-tertiary)' }}>(Opcional)</span>
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          style={{
            ...inputStyle,
            minHeight: '100px',
            resize: 'vertical'
          }}
          placeholder="Notas adicionales..."
          rows={3}
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

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full"
        style={{
          width: '100%',
          padding: '0.875rem 1.5rem',
          marginTop: '0.5rem',
          opacity: loading ? 0.7 : 1,
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? (
          <>
            <Loader2 style={{ width: '1rem', height: '1rem', animation: 'spin 0.8s linear infinite' }} />
            Guardando...
          </>
        ) : (
          'Guardar'
        )}
      </button>
    </form>
  )
}
