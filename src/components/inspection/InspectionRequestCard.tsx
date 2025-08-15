import Link from 'next/link'
import { 
  CalendarIcon, 
  MapPinIcon, 
  UserIcon, 
  ClockIcon 
} from '@heroicons/react/24/outline'

interface InspectionRequest {
  id: string
  client_name: string
  property_address: string
  inspection_type: string
  scheduled_date: string
  status: string
  priority: string
}

interface InspectionRequestCardProps {
  request: InspectionRequest
  onUpdate?: () => void
}

export function InspectionRequestCard({ request, onUpdate }: InspectionRequestCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'في الانتظار'
      case 'in_progress':
        return 'قيد التنفيذ'
      case 'completed':
        return 'مكتمل'
      case 'cancelled':
        return 'ملغي'
      default:
        return status
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'عالية'
      case 'medium':
        return 'متوسطة'
      case 'low':
        return 'منخفضة'
      default:
        return priority
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ar-SA', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <Link
            href={`/engineer/inspections/${request.id}`}
            className="text-lg font-medium text-gray-900 hover:text-primary-600"
          >
            فحص #{request.id.slice(-6)}
          </Link>
          
          <div className="flex items-center mt-2 space-x-4 space-x-reverse text-sm text-gray-500">
            <div className="flex items-center">
              <UserIcon className="w-4 h-4 ml-1" />
              {request.client_name}
            </div>
            
            <div className="flex items-center">
              <MapPinIcon className="w-4 h-4 ml-1" />
              {request.property_address}
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2 space-x-reverse">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
            {getStatusLabel(request.status)}
          </span>
          
          {request.priority !== 'medium' && (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(request.priority)}`}>
              {getPriorityLabel(request.priority)}
            </span>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-500">
          <CalendarIcon className="w-4 h-4 ml-1" />
          {request.scheduled_date ? formatDate(request.scheduled_date) : 'غير محدد'}
        </div>
        
        <div className="flex items-center text-sm text-gray-500">
          <ClockIcon className="w-4 h-4 ml-1" />
          {request.inspection_type}
        </div>
      </div>
      
      <div className="mt-4 flex justify-end space-x-2 space-x-reverse">
        <Link
          href={`/engineer/inspections/${request.id}`}
          className="text-sm text-primary-600 hover:text-primary-500 font-medium"
        >
          عرض التفاصيل
        </Link>
        
        {request.status === 'pending' && (
          <button
            onClick={() => {
              // Handle start inspection
              if (onUpdate) onUpdate()
            }}
            className="text-sm text-green-600 hover:text-green-500 font-medium"
          >
            بدء الفحص
          </button>
        )}
      </div>
    </div>
  )
}
