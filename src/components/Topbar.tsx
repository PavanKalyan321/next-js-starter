import { Bell, Search, User, Settings, LogOut } from 'lucide-react'
import { auth, signOut } from '@/auth'
import Image from 'next/image'
import TopbarClient from './TopbarClient'

export async function Topbar() {
  const session = await auth()

  return (
    <TopbarClient
      user={{
        name: session?.user?.name || 'User',
        email: session?.user?.email || '',
        image: session?.user?.image || '',
      }}
    />
  )
}
