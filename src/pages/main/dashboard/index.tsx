import MainLayout from "@/components/layouts/MainLayout"

function DashboardPage() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold text-secondary">Dashboard</h1>
      <p className="text-secondary mt-2">Aquí va el contenido del dashboard.</p>
    </div>
  )
}

export default function MainSectionLayout() {
  return (
    <MainLayout>
      <DashboardPage />
    </MainLayout>
  )
}