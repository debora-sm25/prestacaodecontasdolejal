import React from 'react'

export function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 ${className}`}
      {...props}
    />
  )
}


