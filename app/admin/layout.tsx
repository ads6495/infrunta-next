export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <div>Admin Layout</div>
      {children}
    </div>
  )
}