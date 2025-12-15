"use client"

import { useState, useEffect, useMemo } from "react"
import Fuse from "fuse.js"
import { ClientWithPayments } from "@/lib/status"
import { Search as SearchIcon, X } from "lucide-react"

interface SearchProps {
  clients: ClientWithPayments[]
  onResults: (results: ClientWithPayments[]) => void
}

export default function Search({ clients, onResults }: SearchProps) {
  const [query, setQuery] = useState("")

  const fuse = useMemo(() => {
    return new Fuse(clients, {
      keys: ["name", "documentNumber"],
      threshold: 0.4,
      ignoreLocation: true,
    })
  }, [clients])

  useEffect(() => {
    if (query.trim() === "") {
      onResults(clients)
    } else {
      const results = fuse.search(query).map((r) => r.item)
      onResults(results)
    }
  }, [query, fuse, clients, onResults])

  const clearSearch = () => {
    setQuery("")
  }

  return (
    <div className="relative">
      {/* Search Icon */}
      <div 
        className="absolute inset-y-0 left-0 flex items-center pointer-events-none"
        style={{ paddingLeft: '1rem' }}
      >
        <SearchIcon 
          className="w-5 h-5"
          style={{ 
            color: query ? 'var(--color-accent)' : 'var(--color-text-tertiary)',
            transition: 'color 0.15s'
          }}
        />
      </div>
      
      {/* Input */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar por nombre o DNI..."
        className="input-modern"
        style={{
          paddingLeft: '3rem',
          paddingRight: '3rem',
          paddingTop: '0.875rem',
          paddingBottom: '0.875rem',
          background: 'var(--color-bg-secondary)',
          borderColor: query ? 'var(--color-accent)' : 'var(--color-border-subtle)'
        }}
      />
      
      {/* Clear Button */}
      {query && (
        <button
          onClick={clearSearch}
          className="absolute inset-y-0 right-0 flex items-center pr-4 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
          aria-label="Limpiar búsqueda"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}
