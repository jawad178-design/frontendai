interface StatsCardProps {
  title: string
  value: string | number
  icon: any
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  trend?: {
    value: number
    isPositive: boolean
  }
}

export function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  color = 'primary',
  trend 
}: StatsCardProps) {
  const colorClasses = {
    primary: 'bg-primary-50 text-primary-600',
    secondary: 'bg-gray-50 text-gray-600',
    success: 'bg-green-50 text-green-600',
    warning: 'bg-yellow-50 text-yellow-600',
    danger: 'bg-red-50 text-red-600',
  }

  const trendColorClasses = trend?.isPositive 
    ? 'text-green-600' 
    : 'text-red-600'

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <div className="flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            {trend && (
              <span className={`mr-2 text-sm font-medium ${trendColorClasses}`}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
            )}
          </div>
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  )
}
