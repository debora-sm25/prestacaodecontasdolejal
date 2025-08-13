import React from 'react'

export function Label({ className = '', htmlFor, children }) {
  return (
    <label htmlFor={htmlFor} className={`mb-1 block text-sm font-medium text-gray-700 ${className}`}>
      {children}
    </label>
  )
}


