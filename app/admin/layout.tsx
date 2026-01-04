import { redirect } from 'next/navigation'
import { isAdminAuthenticated } from '@/lib/admin-auth'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Only protect dashboard routes, not login
  return <>{children}</>
}

