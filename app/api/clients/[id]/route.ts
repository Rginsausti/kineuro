import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function PUT(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { name, documentNumber, phone, notes, isActive } = body

    const client = await prisma.client.update({
      where: { id: params.id },
      data: {
        name,
        documentNumber,
        phone,
        notes,
        isActive,
      },
    })

    return NextResponse.json(client)
  } catch (error) {
    return NextResponse.json({ error: "Error updating client" }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await prisma.client.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Client deleted" })
  } catch (error) {
    return NextResponse.json({ error: "Error deleting client" }, { status: 500 })
  }
}
