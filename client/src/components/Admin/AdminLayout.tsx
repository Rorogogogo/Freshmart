'use client'

import AdminSidebar from './AdminSidebar'

interface AdminLayoutProps {
  children: React.ReactNode
  title?: string
}

export default function AdminLayout({
  children,
  title = 'Admin Panel',
}: AdminLayoutProps) {
  return (
    <div className="container mx-auto max-w-7xl px-4 pt-20 pb-8 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
        {/* Sidebar */}
        <div className="md:w-64 w-full">
          <AdminSidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b">
              <h1 className="text-xl font-semibold">{title}</h1>
            </div>
            <div className="p-4">{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
