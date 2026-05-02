import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

export const metadata = {
  title: 'DoubtBridge',
  description: 'Peer Academic Support Platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-slate-900 text-white">{children}</body>
      </html>
    </ClerkProvider>
  )
}