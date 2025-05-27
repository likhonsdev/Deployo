import { nanoid } from 'nanoid'

// Define a simplified Sandbox interface since we couldn't install @e2b/code-interpreter
interface Sandbox {
  runCode(code: string): Promise<{
    error?: { message?: string },
    text?: string,
    logs: { stdout: string[], stderr: string[] }
  }>;
  runShell(command: string): Promise<{
    exitCode: number,
    stdout: string,
    stderr: string
  }>;
}

// Mock Sandbox implementation
class MockSandbox implements Sandbox {
  async runCode(code: string) {
    console.log('Mock code execution:', code);
    try {
      // Simple code evaluation for demonstration
      const result = eval(code);
      return {
        text: String(result),
        logs: { stdout: [], stderr: [] }
      };
    } catch (err) {
      return {
        error: { message: err instanceof Error ? err.message : String(err) },
        logs: { stdout: [], stderr: [String(err)] }
      };
    }
  }

  async runShell(command: string) {
    console.log('Mock shell execution:', command);
    return {
      exitCode: 0,
      stdout: `Executed: ${command}`,
      stderr: ''
    };
  }
}

// Mock implementation of Sandbox.create
namespace Sandbox {
  export async function create(): Promise<Sandbox> {
    return new MockSandbox();
  }
}

/**
 * Commands supported by the code interpreter
 */
export enum InterpreterCommand {
  SAVE = '/save',
  EDIT = '/edit',
  EXECUTE = '/execute',
  MODE = '/mode',
  MODEL = '/model',
  INSTALL = '/install',
  LANGUAGE = '/language',
  CLEAR = '/clear',
  HELP = '/help',
  LIST = '/list',
  VERSION = '/version',
  EXIT = '/exit',
  FIX = '/fix',
  LOG = '/log',
  UPGRADE = '/upgrade',
  PROMPT = '/prompt',
  SHELL = '/shell',
  DEBUG = '/debug'
}

/**
 * Programming languages supported by the interpreter
 */
export enum ProgrammingLanguage {
  JAVASCRIPT = 'javascript',
  TYPESCRIPT = 'typescript',
  PYTHON = 'python'
}

/**
 * Execution modes for the interpreter
 */
export enum InterpreterMode {
  INTERACTIVE = 'interactive',
  BATCH = 'batch'
}

/**
 * Models that can be used with the interpreter
 */
export enum InterpreterModel {
  DEFAULT = 'default',
  GEMINI = 'gemini'
}

/**
 * Result of code execution
 */
export interface CodeExecutionResult {
  success: boolean
  output: string
  language: string
}

/**
 * State of the code interpreter
 */
export interface CodeInterpreterState {
  language: ProgrammingLanguage
  mode: InterpreterMode
  model: InterpreterModel
  lastCode: string
  isDebugging: boolean
  isLogging: boolean
  savedCode: Map<string, string>
  installedPackages: string[]
}

/**
 * Code Interpreter Service for handling code execution and commands
 */
export class CodeInterpreterService {
  private sandbox: Sandbox | null = null
  private state: CodeInterpreterState = {
    language: ProgrammingLanguage.PYTHON,
    mode: InterpreterMode.INTERACTIVE,
    model: InterpreterModel.DEFAULT,
    lastCode: '',
    isDebugging: false,
    isLogging: false,
    savedCode: new Map(),
    installedPackages: []
  }

  /**
   * Initialize the code interpreter sandbox
   */
  private async initializeSandbox(): Promise<Sandbox> {
    if (!this.sandbox) {
      try {
        this.sandbox = await Sandbox.create()
        console.log('Code interpreter sandbox initialized')
      } catch (error) {
        console.error('Failed to initialize sandbox:', error)
        throw new Error(error instanceof Error ? error.message : String(error))
      }
    }
    return this.sandbox
  }

  /**
   * Determine the programming language from a code block specifier
   */
  private determineLanguage(languageSpecifier?: string): ProgrammingLanguage {
    if (!languageSpecifier) {
      return this.state.language // Use current language if not specified
    }
    
    const specifier = languageSpecifier.toLowerCase()
    
    if (specifier === 'js' || specifier === 'javascript') {
      return ProgrammingLanguage.JAVASCRIPT
    }
    
    if (specifier === 'ts' || specifier === 'typescript') {
      return ProgrammingLanguage.TYPESCRIPT
    }
    
    if (specifier === 'py' || specifier === 'python') {
      return ProgrammingLanguage.PYTHON
    }
    
    return this.state.language
  }

  /**
   * Get the help text for the interpreter
   */
  private getHelpText(): string {
    return `
📝 /save - Save the last code generated.
✏️ /edit - Edit the last code generated.
▶️ /execute - Execute the last code generated.
🔄 /mode - Change the mode of interpreter.
🔄 /model - Change the model of interpreter.
📦 /install - Install a package from npm or pip.
🌐 /language - Change the language of the interpreter.
🧹 /clear - Clear the screen.
🆘 /help - Display this help message.
🚪 /list - List all the models/modes/language available.
📝 /version - Display the version of the interpreter.
🚪 /exit - Exit the interpreter.
🐞 /fix - Fix the generated code for errors.
📜 /log - Toggle different modes of logging.
⏫ /upgrade - Upgrade the interpreter.
📁 /prompt - Switch the prompt mode File or Input modes.
💻 /shell - Access the shell.
🐞 /debug - Toggle Debug mode for debugging.
    `.trim()
  }

