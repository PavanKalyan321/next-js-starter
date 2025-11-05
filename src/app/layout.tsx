import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Sidebar } from '@/components/Sidebar'
import { Topbar } from '@/components/Topbar'
import { auth } from '@/auth'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DevPortal - Personal Developer Portal',
  description: 'Manage your projects, code vault, ideas, and automation bots',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  const isLoginPage = false // We'll handle this with pathname check in children

  return (
    <html lang="en">
      <body className={inter.className}>
        {session ? (
          <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Topbar */}
              <Topbar />

              {/* Page Content */}
              <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
                {children}
              </main>
            </div>
          </div>
        ) : (
          // No layout for unauthenticated users (login page)
          children
        )}
      </body>
    </html>
  )
}
