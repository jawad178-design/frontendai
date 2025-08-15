'use client'

import Link from 'next/link'
import { useAuth } from '../hooks/useAuth'
import { useState } from 'react'

export default function HomePage() {
  const { user, loading } = useAuth()
  const [showFeatures, setShowFeatures] = useState(false)
  const isAuthenticated = !!user

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 ml-2">فحصنا يطمنك</h1>
              <span className="text-blue-600 text-sm bg-blue-100 px-2 py-1 rounded">Beta</span>
            </div>
            <nav className="flex items-center space-x-4 space-x-reverse">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4 space-x-reverse">
                  <span className="text-gray-700">مرحباً، {user?.first_name || user?.email}</span>
                  <Link
                    href="/engineer"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    لوحة التحكم
                  </Link>
                </div>
              ) : (
                <div className="flex items-center space-x-4 space-x-reverse">
                  <Link
                    href="/auth/login"
                    className="text-gray-700 hover:text-gray-900 px-3 py-2"
                  >
                    تسجيل الدخول
                  </Link>
                  <Link
                    href="/auth/register"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    إنشاء حساب
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl mb-6">
            منصة فحص المباني
            <br />
            <span className="text-blue-600">بالذكاء الاصطناعي</span>
          </h2>
          <p className="text-lg leading-8 text-gray-600 max-w-2xl mx-auto mb-10">
            تطبيق شامل لفحص المباني والعقارات وفقاً للكود السعودي مع تحليل متقدم بالذكاء الاصطناعي 
            لضمان السلامة والجودة في الإنشاءات
          </p>
          <div className="flex items-center justify-center gap-6">
            {isAuthenticated ? (
              <Link
                href="/engineer"
                className="rounded-md bg-blue-600 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition-colors"
              >
                بدء الفحص الآن
              </Link>
            ) : (
              <Link
                href="/auth/register"
                className="rounded-md bg-blue-600 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition-colors"
              >
                ابدأ مجاناً
              </Link>
            )}
            <button
              onClick={() => setShowFeatures(!showFeatures)}
              className="text-lg font-semibold leading-6 text-gray-900 hover:text-blue-600 transition-colors"
            >
              تعرف على المميزات ←
            </button>
          </div>
        </div>

        {/* Features Section */}
        {showFeatures && (
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: '🤖',
                title: 'تحليل بالذكاء الاصطناعي',
                description: 'اكتشاف العيوب والتشققات تلقائياً باستخدام أحدث تقنيات الرؤية الحاسوبية'
              },
              {
                icon: '📋',
                title: 'كود البناء السعودي',
                description: 'التحقق من الامتثال لمعايير الكود السعودي وإنتاج تقارير معتمدة'
              },
              {
                icon: '📊',
                title: 'تقارير شاملة',
                description: 'إنشاء تقارير مفصلة قابلة للتخصيص مع التوصيات والحلول المقترحة'
              },
              {
                icon: '🌡️',
                title: 'التصوير الحراري',
                description: 'تحليل الصور الحرارية لاكتشاف مشاكل العزل والرطوبة'
              },
              {
                icon: '🔧',
                title: 'إدارة الفرق',
                description: 'تنسيق العمل بين المهندسين والشركات المختصة'
              },
              {
                icon: '📱',
                title: 'سهولة الاستخدام',
                description: 'واجهة بسيطة ومتجاوبة تعمل على جميع الأجهزة'
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-2xl">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Statistics */}
        <div className="mt-16 bg-white rounded-2xl shadow-sm p-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">1000+</div>
              <div className="text-sm text-gray-600 mt-1">فحص مكتمل</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">95%</div>
              <div className="text-sm text-gray-600 mt-1">دقة التحليل</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">50+</div>
              <div className="text-sm text-gray-600 mt-1">مهندس معتمد</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600">
              © 2025 فحصنا يطمنك. جميع الحقوق محفوظة.
            </p>
            <div className="mt-4 flex justify-center items-center space-x-6 space-x-reverse">
              <a href="#" className="text-gray-400 hover:text-gray-600">الشروط والأحكام</a>
              <a href="#" className="text-gray-400 hover:text-gray-600">سياسة الخصوصية</a>
              <a href="#" className="text-gray-400 hover:text-gray-600">اتصل بنا</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
