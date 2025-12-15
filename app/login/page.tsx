"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Lock, User } from "lucide-react"
import Image from "next/image"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    })

    setIsLoading(false)

    if (res?.error) {
      setError("Credenciales inválidas")
    } else {
      router.push("/")
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-mesh relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-96 h-96 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, var(--color-accent) 0%, transparent 70%)',
            top: '-10%',
            right: '-10%',
            animation: 'pulse 4s ease-in-out infinite'
          }}
        />
        <div 
          className="absolute w-64 h-64 rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, var(--color-success) 0%, transparent 70%)',
            bottom: '10%',
            left: '-5%',
            animation: 'pulse 5s ease-in-out infinite 1s'
          }}
        />
      </div>

      {/* Login Card */}
      <div className="glass-card p-8 w-full max-w-md mx-4 animate-scale-in relative">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <Image
            src="/logo.png"
            alt="Kineuro"
            width={180}
            height={50}
            style={{ objectFit: 'contain', margin: '0 auto' }}
            unoptimized
            priority
          />
          <p style={{ color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
            Sistema de Gestión de Cuotas
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Error Message */}
          {error && (
            <div 
              className="animate-shake rounded-lg p-4 flex items-center gap-3"
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: 'var(--color-danger)'
              }}
            >
              <div 
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: 'var(--color-danger)' }}
              />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          {/* Username Field */}
          <div className="space-y-2">
            <label 
              style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}
              htmlFor="username"
            >
              Usuario
            </label>
            <div className="relative">
              <span 
                className="absolute inset-y-0 left-0 flex items-center"
                style={{ paddingLeft: '1rem', color: 'var(--color-text-tertiary)' }}
              >
                <User size={18} />
              </span>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-modern"
                style={{ paddingLeft: '2.75rem' }}
                placeholder="Ingresá tu usuario"
                required
                autoComplete="username"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label 
              style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}
              htmlFor="password"
            >
              Contraseña
            </label>
            <div className="relative">
              <span 
                className="absolute inset-y-0 left-0 flex items-center"
                style={{ paddingLeft: '1rem', color: 'var(--color-text-tertiary)' }}
              >
                <Lock size={18} />
              </span>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-modern"
                style={{ paddingLeft: '2.75rem' }}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full"
            style={{
              padding: '0.875rem',
              fontSize: '1rem',
              marginTop: '0.5rem',
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? (
              <>
                <div 
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  style={{ animation: 'spin 0.8s linear infinite' }}
                />
                Ingresando...
              </>
            ) : (
              'Ingresar'
            )}
          </button>
        </form>

        {/* Footer */}
        <p style={{ textAlign: 'center', color: 'var(--color-text-tertiary)', fontSize: '0.75rem', marginTop: '1.5rem' }}>
          © 2025 Kineuro. Sistema de Gestión de Cuotas.
        </p>
      </div>
    </div>
  )
}
