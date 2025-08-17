'use client'

import { createElement, useState } from 'react'
import { Link as LinkIcon, Check } from 'lucide-react'

interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6
  id?: string
  children: React.ReactNode
}

export function Heading({ level, id, children }: HeadingProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = async () => {
    if (!id) return

    const url = `${window.location.origin}${window.location.pathname}#${id}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getHeadingStyles = (level: number) => {
    const baseStyles = 'font-bold text-foreground group relative'

    switch (level) {
      case 2:
        return `${baseStyles} text-3xl mb-4 mt-8`
      case 3:
        return `${baseStyles} text-2xl mb-3 mt-6`
      case 4:
        return `${baseStyles} text-xl mb-2 mt-4`
      case 5:
        return `${baseStyles} text-lg mb-2 mt-4`
      case 6:
        return `${baseStyles} text-base mb-2 mt-4`
      default:
        return baseStyles
    }
  }

  return createElement(
    `h${level}`,
    {
      id,
      className: getHeadingStyles(level),
    },
    [
      children,
      id && (
        <button
          key="copy-link"
          onClick={handleCopyLink}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2 p-1 hover:bg-muted rounded"
          aria-label="Copy link to heading"
          title="Copy link"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <LinkIcon className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
      ),
    ].filter(Boolean)
  )
}