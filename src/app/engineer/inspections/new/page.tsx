'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import { DashboardLayout } from '../../../../components/layout/DashboardLayout'
import { LoadingSpinner } from '../../../../components/ui/LoadingSpinner'
import { FormField } from '../../../../components/ui/FormField'
import { Button } from '../../../../components/ui/Button'
import { ProgressBar } from '../../../../components/ui/ProgressBar'
import { ImagePreview } from '../../../../components/inspection/ImagePreview'
import { 
  PhotoIcon, 
  DocumentArrowUpIcon, 
  XMarkIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

interface InspectionType {
  id: number
  name: string
  name_en: string
  description: string
  price: number
}

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

interface InspectionForm {
  client_name: string
  client_phone: string
  client_email: string
  property_address: string
  property_type: string
  inspection_type: number | string
  scheduled_date: string
  description: string
  priority: string
  client_notes: string
  building_year: string
  building_area: string
}

const INSPECTION_TYPES = [
  { value: 'pre_purchase', label: 'فحص ما قبل الشراء' },
  { value: 'maintenance', label: 'فحص الصيانة' },
  { value: 'safety', label: 'فحص السلامة' },
  { value: 'structural', label: 'فحص إنشائي' },
  { value: 'electrical', label: 'فحص كهربائي' },
  { value: 'plumbing', label: 'فحص السباكة' },
  { value: 'hvac', label: 'فحص التكييف والتهوية' },
]

const PROPERTY_TYPES = [
  { value: 'residential', label: 'سكني' },
  { value: 'commercial', label: 'تجاري' },
  { value: 'industrial', label: 'صناعي' },
  { value: 'mixed', label: 'مختلط' },
]

const IMAGE_CATEGORIES = [
  { value: 'exterior', label: 'الخارج' },
  { value: 'interior', label: 'الداخل' },
  { value: 'structural', label: 'إنشائية' },
  { value: 'electrical', label: 'كهربائية' },
  { value: 'plumbing', label: 'سباكة' },
  { value: 'hvac', label: 'تكييف وتهوية' },
  { value: 'defects', label: 'عيوب' },
  { value: 'thermal', label: 'تصوير حراري' },
]

export default function NewInspection() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [inspectionTypes, setInspectionTypes] = useState<InspectionType[]>([])
  const [formData, setFormData] = useState<InspectionForm>({
    client_name: '',
    client_phone: '',
    client_email: '',
    property_address: '',
    property_type: 'residential',
    inspection_type: '',
    scheduled_date: new Date().toISOString().slice(0, 16), // Default to current datetime
    description: '',
    priority: 'normal',
    client_notes: '',
    building_year: '',
    building_area: '',
  })
  const [images, setImages] = useState<UploadedImage[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitProgress, setSubmitProgress] = useState(0)

  // Load inspection types on component mount
  useEffect(() => {
    const fetchInspectionTypes = async () => {
      try {
        console.log('Fetching inspection types...')
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'
        const response = await fetch(`${API_BASE_URL}/api/v1/inspections/types/`)
        console.log('Response status:', response.status)
        if (response.ok) {
          const data = await response.json()
          console.log('Raw API response:', data)
          // Extract results from paginated response
          const types = data.results || data
          console.log('Inspection types:', types)
          setInspectionTypes(types)
        } else {
          console.error('Failed to fetch inspection types:', response.status)
        }
      } catch (error) {
        console.error('Error fetching inspection types:', error)
      }
    }
    
    fetchInspectionTypes()
  }, [])

  const uploadSingleImageDirectly = async (image: UploadedImage) => {
    try {
      console.log('=== Starting Direct Upload ===')
      console.log('Image file:', image.file.name, image.file.size, 'bytes')
      
      setImages((prev) =>
        prev.map((img) =>
          img.id === image.id ? { ...img, uploadProgress: 10 } : img
        )
      )

      // Check if AI service is available first
      console.log('Checking AI service availability...')
      const AI_API_URL = process.env.NEXT_PUBLIC_AI_API_URL || 'http://127.0.0.1:8001'
      const healthResponse = await fetch(`${AI_API_URL}/health`)
      if (!healthResponse.ok) {
        throw new Error('AI service is not available')
      }
      console.log('AI service is available')

      const formData = new FormData()
      formData.append('file', image.file)  // Use 'file' as expected by FastAPI
      console.log('FormData prepared with image file as "file"')

      console.log('Making request to AI service...')
      // Direct upload for AI analysis only (no inspection required)
      const response = await fetch(`${AI_API_URL}/analyze/`, {
        method: 'POST',
        body: formData,
      })

      console.log('Response received:', response.status, response.statusText)
      console.log('Response headers:', Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Response error text:', errorText)
        throw new Error(`Upload failed: ${response.status} - ${errorText}`)
      }

      const result = await response.json()
      
      console.log('=== Direct AI Analysis Response ===')
      console.log('Analysis response status:', response.status)
      console.log('Full analysis result:', result)
      console.log('Result type:', typeof result)
      console.log('Result keys:', Object.keys(result))
      console.log('=================================')
      
      setImages((prev) =>
        prev.map((img) =>
          img.id === image.id 
            ? { 
                ...img, 
                uploadProgress: 100, 
                uploaded: true,
                aiAnalysis: result || null
              }
            : img
        )
      )

      return { ...image, uploaded: true, uploadResult: result }
    } catch (error) {
      console.error('=== Upload Error Details ===')
      console.error('Error type:', typeof error)
      console.error('Error message:', error instanceof Error ? error.message : String(error))
      console.error('Full error object:', error)
      console.error('============================')
      
      setImages((prev) =>
        prev.map((img) =>
          img.id === image.id 
            ? { ...img, error: `فشل في تحليل الصورة: ${error instanceof Error ? error.message : 'خطأ غير معروف'}` }
            : img
        )
      )
      throw error
    }
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImages: UploadedImage[] = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      category: 'exterior',
      description: '',
      uploadProgress: 0,
      uploaded: false,
    }))
    
    setImages((prev) => [...prev, ...newImages])
    
    // Immediately upload images for instant AI analysis
    newImages.forEach(image => {
      uploadSingleImageDirectly(image)
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    maxFiles: 50,
  })

  const updateImageCategory = (imageId: string, category: string) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === imageId ? { ...img, category } : img
      )
    )
  }

  const updateImageDescription = (imageId: string, description: string) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === imageId ? { ...img, description } : img
      )
    )
  }

  const removeImage = (imageId: string) => {
    setImages((prev) => {
      const image = prev.find(img => img.id === imageId)
      if (image) {
        URL.revokeObjectURL(image.preview)
      }
      return prev.filter((img) => img.id !== imageId)
    })
  }

  const uploadImages = async (inspectionId: string) => {
    const uploadPromises = images.map(async (image) => {
      if (image.uploaded) return image

      const formData = new FormData()
      formData.append('image', image.file)
      formData.append('category', image.category)
      formData.append('description', image.description)

      try {
        setImages((prev) =>
          prev.map((img) =>
            img.id === image.id ? { ...img, uploadProgress: 10 } : img
          )
        )

        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'
        const response = await fetch(`${API_BASE_URL}/api/v1/inspections/requests/${inspectionId}/upload/`, {
          method: 'POST',
          // Remove Authorization header for testing without authentication
          body: formData,
        })

        if (!response.ok) {
          throw new Error('Upload failed')
        }

        const result = await response.json()
        
        console.log('=== Image Upload Response Debug ===')
        console.log('Upload response status:', response.status)
        console.log('Upload response headers:', Object.fromEntries(response.headers.entries()))
        console.log('Full upload result:', result)
        console.log('AI analysis result:', result.ai_analysis_result)
        console.log('AI analysis result type:', typeof result.ai_analysis_result)
        if (result.ai_analysis_result) {
          console.log('AI analysis keys:', Object.keys(result.ai_analysis_result))
        }
        console.log('=================================')
        
        setImages((prev) =>
          prev.map((img) =>
            img.id === image.id 
              ? { 
                  ...img, 
                  uploadProgress: 100, 
                  uploaded: true,
                  aiAnalysis: result.ai_analysis_result || null
                }
              : img
          )
        )

        return { ...image, uploaded: true, uploadResult: result }
      } catch (error) {
        setImages((prev) =>
          prev.map((img) =>
            img.id === image.id 
              ? { ...img, error: 'فشل في رفع الصورة' }
              : img
          )
        )
        throw error
      }
    })

    await Promise.all(uploadPromises)
  }

  const submitInspection = async () => {
    try {
      setIsSubmitting(true)
      setSubmitProgress(10)

      // Create inspection request first - only send required fields
      const inspectionData = {
        inspection_type: parseInt(String(formData.inspection_type)),
        property_address: formData.property_address,
        property_type: formData.property_type,
        description: formData.description || 'فحص العقار',
        scheduled_date: formData.scheduled_date,
        priority: formData.priority,
        client_notes: formData.client_notes || '',
      }

      console.log('Sending inspection data:', inspectionData)

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'
      const response = await fetch(`${API_BASE_URL}/api/v1/inspections/requests/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inspectionData),
      })

      console.log('Response status:', response.status)
      const responseText = await response.text()
      console.log('Response text:', responseText)

      if (!response.ok) {
        throw new Error(`فشل في إنشاء طلب الفحص: ${responseText}`)
      }

      const result = JSON.parse(responseText)
      setSubmitProgress(40)

      // Upload images to the created inspection (if any)
      if (images.length > 0) {
        try {
          await uploadImages(result.id)
        } catch (imageError) {
          console.warn('Image upload failed:', imageError)
          // Continue even if image upload fails
        }
      }
      setSubmitProgress(100)

      alert('تم إنشاء طلب الفحص بنجاح!')
      
      // Redirect to inspection details or list
      router.push('/engineer/inspections')
      
    } catch (error) {
      console.error('Error submitting inspection:', error)
      const errorMessage = error instanceof Error ? error.message : 'حدث خطأ غير معروف'
      alert(`حدث خطأ في إرسال طلب الفحص: ${errorMessage}`)
    } finally {
      setIsSubmitting(false)
      setSubmitProgress(0)
    }
  }

  const nextStep = () => {
    if (step < 3) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const canProceedToStep2 = () => {
    return formData.client_name && 
           formData.property_address && 
           formData.property_type && 
           formData.inspection_type
  }

  const canSubmit = () => {
    return canProceedToStep2() && images.length > 0
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">طلب فحص جديد</h1>
            <p className="text-gray-600">قم بإنشاء طلب فحص جديد مع رفع الصور</p>
          </div>
          
          <Button
            variant="ghost"
            onClick={() => router.back()}
          >
            إلغاء
          </Button>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center space-x-4 space-x-reverse">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${step >= stepNumber 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
                }
              `}>
                {stepNumber}
              </div>
              {stepNumber < 3 && (
                <div className={`
                  w-16 h-1 mx-2
                  ${step > stepNumber ? 'bg-primary-600' : 'bg-gray-200'}
                `} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="card">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">
                معلومات العميل والعقار
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="اسم العميل"
                  required
                  value={formData.client_name}
                  onChange={(value) => 
                    setFormData(prev => ({ ...prev, client_name: value }))
                  }
                />
                
                <FormField
                  label="رقم الهاتف"
                  type="tel"
                  value={formData.client_phone}
                  onChange={(value) => 
                    setFormData(prev => ({ ...prev, client_phone: value }))
                  }
                />
                
                <FormField
                  label="البريد الإلكتروني"
                  type="email"
                  value={formData.client_email}
                  onChange={(value) => 
                    setFormData(prev => ({ ...prev, client_email: value }))
                  }
                />
                
                <FormField
                  label="عنوان العقار"
                  required
                  value={formData.property_address}
                  onChange={(value) => 
                    setFormData(prev => ({ ...prev, property_address: value }))
                  }
                />
                
                <FormField
                  label="نوع العقار"
                  type="select"
                  required
                  options={PROPERTY_TYPES}
                  value={formData.property_type}
                  onChange={(value) => 
                    setFormData(prev => ({ ...prev, property_type: value }))
                  }
                />
                
                <FormField
                  label="نوع الفحص"
                  type="select"
                  required
                  options={inspectionTypes.map(type => ({
                    value: type.id.toString(),
                    label: `${type.name} - ${type.price} ريال`
                  }))}
                  value={String(formData.inspection_type)}
                  onChange={(value) => 
                    setFormData(prev => ({ ...prev, inspection_type: parseInt(value) }))
                  }
                />
                
                <FormField
                  label="تاريخ ووقت الفحص المطلوب"
                  type="datetime-local"
                  value={formData.scheduled_date}
                  onChange={(value) => 
                    setFormData(prev => ({ ...prev, scheduled_date: value }))
                  }
                />
                
                <FormField
                  label="سنة البناء"
                  type="number"
                  value={formData.building_year}
                  onChange={(value) => 
                    setFormData(prev => ({ ...prev, building_year: value }))
                  }
                />
              </div>
              
              <FormField
                label="وصف العقار / تفاصيل الفحص"
                type="textarea"
                rows={3}
                required
                value={formData.description}
                onChange={(value) => 
                  setFormData(prev => ({ ...prev, description: value }))
                }
              />
              
              <FormField
                label="مساحة المبنى (م²)"
                type="number"
                value={formData.building_area}
                onChange={(value) => 
                  setFormData(prev => ({ ...prev, building_area: value }))
                }
              />
              
              <FormField
                label="متطلبات خاصة / ملاحظات"
                type="textarea"
                rows={3}
                value={formData.client_notes}
                onChange={(value) => 
                  setFormData(prev => ({ ...prev, client_notes: value }))
                }
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">
                رفع صور العقار
              </h2>
              
              {/* Upload Area */}
              <div
                {...getRootProps()}
                className={`
                  border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                  ${isDragActive 
                    ? 'border-primary-400 bg-primary-50' 
                    : 'border-gray-300 hover:border-primary-400'
                  }
                `}
              >
                <input {...getInputProps()} />
                <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-lg font-medium text-gray-900">
                  {isDragActive 
                    ? 'اسحب الصور هنا...' 
                    : 'اسحب الصور هنا أو انقر للاختيار'
                  }
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  يدعم PNG، JPG، WEBP حتى 10MB لكل صورة (الحد الأقصى 50 صورة)
                </p>
              </div>

              {/* Images Grid */}
              {images.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">
                    الصور المرفوعة ({images.length})
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {images.map((image) => (
                      <ImagePreview
                        key={image.id}
                        image={image}
                        categories={IMAGE_CATEGORIES}
                        onCategoryChange={(category) => 
                          updateImageCategory(image.id, category)
                        }
                        onDescriptionChange={(description) => 
                          updateImageDescription(image.id, description)
                        }
                        onRemove={() => removeImage(image.id)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">
                مراجعة وإرسال الطلب
              </h2>
              
              {/* Summary */}
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900">معلومات العميل</h4>
                    <p className="text-sm text-gray-600">{formData.client_name}</p>
                    <p className="text-sm text-gray-600">{formData.client_phone}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900">معلومات العقار</h4>
                    <p className="text-sm text-gray-600">{formData.property_address}</p>
                    <p className="text-sm text-gray-600">
                      {PROPERTY_TYPES.find(t => t.value === formData.property_type)?.label}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900">نوع الفحص</h4>
                    <p className="text-sm text-gray-600">
                      {INSPECTION_TYPES.find(t => t.value === formData.inspection_type)?.label}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900">الصور المرفوعة</h4>
                    <p className="text-sm text-gray-600">{images.length} صورة</p>
                  </div>
                </div>
              </div>

              {/* Progress */}
              {isSubmitting && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>جاري إرسال الطلب...</span>
                    <span>{submitProgress}%</span>
                  </div>
                  <ProgressBar progress={submitProgress} />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="ghost"
            onClick={prevStep}
            disabled={step === 1 || isSubmitting}
          >
            السابق
          </Button>
          
          <div className="flex space-x-3 space-x-reverse">
            {step < 3 ? (
              <Button
                onClick={nextStep}
                disabled={step === 1 && !canProceedToStep2()}
              >
                التالي
              </Button>
            ) : (
              <Button
                onClick={submitInspection}
                disabled={!canSubmit() || isSubmitting}
                loading={isSubmitting}
              >
                {isSubmitting ? 'جاري الإرسال...' : 'إرسال الطلب'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
