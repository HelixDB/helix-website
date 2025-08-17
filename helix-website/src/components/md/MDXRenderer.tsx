'use client'

import { useMemo, useState } from 'react'
import { Heading } from './Heading'
import { SyntaxHighlighter } from './SyntaxHighlighter'

interface MDXRendererProps {
  content: string
  className?: string
}

// Enhanced HTML parser that converts to React components
function parseHTMLToComponents(html: string, setCopiedCode: (id: string | null) => void, copiedCode: string | null): React.ReactNode[] {
  const components: React.ReactNode[] = []

  // Clean up HTML entities first, but preserve code blocks
  let processed = html
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#x27;/gi, "'")
    .replace(/&#x2F;/gi, '/')

  // Handle code blocks and tables first (they span multiple paragraphs)
  const codeBlockRegex = /<p>\s*```([^<]*)<\/p>([\s\S]*?)<p>\s*```\s*<\/p>/gi

  // Find all special blocks (code blocks and tables)
  const specialBlocks: { start: number, end: number, type: 'code' | 'table', content: any }[] = []

  let match
  // Find code blocks
  while ((match = codeBlockRegex.exec(processed)) !== null) {
    const rawLanguage = match[1].trim()
    // Only consider it a language if it's a single word with common language patterns
    const language = rawLanguage && /^[a-zA-Z][a-zA-Z0-9+#-]*$/.test(rawLanguage) && rawLanguage.length <= 20 ? rawLanguage : ''
    let codeContent = match[2].replace(/<p>/gi, '\n').replace(/<\/p>/gi, '').trim()
    
    // Decode HTML entities in code content
    codeContent = codeContent
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/&amp;/gi, '&')
      .replace(/&quot;/gi, '"')
      .replace(/&#x27;/gi, "'")
      .replace(/&#x2F;/gi, '/')

    specialBlocks.push({
      start: match.index,
      end: match.index + match[0].length,
      type: 'code',
      content: { language, code: codeContent }
    })
  }

  // Find tables - look for consecutive paragraphs with pipe separators
  const paragraphs = processed.split(/<\/p>/gi)
  let currentIndex = 0
  let tableRows: string[] = []
  let tableStart = -1

  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i].replace(/<p[^>]*>/gi, '').trim()
    const nextIndex = currentIndex + paragraphs[i].length + 4 // +4 for </p>

    if (paragraph.includes('|') && paragraph.startsWith('|') && paragraph.endsWith('|')) {
      if (tableRows.length === 0) {
        tableStart = currentIndex
      }
      tableRows.push(paragraph)
    } else if (tableRows.length > 0) {
      // End of table found
      if (tableRows.length >= 2) { // Need at least header + separator
        specialBlocks.push({
          start: tableStart,
          end: currentIndex,
          type: 'table',
          content: { rows: [...tableRows] }
        })
      }
      tableRows = []
      tableStart = -1
    }

    currentIndex = nextIndex
  }

  // Handle final table if it ends at document end
  if (tableRows.length >= 2) {
    specialBlocks.push({
      start: tableStart,
      end: processed.length,
      type: 'table',
      content: { rows: tableRows }
    })
  }

  // Sort blocks by start position
  specialBlocks.sort((a, b) => a.start - b.start)

  let lastIndex = 0
  let key = 0

  // Process content with special blocks
  for (const block of specialBlocks) {
    // Process content before this block
    const beforeBlock = processed.slice(lastIndex, block.start)
    if (beforeBlock.trim()) {
      components.push(...parseRegularContent(beforeBlock, key))
      key += 100
    }

    // Process the special block
    if (block.type === 'code') {
      const codeId = `code-${key}`
      
      components.push(
        <div key={key++} className="bg-neutral-900 rounded-xl overflow-hidden my-6 border border-neutral-700">
          {/* Code content with copy button in top-right */}
          <div className="overflow-x-auto relative">
            <button 
              onClick={() => {
                const codeElement = document.getElementById(codeId);
                if (codeElement) {
                  navigator.clipboard.writeText(codeElement.textContent || '');
                  setCopiedCode(codeId);
                  setTimeout(() => setCopiedCode(null), 2000);
                }
              }}
              className="absolute top-3 right-3 p-1.5 hover:bg-neutral-700 rounded text-neutral-400 hover:text-neutral-200 transition-colors z-10"
              title="Copy code"
            >
              {codeId === copiedCode ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
            <SyntaxHighlighter 
              code={block.content.code}
              language={block.content.language}
              id={codeId}
            />
          </div>
        </div>
      )
    } else if (block.type === 'table') {
      components.push(renderTable(block.content.rows, key++))
    }

    lastIndex = block.end
  }

  // Process remaining content after last block
  const remainingContent = processed.slice(lastIndex)
  if (remainingContent.trim()) {
    components.push(...parseRegularContent(remainingContent, key))
  }

  return components
}

function renderTable(rows: string[], key: number): React.ReactNode {
  if (rows.length < 2) return null

  // Parse table rows
  const parsedRows = rows.map(row => {
    // Remove leading/trailing pipes and split by pipes
    const cells = row.slice(1, -1).split('|').map(cell => cell.trim())
    return cells
  })

  const headerRow = parsedRows[0]
  const separatorRow = parsedRows[1]
  const dataRows = parsedRows.slice(2)

  // Skip if separator row doesn't look like table separator
  if (!separatorRow.every(cell => cell.match(/^-+$/))) {
    return null
  }

  return (
    <div key={key} className="overflow-x-auto mb-6">
      <table className="min-w-full">
        <thead className="rounded-t-lg">
          <tr>
            {headerRow.map((header, i) => (
              <th key={i} className="px-4 py-1 text-left text-xs font-medium text-neutral-300 dark:text-neutral-300 uppercase tracking-wider bg-neutral-800 dark:bg-neutral-800 border-b border-neutral-600">
                <span dangerouslySetInnerHTML={{ __html: processInlineStyles(header) }} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataRows.map((row, i) => (
            <tr key={i} className="hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors border-b border-neutral-700 dark:border-neutral-700">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-1 text-sm text-neutral-900 dark:text-neutral-100">
                  <span dangerouslySetInnerHTML={{ __html: processInlineStyles(cell) }} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function parseRegularContent(html: string, startKey: number): React.ReactNode[] {
  const components: React.ReactNode[] = []
  const paragraphs = html.split(/<\/p>/gi)
  let key = startKey

  paragraphs.forEach((paragraph) => {
    if (!paragraph.trim()) return

    let content = paragraph.replace(/<p[^>]*>/gi, '').trim()
    if (!content) return

    // Apply angle bracket conversion for placeholders only in regular content
    content = content.replace(/&lt;([^&]+)&gt;/gi, '⟨$1⟩')

    key++

    // Check for headings (markdown style in paragraphs)
    const headingMatch = content.match(/^(#{1,6})\s+(.+)/)
    if (headingMatch) {
      const level = headingMatch[1].length as 1 | 2 | 3 | 4 | 5 | 6
      const text = headingMatch[2]
      const id = generateSlug(text.replace(/<[^>]*>/g, '')) // Remove HTML for ID

      components.push(
        <Heading key={key} level={level} id={id}>
          <span dangerouslySetInnerHTML={{ __html: text }} />
        </Heading>
      )
      return
    }

    // Check for horizontal rules
    if (content.match(/^---+$/)) {
      components.push(
        <hr key={key} className="my-8 border-gray-200 dark:border-gray-700" />
      )
      return
    }

    // Check for blockquotes (>, >>, >>>, etc.)
    const blockquoteMatch = content.match(/^(>+)\s*(.*)/)
    if (blockquoteMatch) {
      const level = blockquoteMatch[1].length
      const quoteContent = blockquoteMatch[2]
      const indentLevel = Math.min(level, 3) // Cap at 3 levels

      components.push(
        <blockquote
          key={key}
          className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 dark:bg-blue-950/20 rounded-r-lg"
          style={{ marginLeft: `${(indentLevel - 1) * 20}px` }}
        >
          <p className="italic text-gray-700 dark:text-gray-300 mb-0">
            <span dangerouslySetInnerHTML={{ __html: processInlineStyles(quoteContent) }} />
          </p>
        </blockquote>
      )
      return
    }

    // Check for list items
    if (content.match(/^-\s/)) {
      const listContent = content.replace(/^-\s/, '')
      components.push(
        <li key={key} className="leading-relaxed text-gray-700 dark:text-gray-300">
          <span dangerouslySetInnerHTML={{ __html: processInlineStyles(listContent) }} />
        </li>
      )
      return
    }

    // Regular paragraph
    components.push(
      <p key={key} className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
        <span dangerouslySetInnerHTML={{ __html: processInlineStyles(content) }} />
      </p>
    )
  })

  return components
}

function processInlineStyles(content: string): string {
  return content
    // Style inline code - let CSS handle the styling for consistency
    .replace(/<code>/gi, '<code>')
    // Style strong
    .replace(/<strong>/gi, '<strong class="font-semibold text-gray-900 dark:text-gray-100">')
    // Style em
    .replace(/<em>/gi, '<em class="italic text-gray-800 dark:text-gray-200">')
    // Style links
    .replace(/<a\s+href="([^"]*)"[^>]*>/gi, '<a href="$1" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline underline-offset-2 transition-colors">')
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function MDXRenderer({ content, className }: MDXRendererProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const components = useMemo(() => {
    return parseHTMLToComponents(content, setCopiedCode, copiedCode)
  }, [content, copiedCode])

  return (
    <div className={`prose prose-lg max-w-none dark:prose-invert ${className || ''}`}>
      {components}
    </div>
  )
}