"use client"

import { useState } from "react"
import { Upload, CheckCircle, AlertCircle, FileSpreadsheet, Loader2, Users, CreditCard } from "lucide-react"

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [result, setResult] = useState<{ message?: string; error?: string; clientsCreated?: number; paymentsCreated?: number } | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setResult(null)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
      setResult(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/import", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      setResult(data)
    } catch (error) {
      setResult({ error: "Error al subir el archivo" })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="animate-slide-up">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
          Importar Datos
        </h1>
        <p className="text-[var(--text-secondary)]">
          Cargá un archivo Excel con los datos de clientes y pagos
        </p>
      </div>
      
      {/* Upload Card */}
      <div 
        className="glass-card p-6 animate-slide-up"
        style={{ animationDelay: '50ms' }}
      >
        {/* Dropzone */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
            Archivo Excel (.xlsx)
          </label>
          <label 
            className={`flex flex-col items-center justify-center w-full h-52 rounded-xl cursor-pointer transition-all ${
              isDragging ? 'border-[var(--accent-primary)]' : ''
            }`}
            style={{
              background: isDragging ? 'rgba(99, 102, 241, 0.1)' : 'var(--bg-secondary)',
              border: `2px dashed ${isDragging ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
            }}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center py-6">
              <div 
                className="p-4 rounded-2xl mb-4 transition-all"
                style={{
                  background: isDragging ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.1)',
                }}
              >
                {file ? (
                  <FileSpreadsheet className="w-10 h-10" style={{ color: 'var(--status-success)' }} />
                ) : (
                  <Upload className="w-10 h-10" style={{ color: 'var(--accent-primary)' }} />
                )}
              </div>
              
              {file ? (
                <>
                  <p className="text-[var(--text-primary)] font-medium mb-1">
                    {file.name}
                  </p>
                  <p className="text-xs text-[var(--text-tertiary)]">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm text-[var(--text-secondary)] mb-1">
                    <span className="text-[var(--accent-primary)] font-medium">Click para subir</span>
                    {' '}o arrastrá y soltá
                  </p>
                  <p className="text-xs text-[var(--text-tertiary)]">
                    XLSX, XLS
                  </p>
                </>
              )}
            </div>
            <input 
              type="file" 
              className="hidden" 
              accept=".xlsx, .xls" 
              onChange={handleFileChange} 
            />
          </label>
        </div>

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="btn-primary w-full py-3"
          style={{
            opacity: (!file || uploading) ? 0.5 : 1,
            cursor: (!file || uploading) ? 'not-allowed' : 'pointer'
          }}
        >
          {uploading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Procesando...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              Importar
            </>
          )}
        </button>

        {/* Result */}
        {result && (
          <div 
            className={`mt-6 p-5 rounded-xl animate-scale-in ${
              result.error ? 'status-expired' : 'status-active'
            }`}
            style={{
              background: result.error ? 'var(--status-danger-bg)' : 'var(--status-success-bg)',
              border: `1px solid ${result.error ? 'var(--status-danger-border)' : 'var(--status-success-border)'}`
            }}
          >
            <div className="flex items-start gap-4">
              <div 
                className="p-2 rounded-lg"
                style={{
                  background: result.error ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)'
                }}
              >
                {result.error ? (
                  <AlertCircle className="w-5 h-5" style={{ color: 'var(--status-danger)' }} />
                ) : (
                  <CheckCircle className="w-5 h-5" style={{ color: 'var(--status-success)' }} />
                )}
              </div>
              
              <div className="flex-1">
                <h3 
                  className="font-semibold mb-2"
                  style={{ color: result.error ? 'var(--status-danger)' : 'var(--status-success)' }}
                >
                  {result.error ? "Error en la Importación" : "Importación Exitosa"}
                </h3>
                
                {result.error ? (
                  <p className="text-sm text-[var(--text-secondary)]">{result.error}</p>
                ) : (
                  <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[var(--text-secondary)]" />
                      <span className="text-sm text-[var(--text-secondary)]">
                        <span className="font-semibold text-[var(--text-primary)]">{result.clientsCreated}</span> clientes
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[var(--text-secondary)]" />
                      <span className="text-sm text-[var(--text-secondary)]">
                        <span className="font-semibold text-[var(--text-primary)]">{result.paymentsCreated}</span> pagos
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Help Text */}
      <div 
        className="glass-card p-4 animate-slide-up"
        style={{ animationDelay: '100ms' }}
      >
        <h3 className="text-sm font-medium text-[var(--text-primary)] mb-2">
          Formato esperado
        </h3>
        <p className="text-xs text-[var(--text-secondary)]">
          El archivo debe tener los clientes en filas y los meses en columnas. 
          Cada celda debe contener la fecha y monto del pago en formato "DD/MM - $MONTO".
        </p>
      </div>
    </div>
  )
}
