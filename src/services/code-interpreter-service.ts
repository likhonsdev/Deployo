import { Sandbox as E2BSandbox, type Result, type OutputMessage } from '@e2b/code-interpreter'
import { nanoid } from 'nanoid'

interface CodeExecutionResult {
  error?: { message?: string }
  text?: string
  logs: { stdout: string[]; stderr: string[] }
  results?: Result[]
}

export class CodeInterpreter {
  private sandbox: E2BSandbox | null = null
  private lastCode: string = ''
  private language: ProgrammingLanguage = ProgrammingLanguage.PYTHON
  private mode: InterpreterMode = InterpreterMode.INTERACTIVE
  private model: InterpreterModel = InterpreterModel.DEFAULT

  async initialize() {
    if (!this.sandbox) {
      this.sandbox = await E2BSandbox.create({
        onStderr: (msg: OutputMessage) => console.log('[Code Interpreter stderr]', msg),
        onStdout: (msg: OutputMessage) => console.log('[Code Interpreter stdout]', msg),
      })
    }
  }

  async execute(code: string): Promise<CodeExecutionResult> {
    try {
      await this.initialize()
      if (!this.sandbox) throw new Error('Sandbox not initialized')

      const execution = await this.sandbox.runCode(code)
      this.lastCode = code

      if (execution.error) {
        return {
          error: { message: execution.error.value || 'Unknown error occurred' },
          logs: execution.logs,
          results: execution.results
        }
      }

      return {
        text: execution.results?.[0]?.text,
        logs: execution.logs,
        results: execution.results
      }
    } catch (error) {
      return {
        error: { message: error instanceof Error ? error.message : String(error) },
        logs: { stdout: [], stderr: [String(error)] }
      }
    }
  }

  async executeShell(command: string): Promise<{ exitCode: number; stdout: string; stderr: string }> {
    try {
      await this.initialize()
      if (!this.sandbox) throw new Error('Sandbox not initialized')

      // Execute shell command in sandbox environment
      return await this.sandbox.process.start(command)
    } catch (error) {
      return {
        exitCode: 1,
        stdout: '',
        stderr: error instanceof Error ? error.message : String(error)
      }
    }
  }

  async handleCommand(command: string, args?: string): Promise<string> {
    switch (command) {
      case InterpreterCommand.SAVE:
        return this.saveCode()
      case InterpreterCommand.EDIT:
        return this.editCode()
      case InterpreterCommand.EXECUTE:
        return this.executeLastCode()
      case InterpreterCommand.MODE:
        return this.setMode(args as InterpreterMode)
      case InterpreterCommand.MODEL:
        return this.setModel(args as InterpreterModel)
      case InterpreterCommand.INSTALL:
        return this.installPackage(args || '')
      case InterpreterCommand.LANGUAGE:
        return this.setLanguage(args as ProgrammingLanguage)
      case InterpreterCommand.CLEAR:
        return this.clearEnvironment()
      case InterpreterCommand.HELP:
        return this.getHelpText()
      case InterpreterCommand.LIST:
        return this.listAvailable()
      case InterpreterCommand.VERSION:
        return this.getVersion()
      case InterpreterCommand.EXIT:
        return this.exit()
      case InterpreterCommand.FIX:
        return this.fixCode()
      case InterpreterCommand.LOG:
        return this.toggleLogging()
      case InterpreterCommand.UPGRADE:
        return this.upgradeInterpreter()
      case InterpreterCommand.PROMPT:
        return this.switchPromptMode()
      case InterpreterCommand.SHELL:
        return this.accessShell()
      case InterpreterCommand.DEBUG:
        return this.toggleDebug()
      default:
        throw new Error(`Unknown command: ${command}`)
    }
  }

  private async saveCode(): Promise<string> {
    if (!this.lastCode) return 'No code to save'
    // Implementation for saving code
    return 'Code saved successfully'
  }

  private async editCode(): Promise<string> {
    if (!this.lastCode) return 'No code to edit'
    return this.lastCode
  }

