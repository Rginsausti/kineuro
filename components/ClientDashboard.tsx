"use client"

import { useState, useMemo } from "react"
import { ClientWithPayments, getClientStatus } from "@/lib/status"
import Search from "./Search"
import ClientList from "./ClientList"
import { Users, UserCheck, UserX, TrendingUp } from "lucide-react"

interface ClientDashboardProps {
  initialClients: ClientWithPayments[]
}

export default function ClientDashboard({ initialClients }: ClientDashboardProps) {
  const [filteredClients, setFilteredClients] = useState<ClientWithPayments[]>(initialClients)

  const stats = useMemo(() => {
    const total = initialClients.length
    const active = initialClients.filter(c => getClientStatus(c).status === "Active").length
    const expired = total - active
    const percentage = total > 0 ? Math.round((active / total) * 100) : 0
    
    return { total, active, expired, percentage }
  }, [initialClients])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-slide-up">
        <h1 className="text-3xl font-bold text-primary mb-2">
          Panel de Control
        </h1>
        <p className="text-secondary">
          Gestión de vencimientos y estado de clientes
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid-stats animate-slide-up">
        {/* Total Clients */}
        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <div 
              className="p-2 rounded-lg"
              style={{ background: 'rgba(99, 102, 241, 0.1)' }}
            >
              <Users className="w-5 h-5" style={{ color: 'var(--color-accent)' }} />
            </div>
          </div>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Clientes</div>
        </div>

        {/* Active Clients */}
        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <div 
              className="p-2 rounded-lg"
              style={{ background: 'rgba(34, 197, 94, 0.1)' }}
            >
              <UserCheck className="w-5 h-5" style={{ color: 'var(--color-success)' }} />
            </div>
          </div>
          <div className="stat-value" style={{ color: 'var(--color-success)' }}>
            {stats.active}
          </div>
          <div className="stat-label">Al Día</div>
        </div>

        {/* Expired Clients */}
        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <div 
              className="p-2 rounded-lg"
              style={{ background: 'rgba(239, 68, 68, 0.1)' }}
            >
              <UserX className="w-5 h-5" style={{ color: 'var(--color-danger)' }} />
            </div>
          </div>
          <div className="stat-value" style={{ color: 'var(--color-danger)' }}>
            {stats.expired}
          </div>
          <div className="stat-label">Vencidos</div>
        </div>

        {/* Percentage */}
        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <div 
              className="p-2 rounded-lg"
              style={{ background: 'rgba(245, 158, 11, 0.1)' }}
            >
              <TrendingUp className="w-5 h-5" style={{ color: 'var(--color-warning)' }} />
            </div>
          </div>
          <div className="stat-value">{stats.percentage}%</div>
          <div className="stat-label">Cobrabilidad</div>
        </div>
      </div>

      {/* Search */}
      <div className="animate-slide-up">
        <Search clients={initialClients} onResults={setFilteredClients} />
      </div>
      
      {/* Client List */}
      <div className="animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-primary">
            Clientes
          </h2>
          <span className="text-sm text-secondary">
            Mostrando {filteredClients.length} de {initialClients.length}
          </span>
        </div>
        <ClientList clients={filteredClients} />
      </div>
    </div>
  )
}
