import React, { useContext, useEffect, useRef, useState } from 'react'

const SelectContext = React.createContext(null)

export function Select({ value, onValueChange, children }) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    function onDocumentClick(e) {
      if (!containerRef.current) return
      if (containerRef.current.contains(e.target)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', onDocumentClick)
    return () => document.removeEventListener('mousedown', onDocumentClick)
  }, [])

  const contextValue = {
    open,
    setOpen,
    value,
    setValue: (v) => onValueChange?.(v),
  }

  return (
    <SelectContext.Provider value={contextValue}>
      <div ref={containerRef} className="relative w-full" data-value={value}>
        {children}
      </div>
    </SelectContext.Provider>
  )
}

export function SelectTrigger({ className = '', children }) {
  const ctx = useContext(SelectContext)
  return (
    <button
      type="button"
      className={`w-full rounded-md border px-3 py-2 bg-white text-left flex items-center justify-between ${className}`}
      aria-haspopup="listbox"
      aria-expanded={ctx?.open || false}
      onClick={() => ctx?.setOpen?.(!ctx.open)}
    >
      {children}
      <svg aria-hidden="true" viewBox="0 0 20 20" className="ml-2 h-4 w-4 text-gray-500">
        <path fill="currentColor" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.25 8.29a.75.75 0 0 1-.02-1.08z"/>
      </svg>
    </button>
  )
}

export function SelectValue({ placeholder }) {
  const ctx = useContext(SelectContext)
  return (
    <span className="text-sm text-gray-700">
      {ctx?.value || <span className="text-gray-500">{placeholder}</span>}
    </span>
  )
}

export function SelectContent({ className = '', children }) {
  const ctx = useContext(SelectContext)
  if (!ctx?.open) return null
  return (
    <div
      role="listbox"
      className={`absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-md border bg-white shadow ${className}`}
    >
      {children}
    </div>
  )
}

export function SelectItem({ value, children }) {
  const ctx = useContext(SelectContext)
  const isSelected = ctx?.value === value
  return (
    <div
      role="option"
      aria-selected={isSelected}
      data-value={value}
      className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${isSelected ? 'bg-gray-50' : ''}`}
      onClick={() => {
        ctx?.setValue?.(value)
        ctx?.setOpen?.(false)
      }}
    >
      {children}
    </div>
  )
}


