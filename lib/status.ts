import { Client, Payment } from "@prisma/client"

export type ClientWithPayments = Client & {
  payments: Payment[]
}

export function getClientStatus(client: ClientWithPayments) {
  if (!client.payments || client.payments.length === 0) {
    return { status: "New", dueDate: null, daysOverdue: 0 }
  }

  // Sort payments by date ascending to find the first one
  const sortedPayments = [...client.payments].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  const firstPayment = sortedPayments[0]
  const lastPayment = sortedPayments[sortedPayments.length - 1]

  const dueDay = new Date(firstPayment.date).getDate()
  const today = new Date()
  
  // Calculate the due date for the current month
  let currentMonthDueDate = new Date(today.getFullYear(), today.getMonth(), dueDay)
  
  // If today is before the due day, we check if the previous month was paid
  // If today is after the due day, we check if the current month was paid
  
  // Actually, simpler:
  // The client is covered until: Last Payment Month + 1, on Due Day.
  // Example: Due 5. Last Pay: Nov 20. Covered until Dec 5.
  // Example: Due 5. Last Pay: Dec 2. Covered until Jan 5.
  
  const lastPaymentDate = new Date(lastPayment.date)
  
  // Determine the coverage end date based on the last payment
  // If payment was made in Month M, it covers until Month M+1, Day D.
  // But we need to handle "paying in advance" or "paying late".
  // Let's assume a payment covers the period starting from the due date closest to the payment?
  // No, let's stick to the user's rule: "vencimiento sea a partir de la primera vez que pagaron"
  
  // Let's assume the expiration date is simply 1 month after the "period start" of the last payment.
  // But identifying the period start is hard.
  
  // heuristic: Expiration = Last Payment Date + 30 days? No, user wants specific day.
  // heuristic: Expiration = (Month of Last Payment + 1), Day = Due Day.
  // Exception: If Last Payment was made *after* the Due Day of that month, does it count for next month?
  // Usually yes, if I pay on Nov 20 (Due 5), it's for Nov-Dec. So expires Dec 5.
  // If I pay on Nov 2 (Due 5), it's for Nov-Dec. So expires Dec 5.
  // So in both cases, expires Dec 5.
  // So: Expiration = (LastPayment.Month + 1), DueDay.
  
  let expirationDate = new Date(lastPaymentDate.getFullYear(), lastPaymentDate.getMonth() + 1, dueDay)
  
  // Handle year rollover automatically by Date constructor
  
  // Check if expired
  // We strip time for comparison
  const todayTime = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
  const expirationTime = new Date(expirationDate.getFullYear(), expirationDate.getMonth(), expirationDate.getDate()).getTime()
  
  const isExpired = todayTime > expirationTime
  const daysOverdue = isExpired ? Math.floor((todayTime - expirationTime) / (1000 * 60 * 60 * 24)) : 0
  
  return {
    status: isExpired ? "Expired" : "Active",
    dueDate: expirationDate,
    daysOverdue
  }
}
