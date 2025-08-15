'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '../../hooks/useAuth'
import { 
  HomeIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  CogIcon,
  UserIcon,
  ClipboardDocumentListIcon,
  PhotoIcon,
  ChartBarIcon,
  BellIcon,
  XMarkIcon,
  Bars3Icon
} from '@heroicons/react/24/outline'

interface NavigationItem {
  name: string
  href: string
  icon: any
  badge?: number
}

const engineerNavigation: NavigationItem[] = [
  { name: 'لوحة التحكم', href: '/engineer/dashboard', icon: HomeIcon },
  { name: 'الفحوصات', href: '/engineer/inspections', icon: BuildingOfficeIcon },
  { name: 'التقارير', href: '/engineer/reports', icon: DocumentTextIcon },
  { name: 'الصور', href: '/engineer/images', icon: PhotoIcon },
  { name: 'الإحصائيات', href: '/engineer/analytics', icon: ChartBarIcon },
  { name: 'الإشعارات', href: '/engineer/notifications', icon: BellIcon, badge: 3 },
  { name: 'الملف الشخصي', href: '/engineer/profile', icon: UserIcon },
  { name: 'الإعدادات', href: '/engineer/settings', icon: CogIcon },
]

const clientNavigation: NavigationItem[] = [
  { name: 'لوحة التحكم', href: '/client/dashboard', icon: HomeIcon },
  { name: 'طلباتي', href: '/client/requests', icon: ClipboardDocumentListIcon },
  { name: 'التقارير', href: '/client/reports', icon: DocumentTextIcon },
  { name: 'الإشعارات', href: '/client/notifications', icon: BellIcon },
  { name: 'الملف الشخصي', href: '/client/profile', icon: UserIcon },
]

const partnerNavigation: NavigationItem[] = [
  { name: 'لوحة التحكم', href: '/partner/dashboard', icon: HomeIcon },
  { name: 'المهندسون', href: '/partner/engineers', icon: UserIcon },
  { name: 'الفحوصات', href: '/partner/inspections', icon: BuildingOfficeIcon },
  { name: 'التقارير', href: '/partner/reports', icon: DocumentTextIcon },
  { name: 'الإحصائيات', href: '/partner/analytics', icon: ChartBarIcon },
  { name: 'الملف الشخصي', href: '/partner/profile', icon: UserIcon },
  { name: 'الإعدادات', href: '/partner/settings', icon: CogIcon },
]

const adminNavigation: NavigationItem[] = [
  { name: 'لوحة التحكم', href: '/admin/dashboard', icon: HomeIcon },
  { name: 'المستخدمون', href: '/admin/users', icon: UserIcon },
  { name: 'الفحوصات', href: '/admin/inspections', icon: BuildingOfficeIcon },
  { name: 'التقارير', href: '/admin/reports', icon: DocumentTextIcon },
  { name: 'الإحصائيات', href: '/admin/analytics', icon: ChartBarIcon },
  { name: 'الإعدادات', href: '/admin/settings', icon: CogIcon },
]

export function Sidebar() {
  const { user } = useAuth()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const getNavigationItems = () => {
    switch (user?.user_type) {
      case 'engineer':
        return engineerNavigation
      case 'client':
        return clientNavigation
      case 'partner':
        return partnerNavigation
      case 'admin':
        return adminNavigation
      default:
        return []
    }
  }

  const navigationItems = getNavigationItems()

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 px-4 bg-primary-600">
        <Link href="/" className="flex items-center">
          <BuildingOfficeIcon className="w-8 h-8 text-white ml-2" />
          <span className="text-xl font-bold text-white">فحصنا يطمنك</span>
        </Link>
      </div>

      {/* User Info */}
      {user && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-primary-600" />
            </div>
            <div className="mr-3">
              <p className="text-sm font-medium text-gray-900">
                {user.first_name} {user.last_name}
              </p>
              <p className="text-xs text-gray-500">
                {user.user_type === 'engineer' && 'مهندس فاحص'}
                {user.user_type === 'client' && 'عميل'}
                {user.user_type === 'partner' && 'شريك'}
                {user.user_type === 'admin' && 'مدير النظام'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                ${isActive
                  ? 'bg-primary-100 text-primary-700 border-l-4 border-primary-500'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }
              `}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <item.icon
                className={`
                  ml-3 w-5 h-5
                  ${isActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'}
                `}
              />
              {item.name}
              {item.badge && (
                <span className="mr-auto bg-red-100 text-red-600 text-xs font-medium px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          © 2024 فحصنا يطمنك. جميع الحقوق محفوظة.
        </p>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:bg-white lg:border-l lg:border-gray-200">
        <SidebarContent />
      </div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="bg-white p-2 rounded-md shadow-md"
        >
          <Bars3Icon className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            {/* Close Button */}
            <div className="absolute top-0 left-0 -ml-12 pt-2">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <XMarkIcon className="h-6 w-6 text-white" />
              </button>
            </div>
            
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  )
}
