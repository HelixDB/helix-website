'use client'

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

// Import standard Prism dark theme
import 'prismjs/themes/prism-dark.css'
// Override Prism styles to remove background/border
import '../../styles/prism-override.css'

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
  // Get the correct language key for Prism
  const prismLanguage = languageMap[language.toLowerCase()] || language.toLowerCase()

  // Use Prism to highlight the code - let Prism handle unsupported languages
  const highlightedCode = Prism.highlight(
    code, 
    Prism.languages[prismLanguage] || Prism.languages.text || {}, 
    prismLanguage
  )
  
  return (
    <pre className={`p-4 text-sm font-mono leading-relaxed language-${prismLanguage}`}>
      <code 
        id={id}
        className={`language-${prismLanguage}`}
        dangerouslySetInnerHTML={{ __html: highlightedCode }}
      />
    </pre>
  )
}