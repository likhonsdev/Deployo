import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { extractCodeBlocks } from '@/lib/code-utils'
import { CodeBlock } from './code-block'

interface XmlParserProps {
  content: string
  showThinking: boolean
}

export function XmlParser({ content, showThinking }: XmlParserProps) {
  // Extract thinking and response sections using regex
  const thinkingMatch = content.match(/<thinking>([\s\S]*?)<\/thinking>/i)
  const responseMatch = content.match(/<response>([\s\S]*?)<\/response>/i)

  const thinking = thinkingMatch ? thinkingMatch[1].trim() : ''
  const response = responseMatch ? responseMatch[1].trim() : content.trim()

  // Extract code blocks from response
  const { text: textWithPlaceholders, codeBlocks } = extractCodeBlocks(response)

  return (
    <div>
      {showThinking && thinking && (
        <div className="thinking-section">
          <h4 className="mb-2 text-xs font-semibold uppercase">Thinking</h4>
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
            {thinking}
          </ReactMarkdown>
        </div>
      )}

      <div className="response-section">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            pre: ({ node, ...props }) => {
              // This is handled by our code block renderer below
              return <>{props.children}</>
            },
            code: ({ node, className, children, ...props }) => {
              const match = /language-(\w+)/.exec(className || '')
              const language = match ? match[1] : ''
              const code = String(children).replace(/\n$/, '')
              
              if (!language) {
                return (
                  <code className="bg-muted rounded px-1 py-0.5" {...props}>
                    {code}
                  </code>
                )
              }
              
              return null // Let the placeholder be replaced below
            },
          }}
        >
          {textWithPlaceholders}
        </ReactMarkdown>

        {/* Render code blocks */}
        {codeBlocks.map((block, index) => (
          <div key={index} className="my-4">
            <CodeBlock
              language={block.language}
              code={block.code}
              fileName={block.fileName || undefined}
              project={block.project || undefined}
              description={block.description || undefined}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
