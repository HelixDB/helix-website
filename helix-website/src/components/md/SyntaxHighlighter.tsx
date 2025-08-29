'use client'

import { useEffect, useState } from 'react'
import Prism from 'prismjs'

// Import core languages
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-rust'
import 'prismjs/components/prism-go'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-markup' // HTML
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-yaml'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'

// Prism theme and overrides are imported globally in globals.css

interface SyntaxHighlighterProps {
  code: string
  language: string
  id: string
}

// Map common language aliases to Prism language keys
const languageMap: Record<string, string> = {
  'js': 'javascript',
  'ts': 'typescript',
  'py': 'python',
  'html': 'markup',
  'xml': 'markup',
  'yml': 'yaml',
  'md': 'markdown',
  'shell': 'bash',
  'sh': 'bash',
  'zsh': 'bash',
  'fish': 'bash',
}

export function SyntaxHighlighter({ code, language, id }: SyntaxHighlighterProps) {
  const [highlightedCode, setHighlightedCode] = useState('')
  const [isClient, setIsClient] = useState(false)
  
  // Get the correct language key for Prism
  const prismLanguage = languageMap[language.toLowerCase()] || language.toLowerCase()
  
  useEffect(() => {
    setIsClient(true)
    
    // Check if the language is supported by Prism
    const grammar = Prism.languages[prismLanguage]
    
    if (grammar) {
      // Use Prism to highlight the code
      const highlighted = Prism.highlight(code, grammar, prismLanguage)
      setHighlightedCode(highlighted)
    } else {
      // Just use plain text
      setHighlightedCode(code)
    }
  }, [code, prismLanguage])

  // Check if the language is supported by Prism
  const grammar = Prism.languages[prismLanguage]
  
  if (!isClient || !grammar) {
    // Server-side render or unsupported language - plain text
    return (
      <pre className={`p-4 text-xs font-mono leading-relaxed language-text`}>
        <code 
          id={id}
          className="language-text"
          style={{ color: '#e5e7eb' }}
        >
          {code}
        </code>
      </pre>
    )
  }

  return (
    <pre className={`p-4 text-xs font-mono leading-relaxed language-${prismLanguage}`}>
      <code 
        id={id}
        className={`language-${prismLanguage}`}
        dangerouslySetInnerHTML={{ __html: highlightedCode }}
      />
    </pre>
  )
}