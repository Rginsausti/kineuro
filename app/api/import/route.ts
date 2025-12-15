import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import * as XLSX from "xlsx"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get("file") as File
    
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    const buffer = await file.arrayBuffer()
    const workbook = XLSX.read(buffer, { type: "buffer" })
    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][]

    // Basic parsing logic based on the user's description
    // Assuming Row 0 contains headers (Months)
    // Assuming Column 0 contains Client Name
    
    const headerRow = data[0]
    const monthColumns: { [key: number]: string } = {}
    
    // Identify month columns
    headerRow.forEach((cell, index) => {
      if (typeof cell === "string" && ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"].includes(cell.toUpperCase())) {
        monthColumns[index] = cell.toUpperCase()
      }
    })

    let clientsCreated = 0
    let paymentsCreated = 0

    // Iterate through rows (skipping header)
    for (let i = 1; i < data.length; i++) {
      const row = data[i]
      const clientName = row[0]

      // Skip empty names or footer rows like "ALQUILER"
      if (!clientName || typeof clientName !== "string" || ["ALQUILER", "LUZ", "AGUA", "TOTAL"].includes(clientName.toUpperCase())) {
        continue
      }

      // Create or find client
      let client = await prisma.client.findFirst({ where: { name: clientName } })
      if (!client) {
        client = await prisma.client.create({
          data: { name: clientName }
        })
        clientsCreated++
      }

      // Iterate through month columns to find payments
      for (const [colIndex, monthName] of Object.entries(monthColumns)) {
        const cellValue = row[parseInt(colIndex)]
        if (cellValue) {
          // Parse cell value (e.g. "12/2" or "20000" or both)
          // This is a simplification. We might need more robust parsing.
          // If it's a number, assume amount? Or date serial?
          // If it's a string, try to parse "D/M"
          
          let amount = 0
          let date = new Date() // Default to now, will adjust
          let hasPayment = false

          if (typeof cellValue === "number") {
             // If it's a large number, likely amount. If small, maybe Excel date serial?
             // But usually Excel date serials are > 40000.
             if (cellValue > 1000) {
               amount = cellValue
               hasPayment = true
               // Date? Maybe default to 1st of that month?
               const monthIndex = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"].indexOf(monthName)
               date = new Date(new Date().getFullYear(), monthIndex, 1)
             }
          } else if (typeof cellValue === "string") {
            // Try to match "D/M"
            const dateMatch = cellValue.match(/(\d{1,2})\/(\d{1,2})/)
            if (dateMatch) {
              const day = parseInt(dateMatch[1])
              const month = parseInt(dateMatch[2]) - 1 // JS months are 0-indexed
              date = new Date(new Date().getFullYear(), month, day)
              hasPayment = true
              // Look for amount in the same cell or adjacent?
              // For now, assume a default amount or 0 if not found
              amount = 0 
            }
          }

          if (hasPayment) {
             // Check if payment already exists to avoid duplicates
             const existingPayment = await prisma.payment.findFirst({
               where: {
                 clientId: client.id,
                 date: date,
                 amount: amount
               }
             })

             if (!existingPayment) {
               await prisma.payment.create({
                 data: {
                   clientId: client.id,
                   amount,
                   date,
                   notes: `Imported from ${monthName}`
                 }
               })
               paymentsCreated++
             }
          }
        }
      }
    }

    return NextResponse.json({ message: "Import successful", clientsCreated, paymentsCreated })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Error importing file" }, { status: 500 })
  }
}
