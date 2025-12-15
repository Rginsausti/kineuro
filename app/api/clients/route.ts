import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const clients = await prisma.client.findMany({
      orderBy: { name: "asc" },
      include: {
        payments: {
          orderBy: { date: "desc" },
          take: 1,
        },
      },
    })
    return NextResponse.json(clients)
  } catch (error) {
    return NextResponse.json({ error: "Error fetching clients" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { name, documentNumber, phone, notes } = body

    const client = await prisma.client.create({
      data: {
        name,
        documentNumber,
        phone,
        notes,
      },
    })

    return NextResponse.json(client)
  } catch (error) {
    return NextResponse.json({ error: "Error creating client" }, { status: 500 })
  }
}
