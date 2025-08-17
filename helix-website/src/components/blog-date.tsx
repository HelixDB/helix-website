'use client'

import { useEffect, useState } from 'react'

interface BlogDateProps {
  dateString: string
  format?: 'short' | 'long'
  className?: string
}

export function BlogDate({ dateString, format = 'short', className = '' }: BlogDateProps) {
  const [formattedDate, setFormattedDate] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const date = new Date(dateString)
    
    if (format === 'long') {
      setFormattedDate(date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }))
    } else {
      setFormattedDate(date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }))
    }
  }, [dateString, format])

  if (!mounted) {
    return <span className={className}>Loading...</span>
  }

  return (
    <time dateTime={dateString} className={className}>
      {formattedDate}
    </time>
  )
}