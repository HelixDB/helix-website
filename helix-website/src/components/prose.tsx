import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

type ProseProps = HTMLAttributes<HTMLElement> & {
  as?: 'article';
  html?: string;
};

export function Prose({ children, html, className, ...props }: ProseProps) {
  return (
    <article
      className={cn(
        // Base prose styles from Tailwind Typography
        'prose prose-neutral dark:prose-invert',
        // Size modifiers
        'prose-lg',
        // Max width control
        'max-w-none',
        // Heading styles
        'prose-headings:font-bold',
        'prose-h1:text-3xl prose-h1:mt-8 prose-h1:mb-4',
        'prose-h2:text-2xl prose-h2:mt-6 prose-h2:mb-3',
        'prose-h3:text-xl prose-h3:mt-4 prose-h3:mb-2',
        'prose-h4:text-lg prose-h4:mt-3 prose-h4:mb-2',
        // Paragraph styles
        'prose-p:leading-relaxed prose-p:text-gray-700 dark:prose-p:text-gray-300',
        // Link styles
        'prose-a:text-blue-600 dark:prose-a:text-blue-400',
        'prose-a:underline prose-a:underline-offset-2',
        'prose-a:transition-colors prose-a:decoration-blue-600/30',
        'hover:prose-a:text-blue-700 dark:hover:prose-a:text-blue-300',
        'hover:prose-a:decoration-blue-600/50',
        // Strong and emphasis
        'prose-strong:font-semibold prose-strong:text-gray-900 dark:prose-strong:text-gray-100',
        'prose-em:italic prose-em:text-gray-800 dark:prose-em:text-gray-200',
        // Lists
        'prose-ul:list-disc prose-ol:list-decimal',
        'prose-li:leading-relaxed prose-li:text-gray-700 dark:prose-li:text-gray-300',
        // Blockquotes - Custom styling to match your design
        'prose-blockquote:border-l-4 prose-blockquote:border-neutral-400 dark:prose-blockquote:border-neutral-600',
        'prose-blockquote:pl-6 prose-blockquote:py-4 prose-blockquote:my-6',
        'prose-blockquote:font-normal prose-blockquote:not-italic',
        // Code blocks - We'll handle these with custom components
        'prose-pre:bg-transparent prose-pre:p-0',
        // Inline code styling
        'prose-code:bg-neutral-100 dark:prose-code:bg-neutral-800',
        'prose-code:text-orange-500 dark:prose-code:text-orange-400',
        'prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded',
        'prose-code:text-sm prose-code:font-mono prose-code:font-medium',
        'prose-code:before:content-none prose-code:after:content-none',
        // Tables
        'prose-table:min-w-full',
        'prose-thead:bg-neutral-800 dark:prose-thead:bg-neutral-800',
        'prose-th:px-4 prose-th:py-1 prose-th:text-left prose-th:text-xs',
        'prose-th:font-medium prose-th:text-neutral-300 prose-th:uppercase prose-th:tracking-wider',
        'prose-td:px-4 prose-td:py-1 prose-td:text-sm',
        'prose-tr:border-b prose-tr:border-neutral-700 dark:prose-tr:border-neutral-700',
        'hover:prose-tr:bg-neutral-200 dark:hover:prose-tr:bg-neutral-800',
        // Images
        'prose-img:rounded-xl prose-img:shadow-lg',
        // HR
        'prose-hr:my-8 prose-hr:border-gray-200 dark:prose-hr:border-gray-700',
        className
      )}
      {...props}
    >
      {html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : children}
    </article>
  );
}