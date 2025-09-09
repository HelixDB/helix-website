'use client'

import { useMemo, useState } from 'react'
import { Prose } from '../prose'
import { SyntaxHighlighter } from './SyntaxHighlighter'

interface MDXRendererProseProps {
  content: string
  className?: string
}

interface CodeBlock {
  id: string
  language: string
  code: string
  placeholder: string
}

// Helper function to render tables
function renderTable(rows: string[]): string {
  if (rows.length < 2) return ''

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
    return rows.join('\n')
  }

  const processInlineStyles = (content: string): string => {
    // Process inline code first
    let processed = content.replace(/`([^`]+)`/g, '<code class="bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')

    // Then handle markdown links
    processed = processed.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline underline-offset-2 transition-colors">$1</a>')

    // Style strong and em
    processed = processed.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-gray-100">$1</strong>')
    processed = processed.replace(/\*([^*]+)\*/g, '<em class="italic text-gray-800 dark:text-gray-200">$1</em>')

    return processed
  }

  return `<div class="not-prose overflow-x-auto mb-6">
    <table class="min-w-full">
      <thead class="rounded-t-lg">
        <tr>
          ${headerRow.map(header =>
    `<th class="px-4 py-1 text-left text-xs font-medium text-neutral-300 dark:text-neutral-300 uppercase tracking-wider bg-neutral-800 dark:bg-neutral-800 border-b border-neutral-600">${processInlineStyles(header)}</th>`
  ).join('')}
        </tr>
      </thead>
      <tbody>
        ${dataRows.map(row =>
    `<tr class="hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors border-b border-neutral-700 dark:border-neutral-700">
            ${row.map(cell =>
      `<td class="px-4 py-1 text-sm text-neutral-900 dark:text-neutral-100">${processInlineStyles(cell)}</td>`
    ).join('')}
          </tr>`
  ).join('')}
      </tbody>
    </table>
  </div>`
}



export function MDXRendererProse({ content, className }: MDXRendererProseProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const { processedContent, codeBlocks } = useMemo(() => {
    const extractedCodeBlocks: CodeBlock[] = []
    let processed = content
      .replace(/&amp;/gi, '&')
      .replace(/&quot;/gi, '"')
      .replace(/&#x27;/gi, "'")
      .replace(/&#x2F;/gi, '/')
      .replace(/&gt;/gi, '>')
      .replace(/&lt;/gi, '<')

    // Process code blocks with custom styling
    const codeBlockRegex = /<p>\s*```([^<]*)<\/p>([\s\S]*?)<p>\s*```\s*<\/p>/gi
    let codeBlockIndex = 0

    processed = processed.replace(codeBlockRegex, (match, lang, code) => {
      const rawLanguage = lang.trim()
      const language = rawLanguage && /^[a-zA-Z][a-zA-Z0-9+#-]*$/.test(rawLanguage) && rawLanguage.length <= 20 ? rawLanguage : ''
      let codeContent = code.replace(/<p>/gi, '\n').replace(/<\/p>/gi, '').trim()

      // Decode HTML entities in code content
      codeContent = codeContent
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
        .replace(/&amp;/gi, '&')
        .replace(/&quot;/gi, '"')
        .replace(/&#x27;/gi, "'")
        .replace(/&#x2F;/gi, '/')

      const codeId = `code-block-${codeBlockIndex}`
      const placeholder = `__CODE_BLOCK_${codeBlockIndex}__`

      extractedCodeBlocks.push({
        id: codeId,
        language,
        code: codeContent,
        placeholder
      })


      codeBlockIndex++
      return placeholder
    })

    // Process inline code blocks
    processed = processed.replace(/<code>([^<]+)<\/code>/gi, (match, code) => {
      return `<code class="bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-sm font-mono">${code}</code>`
    })

    // Process tables (they span multiple paragraphs)
    const specialBlocks: { start: number, end: number, type: 'table', content: any }[] = []

    // Find tables - look for consecutive paragraphs
    const paragraphs = processed.split(/<\/p>/gi)
    let currentIndex = 0
    let tableRows: string[] = []
    let tableStart = -1

    for (let i = 0; i < paragraphs.length; i++) {
      const paragraph = paragraphs[i].replace(/<p[^>]*>/gi, '').trim()
      const nextIndex = currentIndex + paragraphs[i].length + 4 // +4 for </p>

      // Check for table rows
      if (paragraph.includes('|') && paragraph.startsWith('|') && paragraph.endsWith('|')) {
        if (tableRows.length === 0) {
          tableStart = currentIndex
        }
        tableRows.push(paragraph)
      }
      // Regular content - end any ongoing table
      else {
        if (tableRows.length >= 2) {
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

    // Sort blocks by start position and process them
    specialBlocks.sort((a, b) => a.start - b.start)

    let processedWithSpecialBlocks = processed
    let offset = 0

    for (const block of specialBlocks) {
      const beforeBlock = processedWithSpecialBlocks.slice(0, block.start + offset)
      const afterBlock = processedWithSpecialBlocks.slice(block.end + offset)

      let blockHtml = ''

      if (block.type === 'table') {
        blockHtml = renderTable(block.content.rows)
      }

      processedWithSpecialBlocks = beforeBlock + blockHtml + afterBlock
      offset += blockHtml.length - (block.end - block.start)
    }

    processed = processedWithSpecialBlocks

    // Process paragraphs
    processed = processed.replace(/<p>/gi, '<p class="mb-4 leading-relaxed">')

    // Process headings
    processed = processed
      .replace(/<h1>/gi, '<h1 class="text-3xl font-bold mt-8 mb-4">')
      .replace(/<h2>/gi, '<h2 class="text-2xl font-bold mt-6 mb-3">')
      .replace(/<h3>/gi, '<h3 class="text-xl font-bold mt-4 mb-2">')
      .replace(/<h4>/gi, '<h4 class="text-lg font-bold mt-3 mb-2">')

    // Process links
    processed = processed.replace(/<a\s+href="([^"]+)"[^>]*>([^<]+)<\/a>/gi, (match, url, text) => {
      return `<a href="${url}" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline underline-offset-2 transition-colors" target="_blank" rel="noopener noreferrer">${text}</a>`
    })

    // Process lists
    processed = processed
      .replace(/<ul>/gi, '<ul class="list-disc pl-6 mb-4 space-y-2">')
      .replace(/<ol>/gi, '<ol class="list-decimal pl-6 mb-4 space-y-2">')
      .replace(/<li>/gi, '<li class="leading-relaxed">')

    // Process emphasis and strong
    processed = processed
      .replace(/<strong>/gi, '<strong class="font-semibold text-gray-900 dark:text-gray-100">')
      .replace(/<em>/gi, '<em class="italic text-gray-800 dark:text-gray-200">')


    return { processedContent: processed, codeBlocks: extractedCodeBlocks }
  }, [content])

  // Split content by code block placeholders and render
  const contentParts = processedContent.split(/__CODE_BLOCK_\d+__/)
  const placeholderMatches = processedContent.match(/__CODE_BLOCK_\d+__/g) || []

  return (
    <Prose className={className}>
      {contentParts.map((part, index) => (
        <div key={index}>
          {part && (
            <div dangerouslySetInnerHTML={{ __html: part }} />
          )}
          {placeholderMatches[index] && (() => {
            const blockIndex = parseInt(placeholderMatches[index].match(/\d+/)?.[0] || '0')
            const block = codeBlocks[blockIndex]
            if (!block) return null

            return (
              <pre key={`code-${blockIndex}`} className="not-prose bg-neutral-900 rounded-xl overflow-x-auto my-6 border border-neutral-700 relative">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(block.code);
                    setCopiedCode(block.id);
                    setTimeout(() => setCopiedCode(null), 2000);
                  }}
                  className="absolute top-3 right-3 p-1.5 hover:bg-neutral-700 rounded text-neutral-400 hover:text-neutral-200 transition-colors z-10"
                  title="Copy code"
                  suppressHydrationWarning
                >
                  {copiedCode === block.id ? (
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
                  code={block.code}
                  language={block.language}
                  id={block.id}
                />
              </pre>
            )
          })()}
        </div>
      ))}
    </Prose>
  )
}