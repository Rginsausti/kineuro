import { prisma } from "@/lib/prisma"
import ClientDashboard from "@/components/ClientDashboard"
import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect("/login")
  }

  const clients = await prisma.client.findMany({
    orderBy: { name: "asc" },
    include: {
      payments: {
        orderBy: { date: "desc" },
      },
    },
  })

  return <ClientDashboard initialClients={clients} />
}
