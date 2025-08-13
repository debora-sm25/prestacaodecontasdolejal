import React from 'react'

export function Tabs({ value, onValueChange, className = '', children }) {
  return <div className={className} data-current-value={value}>{children}</div>
}

export function TabsList({ className = '', children }) {
  return <div className={`inline-grid gap-2 ${className}`}>{children}</div>
}

export function TabsTrigger({ value, className = '', children, onClick }) {
  return (
    <button
      className={`px-3 py-2 rounded-md border bg-white data-[active=true]:bg-gray-900 data-[active=true]:text-white ${className}`}
      data-active={false}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export function TabsContent({ value, children }) {
  return <div>{children}</div>
}


