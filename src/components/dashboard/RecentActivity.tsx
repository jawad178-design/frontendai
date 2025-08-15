import { useState, useEffect } from 'react'
import { 
  ClockIcon, 
  CheckCircleIcon, 
  DocumentTextIcon, 
  UserIcon 
} from '@heroicons/react/24/outline'

interface Activity {
  id: string
  type: 'inspection_completed' | 'inspection_started' | 'report_generated' | 'profile_updated'
  title: string
  description: string
  timestamp: string
  user?: {
    name: string
    avatar?: string
  }
}

interface RecentActivityProps {
  userId: string
  limit?: number
}

export function RecentActivity({ userId, limit = 10 }: RecentActivityProps) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchActivities()
  }, [userId])

  const fetchActivities = async () => {
    try {
      setLoading(true)
      
      // For testing, disable activities API call
      console.log('Activities API call disabled for testing')
      
      // Set dummy activities for testing
      setActivities([
        {
          id: '1',
          type: 'inspection_started',
          description: 'تم إنشاء طلب فحص جديد',
          timestamp: new Date().toISOString(),
          user: 'مدير النظام'
        }
      ])
      
    } catch (error) {
      console.error('Error fetching activities:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'inspection_completed':
        return CheckCircleIcon
      case 'inspection_started':
        return ClockIcon
      case 'report_generated':
        return DocumentTextIcon
      case 'profile_updated':
        return UserIcon
      default:
        return ClockIcon
    }
  }

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'inspection_completed':
        return 'text-green-600 bg-green-100'
      case 'inspection_started':
        return 'text-blue-600 bg-blue-100'
      case 'report_generated':
        return 'text-purple-600 bg-purple-100'
      case 'profile_updated':
        return 'text-gray-600 bg-gray-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) {
      return 'منذ لحظات'
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `منذ ${minutes} دقيقة`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `منذ ${hours} ساعة`
    } else {
      const days = Math.floor(diffInSeconds / 86400)
      return `منذ ${days} يوم`
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-start space-x-3 space-x-reverse animate-pulse">
            <div className="w-8 h-8 bg-gray-200 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <ClockIcon className="mx-auto h-12 w-12 text-gray-300" />
        <p className="mt-2">لا يوجد نشاط حديث</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => {
        const Icon = getActivityIcon(activity.type)
        const colorClasses = getActivityColor(activity.type)
        
        return (
          <div key={activity.id} className="flex items-start space-x-3 space-x-reverse">
            <div className={`p-2 rounded-full ${colorClasses}`}>
              <Icon className="w-4 h-4" />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{activity.title}</p>
              <p className="text-sm text-gray-500">{activity.description}</p>
              <p className="text-xs text-gray-400 mt-1">
                {formatTimestamp(activity.timestamp)}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
