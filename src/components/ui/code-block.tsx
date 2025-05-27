import { useState } from 'react'
import { cn } from '@/lib/utils'

interface CodeBlockProps {
  code: string
  language: string
  fileName?: string
  project?: string
  description?: string
}

export function CodeBlock({
  code,
  language,
  fileName,
  project,
  description,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <div className="code-block">
      <div className="code-block-header">
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
          {language && (
            <div className="rounded bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
              {language}
            </div>
          )}
          {fileName && <span className="text-sm">{fileName}</span>}
          {project && (
            <span className="text-xs text-muted-foreground">{project}</span>
          )}
          {description && (
            <span className="text-xs text-muted-foreground">{description}</span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="rounded-md p-1 hover:bg-muted-foreground/10"
        >
          {copied ? (
            <CheckIcon className="h-4 w-4 text-green-500" />
          ) : (
            <CopyIcon className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
      </div>
      <pre className="p-4">
        <code className={cn('language-' + language)}>{code}</code>
      </pre>
    </div>
  )
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function CopyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c0-1.1.9-2 2-2h2" />
      <path d="M4 12c0-1.1.9-2 2-2h2" />
      <path d="M4 8c0-1.1.9-2 2-2h2" />
    </svg>
  )
}
