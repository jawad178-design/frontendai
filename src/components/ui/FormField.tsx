'use client'

import { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

interface BaseFieldProps {
  label: string
  required?: boolean
  error?: string
  helpText?: string
}

interface InputFieldProps extends BaseFieldProps {
  type?: 'text' | 'email' | 'tel' | 'number' | 'date' | 'datetime-local' | 'password'
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

interface SelectOption {
  value: string
  label: string
}

interface SelectFieldProps extends BaseFieldProps {
  type: 'select'
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
}

interface TextareaFieldProps extends BaseFieldProps {
  type: 'textarea'
  value: string
  onChange: (value: string) => void
  rows?: number
  placeholder?: string
  disabled?: boolean
}

type FormFieldProps = InputFieldProps | SelectFieldProps | TextareaFieldProps

export function FormField(props: FormFieldProps) {
  const { label, required, error, helpText } = props

  const baseClasses = `
    w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-right
    focus:ring-primary-500 focus:border-primary-500
    disabled:bg-gray-50 disabled:text-gray-500
    ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}
  `

  const renderInput = () => {
    if (props.type === 'select') {
      return (
        <select
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          disabled={props.disabled}
          className={baseClasses}
          required={required}
        >
          {props.placeholder && (
            <option value="" disabled>
              {props.placeholder}
            </option>
          )}
          {props.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )
    }

    if (props.type === 'textarea') {
      return (
        <textarea
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          disabled={props.disabled}
          rows={props.rows || 3}
          placeholder={props.placeholder}
          className={baseClasses}
          required={required}
        />
      )
    }

    return (
      <input
        type={props.type || 'text'}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        disabled={props.disabled}
        placeholder={props.placeholder}
        className={baseClasses}
        required={required}
      />
    )
  }

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 mr-1">*</span>}
      </label>
      
      {renderInput()}
      
      {helpText && (
        <p className="text-sm text-gray-500">{helpText}</p>
      )}
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
