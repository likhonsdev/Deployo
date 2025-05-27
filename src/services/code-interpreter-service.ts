import { nanoid } from 'nanoid'

/**
 * Result of code execution
 */
export interface CodeExecutionResult {
  error?: { message?: string }
  text?: string
  logs: { stdout: string[]; stderr: string[] }
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

/**
 * Mock implementation of the Code Interpreter
 * This is a simplified version that doesn't depend on the actual E2B package
 */
export class CodeInterpreter {
  private lastCode = '';
  private language: ProgrammingLanguage = ProgrammingLanguage.PYTHON;
  private mode: InterpreterMode = InterpreterMode.INTERACTIVE;
  private model: InterpreterModel = InterpreterModel.DEFAULT;
  private isDebugEnabled = false;
  private isLoggingEnabled = false;
  private savedCode: Map<string, string> = new Map();

  async execute(code: string): Promise<CodeExecutionResult> {
    if (this.isDebugEnabled) {
      console.log(`[CodeInterpreter] Executing code: ${code}`);
    }
    
    this.lastCode = code;
    
    try {
      // Simple mock execution that returns the code as output
      // In a real implementation, we would use the E2B sandbox
      let output: string;
      
      // Simulate different language execution
      switch (this.language) {
        case ProgrammingLanguage.JAVASCRIPT:
        case ProgrammingLanguage.TYPESCRIPT:
          try {
            // Very simple execution for demo purposes
            const result = eval(`(() => { ${code}; return "Code executed successfully"; })()`);
            output = String(result);
          } catch (error) {
            return {
              error: { message: error instanceof Error ? error.message : String(error) },
              logs: { stdout: [], stderr: [String(error)] }
            };
          }
          break;
          
        case ProgrammingLanguage.PYTHON:
        default:
          // For Python, just simulate the output
          if (code.includes('print(')) {
            // Extract content from print statements
            const printMatches = code.match(/print\((.*?)\)/g);
            if (printMatches) {
              output = printMatches
                .map(match => {
                  // Extract content inside print()
                  const content = match.substring(6, match.length - 1);
                  // Basic handling of strings vs expressions
                  if (content.startsWith('"') || content.startsWith("'")) {
                    return content.substring(1, content.length - 1);
                  }
                  return `[Expression: ${content}]`;
                })
                .join('\n');
            } else {
              output = 'Code executed without output';
            }
          } else {
            output = 'Code executed without output';
          }
          break;
      }
      
      return {
        text: output,
        logs: { stdout: [output], stderr: [] }
      };
    } catch (error) {
      return {
        error: { message: error instanceof Error ? error.message : String(error) },
        logs: { stdout: [], stderr: [String(error)] }
      };
    }
  }

  async handleCommand(command: string, args?: string): Promise<string> {
    if (this.isDebugEnabled) {
      console.log(`[CodeInterpreter] Handling command: ${command} with args: ${args}`);
    }
    
    switch (command) {
      case InterpreterCommand.SAVE:
        if (!this.lastCode) return 'No code to save';
        const saveName = args || `code_${nanoid(6)}`;
        this.savedCode.set(saveName, this.lastCode);
        return `Code saved as "${saveName}"`;
        
      case InterpreterCommand.EDIT:
        if (!args) return 'Please specify a name for the saved code';
        if (!this.savedCode.has(args)) return `No code found with name "${args}"`;
        this.lastCode = this.savedCode.get(args) || '';
        return `Code loaded from "${args}"`;
        
      case InterpreterCommand.EXECUTE:
        if (!this.lastCode) return 'No code to execute';
        await this.execute(this.lastCode);
        return 'Code executed successfully';
        
      case InterpreterCommand.MODE:
        if (args === 'interactive') {
          this.mode = InterpreterMode.INTERACTIVE;
          return 'Switched to interactive mode';
        } else if (args === 'batch') {
          this.mode = InterpreterMode.BATCH;
          return 'Switched to batch mode';
        }
        return `Available modes: ${Object.values(InterpreterMode).join(', ')}`;
        
      case InterpreterCommand.MODEL:
        if (args === 'default') {
          this.model = InterpreterModel.DEFAULT;
          return 'Switched to default model';
        } else if (args === 'gemini') {
          this.model = InterpreterModel.GEMINI;
          return 'Switched to Gemini model';
        }
        return `Available models: ${Object.values(InterpreterModel).join(', ')}`;
        
      case InterpreterCommand.LANGUAGE:
        if (args === 'javascript' || args === 'js') {
          this.language = ProgrammingLanguage.JAVASCRIPT;
          return 'Switched to JavaScript';
        } else if (args === 'typescript' || args === 'ts') {
          this.language = ProgrammingLanguage.TYPESCRIPT;
          return 'Switched to TypeScript';
        } else if (args === 'python' || args === 'py') {
          this.language = ProgrammingLanguage.PYTHON;
          return 'Switched to Python';
        }
        return `Available languages: ${Object.values(ProgrammingLanguage).join(', ')}`;
        
      case InterpreterCommand.CLEAR:
        this.lastCode = '';
        return 'Code cleared';
        
      case InterpreterCommand.HELP:
        return this.getHelpText();
        
      case InterpreterCommand.LIST:
        if (args === 'modes') {
          return `Available modes: ${Object.values(InterpreterMode).join(', ')}`;
        } else if (args === 'models') {
          return `Available models: ${Object.values(InterpreterModel).join(', ')}`;
        } else if (args === 'languages') {
          return `Available languages: ${Object.values(ProgrammingLanguage).join(', ')}`;
        } else if (args === 'saved') {
          const savedCodes = Array.from(this.savedCode.keys());
          return savedCodes.length > 0 
            ? `Saved code: ${savedCodes.join(', ')}` 
            : 'No saved code found';
        }
        return 'Specify what to list: modes, models, languages, saved';
        
      case InterpreterCommand.VERSION:
        return 'Code Interpreter v1.0.0 (Mock)';
        
      case InterpreterCommand.DEBUG:
        this.isDebugEnabled = !this.isDebugEnabled;
        return `Debug mode ${this.isDebugEnabled ? 'enabled' : 'disabled'}`;
        
      case InterpreterCommand.LOG:
        this.isLoggingEnabled = !this.isLoggingEnabled;
        return `Logging ${this.isLoggingEnabled ? 'enabled' : 'disabled'}`;
        
      case InterpreterCommand.INSTALL:
        if (!args) return 'Please specify a package to install';
        return `Mock installation of package: ${args}`;
        
      case InterpreterCommand.FIX:
        if (!this.lastCode) return 'No code to fix';
        return 'Code fixed (mock)';
        
      case InterpreterCommand.SHELL:
        if (!args) return 'Please provide a shell command';
        return `Mock execution of shell command: ${args}`;
        
      default:
        return `Unknown command: ${command}. Use ${InterpreterCommand.HELP} to see available commands.`;
    }
  }
  
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
    `.trim();
  }
}
