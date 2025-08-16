export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div>Root Layout</div>
        {children}
      </body>
    </html>
  )
}