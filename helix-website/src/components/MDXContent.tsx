'use client'

import React, { useState, useEffect, useRef } from 'react'
import { MDXClient, serialize, SerializeResult } from '@mintlify/mdx'
import Prism from 'prismjs'

// Import Prism languages
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-rust'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-bash'

// Import dark theme CSS
import 'prismjs/themes/prism-tomorrow.css'

interface MDXContentProps {
    source: string
}

interface CodeBlockProps {
    children: React.ReactNode
    language?: string
    className?: string
}

function CodeBlock({ children, language, className }: CodeBlockProps) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [showCopySuccess, setShowCopySuccess] = useState(false)
    const codeRef = useRef<HTMLElement>(null)

    // Extract text content from children (could be string or React elements)
    const getTextContent = (node: React.ReactNode): string => {
        if (typeof node === 'string') return node
        if (typeof node === 'number') return String(node)
        if (Array.isArray(node)) return node.map(getTextContent).join('')
        if (React.isValidElement(node)) {
            const element = node as React.ReactElement<{ children?: React.ReactNode }>
            return getTextContent(element.props.children)
        }
        return ''
    }

    const textContent = getTextContent(children)

    // Determine if code block should be expandable (> 10 lines)
    const lineCount = textContent.split('\n').length
    const isExpandable = lineCount > 10
    const shouldTruncate = isExpandable && !isExpanded

    // Extract language from className if provided, or from first line of content
    let lang = language || className?.replace('language-', '') || 'text'

    // Clean up the text content by removing any language prefix that might be included
    let cleanedTextContent = textContent.trim()
    const lines = cleanedTextContent.split('\n')
    const firstLine = lines[0]?.trim() || ''

    // Check if first line is a language identifier (common languages)
    const knownLanguages = ['rust', 'javascript', 'typescript', 'python', 'json', 'bash', 'sh', 'sql', 'html', 'css', 'go', 'java', 'cpp', 'c', 'php', 'ruby', 'swift', 'kotlin', 'js', 'ts', 'py']

    if (knownLanguages.includes(firstLine.toLowerCase()) && lines.length > 1) {
        // Use the first line as the language and remove it from content
        lang = firstLine.toLowerCase()
        cleanedTextContent = lines.slice(1).join('\n').trim()
    } else if (firstLine === lang && lines.length > 1) {
        // Remove the first line if it matches the detected language
        cleanedTextContent = lines.slice(1).join('\n').trim()
    }

    useEffect(() => {
        if (codeRef.current) {
            Prism.highlightElement(codeRef.current)
        }
    }, [cleanedTextContent, lang, isExpanded])

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(cleanedTextContent)
            setShowCopySuccess(true)
            setTimeout(() => setShowCopySuccess(false), 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    const displayCode = shouldTruncate
        ? cleanedTextContent.split('\n').slice(0, 10).join('\n') + '\n...'
        : cleanedTextContent

    return (
        <div className="relative group my-6 not-prose border border-gray-700 rounded-xl overflow-hidden">
            <div className="bg-neutral-900 overflow-hidden">
                {/* Copy button in top right */}
                <div className="absolute top-3 right-3 z-10">
                    <button
                        onClick={copyToClipboard}
                        className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg bg-neutral-800/80 hover:bg-gray-700 opacity-0 group-hover:opacity-100"
                        title="Copy code"
                    >
                        {showCopySuccess ? (
                            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Code content */}
                <pre
                    className={`p-4 overflow-x-auto text-sm !leading-[0] ${shouldTruncate || (isExpandable && isExpanded) ? '' : 'rounded-b-xl'}`}
                    style={{ margin: 0 }}
                >
                    <code
                        ref={codeRef}
                        className={`language-${lang}`}
                        style={{ background: 'transparent' }}
                    >
                        {displayCode.trim()}
                    </code>
                </pre>

                {/* Expandable overlay and button at bottom */}
                {shouldTruncate && (
                    <>
                        <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none rounded-b-xl" />
                        <div className="absolute bottom-0 left-0 right-0 backdrop-blur-sm rounded-b-xl">
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="w-full px-4 py-3 text-sm text-gray-400 hover:text-white transition-colors flex  gap-2 "
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                                See all {lineCount} lines
                            </button>
                        </div>
                    </>
                )}

                {/* Collapse button when expanded */}
                {isExpandable && isExpanded && (
                    <div className="backdrop-blur-sm">
                        <button
                            onClick={() => setIsExpanded(false)}
                            className="bg-neutral-900 w-full px-4 py-3 text-sm text-gray-400 hover:text-white transition-colors flex gap-2 "
                        >
                            <svg className="w-4 h-4 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                            Collapse
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default function MDXContent({ source }: MDXContentProps) {
    const [mdxSource, setMdxSource] = useState<any | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const customComponents = {
        pre: ({ children, ...props }: any) => {
            // Extract code content and language from children
            const codeElement = children?.props
            if (codeElement) {
                return (
                    <CodeBlock
                        language={codeElement.className?.replace('language-', '')}
                        className={codeElement.className}
                    >
                        {codeElement.children || ''}
                    </CodeBlock>
                )
            }
            return <pre {...props}>{children}</pre>
        }
    }

    useEffect(() => {
        const renderWithMintlify = async () => {
            try {
                console.log('Raw source content:', source.substring(0, 500) + '...')

                // Process Marble content for better MDX compatibility
                const processedContent = processMarbleContent(source)

                console.log('Processed content for MDX:', processedContent.substring(0, 500) + '...')

                // Add timeout to prevent hanging
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('MDX processing timeout')), 10000)
                )

                const serializePromise = serialize({ source: processedContent })

                const resultAny = await Promise.race([serializePromise, timeoutPromise]) as any

                if (resultAny && typeof resultAny === 'object' && 'error' in resultAny) {
                    throw new Error((resultAny as any).error?.message || 'Failed to serialize MDX content')
                }

                console.log('MDX serialization successful')
                setMdxSource(resultAny as SerializeResult)
                setError(null)
            } catch (err) {
                console.error('Error with Mintlify MDX:', err)
                setError(err instanceof Error ? err.message : 'Unknown error occurred')

                // Fallback to basic HTML rendering if MDX fails
                setMdxSource({
                    compiledSource: `function _createMdxContent(props) {
            return React.createElement('div', { 
              dangerouslySetInnerHTML: { __html: ${JSON.stringify(processMarbleContent(source))} }
            });
          }
          function MDXContent(props = {}) {
            return React.createElement(_createMdxContent, props);
          }
          return { default: MDXContent };`,
                    frontmatter: {},
                    scope: {},
                    components: customComponents
                } as any)
            } finally {
                setLoading(false)
            }
        }

        renderWithMintlify()
    }, [source])

    // Convert HTML content from Marble CMS to valid MDX with better structure
    function processMarbleContent(content: string): string {
        let processed = content.trim()

        // First, remove paragraph tags that wrap markdown content (common in Marble CMS)
        processed = processed.replace(/<p>(---)<\/p>/g, '\n$1\n')
        processed = processed.replace(/<p>(#{1,6}\s+.*?)<\/p>/g, '\n$1\n')
        processed = processed.replace(/<p>```(\w+)?<\/p>/g, '\n```$1\n')
        processed = processed.replace(/<p>```<\/p>/g, '\n```\n')

        // Convert inline code (preserve HTML entities for now)
        processed = processed.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, '`$1`')

        // Handle pre-formatted code blocks better (preserve HTML entities inside code)
        processed = processed.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, (match, code) => {
            // Keep HTML entities in code blocks to prevent them from being interpreted as HTML tags
            return '\n```\n' + code.trim() + '\n```\n'
        })

        // Handle standalone code blocks
        processed = processed.replace(/```(\w+)?\s*\n([\s\S]*?)```/g, (match, lang, code) => {
            const language = lang || ''
            return '\n```' + language + '\n' + code.trim() + '\n```\n'
        })

        // NOW decode HTML entities for everything EXCEPT what's inside code blocks
        // First, temporarily replace code blocks with placeholders to protect them
        const codeBlockPlaceholders: string[] = []
        processed = processed.replace(/```[\s\S]*?```/g, (match) => {
            const placeholder = `__CODE_BLOCK_${codeBlockPlaceholders.length}__`
            codeBlockPlaceholders.push(match)
            return placeholder
        })

        const inlineCodePlaceholders: string[] = []
        processed = processed.replace(/`[^`]*`/g, (match) => {
            const placeholder = `__INLINE_CODE_${inlineCodePlaceholders.length}__`
            inlineCodePlaceholders.push(match)
            return placeholder
        })

        // Decode HTML entities in non-code content
        processed = processed.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"')

        // Restore code blocks and inline code with proper HTML entity decoding
        inlineCodePlaceholders.forEach((code, index) => {
            // Decode HTML entities inside code but preserve the structure
            const decodedCode = code.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"')
            processed = processed.replace(`__INLINE_CODE_${index}__`, decodedCode)
        })
        codeBlockPlaceholders.forEach((code, index) => {
            // Decode HTML entities inside code blocks but preserve the structure
            const decodedCode = code.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"')
            processed = processed.replace(`__CODE_BLOCK_${index}__`, decodedCode)
        })

        // Convert HTML-encoded headers that are now unwrapped
        processed = processed.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '\n# $1\n')
        processed = processed.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '\n## $1\n')
        processed = processed.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '\n### $1\n')
        processed = processed.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '\n#### $1\n')
        processed = processed.replace(/<h5[^>]*>(.*?)<\/h5>/gi, '\n##### $1\n')
        processed = processed.replace(/<h6[^>]*>(.*?)<\/h6>/gi, '\n###### $1\n')

        // Convert remaining paragraph-wrapped content to proper text with spacing
        processed = processed.replace(/<p>([\s\S]*?)<\/p>/gi, '$1\n\n')

        // Only escape curly braces that are NOT inside code blocks (between ``` or `)
        // This preserves JSON examples while escaping JSX conflicts
        let inCodeBlock = false
        let inInlineCode = false
        let result = ''

        for (let i = 0; i < processed.length; i++) {
            const char = processed[i]
            const nextThree = processed.substr(i, 3)

            // Track code block boundaries
            if (nextThree === '```') {
                inCodeBlock = !inCodeBlock
                result += char
            } else if (char === '`' && !inCodeBlock) {
                inInlineCode = !inInlineCode
                result += char
            } else if ((char === '{' || char === '}') && !inCodeBlock && !inInlineCode) {
                // Only escape braces outside of code blocks/inline code
                result += '\\' + char
            } else {
                result += char
            }
        }

        processed = result

        // Convert HTML headers to markdown headers with proper spacing
        processed = processed.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '\n# $1\n')
        processed = processed.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '\n## $1\n')
        processed = processed.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '\n### $1\n')
        processed = processed.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '\n#### $1\n')
        processed = processed.replace(/<h5[^>]*>(.*?)<\/h5>/gi, '\n##### $1\n')
        processed = processed.replace(/<h6[^>]*>(.*?)<\/h6>/gi, '\n###### $1\n')

        // Convert paragraphs to plain text with single line breaks
        processed = processed.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '\n$1\n')

        // Convert line breaks
        processed = processed.replace(/<br\s*\/?>/gi, '\n')

        // Convert horizontal rules
        processed = processed.replace(/<hr\s*\/?>/gi, '\n---\n')

        // Convert bold and italic text
        processed = processed.replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, '**$1**')
        processed = processed.replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, '**$1**')
        processed = processed.replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, '*$1*')
        processed = processed.replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, '*$1*')

        // Convert links
        processed = processed.replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)')

        // Convert unordered lists
        processed = processed.replace(/<ul[^>]*>/gi, '\n')
        processed = processed.replace(/<\/ul>/gi, '\n')
        processed = processed.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '- $1\n')

        // Convert ordered lists  
        processed = processed.replace(/<ol[^>]*>/gi, '\n')

        processed = processed.replace(/<\/ol>/gi, '\n')
        let listCounter = 1
        processed = processed.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, () => `${listCounter++}. $1\n`)


        // Convert custom CMS components to styled blockquotes
        processed = processed.replace(/<Note[^>]*>([\s\S]*?)<\/Note>/gi, '\n> **💡 Note:** $1\n')
        processed = processed.replace(/<Warning[^>]*>([\s\S]*?)<\/Warning>/gi, '\n> **⚠️ Warning:** $1\n')
        processed = processed.replace(/<Tip[^>]*>([\s\S]*?)<\/Tip>/gi, '\n> **💡 Tip:** $1\n')

        // Remove any remaining HTML tags, but preserve code blocks first
        // Save all code blocks again to protect them from HTML tag removal
        const finalCodeBlockPlaceholders: string[] = []
        processed = processed.replace(/```[\s\S]*?```/g, (match) => {
            const placeholder = `__FINAL_CODE_BLOCK_${finalCodeBlockPlaceholders.length}__`
            finalCodeBlockPlaceholders.push(match)
            return placeholder
        })

        const finalInlineCodePlaceholders: string[] = []
        processed = processed.replace(/`[^`]*`/g, (match) => {
            const placeholder = `__FINAL_INLINE_CODE_${finalInlineCodePlaceholders.length}__`
            finalInlineCodePlaceholders.push(match)
            return placeholder
        })

        // Now remove HTML tags from non-code content
        processed = processed.replace(/<[^>]+>/g, '')

        // Restore the code blocks
        finalInlineCodePlaceholders.forEach((code, index) => {
            processed = processed.replace(`__FINAL_INLINE_CODE_${index}__`, code)
        })
        finalCodeBlockPlaceholders.forEach((code, index) => {
            processed = processed.replace(`__FINAL_CODE_BLOCK_${index}__`, code)
        })

        // Clean up multiple newlines but keep paragraph structure
        processed = processed.replace(/\n{4,}/g, '\n\n\n')
        processed = processed.replace(/\n{2,}(?=\n#)/g, '\n\n')

        // Ensure headers have proper spacing
        processed = processed.replace(/\n(#{1,6}\s)/g, '\n\n$1')
        processed = processed.replace(/(#{1,6}.*)\n(?!\n)/g, '$1\n\n')

        // Trim and ensure we start and end cleanly
        processed = processed.trim()

        return processed
    }

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="space-y-3">
                    <div className="h-8 bg-gray-700/50 rounded-lg"></div>
                    <div className="h-4 bg-gray-700/30 rounded w-4/5"></div>
                    <div className="h-4 bg-gray-700/30 rounded w-3/5"></div>
                </div>
                <div className="space-y-3">
                    <div className="h-6 bg-gray-700/40 rounded w-2/3"></div>
                    <div className="h-4 bg-gray-700/20 rounded w-full"></div>
                    <div className="h-4 bg-gray-700/20 rounded w-5/6"></div>
                </div>
                <div className="space-y-2">
                    <div className="h-24 bg-gray-700/20 rounded-lg"></div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-6 bg-red-900/10 border border-red-500/30 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                        <span className="text-red-400 text-sm">⚠</span>
                    </div>
                    <h3 className="text-red-400 font-semibold">Content Loading Error</h3>
                </div>
                <p className="text-red-300/80 text-sm leading-relaxed mb-3">{error}</p>
                <p className="text-gray-400 text-xs">
                    The system is attempting to process the content. Please refresh the page if this persists.
                </p>
            </div>
        )
    }

    if (!mdxSource) {
        return (
            <div className="p-8 bg-gray-800/30 rounded-xl border border-gray-700/50">
                <div className="text-center">
                    <div className="w-12 h-12 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-gray-400 text-lg">📄</span>
                    </div>
                    <p className="text-gray-400 font-medium mb-1">No content available</p>
                    <p className="text-gray-500 text-sm">The content for this post is not currently available.</p>
                </div>
            </div>
        )
    }

    return (
        <>
            <style jsx global>{`
        /* Custom dark theme overrides for Prism */
        .token.comment,
        .token.prolog,
        .token.doctype,
        .token.cdata {
          color: #6b7280;
          font-style: italic;
        }
        
        .token.string,
        .token.attr-value {
          color: #22d3ee;
        }
        
        .token.property,
        .token.number {
          color: #fb7185;
        }
        
        .token.keyword,
        .token.tag {
          color: #a78bfa;
        }
        
        .token.attr-name {
          color: #60a5fa;
        }
        
        .token.punctuation {
          color: #9ca3af;
        }
        
        .token.operator,
        .token.boolean {
          color: #f59e0b;
        }
        
        .token.function {
          color: #34d399;
        }
        
        .token.variable {
          color: #fbbf24;
        }
        
        /* Override prism-tomorrow background */
        code[class*="language-"],
        pre[class*="language-"] {
          background: #1a1a1a !important;
        }
      `}</style>

            <div className="prose prose-lg prose-invert max-w-none [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-white [&_h1]:mt-8 [&_h1]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mt-8 [&_h2]:mb-4 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-white [&_h3]:mt-6 [&_h3]:mb-3 [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:text-white [&_h4]:mt-6 [&_h4]:mb-3 [&_p]:text-gray-300 [&_p]:leading-relaxed [&_p]:mb-4 [&_p]:text-lg [&_strong]:text-white [&_strong]:font-semibold [&_code]:text-amber-400 [&_code]:bg-gray-800/80 [&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_code]:font-mono [&_code]:text-sm [&_code]:font-medium [&_blockquote]:border-l-4 [&_blockquote]:border-blue-500 [&_blockquote]:bg-blue-900/10 [&_blockquote]:pl-6 [&_blockquote]:py-4 [&_blockquote]:rounded-r-lg [&_blockquote]:my-6 [&_ul]:text-gray-300 [&_ol]:text-gray-300 [&_li]:text-gray-300 [&_li]:mb-1 [&_a]:text-blue-400 [&_a]:no-underline hover:[&_a]:underline hover:[&_a]:text-blue-300">
                <MDXClient
                    {...mdxSource}
                    components={customComponents}
                />
            </div>
        </>
    )
}