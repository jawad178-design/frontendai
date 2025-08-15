import { useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface UploadedImage {
  id: string
  file: File
  preview: string
  category: string
  description: string
  uploadProgress: number
  uploaded: boolean
  error?: string
  aiAnalysis?: {
    confidence_score?: number
    detected_issues?: Array<{
      type: string
      severity: string
      description: string
      confidence: number
    }>
    saudi_code_compliance?: {
      overall_grade: string
      compliance_percentage: number
    }
    suggested_fixes?: Array<{
      description: string
      estimated_cost: number
    }>
  }
}

interface ImageCategory {
  value: string
  label: string
}

interface ImagePreviewProps {
  image: UploadedImage
  categories: ImageCategory[]
  onCategoryChange: (category: string) => void
  onDescriptionChange: (description: string) => void
  onRemove: () => void
}

export function ImagePreview({
  image,
  categories,
  onCategoryChange,
  onDescriptionChange,
  onRemove,
}: ImagePreviewProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Image */}
      <div className="relative aspect-video bg-gray-100">
        <img
          src={image.preview}
          alt={image.description || 'معاينة الصورة'}
          className="w-full h-full object-cover"
        />
        
        {/* Remove button */}
        <button
          onClick={onRemove}
          className="absolute top-2 left-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
          aria-label="حذف الصورة"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
        
        {/* Upload progress */}
        {image.uploadProgress > 0 && image.uploadProgress < 100 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-sm text-gray-600 mb-2">جاري الرفع...</div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${image.uploadProgress}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">{image.uploadProgress}%</div>
            </div>
          </div>
        )}
        
        {/* Error state */}
        {image.error && (
          <div className="absolute inset-0 bg-red-600 bg-opacity-80 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="text-sm font-medium">خطأ في الرفع</div>
              <div className="text-xs">{image.error}</div>
            </div>
          </div>
        )}
        
        {/* Success state with AI analysis */}
        {image.uploaded && (
          <div className="absolute top-2 right-2 space-y-1">
            <div className="p-1 bg-green-600 text-white rounded-full">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            {/* AI Analysis indicator */}
            <div className="p-1 bg-blue-600 text-white rounded-full" title="تم التحليل بالذكاء الاصطناعي">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        )}
      </div>
      
      {/* Image details */}
      <div className="p-3 space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            التصنيف
          </label>
          <select
            value={image.category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-primary-500 focus:border-primary-500"
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            الوصف
          </label>
          <textarea
            value={image.description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="وصف الصورة..."
            rows={2}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-primary-500 focus:border-primary-500 resize-none"
          />
        </div>
        
        {/* File info */}
        <div className="text-xs text-gray-500">
          <div>الحجم: {(image.file.size / 1024 / 1024).toFixed(1)} ميجابايت</div>
          <div>النوع: {image.file.type}</div>
        </div>

        {/* AI Analysis Results */}
        {(() => {
          console.log('=== ImagePreview Debug Info ===')
          console.log('Image ID:', image.id)
          console.log('Image uploaded status:', image.uploaded)
          console.log('Image uploadProgress:', image.uploadProgress)
          console.log('Image aiAnalysis:', image.aiAnalysis)
          console.log('Image aiAnalysis type:', typeof image.aiAnalysis)
          console.log('Full image object keys:', Object.keys(image))
          console.log('==============================')
          return null
        })()}
        
        {image.uploaded && (
          <div className="mt-3">
            {image.aiAnalysis ? (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium text-blue-800">تحليل الذكاء الاصطناعي</span>
                </div>
                
                {image.aiAnalysis.confidence_score && (
                  <div className="text-xs text-blue-700 mb-2">
                    مستوى الثقة: {(image.aiAnalysis.confidence_score * 100).toFixed(1)}%
                  </div>
                )}

                {image.aiAnalysis.detected_issues && image.aiAnalysis.detected_issues.length > 0 ? (
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-red-700">
                      مشاكل مكتشفة ({image.aiAnalysis.detected_issues.length}):
                    </div>
                    {image.aiAnalysis.detected_issues.slice(0, 2).map((issue, index) => (
                      <div key={index} className="text-xs text-red-600 bg-red-50 p-1 rounded">
                        <div className="font-medium">{issue.type}</div>
                        <div>{issue.description}</div>
                        <div className="text-gray-500">الشدة: {issue.severity}</div>
                      </div>
                    ))}
                    {image.aiAnalysis.detected_issues.length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{image.aiAnalysis.detected_issues.length - 2} مشاكل أخرى
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-green-700 bg-green-50 p-1 rounded">
                    ✅ لم يتم اكتشاف مشاكل واضحة
                  </div>
                )}

                {image.aiAnalysis.saudi_code_compliance && (
                  <div className="mt-2 text-xs">
                    <div className="text-blue-700">
                      مطابقة كود البناء: {image.aiAnalysis.saudi_code_compliance.compliance_percentage}%
                    </div>
                    <div className="text-blue-600">
                      التقييم: {image.aiAnalysis.saudi_code_compliance.overall_grade}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="text-sm text-yellow-800">
                  🔄 جاري تحليل الصورة بالذكاء الاصطناعي...
                </div>
                <div className="text-xs text-yellow-600 mt-1">
                  قد يستغرق هذا بضع ثوان
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
