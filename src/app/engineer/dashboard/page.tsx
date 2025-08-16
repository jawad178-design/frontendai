'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '../../../hooks/useAuth'
import { DashboardLayout } from '../../../components/layout/DashboardLayout'
import { StatsCard } from '../../../components/dashboard/StatsCard'
import { InspectionRequestCard } from '../../../components/inspection/InspectionRequestCard'
import { RecentActivity } from '../../../components/dashboard/RecentActivity'
import { 
  BuildingOfficeIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner'

interface DashboardStats {
  totalInspections: number
  pendingInspections: number
  completedInspections: number
  totalRevenue: number
}

interface InspectionRequest {
  id: string
  client_name: string
  property_address: string
  inspection_type: string
  scheduled_date: string
  status: string
  priority: string
}

export default function EngineerDashboard() {
  const { user, loading } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentRequests, setRecentRequests] = useState<InspectionRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user?.user_type === 'engineer') {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      console.log('Starting dashboard data fetch...')
      
      // For testing, disable API calls that don't exist yet
      console.log('Dashboard API calls disabled for testing')
      
      // Set dummy data for testing
      const dummyStats = {
        totalInspections: 5,
        completedInspections: 3,
        pendingInspections: 2,
        totalRevenue: 12500
      }
      console.log('Setting dummy stats:', dummyStats)
      setStats(dummyStats)

      // Fetch recent inspection requests (this API exists)
      console.log('Fetching recent requests...')
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://jawad12k-fahsna-backend.hf.space'
      const requestsResponse = await fetch(`${API_BASE_URL}/api/v1/inspections/requests/?limit=5`)
      
      if (requestsResponse.ok) {
        const requestsData = await requestsResponse.json()
        console.log('Requests data:', requestsData)
        setRecentRequests(requestsData.results || [])
      }

      console.log('Dashboard data fetch completed')
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      console.log('Setting isLoading to false')
      setIsLoading(false)
    }
  }

  if (loading || isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    )
  }

  if (!user || user.user_type !== 'engineer') {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-warning-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">غير مخول</h3>
          <p className="mt-1 text-sm text-gray-500">
            هذه الصفحة مخصصة للمهندسين فقط
          </p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              مرحباً، {user.first_name} {user.last_name}
            </h1>
            <p className="text-gray-600">
              إليك نظرة عامة على نشاطك كمهندس فاحص
            </p>
          </div>
          
          <Link 
            href="/engineer/inspections/new"
            className="btn-primary inline-flex items-center"
          >
            <PlusIcon className="w-5 h-5 ml-2" />
            فحص جديد
          </Link>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="إجمالي الفحوصات"
            value={stats?.totalInspections || 0}
            icon={BuildingOfficeIcon}
            color="primary"
          />
          
          <StatsCard
            title="الفحوصات المعلقة"
            value={stats?.pendingInspections || 0}
            icon={ClockIcon}
            color="warning"
          />
          
          <StatsCard
            title="الفحوصات المكتملة"
            value={stats?.completedInspections || 0}
            icon={CheckCircleIcon}
            color="success"
          />
          
          <StatsCard
            title="نسبة الدقة"
            value={`${((stats?.completedInspections || 0) / (stats?.totalInspections || 1) * 100).toFixed(1)}%`}
            icon={ExclamationTriangleIcon}
            color="secondary"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Inspection Requests */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                طلبات الفحص الحديثة
              </h2>
              <Link 
                href="/engineer/inspections"
                className="text-primary-600 hover:text-primary-500 text-sm font-medium"
              >
                عرض الكل
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentRequests.length > 0 ? (
                recentRequests.map((request) => (
                  <InspectionRequestCard 
                    key={request.id} 
                    request={request}
                    onUpdate={fetchDashboardData}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-300" />
                  <p className="mt-2">لا توجد طلبات فحص حديثة</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              النشاط الأخير
            </h2>
            <RecentActivity userId={user.id} />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            إجراءات سريعة
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              href="/engineer/inspections/new"
              className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <PlusIcon className="h-8 w-8 text-primary-600 mb-2" />
              <h3 className="font-medium text-gray-900">بدء فحص جديد</h3>
              <p className="text-sm text-gray-500">قم بإنشاء طلب فحص جديد</p>
            </Link>
            
            <Link 
              href="/engineer/reports"
              className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <BuildingOfficeIcon className="h-8 w-8 text-primary-600 mb-2" />
              <h3 className="font-medium text-gray-900">التقارير</h3>
              <p className="text-sm text-gray-500">عرض وإدارة التقارير</p>
            </Link>
            
            <Link 
              href="/engineer/profile"
              className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <CheckCircleIcon className="h-8 w-8 text-primary-600 mb-2" />
              <h3 className="font-medium text-gray-900">الملف الشخصي</h3>
              <p className="text-sm text-gray-500">تحديث معلوماتك الشخصية</p>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
