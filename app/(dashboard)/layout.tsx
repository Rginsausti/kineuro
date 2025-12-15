import Sidebar from "@/components/Sidebar"
import Navbar from "@/components/Navbar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="layout-container bg-gradient-mesh">
      <Sidebar />
      <div className="layout-main">
        <Navbar />
        <main className="layout-content">
          <div className="layout-content-inner">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
