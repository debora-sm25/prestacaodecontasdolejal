import React from 'react'

export function Card({ className = '', children }) {
  return (
    <div className={`rounded-xl border bg-white shadow-sm ${className}`}>{children}</div>
  )
}

export function CardHeader({ className = '', children }) {
  return <div className={`p-6 border-b ${className}`}>{children}</div>
}

export function CardTitle({ className = '', children }) {
  return <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>{children}</h3>
}

export function CardDescription({ className = '', children }) {
  return <p className={`text-sm text-gray-500 ${className}`}>{children}</p>
}

export function CardContent({ className = '', children }) {
  return <div className={`p-6 ${className}`}>{children}</div>
}