  /**
   * Process a user message and handle any interpreter commands
   */
  async processMessage(message: string): Promise<{
    response: string
    isCommand: boolean
    executionResult?: CodeExecutionResult
  }> {
    // Check if the message is a command
    const commandMatch = message.trim().match(/^\/\w+/)
    if (commandMatch) {
      const command = commandMatch[0] as InterpreterCommand
      const args = message.substring(command.length).trim()
      return this.executeCommand(command, args)
    }

    // Check for code blocks in the message
    const codeBlockMatch = message.match(/```(?:(js|ts|javascript|typescript|python|py)?\n)?([\s\S]*?)```/)
    if (codeBlockMatch) {
      const language = this.determineLanguage(codeBlockMatch[1])
      const code = codeBlockMatch[2].trim()
      
      // Store the code for future use
      this.state.lastCode = code
      
      // Execute the code if in interactive mode
      if (this.state.mode === InterpreterMode.INTERACTIVE) {
        const executionResult = await this.executeCode(code, language)
        return {
          response: `Executed code in ${language}`,
          isCommand: false,
          executionResult
        }
      } else {
        return {
          response: `Code saved. Use ${InterpreterCommand.EXECUTE} to run it.`,
          isCommand: false
        }
      }
    }

    // Not a command or code block
    return {
      response: '',
      isCommand: false
    }
  }

  /**
   * Execute a specific interpreter command
   */
  private async executeCommand(
    command: InterpreterCommand,
    args: string
  ): Promise<{
    response: string
    isCommand: boolean
    executionResult?: CodeExecutionResult
  }> {
    switch (command) {
      case InterpreterCommand.EXECUTE:
        if (this.state.lastCode) {
          const executionResult = await this.executeCode(
            this.state.lastCode,
            this.state.language
          )
          return {
            response: 'Code execution complete',
            isCommand: true,
            executionResult
          }
        } else {
          return {
            response: 'No code to execute',
            isCommand: true
          }
        }

      case InterpreterCommand.SAVE:
        if (this.state.lastCode) {
          const saveName = args || `code_${nanoid(6)}`
          this.state.savedCode.set(saveName, this.state.lastCode)
          return {
            response: `Code saved as "${saveName}"`,
            isCommand: true
          }
        } else {
          return {
            response: 'No code to save',
            isCommand: true
          }
        }

      case InterpreterCommand.HELP:
        return {
          response: this.getHelpText(),
          isCommand: true
        }

      case InterpreterCommand.LANGUAGE:
        if (args === 'javascript' || args === 'js') {
          this.state.language = ProgrammingLanguage.JAVASCRIPT
          return {
            response: 'Switched to JavaScript',
            isCommand: true
          }
        } else if (args === 'typescript' || args === 'ts') {
          this.state.language = ProgrammingLanguage.TYPESCRIPT
          return {
            response: 'Switched to TypeScript',
            isCommand: true
          }
        } else if (args === 'python' || args === 'py') {
          this.state.language = ProgrammingLanguage.PYTHON
          return {
            response: 'Switched to Python',
            isCommand: true
          }
        } else {
          return {
            response: 'Available languages: javascript, typescript, python',
            isCommand: true
          }
        }

      case InterpreterCommand.VERSION:
        return {
          response: 'Code Interpreter v1.0.0',
          isCommand: true
        }

      case InterpreterCommand.DEBUG:
        this.state.isDebugging = !this.state.isDebugging
        return {
          response: `Debug mode ${this.state.isDebugging ? 'enabled' : 'disabled'}`,
          isCommand: true
        }

      case InterpreterCommand.LOG:
        this.state.isLogging = !this.state.isLogging
        return {
          response: `Logging ${this.state.isLogging ? 'enabled' : 'disabled'}`,
          isCommand: true
        }

      default:
        if (this.state.isDebugging) {
          console.log(`Command not implemented: ${command}`)
        }
        return {
          response: `Command "${command}" is not fully implemented yet. Type ${InterpreterCommand.HELP} for available commands.`,
          isCommand: true
        }
    }
  }

  /**
   * Execute code using the sandbox
   */
  private async executeCode(
    code: string,
    language: ProgrammingLanguage
  ): Promise<CodeExecutionResult> {
    try {
      if (this.state.isDebugging) {
        console.log(`Executing ${language} code:`, code)
      }
      
      const sandbox = await this.initializeSandbox()
      
      // Prepare the code based on the language
      let preparedCode = code
      if (language === ProgrammingLanguage.JAVASCRIPT) {
        preparedCode = `console.log((() => { ${code} })())`
      } else if (language === ProgrammingLanguage.TYPESCRIPT) {
        preparedCode = `console.log((() => { ${code} })())`
      }
      
      const execution = await sandbox.runCode(preparedCode)
      
      // Combine stdout and result for output
      const output = [
        ...execution.logs.stdout,
        execution.text || ''
      ].filter(Boolean).join('\n')
      
      return {
        success: !execution.error,
        output: execution.error ? `Error: ${execution.error?.message || 'Unknown error'}` : output,
        language: language
      }
    } catch (error) {
      console.error('Code execution error:', error)
      return {
        success: false,
        output: `Error: ${error instanceof Error ? error.message : String(error)}`,
        language: language
      }
    }
  }

  /**
   * Attempt to fix code by analyzing errors
   */
  private async fixCode(code: string): Promise<string> {
    // Simplified implementation
    let fixedCode = code
    
    // Add try-catch blocks for JavaScript/TypeScript
    if (
      this.state.language === ProgrammingLanguage.JAVASCRIPT ||
      this.state.language === ProgrammingLanguage.TYPESCRIPT
    ) {
      fixedCode = `try {\n${code}\n} catch (error) {\n  console.error('Caught error:', error);\n}`
    }
    
    // Add try-except blocks for Python
    if (this.state.language === ProgrammingLanguage.PYTHON) {
      fixedCode = `try:\n${code.split('\n').map(line => '    ' + line).join('\n')}\nexcept Exception as e:\n    print(f"Caught error: {e}")`
    }
    
    return fixedCode
  }
}
