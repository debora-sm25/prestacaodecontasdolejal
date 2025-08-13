import React from 'react'

export function Badge({ className = '', variant = 'default', children }) {
  const variants = {
    default: 'bg-gray-900 text-white',
    secondary: 'bg-gray-100 text-gray-900',
    outline: 'border border-gray-300 text-gray-700'
  }
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  )
}


