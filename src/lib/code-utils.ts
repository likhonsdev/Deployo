interface CodeBlock {
  language: string
  code: string
  fileName?: string
  project?: string
  description?: string
  type?: string
}

/**
 * Extracts code blocks from XML-based codeblock format:
 * <codeblock type="python_file" project="project-name" file="filename.py" description="Description">code</codeblock>
 */
export function extractCodeBlocks(content: string): {
  text: string
  codeBlocks: CodeBlock[]
} {
  const codeBlocks: CodeBlock[] = []
  
  // Replace markdown code blocks first (they have lower precedence)
  let processedContent = content.replace(
    /```(\w+)?\n([\s\S]*?)```/g,
    (match, language, code) => {
      const blockId = `__CODE_BLOCK_${codeBlocks.length}__`
      codeBlocks.push({
        language: language || 'text',
        code: code.trim(),
      })
      return blockId
    }
  )
  
  // Then replace our custom XML-style code blocks
  processedContent = processedContent.replace(
    /<codeblock\s+(?:type="([^"]*)")?\s*(?:project="([^"]*)")?\s*(?:file="([^"]*)")?\s*(?:description="([^"]*)")?\s*(?:environment="([^"]*)")?\s*>([\s\S]*?)<\/codeblock>/g,
    (match, type, project, fileName, description, environment, code) => {
      const blockId = `__CODE_BLOCK_${codeBlocks.length}__`
      
      // Infer language from type or file extension
      let language = 'text'
      if (type) {
        if (type === 'python_file') language = 'python'
        else if (type === 'cli_command') language = 'bash'
        else if (type === 'config_file') language = inferLanguageFromFileExtension(fileName || '')
        else if (type === 'dockerfile') language = 'dockerfile'
        else language = type.replace('_file', '')
      } else if (fileName) {
        language = inferLanguageFromFileExtension(fileName)
      }
      
      codeBlocks.push({
        language,
        code: code.trim(),
        fileName,
        project,
        description,
        type,
      })
      
      return blockId
    }
  )
  
  return { text: processedContent, codeBlocks }
}

/**
 * Infers language from file extension for syntax highlighting
 */
function inferLanguageFromFileExtension(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase() || ''
  
  const extensionMap: Record<string, string> = {
    'py': 'python',
    'js': 'javascript',
    'jsx': 'jsx',
    'ts': 'typescript',
    'tsx': 'tsx',
    'html': 'html',
    'css': 'css',
    'json': 'json',
    'md': 'markdown',
    'sql': 'sql',
    'yml': 'yaml',
    'yaml': 'yaml',
    'toml': 'toml',
    'sh': 'bash',
    'bash': 'bash',
    'dockerfile': 'dockerfile',
  }
  
  return extensionMap[extension] || 'text'
}
