import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { clientId, amount, date, notes } = body

    const payment = await prisma.payment.create({
      data: {
        clientId,
        amount: parseFloat(amount),
        date: new Date(date),
        notes,
      },
    })

    return NextResponse.json(payment)
  } catch (error) {
    return NextResponse.json({ error: "Error creating payment" }, { status: 500 })
  }
}
