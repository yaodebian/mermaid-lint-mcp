#!/usr/bin/env node

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { MermaidLinter } from './mermaid-linter.js';

interface CliOptions {
  command?: string;
  file?: string;
  code?: string;
  timeout?: number;
  browserPath?: string;
  help?: boolean;
  version?: boolean;
}

function parseArgs(args: string[]): CliOptions {
  const options: CliOptions = {};
  
  // 检查第一个参数是否为命令
  if (args.length > 0 && !args[0].startsWith('-')) {
    const firstArg = args[0];
    if (firstArg === 'lint' || firstArg === 'server') {
      options.command = firstArg;
      args = args.slice(1); // 移除命令参数
    }
  }
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '-f':
      case '--file':
        options.file = args[++i];
        break;
      case '-c':
      case '--code':
        options.code = args[++i];
        break;
      case '-t':
      case '--timeout':
        options.timeout = parseInt(args[++i], 10);
        break;
      case '-b':
      case '--browser-path':
        options.browserPath = args[++i];
        break;
      case '-h':
      case '--help':
        options.help = true;
        break;
      case '-v':
      case '--version':
        options.version = true;
        break;
      default:
        // If it's not a flag and no file/code specified yet, treat as file path
        if (!options.file && !options.code && !arg.startsWith('-')) {
          options.file = arg;
        }
        break;
    }
  }
  
  return options;
}

function showHelp(): void {
  console.log(`
Mermaid Lint MCP - Validate Mermaid diagrams and run MCP server

Usage:
  npx mermaid-lint-mcp [command] [options]

Commands:
  lint                  Validate Mermaid diagram (default)
  server                Start MCP server

Lint Options:
  -f, --file <path>     Path to mermaid file to validate
  -c, --code <code>     Mermaid code string to validate
  -t, --timeout <ms>    Validation timeout in milliseconds (default: 5000)
  -b, --browser-path <path>  Path to custom browser executable for puppeteer

Global Options:
  -h, --help           Show this help message
  -v, --version        Show version number

Examples:
  npx mermaid-lint-mcp lint diagram.mmd
  npx mermaid-lint-mcp lint --file diagram.mmd
  npx mermaid-lint-mcp lint --code "graph TD; A-->B"
  npx mermaid-lint-mcp lint --browser-path /path/to/chrome
  npx mermaid-lint-mcp server
  npx mermaid-lint-mcp diagram.mmd  (defaults to lint command)
`);
}

function showVersion(): void {
  try {
    const packagePath = resolve(new URL(import.meta.url).pathname, '../../package.json');
    const packageJson = JSON.parse(readFileSync(packagePath, 'utf-8'));
    console.log(packageJson.version);
  } catch (error) {
    console.log('1.0.0'); // fallback version
  }
}

async function validateMermaidCode(code: string, options: { timeout?: number; browserPath?: string } = {}): Promise<void> {
  const linter = new MermaidLinter(options.browserPath);
  
  try {
    console.log('🔍 Validating Mermaid diagram...');
    
    const result = await linter.validateDiagram(code, options);
    
    if (result.isValid) {
      console.log('✅ Diagram is valid!');
      if (result.diagramType) {
        console.log(`📊 Diagram type: ${result.diagramType}`);
      }
      process.exit(0);
    } else {
      console.error('❌ Diagram validation failed:');
      console.error(`   ${result.error}`);
      if (result.diagramType && result.diagramType !== 'unknown') {
        console.log(`📊 Diagram type: ${result.diagramType}`);
      }
      process.exit(1);
    }
  } catch (error) {
    console.error('💥 Validation error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  } finally {
    await linter.cleanup();
  }
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const options = parseArgs(args);
  
  if (options.help) {
    showHelp();
    return;
  }
  
  if (options.version) {
    showVersion();
    return;
  }
  
  // 确定要执行的命令
  const command = options.command || 'lint'; // 默认为lint命令
  
  if (command === 'server') {
    // 启动MCP服务器
    console.log('🚀 Starting MCP server...');
    await import('./index.js');
    return;
  }
  
  if (command === 'lint') {
    // 执行lint功能
    let mermaidCode: string;

    if (options.code) {
      mermaidCode = options.code;
    } else if (options.file) {
      try {
        const filePath = resolve(options.file);
        mermaidCode = readFileSync(filePath, 'utf-8');
        console.log(`📁 Reading file: ${options.file}`);
      } catch (error) {
        console.error(`❌ Error reading file: ${error instanceof Error ? error.message : String(error)}`);
        process.exit(1);
      }
    } else {
      console.error('❌ No input provided. Use --file or --code option.');
      console.error('   Run with --help for usage information.');
      process.exit(1);
    }

    await validateMermaidCode(mermaidCode, { 
      timeout: options.timeout, 
      browserPath: options.browserPath 
    });
    return;
  }
  
  // 未知命令
  console.error(`❌ Unknown command: ${command}`);
  console.error('   Run with --help for usage information.');
  process.exit(1);
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  process.exit(1);
});

main().catch((error) => {
  console.error('💥 CLI error:', error);
  process.exit(1);
});