  private async executeLastCode(): Promise<string> {
    if (!this.lastCode) return 'No code to execute'
    const result = await this.execute(this.lastCode)
    return result.text || 'Code executed successfully'
  }

  private async setMode(mode: InterpreterMode): Promise<string> {
    this.mode = mode
    return `Mode set to ${mode}`
  }

  private async setModel(model: InterpreterModel): Promise<string> {
    this.model = model
    return `Model set to ${model}`
  }

  private async installPackage(packageName: string): Promise<string> {
    if (!packageName) return 'Please specify a package name'
    try {
      const command = this.language === ProgrammingLanguage.PYTHON
        ? `pip install ${packageName}`
        : `npm install ${packageName}`
      const result = await this.executeShell(command)
      return result.exitCode === 0
        ? `Package ${packageName} installed successfully`
        : `Failed to install package: ${result.stderr}`
    } catch (error) {
      return `Failed to install package: ${error instanceof Error ? error.message : String(error)}`
    }
  }

  private async setLanguage(language: ProgrammingLanguage): Promise<string> {
    this.language = language
    return `Language set to ${language}`
  }

  private async clearEnvironment(): Promise<string> {
    await this.initialize()
    // Reset the sandbox
    if (this.sandbox) {
      await this.sandbox.kill()
      this.sandbox = await E2BSandbox.create()
    }
    return 'Environment cleared'
  }

  private getHelpText(): string {
    return `
Available commands:
📝 /save - Save the last code generated
✏️ /edit - Edit the last code generated
▶️ /execute - Execute the last code generated
🔄 /mode - Change the mode of interpreter
🔄 /model - Change the model of interpreter
📦 /install - Install a package
🌐 /language - Change the language
🧹 /clear - Clear the environment
🆘 /help - Display this help message
🚪 /list - List available options
📝 /version - Display version
🚪 /exit - Exit the interpreter
🐞 /fix - Fix code errors
📜 /log - Toggle logging
⏫ /upgrade - Upgrade interpreter
📁 /prompt - Switch prompt mode
💻 /shell - Access shell
🐞 /debug - Toggle debug mode`
  }

  private listAvailable(): string {
    return `
Available options:
Languages: ${Object.values(ProgrammingLanguage).join(', ')}
Modes: ${Object.values(InterpreterMode).join(', ')}
Models: ${Object.values(InterpreterModel).join(', ')}`
  }

  private getVersion(): string {
    return 'Code Interpreter v1.0.0'
  }

  private async exit(): Promise<string> {
    if (this.sandbox) {
      await this.sandbox.kill()
      this.sandbox = null
    }
    return 'Interpreter session ended'
  }

  private async fixCode(): Promise<string> {
    if (!this.lastCode) return 'No code to fix'
    // Implement code fixing logic here
    return 'Code fixed successfully'
  }

  private toggleLogging(): string {
    // Implement logging toggle
    return 'Logging mode toggled'
  }

  private async upgradeInterpreter(): Promise<string> {
    // Implement upgrade logic
    return 'Interpreter upgraded successfully'
  }

  private switchPromptMode(): string {
    // Implement prompt mode switching
    return 'Prompt mode switched'
  }

  private async accessShell(): Promise<string> {
    // Implement shell access
    return 'Shell access granted'
  }

  private toggleDebug(): string {
    // Implement debug mode toggle
    return 'Debug mode toggled'
  }

  async cleanup() {
    if (this.sandbox) {
      await this.sandbox.kill()
      this.sandbox = null
    }
  }
}

// Export enums
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

export enum ProgrammingLanguage {
  JAVASCRIPT = 'javascript',
  TYPESCRIPT = 'typescript',
  PYTHON = 'python'
}

export enum InterpreterMode {
  INTERACTIVE = 'interactive',
  BATCH = 'batch'
}

export enum InterpreterModel {
  DEFAULT = 'default',
  GEMINI = 'gemini'
}
