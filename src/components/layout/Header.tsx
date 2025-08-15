'use client'

import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { 
  BellIcon, 
  UserIcon, 
  Cog6ToothIcon, 
  ArrowRightOnRectangleIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'

export function Header() {
  const { user, logout } = useAuth()
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    setIsProfileMenuOpen(false)
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - empty for now, can add breadcrumbs */}
        <div className="flex-1">
          {/* Breadcrumbs or page title can go here */}
        </div>

        {/* Right side - User actions */}
        <div className="flex items-center space-x-4 space-x-reverse">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2 text-gray-400 hover:text-gray-500 relative"
              aria-label="الإشعارات"
            >
              <BellIcon className="w-6 h-6" />
              {/* Notification badge */}
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
            </button>

            {/* Notifications dropdown */}
            {isNotificationsOpen && (
              <div className="absolute left-0 mt-2 w-80 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">الإشعارات</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 space-x-reverse p-2 hover:bg-gray-50 rounded">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">تم اكتمال تحليل الفحص #12345</p>
                        <p className="text-xs text-gray-500">منذ 5 دقائق</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 space-x-reverse p-2 hover:bg-gray-50 rounded">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">طلب فحص جديد من أحمد محمد</p>
                        <p className="text-xs text-gray-500">منذ ساعة</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 space-x-reverse p-2 hover:bg-gray-50 rounded">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">تم تحديث كود البناء السعودي</p>
                        <p className="text-xs text-gray-500">منذ يوم</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <button className="text-sm text-primary-600 hover:text-primary-500">
                      عرض جميع الإشعارات
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center space-x-2 space-x-reverse text-sm text-gray-700 hover:text-gray-900"
              aria-label="قائمة المستخدم"
            >
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-primary-600" />
              </div>
              <span className="hidden md:block font-medium">
                {user?.first_name} {user?.last_name}
              </span>
              <ChevronDownIcon className="w-4 h-4" />
            </button>

            {/* Profile dropdown */}
            {isProfileMenuOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-1">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.first_name} {user?.last_name}
                    </p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                  
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false)
                      // Navigate to profile
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <UserIcon className="w-4 h-4 ml-2" />
                    الملف الشخصي
                  </button>
                  
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false)
                      // Navigate to settings
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Cog6ToothIcon className="w-4 h-4 ml-2" />
                    الإعدادات
                  </button>
                  
                  <div className="border-t border-gray-200">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                    >
                      <ArrowRightOnRectangleIcon className="w-4 h-4 ml-2" />
                      تسجيل الخروج
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
